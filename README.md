# Cursor Agents & Rules

Shared Cursor configuration for Goldberg Consulting projects. Contains specialized subagents and scoped coding rules.

## Installation

Copy agents and rules into any project's `.cursor/` directory:

```bash
# Clone once
git clone git@github.com:goldberg-consulting/cursor-agents.git ~/cursor-agents

# In your project, copy what you need
cp ~/cursor-agents/*.md your-project/.cursor/agents/
cp ~/cursor-agents/rules/*.mdc your-project/.cursor/rules/
```

Or as a one-liner for a new project:

```bash
mkdir -p .cursor/agents .cursor/rules && \
  cp ~/cursor-agents/*.md .cursor/agents/ && \
  cp ~/cursor-agents/rules/*.mdc .cursor/rules/
```

### Directory Structure

```
your-project/
└── .cursor/
    ├── agents/          ← subagents (*.md)
    │   ├── code-reviewer.md
    │   ├── data-scientist.md
    │   ├── databricks-engineer.md
    │   ├── debugger.md
    │   └── swift-developer.md
    └── rules/           ← coding rules (*.mdc)
        ├── general.mdc
        ├── git-workflow.mdc
        ├── python-standards.mdc
        ├── security.mdc
        ├── sql-standards.mdc
        ├── swift-standards.mdc
        └── writing-style.mdc
```

## Agents

| Agent | Scope | Description |
|-------|-------|-------------|
| `databricks-engineer` | Python + SQL + DBT | PySpark, Spark SQL, DBT models, Databricks CLI, Delta Lake, Unity Catalog |
| `data-scientist` | Python + analytics | Polars-first data science, DuckDB, scikit-learn, statistical modeling, healthcare analytics |
| `swift-developer` | Swift / SwiftUI | iOS/macOS app development, structured concurrency, protocol-oriented design |
| `code-reviewer` | All languages | Code quality, security, and adherence to project coding standards |
| `debugger` | Python + Swift | Root cause analysis, error triage, regression testing |

## Rules

| Rule | Applies To | Description |
|------|-----------|-------------|
| `general.mdc` | Always | Scope discipline, no LLM tells, surgical edits, self-verification |
| `git-workflow.mdc` | Always | Conventional commits, branch naming, PR workflow |
| `security.mdc` | Always | Secrets management, PHI/PII protection, input validation |
| `python-standards.mdc` | `**/*.py` | Polars over Pandas, structlog, ruff, type hints, pytest |
| `sql-standards.mdc` | `**/*.sql` | CTEs, parameterized queries, DBT conventions |
| `swift-standards.mdc` | `**/*.swift` | SwiftUI, async/await, value types, SwiftLint |
| `writing-style.mdc` | `**/*.md` | Academic/technical voice, mermaid diagrams |

### How Rules Work

- **`alwaysApply: true`** rules load in every conversation (general, git, security).
- **`globs: **/*.py`** rules load only when you have matching files open.
- Rules are concise (~30 lines each) so they don't bloat the context window.

## Updating

Pull the latest and re-copy:

```bash
cd ~/cursor-agents && git pull
cp *.md your-project/.cursor/agents/
cp rules/*.mdc your-project/.cursor/rules/
```
