#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    shift
fi

if [[ ! -f "$ENV_FILE" ]]; then
    echo "ERROR: .env not found at $ENV_FILE"
    echo "  cp .env.example .env"
    echo "  Then edit .env with your project paths."
    exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

if [[ -z "${PROJECTS:-}" ]]; then
    echo "ERROR: PROJECTS is empty or not set in .env"
    echo "  Add project paths to the PROJECTS variable, one per line."
    exit 1
fi

succeeded=0
skipped=0
failed=0

while IFS= read -r line; do
    line="${line##[[:space:]]}"
    line="${line%%[[:space:]]}"

    [[ -z "$line" ]] && continue
    [[ "$line" == \#* ]] && continue

    # Expand ~ to home directory
    expanded="${line/#\~/$HOME}"

    if [[ ! -d "$expanded" ]]; then
        echo "SKIP: $expanded (directory not found)"
        ((skipped++))
        continue
    fi

    if $DRY_RUN; then
        echo "WOULD INSTALL: $expanded"
        ((succeeded++))
        continue
    fi

    echo "=== $expanded ==="
    if "$SCRIPT_DIR/install.sh" "$expanded"; then
        ((succeeded++))
    else
        echo "FAILED: $expanded"
        ((failed++))
    fi
    echo ""
done <<< "$PROJECTS"

echo "---"
if $DRY_RUN; then
    echo "Dry run complete: $succeeded projects would be updated, $skipped skipped."
else
    echo "Done: $succeeded succeeded, $skipped skipped, $failed failed."
fi
