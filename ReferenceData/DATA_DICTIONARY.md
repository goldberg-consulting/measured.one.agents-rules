# Reference Data Dictionary

Schema and table catalog for `reference.duckdb`.
Generated from the live database; rebuild with `python build_reference_db.py`.

## Schema: `commercial`

27 objects, 103,497 total rows.

### `commercial.comorbidity_codes` (365 rows)

Comorbidity codes used in ETG severity adjustment.

| Column | Type | Examples |
|--------|------|----------|
| Comorbidity Code | BIGINT | `80006`, `80056`, `80072` |
| Description | VARCHAR | `Infection w/drug resistant microorganisms`, `Viral illness, severe`, `Systemic infection syndromes` |
| Oncology Only | VARCHAR | `x` |

### `commercial.condition_status_codes` (745 rows)

Condition status codes for ETG episode classification.

| Column | Type | Examples |
|--------|------|----------|
| Condition_Status Code | BIGINT | `70002`, `70004`, `70030` |
| Description | VARCHAR | `Acromegaly`, `Lymphoid leukemia`, `Malignant neoplasm of cerebrum` |
| Oncology Only | VARCHAR | `x` |

### `commercial.dcc` (3,087 rows)

Dominant Condition Category drug-to-ETG mappings.

| Column | Type | Examples |
|--------|------|----------|
| TCC | BIGINT | `13`, `19`, `15` |
| PCC | BIGINT | `146`, `148`, `175` |
| DCC | BIGINT | `200`, `406`, `416` |
| Generic Name | VARCHAR | `Anidulafungin`, `Oxacillin sodium`, `Cefadroxil, or as monohydrate` |
| Maintenance Drug ETG | DOUBLE | `902600.0`, `905600.0`, `902100.0` |
| DCC_Added_Date | TIMESTAMP | `2011-06-16 00:00:00`, `2000-11-01 00:00:00`, `2020-07-08 00:00:00` |
| Off-market_Date | TIMESTAMP | `2003-01-01 00:00:00`, `2022-06-01 00:00:00`, `2015-03-27 00:00:00` |
| Specialty_Drug | VARCHAR | `N`, `Y` |
| Specialty_Drug_Add Date | TIMESTAMP |  |
| Specialty_Drug_Remove Date | TIMESTAMP |  |

### `commercial.dhs_cpt_hcpcs` (1,320 rows)

DHS CPT/HCPCS code list with descriptions.

| Column | Type | Examples |
|--------|------|----------|
| code | VARCHAR | `0036U`, `0039U`, `0055U` |
| description | VARCHAR | `Vol reduction of blood/prod`, `Ncntc ifr spctrsc o/t pad 1`, `Onc sld org neo dna 468 gene` |

### `commercial.etg_4digit` (421 rows)

4-digit ETG category-level codes and descriptions.

| Column | Type | Examples |
|--------|------|----------|
| ETG-4 | BIGINT | `2078`, `2392`, `2401` |
| Description | VARCHAR | `Hyper-functioning thyroid gland`, `Dehydration`, `Parasitic encephalitis` |
| Short Description | VARCHAR | `HIV sero-positive wo AIDS`, `Hyper-funct thyroid gland`, `Dehydration` |

### `commercial.etg_base_class` (529 rows)

ETG base class metadata: clean period, chronic indicator, gender, age limits.

| Column | Type | Examples |
|--------|------|----------|
| mpc | DOUBLE | `12.0`, `5.0`, `9.0` |
| base_etg | BIGINT | `163200`, `208900`, `239100` |
| description | VARCHAR | `Hyper-functioning thyroid gland`, `Dehydration`, `Parasitic encephalitis` |
| short_desc | VARCHAR | `HIV sero-positive wo AIDS`, `Hyper-funct thyroid gland`, `Non mal neo thyroid gland` |
| clean_period | DOUBLE | `180.0`, `120.0`, `30.0` |
| drug_pre_period | DOUBLE | `30.0`, `180.0`, `120.0` |
| drug_post_period | DOUBLE | `30.0`, `270.0`, `120.0` |
| chronic | VARCHAR | `Y`, `N` |
| gender_specific | VARCHAR |  |
| age_lower | DOUBLE |  |
| age_upper | DOUBLE |  |
| standard | VARCHAR |  |
| oncology | VARCHAR |  |

### `commercial.etg_body_part_key` (11 rows)

Maps 5th-6th digit of ETG codes to body part descriptions.

| Column | Type | Examples |
|--------|------|----------|
| Any first 6 digits | VARCHAR | `XXXX` |
| 5th_6th_digit | BIGINT | `8`, `1`, `6` |
| Body Part | VARCHAR | ` trunk`, ` back`, ` knee & lower leg` |

### `commercial.etg_number` (2,685 rows)

Full ETG codes with MPC, base ETG, and descriptions.

| Column | Type | Examples |
|--------|------|----------|
| mpc | BIGINT | `8`, `16`, `17` |
| base_etg | BIGINT | `163200`, `208900`, `239100` |
| full_etg | BIGINT | `130400006`, `130400017`, `163000016` |
| long_desc | VARCHAR | `HIV sero-positive w/o AIDS, w/o comorbidity`, `Sepsis, w/o complication, with comorbidity, with endoscopic intervention`, `Malignant neoplasm of thyroid gland, w/o comorbidity, w/o surgery` |
| short_desc | VARCHAR | `Sepsis, w comp, w comorb, w surg`, `Sepsis, w comp, w comorb, w endscpy`, `Mal neo thyroid gland, wo comorb, w surg` |

### `commercial.etg_outliers_commercial` (5,806 rows)

Commercial ETG outlier thresholds.

| Column | Type | Examples |
|--------|------|----------|
| ETG Number | BIGINT | `130400007`, `162200000`, `162600000` |
| Description | VARCHAR | `HIV sero-positive wo AIDS, w comorb`, `Sepsis, wo comp, wo comorb, w surg`, `Sepsis, wo comp, wo comorb, w PCI` |
| Severity Level | BIGINT | `1`, `2`, `3` |
| Low Outlier_Commercial | BIGINT | `187`, `200`, `1316` |
| High Outlier_Commercial | BIGINT | `5822`, `78692`, `95816` |

### `commercial.etg_outliers_medicare` (5,980 rows)

Medicare ETG outlier thresholds.

| Column | Type | Examples |
|--------|------|----------|
| ETG Number | BIGINT | `130400116`, `130800100`, `162400012` |
| Description | VARCHAR | `HIV sero-positive wo AIDS, w comorb`, `Sepsis, wo comp, wo comorb, w surg`, `Sepsis, wo comp, wo comorb, w PCI` |
| Severity Level | BIGINT | `1`, `2`, `3` |
| Low Outlier_Medicare | BIGINT | `110`, `2816`, `191` |
| High Outlier_Medicare | BIGINT | `41097`, `7122`, `296344` |

### `commercial.etg_treatment_indicator_map` (1,076 rows)

Maps ETG base class to treatment indicator codes.

| Column | Type | Examples |
|--------|------|----------|
| MPC | BIGINT | `13`, `19`, `8` |
| Base_ETG | BIGINT | `164400`, `206800`, `239700` |
| ETG Number_9th Digit -_Treatment_Indicator | BIGINT | `0`, `8`, `1` |
| ETG Base_Class Description | VARCHAR | `Hyper-functioning thyroid gland`, `Dehydration`, `Parasitic encephalitis` |
| Treatment_Indicator_Description | VARCHAR | ` with surgery, with active mgmt`, ` with surgery, with BMT`, ` with bone marrow transplant` |

### `commercial.icd10` (73,427 rows)

ICD-10-CM codes with short/long descriptions. Codes stored both with and without decimal format.

| Column | Type | Examples |
|--------|------|----------|
| code | VARCHAR | `A001`, `A0100`, `A0104` |
| code_formatted | VARCHAR | `A01.04`, `A05.8`, `A06.81` |
| short_desc | VARCHAR | `Typhoid fever with other complications`, `Salmonella osteomyelitis`, `Enterotoxigenic Escherichia coli infection` |
| long_desc | VARCHAR | `Cholera due to Vibrio cholerae 01, biovar cholerae`, `Amebic liver abscess`, `Cutaneous amebiasis` |

### `commercial.mpc_key` (22 rows)

Major Practice Category codes and descriptions.

| Column | Type | Examples |
|--------|------|----------|
| MPC | BIGINT | `8`, `16`, `17` |
| Description | VARCHAR | `Hepatology`, `Obstetrics`, `Orthopedics & rheumatology` |

### `commercial.paces_grouper` (1,071 rows)

PACES (Open-Source-Grouper) clinical episode definitions with ICD-10 trigger codes.

| Column | Type | Examples |
|--------|------|----------|
| clinical_chapter | VARCHAR | `behavioral`, `cardiology`, `msk` |
| category | VARCHAR | `procedures`, `conditions`, `acute_events` |
| episode_name | VARCHAR | `psychotic_ds_other_acute`, `anxiety_ds_chronic`, `anemia_acute` |
| trigger_codes | VARCHAR | `F308, F338, F341, F348, F349, F39, F4321`, `F42, F900, F901, F902, F908, F909`, `F70, F71, F72, F73, F78, F79` |

### `commercial.pcc` (542 rows)

Primary Condition Category codes.

| Column | Type | Examples |
|--------|------|----------|
| PCC | BIGINT | `146`, `148`, `175` |
| Description | VARCHAR | `Enzymes, chemotherapeutic`, `Alkylating agents, miscellaneous`, `Progestins, chemotherapeutic` |

### `commercial.primary_condition` (2,685 rows)

Primary condition assignments for ETG episodes.

| Column | Type | Examples |
|--------|------|----------|
| MPC | DOUBLE | `6.0`, `12.0`, `10.0` |
| Base ETG | BIGINT | `163800`, `164800`, `207900` |
| Full ETG | BIGINT | `241000000`, `316000000`, `450000000` |
| ETG Long Description | VARCHAR | `Hyper-functioning thyroid gland`, `Dehydration`, `Parasitic encephalitis` |
| Primary Condition Description | VARCHAR | `Behavioral health`, `Liver, gallbladder & pancreas diseases`, `Major skin diseases` |
| Primary Condition Code | BIGINT | `34`, `41`, `40` |
| Unnamed: 6 | DOUBLE |  |
| Unnamed: 7 | DOUBLE |  |
| Unnamed: 8 | DOUBLE |  |
| Infection of bone & joint - foot & ankle | VARCHAR |  |

### `commercial.sdoh_codes` (20 rows)

Social Determinants of Health codes.

| Column | Type | Examples |
|--------|------|----------|
| Social Determinant Code | BIGINT | `40070`, `40080`, `40150` |
| Description | VARCHAR | `SDoH Diet & Exercise`, `SDoH Housing & Economic`, `SDoH Medication Regimen Non-Compliance` |

### `commercial.severity_level_model_1_com` (458 rows)

Severity level model 1, commercial.

| Column | Type | Examples |
|--------|------|----------|
| ETG | BIGINT | `163800`, `164800`, `207900` |
| Description | VARCHAR | `Hyper-functioning thyroid gland`, `Dehydration`, `Parasitic encephalitis` |
| ETG Severity Adjusted | VARCHAR | `N`, `Y` |
| First Threshold | DOUBLE | `1.3032`, `1.0494`, `0.9597` |
| Second Threshold | DOUBLE | `2.3272`, `2.6098`, `1.6112` |
| Third Threshold | DOUBLE | `4.2407`, `5.1171`, `2.2517` |
| Number of Severity Levels | BIGINT | `1`, `3`, `4` |

### `commercial.severity_level_model_1_mcr` (458 rows)

Severity level model 1, Medicare.

| Column | Type | Examples |
|--------|------|----------|
| ETG | BIGINT | `163800`, `164800`, `207900` |
| Description | VARCHAR | `Hyper-functioning thyroid gland`, `Dehydration`, `Parasitic encephalitis` |
| ETG Severity Adjusted | VARCHAR | `N`, `Y` |
| First Threshold_Medicare | DOUBLE | `1.64`, `0.568`, `1.1537` |
| Second Threshold_Medicare | DOUBLE | `1.4237`, `1.5697`, `1.2694` |
| Third Threshold_Medicare | DOUBLE | `2.7839`, `2.4414`, `2.5013` |
| Number of Severity Levels Medicare | BIGINT | `1`, `2`, `3` |

### `commercial.severity_level_model_2_com` (458 rows)

Severity level model 2, commercial.

| Column | Type | Examples |
|--------|------|----------|
| ETG | BIGINT | `163200`, `208900`, `239100` |
| Description | VARCHAR | `Hyper-functioning thyroid gland`, `Dehydration`, `Parasitic encephalitis` |
| ETG Severity Adjusted | VARCHAR | `N`, `Y` |
| First Threshold | DOUBLE | `1.3329`, `1.0624`, `1.3205` |
| Second Threshold | DOUBLE | `1.8081`, `2.6799`, `3.6466` |
| Third Threshold | DOUBLE | `3.1023`, `7.2134`, `3.7178` |
| Number of Severity Levels | BIGINT | `1`, `4` |

### `commercial.severity_level_model_2_mcr` (458 rows)

Severity level model 2, Medicare.

| Column | Type | Examples |
|--------|------|----------|
| ETG | BIGINT | `163200`, `208900`, `239100` |
| Description | VARCHAR | `Hypo-functioning thyroid gland`, `Hypo-functioning adrenal gland`, `Iron deficiency anemia` |
| ETG Severity Adjusted | VARCHAR | `N`, `Y` |
| First Threshold_Medicare | DOUBLE | `1.5137`, `1.4153`, `1.4296` |
| Second Threshold_Medicare | DOUBLE | `1.708`, `1.994`, `6.2736` |
| Third Threshold_Medicare | DOUBLE | `2.6618`, `4.3296`, `11.8483` |
| Number of Severity Levels Medicare | BIGINT | `1`, `4`, `3` |

### `commercial.severity_level_model_3_com` (458 rows)

Severity level model 3, commercial.

| Column | Type | Examples |
|--------|------|----------|
| MSK | BIGINT | `163200`, `208900`, `239100` |
| Description | VARCHAR | `Hyper-functioning thyroid gland`, `Dehydration`, `Parasitic encephalitis` |
| ETG Severity Adjusted | VARCHAR | `N`, `Y` |
| First Threshold | DOUBLE | `0.8381`, `0.7428`, `0.7082` |
| Second Threshold | DOUBLE | `1.0575`, `1.0903`, `1.1025` |
| Third Threshold | DOUBLE | `1.4386`, `1.4458`, `1.5252` |
| Number of Severity Levels | BIGINT | `1`, `4` |

### `commercial.severity_models` (3 rows)

Severity model configuration.

| Column | Type | Examples |
|--------|------|----------|
| Model | BIGINT | `1`, `2`, `3` |
| Description | VARCHAR | `Utilization treatment severity`, `Standard severity`, `Utilization treatment and clinical severity` |

### `commercial.std_specialties` (244 rows)

Standard specialty codes and descriptions.

| Column | Type | Examples |
|--------|------|----------|
| OptumInsight Standard_Specialty Code | BIGINT | `110`, `190`, `200` |
| Description | VARCHAR | `Urgent Care Center`, `Hepatology`, `Neurosurgery` |
| ETG Provider Type | BIGINT | `0`, `1`, `2` |

### `commercial.sub_episodes` (23 rows)

Sub-episode definitions.

| Column | Type | Examples |
|--------|------|----------|
| ETG Base Class_(Parent ETG) | BIGINT | `386500`, `439300`, `238900` |
| Description | VARCHAR | `Mood disorder, depressed`, `Psychotic & schizophrenic disorders`, `Cerebral vascular disease` |
| Sub ETG | VARCHAR | `B`, `A`, `C` |
| Description.1 | VARCHAR | `Acute congestive heart failure`, `Acute myocardial infarction`, `Chronic obstructive pulmonary disease with acute exacerbation` |
| Days Before | BIGINT | `1`, `7`, `2` |
| Days After | BIGINT | `365`, `45`, `30` |
| Chronic | BIGINT | `1`, `0` |
| Priority | DOUBLE | `2.0`, `1.0` |

### `commercial.treatment_indicator_codes` (1,115 rows)

Treatment indicator codes for ETG episodes.

| Column | Type | Examples |
|--------|------|----------|
| Treatment Indicator Code | BIGINT | `90007`, `90043`, `90055` |
| Description | VARCHAR | `Surgery; abdomen/peritoneum; drain abscess`, `Surgery; nervous system; basilar; posterior cranial fossa definitive procedures`, `Surgery; integumentary; breast; mammoplasty/nipple reconstruction` |

### `commercial.utilization_treatment_codes` (30 rows)

Utilization treatment codes.

| Column | Type | Examples |
|--------|------|----------|
| Utilization Treatment Code | BIGINT | `60005`, `60001`, `60009` |
| Description | VARCHAR | `CAR-T - days available`, `Injectable hormonal therapy (breast cancer) - days available`, `Injectable biologic` |
| Oncology Only | VARCHAR | `x` |

---

## Schema: `elixhauser`

2 objects, 4,580 total rows.

### `elixhauser.comorbidity_measures` (38 rows)

2025.1 CMR comorbidity measure definitions. Abbreviation, description, and whether POA indicators are required for assignment.

| Column | Type | Examples |
|--------|------|----------|
| Abbreviation (SAS Data Element Name) | VARCHAR | `CMR_AUTOIMMUNE`, `CMR_ULCER_PEPTIC`, `CMR_DEPRESS` |
| Comorbidity Description | VARCHAR | `Anemias due to other nutritional deficiencies`, `Drug abuse `, `Neurological disorders affecting movement ` |
| Uses present on admission (POA) indicators for assignment? | BOOLEAN | `false`, `true` |

### `elixhauser.dx_to_comorb_mapping` (4,542 rows)

2025.1 CMR DX-to-Comorbidity mapping. Maps ICD-10-CM diagnosis codes to 39 Elixhauser comorbidity flags (binary 0/1 columns).

| Column | Type | Examples |
|--------|------|----------|
| ICD-10-CM Diagnosis | VARCHAR | `A5202`, `B181`, `B1910` |
| ICD-10-CM Code Description | VARCHAR | `Malignant neoplasm of lower lip, inner aspect`, `Malignant neoplasm of upper gum`, `Malignant neoplasm of tonsil, unspecified` |
| # Comorbidities | BIGINT | `1`, `3`, `2` |
| AIDS | BIGINT | `0`, `1` |
| ALCOHOL | BIGINT | `1`, `0` |
| ANEMDEF | BIGINT | `0`, `1` |
| AUTOIMMUNE | BIGINT | `1`, `0` |
| BLDLOSS | BIGINT | `0`, `1` |
| CANCER_LEUK | BIGINT |  |
| CANCER_LYMPH | BIGINT |  |
| CANCER_METS | BIGINT |  |
| CANCER_NSITU | BIGINT |  |
| CANCER_SOLID | BIGINT |  |
| CBVD_POA | BIGINT |  |
| CBVD_SQLA | BIGINT |  |
| COAG | BIGINT |  |
| DEMENTIA | BIGINT |  |
| DEPRESS | BIGINT |  |
| DIAB_CX | BIGINT |  |
| DIAB_UNCX | BIGINT |  |
| DRUG_ABUSE | BIGINT |  |
| HF | BIGINT |  |
| HTN_CX | BIGINT |  |
| HTN_UNCX | BIGINT |  |
| LIVER_MLD | BIGINT |  |
| LIVER_SEV | BIGINT |  |
| LUNG_CHRONIC | BIGINT |  |
| NEURO_MOVT | BIGINT |  |
| NEURO_OTH | BIGINT |  |
| NEURO_SEIZ | BIGINT |  |
| OBESE | BIGINT |  |
| PARALYSIS | BIGINT |  |
| PERIVASC | BIGINT |  |
| PSYCHOSES | BIGINT |  |
| PULMCIRC | BIGINT |  |
| RENLFL_MOD | BIGINT |  |
| RENLFL_SEV | BIGINT |  |
| THYROID_HYPO | BIGINT |  |
| THYROID_OTH | BIGINT |  |
| ULCER_PEPTIC | BIGINT |  |
| VALVE | BIGINT |  |
| WGHTLOSS | BIGINT |  |

---

## Schema: `geography`

2 objects, 44,118 total rows.

### `geography.fips_codes` (44,066 rows)

ZIP code to FIPS county crosswalk. Includes city, state, latitude, longitude, FIPS county code, county name, SSA county code, and FIPS state code. Sourced from Synthea.

| Column | Type | Examples |
|--------|------|----------|
| zip | BIGINT | `11805`, `606`, `644` |
| city | VARCHAR | `East Candia`, `Rosario`, `Coamo` |
| state | VARCHAR | `NH`, `ME`, `KY` |
| latitude | DOUBLE | `18.142001999999998`, `18.449732`, `18.332595` |
| longitude | DOUBLE | `-67.13422`, `-66.49835`, `-66.61216999999999` |
| fipscounty | BIGINT | `33015`, `72003`, `72093` |
| county | VARCHAR | `JAYUYA`, `LAJAS`, `NORFOLK` |
| ssacounty | BIGINT | `40180`, `40240`, `40360` |
| fipsstate | DOUBLE |  |

### `geography.timezones` (52 rows)

State to timezone mapping. Maps full state name and abbreviation to timezone name and abbreviation.

| Column | Type | Examples |
|--------|------|----------|
| STATE | VARCHAR | `Hawaii`, `Vermont`, `Virginia` |
| ST | VARCHAR | `CA`, `KY`, `ME` |
| TIMEZONE | VARCHAR | `Eastern Standard Time`, `Mountain Standard Time`, `Alaska Standard Time` |
| TZ | VARCHAR | `CST`, `AKST`, `MST` |

---

## Schema: `medicare`

15 objects, 41,786 total rows.

### `medicare.ap_drg` (1,398 rows)

All Patient DRGs with severity levels 1-4.

| Column | Type | Examples |
|--------|------|----------|
| DRG | VARCHAR | `0051`, `0062`, `0202` |
| AP-DRG | VARCHAR | `002`, `040`, `070` |
| AP-DRG-SEVERITY | BIGINT | `0`, `1`, `3` |
| DRG_DESC | VARCHAR | `Nonspecific CVA & precerebral occlusion w/o infarct`, `Concussion, closed skull Fx nos,uncomplicated intracranial injury, coma < 1 hr or no coma`, `Eye disorders except major infections` |
| GROUP_CAT_CD | VARCHAR | `Maternity`, `MHSA`, `N/A` |
| GROUP_SUB_CD | VARCHAR | `Medical`, `N/A`, `Mental Health` |
| DRG_SEVERITY_METRICS | VARCHAR | `N`, `Y` |
| DRG_WGHT | BIGINT | `0` |
| GEO_LOS | DOUBLE |  |
| AVG_LOS | DOUBLE |  |

### `medicare.bill_type` (679 rows)

Bill type codes with TREND_CAT_CD, FACILITY_TYPE, BILL_CLASSIFICATION for IP/OP/HH/SNF determination.

| Column | Type | Examples |
|--------|------|----------|
| BILL_TYPE_CD | VARCHAR | `175`, `177`, `211` |
| BILL_TYPE_LKP | VARCHAR | `0130`, `0181`, `0134` |
| TREND_CAT_CD | VARCHAR | `IP`, `OP`, `HO` |
| TREND_SUB_CD | VARCHAR | `HH`, `OP`, `IP` |
| FACILITY_TYPE | VARCHAR | `Home Health`, `Clinic`, `Hospital` |
| BILL_CLASSIFICATION | VARCHAR | `Community Mental Health Center (CMHC)`, `Hospital Based or Independent Renal Dialysis Facility`, `Comprehensive Outpatient Rehabilitation Facility (CORF)` |
| FREQUENCY_DESC | VARCHAR | `Replacement of Prior Claim or Corrected Claim`, `Other Outpatient`, `Interim (Continuing Claims)` |

### `medicare.bill_type_hs` (679 rows)

Bill type codes, health system variant.

| Column | Type | Examples |
|--------|------|----------|
| BILL_TYPE_CD | VARCHAR | `175`, `177`, `211` |
| BILL_TYPE_LKP | VARCHAR | `0142`, `0152`, `0114` |
| TREND_CAT_CD | VARCHAR | `IP`, `OP`, `HO` |
| TREND_SUB_CD | VARCHAR | `HH`, `OP`, `HO` |
| FACILITY_TYPE | VARCHAR | `Hospital`, `Other Outpatient`, `Clinic` |
| BILL_CLASSIFICATION | VARCHAR | `Community Mental Health Center (CMHC)`, `Hospital Based or Independent Renal Dialysis Facility`, `Comprehensive Outpatient Rehabilitation Facility (CORF)` |
| FREQUENCY_DESC | VARCHAR | `Replacement of Prior Claim or Corrected Claim`, `Interim (Continuing Claims)`, `Other Outpatient` |

### `medicare.category_mapping` (236 rows)

Trend category to group category crosswalk for cost trend reporting.

| Column | Type | Examples |
|--------|------|----------|
| TREND_CAT_CD | VARCHAR | `IP`, `OP`, `HO` |
| TREND_SUB_CD | VARCHAR | `IP`, `SP`, `SNF` |
| GROUP_CAT_CD | VARCHAR | `DME/Prosthetics/Supplies`, `Drugs`, `Inpatient Visits` |
| GROUP_SUB_CD | VARCHAR | `DME/Prosthetics/Supplies`, `Ultrasound`, `Inpatient Visits` |
| TREND_CAT_CD_FNL | VARCHAR | `IP`, `OT`, `PH` |
| TREND_SUB_CD_FNL | VARCHAR | `IP`, `OT`, `OP` |
| GROUP_CAT_CD_FNL | VARCHAR | `DME/Prosthetics/Supplies`, `Anesthesia`, `Inpatient Visits / Observation` |
| GROUP_SUB_CD_FNL | VARCHAR | `DME/Prosthetics/Supplies`, `Ultrasound`, `Anesthesia` |

### `medicare.chronic_dx` (3,484 rows)

Chronic condition diagnosis codes with CC_IND and SOURCE.

| Column | Type | Examples |
|--------|------|----------|
| DX | VARCHAR | `0065`, `0074`, `01312` |
| CC_IND | VARCHAR | `Opportunistic Infections`, `High Blood Pressure`, `Heart Attack` |
| SOURCE | VARCHAR | `CMS Medicare`, `Truven`, `Commercial` |

### `medicare.clm_cat_lookups` (236 rows)

Claims categorization lookups parsed from CLM_CAT_LKPS.sas. Contains ER, SNF, HH, IRF, room-and-board revenue codes and specialty trend codes.

| Column | Type | Examples |
|--------|------|----------|
| category | VARCHAR | `SPEC_TAX_TREND`, `HH_REV`, `IRF_REV` |
| code | VARCHAR | `207R00000X`, `363LC0200X`, `364SE1400X` |
| description | VARCHAR | `Specialty codes for trend category assignment`, `Specialty taxonomy (NUCC) codes for trend category`, `Skilled nursing facility revenue codes` |

### `medicare.cms_drg` (581 rows)

CMS DRGs, older classification system.

| Column | Type | Examples |
|--------|------|----------|
| DRG | VARCHAR | `002`, `009`, `012` |
| DRG_DESC | VARCHAR | `craniotomy age >17 w cc`, `periph & cranial nerve & other nerv syst proc w cc`, `traumatic stupor & coma, coma <1 hr age >17 w cc` |
| GROUP_CAT_CD | VARCHAR | `Maternity`, `MHSA`, `ERROR` |
| GROUP_SUB_CD | VARCHAR | `Medical`, `Cardiac Surgery`, `Normal Newborn` |

### `medicare.cpt_cd` (32,654 rows)

CPT codes with GROUP_CAT_CD/GROUP_SUB_CD for procedure categorization.

| Column | Type | Examples |
|--------|------|----------|
| CPT | VARCHAR | `0002A`, `00110`, `0011A` |
| CPT_DESC | VARCHAR | `ANES-ELECTROCULVULSIVE THERAPY`, `ANESTHESIA PROCEDURES ON EYE; NOS`, `DEL HI PWR FOCL MAGNET PULS NEURONS` |
| GROUP_CAT_CD | VARCHAR | `Drugs`, `Anesthesia`, `Inpatient Visits` |
| GROUP_SUB_CD | VARCHAR | `Anesthesia`, `Ultrasound`, `Inpatient Visits` |
| GROUP_SUB_RANK | BIGINT | `34`, `41`, `40` |

### `medicare.discharge_status` (99 rows)

Discharge status codes with descriptions for post-acute disposition.

| Column | Type | Examples |
|--------|------|----------|
| Discharge_Status_Code | VARCHAR | `05`, `10`, `54` |
| Discharge_Status_Description | VARCHAR | `Discharged/transferred to an intermediate care facility`, `Reserved for national assignment`, `Expired -used only when the patient dies` |

### `medicare.esrd_cpt` (95 rows)

End-stage renal disease CPT codes for ESRD identification.

| Column | Type | Examples |
|--------|------|----------|
| CPT | VARCHAR | `A4657`, `A4663`, `A4723` |
| ESRD | VARCHAR | `Y` |

### `medicare.ltch` (426 rows)

Long-term care hospital facilities identified by CMS_CCN.

| Column | Type | Examples |
|--------|------|----------|
| CMS_CCN | VARCHAR | `052037`, `072006`, `102025` |
| LTCH_FLAG | VARCHAR | `Y` |
| LTCH_NAME | VARCHAR | `NOLAND HOSPITAL MONTGOMERY II, LLC`, `SELECT SPECIALTY HOSPITAL-PALM BEACH`, `SELECT SPECIALTY HOSPITAL - ATLANTA` |
| LTCH_ADDRESS | VARCHAR | `5 MOBILE INFIRMARY CIRCLE`, `50 MEDICAL PARK EAST DRIVE 8TH FLOOR`, `7220 EAST ROSEWOOD STREET` |
| LTCH_CITY | VARCHAR | `REDDING`, `THORNTON`, `LAND O LAKES` |
| LTCH_STATE | VARCHAR | `CA`, `KY`, `NV` |
| LTCH_ZIP | VARCHAR | `71913`, `72901`, `72903` |
| LTCH_PART_DATE | DATE | `2001-09-01`, `1984-09-01`, `2004-09-01` |

### `medicare.ms_drg` (799 rows)

Medicare Severity DRGs with DRG_WGHT, GEO_LOS, AVG_LOS for inpatient case mix.

| Column | Type | Examples |
|--------|------|----------|
| DRG | VARCHAR | `002`, `012`, `040` |
| DRG_DESC | VARCHAR | `Heart Transplant or Implant of Heart Assist System with MCC`, `ECMO or Tracheostomy with Mechanical Ventilation 96+ Hours or Principal Diagnosis Except Face, Mouth and Neck with Major O.R.`, `Carotid Artery Stent Procedure with CC` |
| GROUP_CAT_CD | VARCHAR | `MHSA`, `Maternity`, `Acute` |
| GROUP_SUB_CD | VARCHAR | `Medical`, `Mental Health`, `Normal Newborn` |
| DRG_SEVERITY_METRICS | VARCHAR | `N`, `Y` |
| DRG_WGHT | DOUBLE | `17.6399`, `1.5602`, `0.753` |
| GEO_LOS | DOUBLE | `28.6`, `11.5`, `5.6` |
| AVG_LOS | DOUBLE | `15.8`, `12.0`, `9.3` |

### `medicare.pot_cd` (99 rows)

Place of treatment codes with TREND_CAT_CD and location descriptors.

| Column | Type | Examples |
|--------|------|----------|
| POT_LKP | VARCHAR | `19`, `27`, `34` |
| POT_CD | BIGINT | `13`, `19`, `23` |
| POT_NAME | VARCHAR | `Prison/ Correctional Facility`, `Assisted Living Facility`, `Homeless Shelter` |
| POT_LOC | VARCHAR | `UN`, `IP`, `AS` |
| POT_LOC_DESC | VARCHAR | `Emergency Room`, `Unassigned`, `Inpatient` |
| TREND_CAT_CD | VARCHAR | `IP`, `OP`, `ERROR` |
| TREND_SUB_CD | VARCHAR | `ERROR`, `HH`, `SNF` |

### `medicare.revenue_cd` (321 rows)

Revenue codes for facility billing classification.

| Column | Type | Examples |
|--------|------|----------|
| REV_CD | VARCHAR | `0040`, `0074`, `0293` |
| REV_CD_DESC | VARCHAR | `Room and Board Ward - Hospice`, `Radiology-Diagnostic-Chest X-ray`, `Anesthesia-Other Anesthesia` |
| GROUP_CAT_CD | VARCHAR | `MHSA`, `Therapy`, `Home Health` |
| GROUP_SUB_CD | VARCHAR | `Inpatient Visits`, `DME/Prosthetics/Supplies`, `Anesthesia` |
| GROUP_SUB_RANK | BIGINT | `41`, `72`, `26` |

### `medicare.revenue_code_flags` (view)

View joining revenue_cd to clm_cat_lookups. Provides boolean flags (is_er, is_snf, is_hh, is_irf, is_room_board) per revenue code.

| Column | Type | Examples |
|--------|------|----------|
| REV_CD | VARCHAR |  |
| REV_CD_DESC | VARCHAR |  |
| GROUP_CAT_CD | VARCHAR |  |
| GROUP_SUB_CD | VARCHAR |  |
| GROUP_SUB_RANK | BIGINT |  |
| is_er | BOOLEAN |  |
| is_snf | BOOLEAN |  |
| is_hh | BOOLEAN |  |
| is_irf | BOOLEAN |  |
| is_room_board | BOOLEAN |  |

---

## Schema: `ndc`

2 objects, 320,500 total rows.

### `ndc.package` (209,777 rows)

FDA NDC package file. 209k+ package-level records with NDC package code and description.

| Column | Type | Examples |
|--------|------|----------|
| PRODUCTID | VARCHAR | `65785-125_445cc5b0-291c-a344-e063-6394a90a0298`, `65808-324_b7a1ce34-a98c-22cf-e053-2a95a90afa45`, `65841-099_ef5c1ef5-2884-4395-a65a-92591c986150` |
| PRODUCTNDC | VARCHAR | `65785-166`, `65841-617`, `65841-626` |
| NDCPACKAGECODE | VARCHAR | `65785-160-01`, `65808-326-01`, `65841-023-24` |
| PACKAGEDESCRIPTION | VARCHAR | `1 BOTTLE in 1 CARTON (65808-320-01)  / 90 TABLET in 1 BOTTLE`, `30 TABLET, FILM COATED in 1 BOTTLE (65841-097-06) `, `90 TABLET, FILM COATED in 1 BOTTLE (65841-667-16) ` |
| STARTMARKETINGDATE | VARCHAR | `20200101`, `20140812`, `20110601` |
| ENDMARKETINGDATE | VARCHAR | `20281220.0`, `20290520.0`, `20290522.0` |
| NDC_EXCLUDE_FLAG | VARCHAR | `N` |
| SAMPLE_PACKAGE | VARCHAR | `N`, `Y` |

### `ndc.product` (110,723 rows)

FDA NDC product file. 110k+ drug products with proprietary name, substance, dosage form, route, labeler, and pharmacological class.

| Column | Type | Examples |
|--------|------|----------|
| PRODUCTID | VARCHAR | `0002-1152_73525e5b-d4bc-444e-bf38-f989c2ccea96`, `0002-3977_94e137ac-9f6b-4904-8999-3e55603a2407`, `0002-4815_01706851-8b56-40b8-9e22-e454b3e24f95` |
| PRODUCTNDC | VARCHAR | `0002-7797`, `0003-0857`, `0003-4522` |
| PRODUCTTYPENAME | VARCHAR | `STANDARDIZED ALLERGENIC`, `HUMAN OTC DRUG`, `NON-STANDARDIZED ALLERGENIC` |
| PROPRIETARYNAME | VARCHAR | `BASAGLAR`, `EBGLYSS`, `Rezvoglar` |
| PROPRIETARYNAMESUFFIX | VARCHAR | `R U-500`, `350`, `Severe Congestion Relief Nasal Mist` |
| NONPROPRIETARYNAME | VARCHAR | `pirtobrutinib`, `ipilimumab`, `RALTEGRAVIR` |
| DOSAGEFORMNAME | VARCHAR | `GRANULE, FOR SUSPENSION`, `TABLET, EXTENDED RELEASE`, `SUPPOSITORY` |
| ROUTENAME | VARCHAR | `INTRAVASCULAR; INTRAVENOUS`, `VAGINAL`, `ORAL; RECTAL` |
| STARTMARKETINGDATE | VARCHAR |  |
| ENDMARKETINGDATE | VARCHAR |  |
| MARKETINGCATEGORYNAME | VARCHAR |  |
| APPLICATIONNUMBER | VARCHAR |  |
| LABELERNAME | VARCHAR |  |
| SUBSTANCENAME | VARCHAR |  |
| ACTIVE_NUMERATOR_STRENGTH | VARCHAR |  |
| ACTIVE_INGRED_UNIT | VARCHAR |  |
| PHARM_CLASSES | VARCHAR |  |
| DEASCHEDULE | VARCHAR |  |
| NDC_EXCLUDE_FLAG | VARCHAR |  |
| LISTING_RECORD_CERTIFIED_THROUGH | VARCHAR |  |

---
