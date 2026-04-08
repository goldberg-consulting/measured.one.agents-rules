#!/usr/bin/env bash
set -euo pipefail

# Install Cursor agents, rules, skills, and reference database into a project.
#
# Usage: ./install.sh [target-project-path]
#   Defaults to current directory if no path given.
#
# Environment:
#   REFERENCE_DB_REPO  Path to the reference database build repo
#                      (default: ~/reference-db-builder)
#   CODE_LOOK_ME_UP    Legacy alias for REFERENCE_DB_REPO
#   REBUILD_DB         Set to "1" to force rebuild the reference database

TARGET="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REFERENCE_DB_REPO="${REFERENCE_DB_REPO:-${CODE_LOOK_ME_UP:-$HOME/reference-db-builder}}"

# --- Agents, rules, and skills ---
mkdir -p "$TARGET/.cursor"
cp -r "$SCRIPT_DIR/cursor/agents" "$TARGET/.cursor/"
cp -r "$SCRIPT_DIR/cursor/rules" "$TARGET/.cursor/"
cp -r "$SCRIPT_DIR/cursor/skills" "$TARGET/.cursor/"

echo "Installed agents, rules, and skills to $TARGET/.cursor/"
echo "  agents: $(ls "$TARGET/.cursor/agents/" | wc -l | tr -d ' ') files"
echo "  rules:  $(ls "$TARGET/.cursor/rules/" | wc -l | tr -d ' ') files"
echo "  skills: $(ls "$TARGET/.cursor/skills/" | wc -l | tr -d ' ') directories"

# --- Reference database ---
DB_SOURCE="$REFERENCE_DB_REPO/src/reference.duckdb"
mkdir -p "$TARGET/ReferenceData"

if [ ! -d "$REFERENCE_DB_REPO" ]; then
    echo ""
    echo "NOTE: Reference database build repo not found at $REFERENCE_DB_REPO"
    echo "  Set REFERENCE_DB_REPO env var to the repo path."
    echo "  Skipping reference database setup."
else
    # Build the database if it does not exist or rebuild is requested
    if [ ! -f "$DB_SOURCE" ] || [ "${REBUILD_DB:-0}" = "1" ]; then
        echo ""
        echo "Building reference database from source files..."
        (cd "$REFERENCE_DB_REPO/src" && python3 build_reference_db.py)
    fi

    DB_TARGET="$TARGET/ReferenceData/reference.duckdb"
    # Remove stale symlinks or old copies
    [ -L "$DB_TARGET" ] && rm "$DB_TARGET"

    echo ""
    echo "Copying reference database to $DB_TARGET..."
    cp "$DB_SOURCE" "$DB_TARGET"

    DB_SIZE=$(du -sh "$DB_TARGET" | cut -f1)
    echo "  reference.duckdb ($DB_SIZE)"

    # Always copy the latest access module and data dictionary
    cp "$REFERENCE_DB_REPO/src/reference_db.py" "$TARGET/ReferenceData/reference_db.py"
    echo "  reference_db.py"

    if [ -f "$REFERENCE_DB_REPO/src/DATA_DICTIONARY.md" ]; then
        cp "$REFERENCE_DB_REPO/src/DATA_DICTIONARY.md" "$TARGET/ReferenceData/DATA_DICTIONARY.md"
        echo "  DATA_DICTIONARY.md"
    fi
fi

# Create __init__.py so ReferenceData is importable as a package
touch "$TARGET/ReferenceData/__init__.py"

# Verify
echo ""
if python3 -c "
import sys
sys.path.insert(0, '$(cd "$TARGET" && pwd)')
from ReferenceData.reference_db import list_schemas
schemas = list_schemas()
print(f'  Schemas with data: {schemas}')
" 2>/dev/null; then
    echo "  Database verified."
else
    echo "  WARNING: Could not verify database. Check Python dependencies (duckdb, polars)."
fi

echo ""
echo "Done. Reference data available via:"
echo "  from ReferenceData.reference_db import query, get_er_revenue_codes, lookup_drg"
