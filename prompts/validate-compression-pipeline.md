# Validate Compression Pipeline

Run `python scripts/validate_compression.py` and evaluate the output stage by stage. Each stage has pass/fail criteria. Do not proceed past a failed stage; diagnose and fix before continuing.

Use `@embedding-pipeline-validation` for the full stage-by-stage protocol. The agents below are responsible for specific stages.

## Reference Data Access

All code lookups go through the reference database. The database has 5 populated schemas (medicare, commercial, ndc, elixhauser, geography) with 48 tables. Full column docs are in `ReferenceData/DATA_DICTIONARY.md`.

```python
from ReferenceData.reference_db import (
    query, spur_search, lookup_drg, get_etg_info,
    get_er_revenue_codes, get_chronic_dx,
    lookup_icd10, lookup_paces_by_code,
    normalize_icd10, format_icd10,
)

# ICD-10 lookup (73K codes in commercial.icd10)
spur_search("icd10", "code", "I50", schema="commercial")

# Chronic condition check
spur_search("chronic_dx", "DX", "I50", schema="medicare")

# PACES episode reverse lookup
lookup_paces_by_code("I500", schema="commercial")

# Elixhauser comorbidity flags for a code
query("SELECT * FROM elixhauser.dx_to_comorb_mapping WHERE \"ICD-10-CM Diagnosis\" LIKE 'I50%'")
```

## Setup

```bash
python scripts/validate_compression.py
```

Capture the full terminal output. It walks through 8 stages (0-7) with diagnostics at each step.

## Stage 0: Data Ingestion and Vocabulary Audit

@reference-data-librarian: Verify the ICD codes in the raw data against the reference database:
- Query `commercial.icd10` (73,427 codes) to check how many of the pipeline's codes have valid descriptions.
- Query `medicare.chronic_dx` (3,484 codes) to flag which codes are chronic conditions.
- Compute chapter coverage: `SELECT SUBSTRING(code, 1, 1) as chapter, COUNT(*) FROM commercial.icd10 GROUP BY 1` and compare against the pipeline's vocabulary.

@data-scientist: Check row counts, member counts, date range. Schema validation: are the expected columns present with correct types?

**Pass**: schema validates, ICD vocabulary spans at least 15 of 22 ICD-10 chapters.
**Fail blocks**: everything downstream.

## Stage 1: Anchor Assignment

@data-scientist: Report N in TARGET_OCCURRED and TARGET_AVOIDED. Compute prevalence. Verify the anchor date precedes all feature windows (no temporal leakage).

@healthcare-data-reviewer: Is the anchor definition clinically appropriate for the condition? Are the ICD/CPT codes used for anchor assignment correct? Are exclusion criteria justified?

@reference-data-librarian: Look up the anchor ICD/CPT codes in the reference database to confirm they match the intended clinical concept. For CPT codes, check `medicare.cpt_cd` for GROUP_CAT_CD. For ICD codes, check `commercial.icd10` for descriptions and `commercial.paces_grouper` for which clinical episodes they trigger.

**Pass**: both groups non-empty, prevalence between 1% and 50%, no temporal leakage.
**Fail blocks**: group labels used in all downstream stages.

## Stage 2: Member-Month Aggregation

@data-scientist: Confirm one row per member per month, no duplicates at that grain. Report the minimum sequence length threshold and the drop rate (members excluded for too few codes).

@healthcare-data-reviewer: Does the deduplication logic make clinical sense? Does dropping short-sequence members bias the sample toward sicker members?

**Pass**: no duplicate member-months, all ICD codes match valid format, dropped-member rate documented.
**Fail blocks**: embedding training consumes these sequences.

## Stage 3: Word2Vec Training and Semantic Validation

This is the most important stage. The quality of everything downstream depends on whether the embedding space captures clinically meaningful relationships.

@data-scientist: Report the Word2Vec hyperparameters (vector_size, window, min_count, sg, epochs, seed). Confirm training convergence (loss decreasing). Run `model.wv.most_similar()` on sentinel codes and capture the output.

@reference-data-librarian: For each sentinel code returned by `most_similar()`, look up its full description and clinical context:

```python
# For each neighbor code from the most_similar output:
spur_search("icd10", "code", "I50", schema="commercial")   # heart failure and subtypes
spur_search("icd10", "code", "I25", schema="commercial")   # ischemic heart disease
spur_search("icd10", "code", "N17", schema="commercial")   # acute kidney injury

# Check if the neighbor is a known chronic condition
spur_search("chronic_dx", "DX", "I50", schema="medicare")

# Check Elixhauser comorbidity flags
query("SELECT * FROM elixhauser.dx_to_comorb_mapping WHERE \"ICD-10-CM Diagnosis\" LIKE 'I50%'")

# Check which PACES episodes include the sentinel
lookup_paces_by_code("I500", schema="commercial")
```

Validate that neighbors are plausible:
- **I50** (heart failure): neighbors should include I25 (ischemic heart disease), I48 (atrial fibrillation), I11 (hypertensive heart disease), J81 (pulmonary edema), N17 (acute kidney injury). Elixhauser flag: HF=1.
- **M54.5** (low back pain): neighbors should include M54.x codes, M47 (spondylosis), M51 (disc disorders), G89 (pain codes).
- **E11** (type 2 diabetes): neighbors should include E78 (hyperlipidemia), I10 (hypertension), N18 (CKD). Elixhauser flags: DIAB_UNCX=1 or DIAB_CX=1.

@healthcare-data-reviewer: Are cross-chapter neighbors clinically explainable (e.g., I50 near N17 is cardiorenal syndrome, which is expected) or evidence of a bad embedding?

@whats-strange: Do any of the nearest-neighbor results look surprising? Are there codes that should not be near the sentinel? Are low-frequency codes producing unreliable neighbors? Compare against Elixhauser comorbidity patterns: codes that share the same Elixhauser flag often co-occur, so their proximity in embedding space is expected.

**Pass**: for each sentinel, a majority of top-10 neighbors are from the same or clinically adjacent ICD chapter. Unexplained cross-chapter intrusion fails the stage.
**Fail blocks**: all downstream stages consume these embeddings.

## Stage 4: TF-IDF Weighting

@data-scientist: Report the top-10 highest IDF codes and top-10 lowest IDF codes.

@reference-data-librarian: Look up each code:
```python
# For each high/low IDF code, get its description
lookup_icd10("Z8791", schema="commercial")   # example common code
lookup_icd10("I5020", schema="commercial")   # example specific code

# Check if it's a chronic condition
query("SELECT * FROM medicare.chronic_dx WHERE DX = 'I5020'")
```
High-IDF codes should be rare, specific conditions. Low-IDF codes should be ubiquitous non-specific codes (Z87, R codes, E11.9).

@whats-strange: Are any clinically important codes getting near-zero weight? Is anything unexpected in the extremes?

**Pass**: high-IDF codes are clinically specific, low-IDF codes are non-specific, no important codes suppressed.
**Fail blocks**: weighted embeddings feed into member vectors.

## Stage 5: Monthly Embedding Vectors

@data-scientist: Report the L2 norm distribution across all member-month vectors. Compute the zero-vector rate (members whose codes all fell below min_count). Check for NaN/Inf.

@whats-strange: Is the norm distribution unimodal? Bimodal norms suggest a subpopulation whose codes are missing from the vocabulary. Is the zero-vector rate below 1%?

**Pass**: zero-vector rate < 1%, unimodal norm distribution, no NaN/Inf.
**Fail blocks**: pooling and clustering operate on these vectors.

## Stage 6: Time-Decayed Pooling and Clustering

@data-scientist: Report the decay parameter (lambda / half-life), KMeans k, silhouette score, Calinski-Harabasz, Davies-Bouldin. Test sensitivity to lambda at 2-3 values.

@healthcare-data-reviewer: Does the decay rate have clinical justification (6-month half-life for acute, 24-month for chronic)? Is the number of clusters justified?

@whats-strange: Profile each cluster: top-10 most frequent ICD codes and top-10 highest TF-IDF codes. Do clusters have interpretable clinical themes? Compare cluster composition by TARGET_OCCURRED vs TARGET_AVOIDED. Do clusters separate the outcome groups or is assignment independent?

@reference-data-librarian: For the top codes in each cluster, provide clinical context:
```python
# For each top code in a cluster
lookup_icd10("I5020", schema="commercial")
query("SELECT * FROM elixhauser.dx_to_comorb_mapping WHERE \"ICD-10-CM Diagnosis\" = 'I5020'")
lookup_paces_by_code("I5020", schema="commercial")
```
Verify the cluster themes make sense (a cluster dominated by I-chapter codes is cardiac, M-chapter is MSK, E-chapter is metabolic/endocrine). Name each cluster by its dominant clinical theme.

**Pass**: silhouette > 0, each cluster has a documented clinical interpretation, at least partial separation of outcome groups.
**Fail blocks**: visualization depends on cluster assignments.

## Stage 7: PCA and Spaghetti Plot

@data-scientist: Report explained variance for the first 2 and first 10 PCA components. If the first two components explain < 10% of variance, flag that the 2D projection is lossy and conclusions drawn from it are limited.

@visualization-creator: Verify `output/compression_spaghetti.html` renders correctly. Check that the plot follows team conventions: TARGET_OCCURRED in `#E74C3C` (red), TARGET_AVOIDED in `#3498DB` (blue), cluster centroids annotated, explained variance reported in the subtitle, source annotation with cohort and N. If the plot does not meet these standards, regenerate it.

@whats-strange: Are the trajectory patterns in the spaghetti plot clinically interpretable? Do TARGET_OCCURRED members follow different paths than TARGET_AVOIDED? Or is it visual noise with no separation? If paths converge or diverge at specific time points, that may indicate a clinical event worth investigating.

**Pass**: plot renders, explained variance reported, outcome groups visually distinguishable (or the lack of separation is documented as a finding).

## After All Stages Pass

@data-scientist: Write a one-paragraph summary of the pipeline validation results. State: which condition was studied, the cohort size, Word2Vec quality (sentinel neighbor check), clustering quality (silhouette, number of clusters, clinical themes), and whether the spaghetti plot shows trajectory separation. Note any stages that required intervention and what was fixed.

@healthcare-data-reviewer: Review the summary for clinical correctness. Flag any overstatements (e.g., claiming "the embedding captures disease progression" when only comorbidity co-occurrence was validated).

---

Start by running the script and capturing the output. Work through Stage 0. Do not skip ahead.
