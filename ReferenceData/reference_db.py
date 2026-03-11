"""
Read-only access to the reference data DuckDB database.

Provides typed convenience functions for common lookups. All functions
return Polars DataFrames or Python collections. The database connection
is read-only by default.

The database has three payer schemas: medicare, medicaid, commercial.
All functions default to the 'medicare' schema. Pass schema="medicaid"
or schema="commercial" when those schemas have data.

Usage:
    from ReferenceData.reference_db import connect, query, get_er_revenue_codes

    # Ad-hoc query (defaults to medicare schema via search path)
    df = query("SELECT * FROM ms_drg WHERE DRG_WGHT > 10")

    # Explicit schema
    df = query("SELECT * FROM medicaid.chronic_dx")

    # Convenience lookups
    er_codes = get_er_revenue_codes()
    chronic = get_chronic_dx()
    drg_info = lookup_drg("001")
"""

from __future__ import annotations

from pathlib import Path

import duckdb
import polars as pl

DB_PATH = Path(__file__).parent / "reference.duckdb"

VALID_SCHEMAS = {"medicare", "medicaid", "commercial", "ndc", "elixhauser", "geography"}
DEFAULT_SCHEMA = "medicare"


def _validate_schema(schema: str) -> str:
    if schema not in VALID_SCHEMAS:
        raise ValueError(f"Unknown schema '{schema}'. Valid schemas: {sorted(VALID_SCHEMAS)}")
    return schema


def connect(read_only: bool = True, schema: str = DEFAULT_SCHEMA) -> duckdb.DuckDBPyConnection:
    """Return a DuckDB connection with the search path set to the given schema.

    Args:
        read_only: Open in read-only mode (default True). Set False only
            for administrative operations.
        schema: Payer schema to set as default search path. One of
            'medicare', 'medicaid', 'commercial'.

    Raises:
        FileNotFoundError: If reference.duckdb does not exist. Run
            build_reference_db.py first.
    """
    if not DB_PATH.exists():
        raise FileNotFoundError(
            f"Reference database not found at {DB_PATH}. "
            "Run 'python ReferenceData/build_reference_db.py' to build it."
        )
    _validate_schema(schema)
    conn = duckdb.connect(str(DB_PATH), read_only=read_only)
    conn.execute(f"SET search_path = '{schema}'")
    return conn


def query(sql: str, schema: str = DEFAULT_SCHEMA) -> pl.DataFrame:
    """Execute a SQL query and return a Polars DataFrame.

    Unqualified table names resolve to the given schema. You can also
    use fully qualified names (e.g., medicaid.chronic_dx) regardless
    of the schema parameter.
    """
    conn = connect(schema=schema)
    try:
        return conn.execute(sql).pl()
    finally:
        conn.close()


def get_er_revenue_codes(schema: str = DEFAULT_SCHEMA) -> frozenset[str]:
    """Return the set of ER revenue codes (4-digit padded)."""
    conn = connect(schema=schema)
    try:
        rows = conn.execute("SELECT code FROM clm_cat_lookups WHERE category = 'ER_REV'").fetchall()
        return frozenset(r[0] for r in rows)
    finally:
        conn.close()


def get_snf_revenue_codes(schema: str = DEFAULT_SCHEMA) -> frozenset[str]:
    """Return the set of SNF revenue codes (4-digit padded)."""
    conn = connect(schema=schema)
    try:
        rows = conn.execute(
            "SELECT code FROM clm_cat_lookups WHERE category = 'SNF_REV'"
        ).fetchall()
        return frozenset(r[0] for r in rows)
    finally:
        conn.close()


def get_hh_revenue_codes(schema: str = DEFAULT_SCHEMA) -> frozenset[str]:
    """Return the set of Home Health revenue codes (4-digit padded)."""
    conn = connect(schema=schema)
    try:
        rows = conn.execute("SELECT code FROM clm_cat_lookups WHERE category = 'HH_REV'").fetchall()
        return frozenset(r[0] for r in rows)
    finally:
        conn.close()


def get_room_board_revenue_codes(schema: str = DEFAULT_SCHEMA) -> frozenset[str]:
    """Return the set of Room and Board revenue codes (4-digit padded)."""
    conn = connect(schema=schema)
    try:
        rows = conn.execute(
            "SELECT code FROM clm_cat_lookups WHERE category = 'ROOM_BOARD_REV'"
        ).fetchall()
        return frozenset(r[0] for r in rows)
    finally:
        conn.close()


def get_chronic_dx(schema: str = DEFAULT_SCHEMA) -> pl.DataFrame:
    """Return all chronic condition diagnosis codes with CC_IND and SOURCE."""
    return query("SELECT * FROM chronic_dx", schema=schema)


def get_cpt_categories(schema: str = DEFAULT_SCHEMA) -> pl.DataFrame:
    """Return CPT codes with their group category and subcategory."""
    return query(
        "SELECT CPT, CPT_DESC, GROUP_CAT_CD, GROUP_SUB_CD FROM cpt_cd",
        schema=schema,
    )


def get_revenue_code_flags(schema: str = DEFAULT_SCHEMA) -> pl.DataFrame:
    """Return revenue codes with boolean flags for ER, SNF, HH, IRF, Room and Board."""
    return query("SELECT * FROM revenue_code_flags", schema=schema)


def lookup_drg(drg_code: str, system: str = "ms", schema: str = DEFAULT_SCHEMA) -> dict | None:
    """Look up a DRG code and return its attributes.

    Args:
        drg_code: The DRG code (will be cast to match the table).
        system: Which DRG system to query: "ms" (default), "cms", or "ap".
        schema: Payer schema to query.

    Returns:
        Dictionary with DRG attributes, or None if not found.
    """
    table = {"ms": "ms_drg", "cms": "cms_drg", "ap": "ap_drg"}.get(system)
    if table is None:
        raise ValueError(f"Unknown DRG system '{system}'. Use 'ms', 'cms', or 'ap'.")

    conn = connect(schema=schema)
    try:
        row = conn.execute(
            f"SELECT * FROM {table} WHERE CAST(DRG AS VARCHAR) = ?",  # noqa: S608
            [str(drg_code)],
        ).fetchone()
        if row is None:
            return None
        columns = [desc[0] for desc in conn.description]
        return dict(zip(columns, row, strict=False))
    finally:
        conn.close()


def get_category_mapping(schema: str = DEFAULT_SCHEMA) -> pl.DataFrame:
    """Return the trend-to-group category mapping for cost reporting."""
    return query(
        "SELECT * FROM category_mapping WHERE TREND_CAT_CD IS NOT NULL AND TREND_CAT_CD != ''",
        schema=schema,
    )


def get_bill_type_classification(schema: str = DEFAULT_SCHEMA) -> pl.DataFrame:
    """Return bill types with facility type and classification for IP/OP/HH/SNF."""
    return query(
        """SELECT BILL_TYPE_CD, BILL_TYPE_LKP, TREND_CAT_CD, TREND_SUB_CD,
                  FACILITY_TYPE, BILL_CLASSIFICATION
           FROM bill_type""",
        schema=schema,
    )


def get_clm_cat_codes(category: str, schema: str = DEFAULT_SCHEMA) -> frozenset[str]:
    """Return codes for any claims categorization lookup by category name.

    Valid categories: ER_REV, SNF_REV, HH_REV, IRF_REV, HH_POT,
    ROOM_BOARD_REV, SPEC_TREND, SPEC_TAX_TREND.
    """
    conn = connect(schema=schema)
    try:
        rows = conn.execute(
            "SELECT code FROM clm_cat_lookups WHERE category = ?",
            [category],
        ).fetchall()
        if not rows:
            valid = conn.execute(
                "SELECT DISTINCT category FROM clm_cat_lookups ORDER BY category"
            ).fetchall()
            valid_names = [r[0] for r in valid]
            raise ValueError(f"Unknown category '{category}'. Valid categories: {valid_names}")
        return frozenset(r[0] for r in rows)
    finally:
        conn.close()


def list_tables(schema: str | None = None) -> pl.DataFrame:
    """List tables and views in the reference database.

    Args:
        schema: If provided, list only tables in that schema. If None,
            list tables across all payer schemas.
    """
    if schema:
        _validate_schema(schema)
        where = f"t.table_schema = '{schema}'"
    else:
        schemas_str = ", ".join(f"'{s}'" for s in VALID_SCHEMAS)
        where = f"t.table_schema IN ({schemas_str})"

    conn = connect()
    try:
        return conn.execute(
            f"""
            SELECT
                t.table_schema,
                t.table_name,
                t.table_type
            FROM information_schema.tables t
            WHERE {where}
            ORDER BY t.table_schema, t.table_type, t.table_name
        """  # noqa: S608
        ).pl()
    finally:
        conn.close()


def spur_search(
    table: str, code_column: str, spur: str, schema: str = DEFAULT_SCHEMA
) -> pl.DataFrame:
    """Find all rows where the code column starts with the given prefix (spur).

    Ported from ReferenceDataManager.lookup_*_by_spur patterns. Works against
    any table and code column in the database.

    Args:
        table: Table name (e.g., "cpt_cd", "etg_number", "icd10").
        code_column: Column containing the code (e.g., "CPT", "full_etg", "code").
        spur: Prefix to match (e.g., "E11" for all E11.x ICD codes, "992" for 992xx CPTs).
        schema: Payer schema to query.

    Returns:
        Polars DataFrame with all matching rows.
    """
    conn = connect(schema=schema)
    try:
        return conn.execute(
            f"SELECT * FROM {table} WHERE CAST({code_column} AS VARCHAR) LIKE ? || '%'",  # noqa: S608
            [str(spur)],
        ).pl()
    finally:
        conn.close()


def normalize_icd10(code: str) -> str:
    """Remove decimal from an ICD-10 code. E11.9 becomes E119."""
    return str(code).replace(".", "")


def format_icd10(code: str) -> str:
    """Add decimal after the 3rd character. E119 becomes E11.9."""
    normalized = normalize_icd10(code)
    if len(normalized) > 3:
        return f"{normalized[:3]}.{normalized[3:]}"
    return normalized


def lookup_icd10(code: str, schema: str = "commercial") -> pl.DataFrame:
    """Look up an ICD-10 code by either format (with or without decimal).

    Searches the icd10 table in the given schema. Returns matching rows.
    """
    normalized = normalize_icd10(code)
    return query(
        f"SELECT * FROM icd10 WHERE code = '{normalized}'",  # noqa: S608
        schema=schema,
    )


def lookup_paces_by_code(icd_code: str, schema: str = "commercial") -> pl.DataFrame:
    """Find PACES episodes whose trigger codes contain the given ICD-10 code.

    Searches the trigger_codes column of paces_grouper for a substring match.
    """
    normalized = normalize_icd10(icd_code)
    formatted = format_icd10(icd_code)
    return query(
        f"""SELECT * FROM paces_grouper
            WHERE trigger_codes LIKE '%{normalized}%'
               OR trigger_codes LIKE '%{formatted}%'""",  # noqa: S608
        schema=schema,
    )


def get_etg_info(etg_code: int | str, schema: str = "commercial") -> dict | None:
    """Look up an ETG code and return its attributes including body part.

    Args:
        etg_code: Full 9-digit or 6-digit ETG code.
        schema: Payer schema to query.
    """
    conn = connect(schema=schema)
    try:
        row = conn.execute(
            "SELECT * FROM etg_number WHERE CAST(full_etg AS VARCHAR) = ?",
            [str(etg_code)],
        ).fetchone()
        if row is None:
            return None
        columns = [desc[0] for desc in conn.description]
        result = dict(zip(columns, row, strict=False))

        etg_str = str(etg_code).zfill(6)
        body_part_code = etg_str[4:6] if len(etg_str) >= 6 else "00"
        bp_row = conn.execute(
            'SELECT * FROM etg_body_part_key WHERE CAST("5th_6th_digit" AS VARCHAR) = ?',
            [body_part_code.lstrip("0") or "0"],
        ).fetchone()
        result["body_part_code"] = body_part_code
        result["body_part_desc"] = bp_row[2] if bp_row and len(bp_row) > 2 else "N/A"
        return result
    except duckdb.CatalogException:
        return None
    finally:
        conn.close()


def list_schemas() -> list[str]:
    """Return the list of payer schemas that contain at least one table."""
    conn = connect()
    try:
        rows = conn.execute("""
            SELECT DISTINCT table_schema
            FROM information_schema.tables
            WHERE table_schema IN ('medicare', 'medicaid', 'commercial', 'ndc', 'elixhauser', 'geography')
              AND table_type = 'BASE TABLE'
            ORDER BY table_schema
        """).fetchall()
        return [r[0] for r in rows]
    finally:
        conn.close()
