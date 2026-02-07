# Cursor Agents & Rules

Shared Cursor configuration for Goldberg Consulting projects.

## Quick Install

```bash
git clone git@github.com:goldberg-consulting/cursor-agents.git
cd cursor-agents
./install.sh /path/to/your/project
```

This copies agents into `.cursor/agents/` and rules into `.cursor/rules/` inside the target project.

## What Gets Installed

### Agents (`.cursor/agents/`)

| Agent | Description |
|-------|-------------|
| `databricks-engineer` | PySpark, Spark SQL, DBT, Databricks CLI, Delta Lake, Unity Catalog |
| `data-scientist` | Polars, DuckDB, scikit-learn, statistical modeling, healthcare analytics |
| `swift-developer` | SwiftUI, structured concurrency, protocol-oriented design, iOS/macOS |
| `code-reviewer` | Code quality, security, and project coding standards enforcement |
| `debugger` | Root cause analysis for Python and Swift |

### Rules (`.cursor/rules/`)

| Rule | Scope | Description |
|------|-------|-------------|
| `general.mdc` | Always | Scope discipline, no LLM tells, surgical edits |
| `git-workflow.mdc` | Always | Conventional commits, branch naming |
| `security.mdc` | Always | Secrets, PHI/PII, input validation |
| `python-standards.mdc` | `**/*.py` | Polars, structlog, ruff, type hints, pytest |
| `sql-standards.mdc` | `**/*.sql` | CTEs, parameterized queries, DBT conventions |
| `swift-standards.mdc` | `**/*.swift` | SwiftUI, async/await, value types, SwiftLint |
| `writing-style.mdc` | `**/*.md` | Academic/technical voice, mermaid diagrams |

## Updating

```bash
cd cursor-agents && git pull
./install.sh /path/to/your/project
```
