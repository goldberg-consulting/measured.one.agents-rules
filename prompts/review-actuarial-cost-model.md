# Review: Actuarial Cost Model

I need a thorough review of the actuarial cost model in this repo. I want feedback on coding style, approach, and correctness. This is not a refactor request; I want a written assessment before we decide what to change.

## Part 1: Code Quality Review

@code-reviewer: Review the codebase against our Python standards. Focus on:

- **Design**: Is the code OO where it should be? Are there raw dicts crossing function boundaries that should be dataclasses or Pydantic models? Are config values hardcoded or parameterized?
- **Vectorization**: Are there row-level loops over claims or member data? Anything using `iterrows()`, `apply(axis=1)`, or Python `for` loops over DataFrames?
- **Type safety**: Are function signatures typed? Are return types documented? Would a new developer know what goes in and what comes out without reading the implementation?
- **Naming**: Are variable names descriptive? Are there magic numbers without comments? Are actuarial assumptions (trend factors, completion factors, IBNR lags) documented with their source?
- **Testing**: Is there a test suite? Do the tests verify actuarial outputs against known values or published benchmarks? Are edge cases covered (zero-member months, partial eligibility, runout periods)?
- **Structure**: Is the code organized into clear modules, or is it a single file? Are concerns separated (data loading, transformation, modeling, output)?

Present findings as CRITICAL / WARNING / SUGGESTION with file and line references.

## Part 2: Statistical and Actuarial Review

@data-scientist: Review the analytical approach. Focus on:

- **Assumptions**: Are actuarial assumptions stated explicitly (trend rate, completion factors, IBNR development, seasonality adjustment)? Are they documented with their source (experience study, industry benchmark, client-specific)?
- **Causal framing**: If the model estimates the cost impact of an intervention, is the causal question stated? What is the estimand? What identification strategy is used? Are the assumptions for a causal interpretation testable?
- **Estimation**: Are standard errors reported? Are confidence intervals provided alongside point estimates? Is uncertainty in the trend assumption propagated through to the final cost projection?
- **Validation**: Is there a holdout or backtest? Does the model predict accurately on historical periods where the true answer is known?
- **Sensitivity**: Is there a sensitivity analysis on key assumptions (trend +/- 1%, completion factor +/- 5%, IBNR lag +/- 1 month)? What breaks the model?
- **Methodology**: Is the approach standard (chain-ladder, Bornhuetter-Ferguson, GLM, gradient boosting) or custom? If custom, is the rationale documented?

Present findings with specific references to the code and any formulas that need clarification or correction.

## Part 3: Healthcare Domain Review

@healthcare-data-reviewer: Review for clinical and compliance correctness. Focus on:

- **PHI**: Are there member IDs, dates of birth, or other PHI in logs, comments, or hardcoded test data?
- **Claims logic**: Is the model using the correct dedup key? Are bilateral procedures, multi-line claims, and legitimate duplicates handled correctly? Is the allowed amount (not charge amount) used for cost projections?
- **Clinical plausibility**: Do the projected costs per member per month fall within reasonable ranges for the condition and population? Are there outputs that a clinician would flag as implausible?
- **Date handling**: Are incurred dates parsed correctly (SAS format vs. ISO)? Is claim lag / runout accounted for?
- **Terminology**: Is the code using our standard terms (member, not patient; allowed amount, not paid amount; book, not product)?

Present findings organized by severity (CRITICAL, WARNING, SUGGESTION, CLINICAL NOTE).

---

Start with all three reviews in parallel. Present a consolidated assessment with the most critical findings first, regardless of which reviewer identified them.
