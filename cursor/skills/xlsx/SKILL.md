---
name: xlsx
description: "Use this skill when a spreadsheet file is the primary input or output, including .xlsx, .xlsm, .csv, and .tsv workflows."
---

# Spreadsheet Skill

Use this skill when the user asks to create, edit, clean, analyze, or convert spreadsheet files.

## Trigger Conditions

- The user references `.xlsx`, `.xlsm`, `.csv`, or `.tsv` files.
- The deliverable is a spreadsheet file, not a standalone script or report.
- Work includes formulas, formatting, charting, cleanup, or tabular conversion.

## Output Requirements

- Deliver spreadsheet files with zero formula errors (`#REF!`, `#DIV/0!`, `#VALUE!`, `#N/A`, `#NAME?`).
- Preserve existing template conventions when modifying existing workbooks.
- Use formulas in workbook cells, do not hardcode computed values from code.

## Preferred Tooling

- Use `pandas` for bulk tabular ingest, transformations, and export.
- Use `openpyxl` for formulas, formatting, workbook structure, and Excel-specific features.
- Recalculate formulas after writing files if the workflow depends on formula outputs.

## Working Pattern

1. Inspect workbook/sheet structure first.
2. Apply data and formula edits.
3. Save workbook.
4. Recalculate and validate formulas.
5. Verify key cells and totals before final handoff.
