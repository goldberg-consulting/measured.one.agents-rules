# Cursor Agents & Rules

Shared Cursor agents, rules, and skills for consistent AI-assisted development.

## Install

### Option 1: VS Code / Cursor Extension

Install the **Cursor Agents Installer** extension, then open the Command Palette:

- **Cursor Agents: Install from Repository** picks from your registry or accepts a custom git URL
- **Cursor Agents: Install Scaffolding** installs the bundled defaults with no network needed
- **Cursor Agents: Manage Repositories** add, view, or remove repos from your registry

The extension clones the repo, copies `agents/`, `rules/`, and `skills/` into your workspace's `.cursor/` directory, and cleans up.

### Option 2: Shell Script

```bash
git clone <repo-url>
cd cursor-agents
./install.sh /path/to/your/project
```

This copies `cursor/` into `.cursor/` inside the target project.

## Repo Structure

```
cursor-agents/
├── cursor/                  ← mirrors .cursor/ in your project
│   ├── agents/
│   │   ├── code-reviewer.md
│   │   ├── data-scientist.md
│   │   ├── databricks-engineer.md
│   │   ├── debugger.md
│   │   ├── scientific-writer.md
│   │   └── swift-developer.md
│   ├── rules/
│   │   ├── general.mdc
│   │   ├── git-workflow.mdc
│   │   ├── python-standards.mdc
│   │   ├── security.mdc
│   │   ├── sql-standards.mdc
│   │   ├── swift-standards.mdc
│   │   └── writing-style.mdc
│   └── skills/
│       └── example-skill/
│           └── SKILL.md
├── extension/               ← VS Code / Cursor extension source
│   ├── package.json
│   ├── src/
│   │   ├── extension.ts
│   │   ├── installer.ts
│   │   └── registry.ts
│   └── ...
├── install.sh
└── README.md
```

## Agents

| Agent | Description |
|-------|-------------|
| `databricks-engineer` | PySpark, Spark SQL, DBT, Databricks CLI, Delta Lake, Unity Catalog |
| `data-scientist` | Polars, DuckDB, scikit-learn, statistical modeling, exploratory analysis |
| `swift-developer` | SwiftUI, structured concurrency, protocol-oriented design, iOS/macOS |
| `code-reviewer` | Code quality, security, and project coding standards enforcement |
| `debugger` | Root cause analysis for Python and Swift |
| `scientific-writer` | Academic/technical prose, papers, white papers, figure captions, abstracts |

## Rules

| Rule | Scope | Description |
|------|-------|-------------|
| `general.mdc` | Always | Scope discipline, no LLM tells, surgical edits |
| `git-workflow.mdc` | Always | Conventional commits, branch naming |
| `security.mdc` | Always | Secrets, PHI/PII, input validation |
| `python-standards.mdc` | `**/*.py` | Polars, structlog, ruff, type hints, pytest |
| `sql-standards.mdc` | `**/*.sql` | CTEs, parameterized queries, DBT conventions |
| `swift-standards.mdc` | `**/*.swift` | SwiftUI, async/await, value types, SwiftLint |
| `writing-style.mdc` | `**/*.md` | Academic/technical voice, mermaid diagrams |

## Skills

| Skill | Description |
|-------|-------------|
| `example-skill` | Template demonstrating the SKILL.md format |

## Repository Registry

The extension maintains a list of known repositories in your VS Code settings under `cursorAgents.repositories`. Each entry has a name, git URL, and optional description. Use **Cursor Agents: Manage Repositories** to add your own agent repos.

## Building the Extension

```bash
cd extension
npm install
npm run build
```

To package as a `.vsix`:

```bash
npm run package
```

## Updating

Pull the latest and re-install, or use the extension to re-install from the same repo URL:

```bash
cd cursor-agents && git pull
./install.sh /path/to/your/project
```
