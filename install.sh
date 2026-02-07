#!/usr/bin/env bash
set -euo pipefail

# Install Cursor agents and rules into the current project.
# Usage: ./install.sh [target-project-path]
#   Defaults to current directory if no path given.

TARGET="${1:-.}"

mkdir -p "$TARGET/.cursor/agents" "$TARGET/.cursor/rules"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cp "$SCRIPT_DIR"/*.md "$TARGET/.cursor/agents/" 2>/dev/null || true
# Exclude README.md from agents
rm -f "$TARGET/.cursor/agents/README.md"

cp "$SCRIPT_DIR"/rules/*.mdc "$TARGET/.cursor/rules/"

echo "Installed to $TARGET/.cursor/"
echo "  agents: $(ls "$TARGET/.cursor/agents/" | wc -l | tr -d ' ') files"
echo "  rules:  $(ls "$TARGET/.cursor/rules/" | wc -l | tr -d ' ') files"
