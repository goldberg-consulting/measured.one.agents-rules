#!/usr/bin/env bash
set -euo pipefail

# Install Cursor agents and rules into a project.
# Usage: ./install.sh [target-project-path]
#   Defaults to current directory if no path given.

TARGET="${1:-.}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

cp -r "$SCRIPT_DIR/cursor/" "$TARGET/.cursor/"

echo "Installed to $TARGET/.cursor/"
echo "  agents: $(ls "$TARGET/.cursor/agents/" | wc -l | tr -d ' ') files"
echo "  rules:  $(ls "$TARGET/.cursor/rules/" | wc -l | tr -d ' ') files"
