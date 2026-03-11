# Repo Review: [Project Name]

I need to review, reorganize, and evaluate this repository. The core logic lives in `[core_module]/`. The rest of the repo has accumulated files without clear structure.

## Phase 1: Audit and organize the repo

@code-reviewer: Map the current file tree and classify every file: core logic, utilities, notebooks, tests, config, dead code, duplicates.

Propose a normalized structure following our project conventions: `src/` for production code, `tests/` for tests, `notebooks/` for exploratory work, `config/` for configuration. The core modules from `[core_module]/` should land in `src/[core_module]/`.

Identify files that can be deleted (scratch scripts, backup copies, orphaned notebooks) vs. files that should be moved.

Do not move or delete anything yet. Present the proposed structure and the migration plan for my approval.

@healthcare-data-reviewer: Review the proposed structure for anything that touches clinical data, PHI, or healthcare logic. Flag any files that contain hardcoded member data, credentials, or PHI that should not be in version control.

## Phase 2: Normalize the core modules

@data-scientist: Review every module in `[core_module]/` against our Python standards: type hints, docstrings, vectorized operations (no row-level loops), Polars/NumPy over Pandas where possible, `dataclass` or Pydantic for structured inputs/outputs.

Identify numerical correctness risks: hardcoded constants without documentation, magic numbers, implicit assumptions about input shape or scale, missing input validation.

Ensure every public function has a docstring that states: what it computes, the mathematical definition or reference, the expected input types and shapes, and the output contract.

Propose a normalized API surface: which functions are public, which are internal, how they compose. Present this before refactoring.

@code-reviewer: Review the proposed API surface for consistency, naming, and adherence to our Python standards (OO design, vectorization, type hints).

## Phase 3: Evaluate against data

@data-scientist: For each core computation in the modules, write a test that validates it against a known analytical solution or published reference value.

Then write integration tests that run the logic against actual data (staged, aggregated, or sample). Frame any comparison as a causal or statistical question: what is the expected distribution, what would constitute a surprising result, what is the null hypothesis.

Present the test plan with expected outcomes before writing the tests.

@healthcare-data-reviewer: Review the test plan for clinical correctness. Are the expected values clinically plausible? Are the null hypotheses well-formed? Are we testing the right edge cases for healthcare data (SAS dates, null amounts, bilateral procedures, enrollment gaps)?

---

Start with Phase 1. Show me the full current file tree, the classification of every file, and the proposed reorganization. Route to the appropriate reviewer before I approve.
