# measured.one Agents & Rules

Shared Cursor configuration for measured.one projects: agent definitions, workspace rules, skills, reference data, and reusable prompts.

## Quick Start

Pick whichever method fits your workflow. All three produce the same result: agents, rules, and skills in your project's `.cursor/` directory.

### Homebrew (one command)

```bash
brew install --cask goldberg-consulting/tap/measured-one-agents-rules
```

This installs the Cursor/VS Code extension (with agents, rules, and skills bundled inside) and two CLI tools for installing into project directories. Once installed, open any project in Cursor and run **Cursor Agents: Install Scaffolding** from the command palette, or use the CLI:

```bash
measured-one-agents-rules-install /path/to/your/project
```

For CLI tools only (no extension):

```bash
brew install goldberg-consulting/tap/measured-one-agents-rules
```

See [docs/HOMEBREW.md](docs/HOMEBREW.md) for release flow and tap details.

### Cursor Extension (manual install)

Download the `.vsix` from the [latest release](https://github.com/goldberg-consulting/measured.one.agents-rules/releases), then:

```bash
cursor --install-extension measured-one-agents-rules-*.vsix
```

Or build from source:

```bash
cd extension && npm install && npx @vscode/vsce package --no-dependencies
cursor --install-extension cursor-agents-installer-*.vsix
```

### Shell Script

```bash
git clone git@github.com:goldberg-consulting/measured.one.agents-rules.git
cd measured.one.agents-rules
./install.sh /path/to/your/project
```

Copies `cursor/agents/`, `cursor/rules/`, and `cursor/skills/` into the target project's `.cursor/` directory, then optionally builds and installs the reference database.

## Extension Commands

Once the extension is installed (via Homebrew or manual `.vsix`), four commands are available in the command palette (`Cmd+Shift+P`):

| Command | What it does |
|---------|-------------|
| **Install Scaffolding** | Copies agents, rules, and skills from the extension's bundled copy into the current workspace. No network required. |
| **Install from Repository** | Clones a git repo (from the registry or a custom URL) and copies its `cursor/` contents into `.cursor/`. Use this for third-party repos like Anthropic skills. |
| **Update from Repository** | Re-clones a registered repo and overwrites all files in `.cursor/` without conflict prompts. |
| **Manage Repositories** | View, add, or remove repos from the registry. |

**Install Scaffolding** vs **Install from Repository**: Scaffolding uses the copy of agents, rules, and skills that was bundled into the extension at build time. It works offline and is instant. Install from Repository clones fresh from git, so it always gets the latest version, but requires network access.

The extension ships with four default repositories in its registry:

- **measured.one defaults** -- this repo
- **[Anthropic skills](https://github.com/anthropics/skills)** -- official Anthropic skills (PDF, DOCX, XLSX, MCP builder, webapp testing, and more)
- **[Addy Osmani agent-skills](https://github.com/addyosmani/agent-skills)** -- production-grade engineering skills: spec, plan, build, test, review, simplify, ship (19 skills + 3 agent personas)
- **[Databricks AI Dev Kit](https://github.com/databricks-solutions/ai-dev-kit)** -- 20 Databricks skills: pipelines, jobs, dashboards, Unity Catalog, MLflow, model serving, Genie, apps

Additional repositories can be added through Manage Repositories or in settings under `cursorAgents.repositories`.

## Install to Multiple Projects

```bash
cp .env.example .env
# Edit .env: add your project paths to PROJECTS, one per line
./install-all.sh
```

Preview which projects would be updated:

```bash
./install-all.sh --dry-run
```

## Prerequisites

For **Homebrew or extension install**: no prerequisites. The extension bundles everything.

For **shell script install**:

- Python 3.12+
- `duckdb` and `polars` Python packages (for reference data verification)
- The `reference.duckdb` file must be built or obtained separately (see Reference Data). The installer copies agents, rules, and skills regardless; reference data queries require the database file.
- Optional: `REFERENCE_DB_REPO` environment variable if your reference DB build repo is not `~/reference-db-builder`

For **local development** in this repo:

```bash
uv sync --extra dev
pre-commit install
```

## Repo Structure

```
measured.one.agents-rules/
├── cursor/                     ← portable copy, mirrors .cursor/ in target projects
│   ├── agents/                 ← agent definitions (.md)
│   ├── rules/                  ← workspace rules (.mdc)
│   └── skills/                 ← skill definitions (each in its own folder with SKILL.md)
├── extension/                  ← Cursor/VS Code extension source
│   ├── src/
│   │   ├── extension.ts        ← command wiring
│   │   ├── installer.ts        ← git clone, file discovery, copy logic
│   │   └── registry.ts         ← settings-backed repo registry
│   ├── package.json            ← prebuild copies cursor/ into the extension for bundling
│   ├── esbuild.js
│   └── tsconfig.json
├── ReferenceData/              ← clinical/claims reference database and access module
│   ├── reference.duckdb        ← not tracked; build from source or download separately
│   ├── reference_db.py
│   ├── DATA_DICTIONARY.md
│   └── __init__.py
├── prompts/                    ← reusable prompts for common review and validation tasks
├── docs/                       ← supplementary documentation
├── .github/                    ← PR template, issue templates, release workflow
├── install.sh
├── install-all.sh
└── README.md
```

The Homebrew formula and cask definitions live in the [goldberg-consulting/homebrew-tap](https://github.com/goldberg-consulting/homebrew-tap) repository, not in this repo.

## Agents

| Agent | Description |
|-------|-------------|
| `code-reviewer` | Code quality, security, and project coding standards enforcement |
| `data-scientist` | Causal inference, experimental design, Polars, DuckDB, scikit-learn, healthcare analytics |
| `databricks-engineer` | PySpark, Spark SQL, DBT, Databricks CLI, Delta Lake, Unity Catalog |
| `debugger` | Root cause analysis for Python: Polars, DuckDB, PySpark, Databricks, healthcare data |
| `doc-to-markdown` | Converts Word documents (.docx) to GitHub-flavored Markdown with structure preservation |
| `eli-documenter` | Adds and updates docstrings and comments: formal, domain-grounded, contract-focused |
| `executive-summarizer` | Transforms analytical output into concise, quantified executive summaries using SCQA framing |
| `git-gatekeeper` | Git workflow enforcement: branch hygiene, forbidden paths, pre-commit compliance, commit message audit |
| `healthcare-data-reviewer` | Clinical logic, PHI compliance, DBT model quality, data science correctness for healthcare code |
| `project-organizer` | Organizes analytical projects into experimentation, visualization, and documentation layers |
| `reality-checker` | Evidence-based validation that defaults to "needs work" and requires proof before certifying deliverables |
| `reference-data-librarian` | Clinical code lookups (ICD-10, CPT, DRG, NDC), schema inventory, code-to-category mappings |
| `sas-to-python` | Converts SAS programs, formats, macros, and DATA steps into idiomatic Polars/DuckDB/PySpark |
| `scientific-educator` | Observable Framework pages teaching quantitative concepts through sequenced figures and KaTeX math |
| `scientific-writer` | Formal academic prose for papers, white papers, technical reports, figure captions, and abstracts |
| `swift-debugger` | Root cause analysis for Swift: crashes, SwiftUI, concurrency, Instruments profiling |
| `swift-developer` | SwiftUI, structured concurrency, protocol-oriented design, iOS/macOS |
| `ticketer` | Structured project tickets, use case definitions, epic breakdowns, architecture specs |
| `tuva-pipeline-operator` | Operates the Tuva dbt analytics pipeline on Databricks: deploy, submit, monitor, diagnose |
| `vae-claims` | VAE and ConvVAE architectures for claims data: compression, latent representations, synthetic generation |
| `visualization-creator` | Consulting-quality charts, pipeline diagrams, staging schematics, annotated figures |
| `whats-strange` | Anomaly detection in analytical output, pattern interpretation, signal vs. noise assessment |
| `whimsy-injector` | Adds personality, micro-interactions, and playful microcopy to UIs |

## Rules

| Rule | Scope | Description |
|------|-------|-------------|
| `agent-routing.mdc` | Always | Lifecycle-aware routing: plan, build, review phases with agent handoffs |
| `embedding-pipeline-validation.mdc` | Agent-requested | Planning template for validating ICD embedding pipelines (Word2Vec, TF-IDF, KMeans, PCA) |
| `general.mdc` | Always | Scope discipline, no LLM tells, surgical edits |
| `git-workflow.mdc` | Always | Conventional commits, branch naming |
| `glossary.mdc` | Always | Team terminology: member, book, stage, lane, ETG, reference data, platform terms |
| `pathwaymapping-context.mdc` | Always | PathwayMapping architectural context, guardrails, and clustering standards |
| `python-standards.mdc` | `**/*.py` | OO design, vectorization, Polars, ruff format (line length 100), ruff, pytest, Python 3.12+ |
| `reference-data.mdc` | Agent-requested | Decision guide for when and how to query `ReferenceData/reference.duckdb` |
| `security.mdc` | Always | Secrets, PHI/PII, input validation |
| `sql-standards.mdc` | `**/*.sql` | CTEs, parameterized queries, DBT conventions |
| `swift-standards.mdc` | `**/*.swift` | SwiftUI, async/await, value types, SwiftLint |
| `writing-style.mdc` | `**/*.md` | Academic/technical voice, mermaid diagrams |

## Skills

Skills are self-contained capability packages that an agent reads and follows at runtime. Each skill lives in its own folder with a `SKILL.md` file.

| Skill | Source | Description |
|-------|--------|-------------|
| `example-skill` | This repo | Template showing the expected skill structure |
| `xlsx` | This repo | Spreadsheet-focused workflow for creating, editing, validating, and converting workbook/tabular files |
| `homebrew-cask-packaging` | This repo | Package any artifact as a Homebrew cask with tap, postflight hooks, and automated version bumps |
| Anthropic skills | [anthropics/skills](https://github.com/anthropics/skills) | PDF, DOCX, XLSX, PPTX, MCP builder, webapp testing, frontend design, canvas, and more |
| Addy Osmani agent-skills | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | 19 production engineering skills (spec, plan, incremental build, TDD, code review, security hardening, performance, CI/CD, shipping) plus 3 agent personas |
| Databricks AI Dev Kit | [databricks-solutions/ai-dev-kit](https://github.com/databricks-solutions/ai-dev-kit) | 20 Databricks skills: declarative pipelines, jobs, AI/BI dashboards, Unity Catalog, MLflow, model serving, Genie spaces, Databricks Apps, vector search, and more |

Install third-party skills through the extension: run **Cursor Agents: Install from Repository**, select the repo, and the extension copies agents and skills into `.cursor/`.

## Reference Data

The `ReferenceData/` directory contains a Python access module and data dictionary for a DuckDB database of clinical and claims reference tables (CPT, ICD-10, DRG, revenue codes, bill types, chronic conditions, and more). The `reference-data-librarian` agent and the `reference-data.mdc` rule guide when and how to query it.

The `reference.duckdb` file is **not included** in this repo due to third-party data licensing constraints (ETG data from OptumInsight, CPT descriptions from AMA). To use the reference data module, build the database from source using the build script, or place a pre-built copy at `ReferenceData/reference.duckdb`. The access module, data dictionary, and all agent/rule references will work once the database file is present.

After install, reference data is available via:

```python
from ReferenceData.reference_db import query, get_er_revenue_codes, lookup_drg
```

See `ReferenceData/DATA_DICTIONARY.md` for full column-level documentation.

## How It Works

The `agent-routing.mdc` rule is always active and routes tasks through five phases:

**Plan**: When you describe something to build, the routing rule pulls in the domain specialist (e.g., @databricks-engineer) to draft an approach, then routes the plan to a reviewer (e.g., @healthcare-data-reviewer) for critique before you see it. Triggered by words like "plan", "design", "how should we".

**Build**: Once you approve a plan (or ask to build something straightforward), the agent routes to the implementation specialist. Triggered by "build", "implement", "write", or approval of a plan.

**Review**: After building, or when you paste code or a diff, the agent routes to the appropriate reviewer. Healthcare context always goes to @healthcare-data-reviewer; everything else goes to @code-reviewer. Triggered by "review", "check", "before I commit".

**Validate**: Before shipping, the workflow routes to @reality-checker for evidence-based go or no-go validation.

**Summarize**: After validation, the workflow can route to @executive-summarizer for concise decision-ready summaries.

You can override routing at any time by typing `@agent-name` directly in your prompt.

## Updating

### Via Homebrew

```bash
brew update && brew upgrade --cask measured-one-agents-rules
```

This downloads the latest VSIX from GitHub Releases, installs it into Cursor, and updates the CLI tools. Reload Cursor after upgrading (`Cmd+Shift+P` > Developer: Reload Window).

### Via the extension

Run **Cursor Agents: Update from Repository** from the command palette, select the repo, and the extension re-clones and overwrites all files in `.cursor/` without prompts.

This is also how you install third-party skills (Anthropic, Addy Osmani, Databricks) into a specific project.

### Via the shell

```bash
cd measured.one.agents-rules && git pull
./install.sh /path/to/your/project
```

## License

MIT. See [LICENSE](LICENSE).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch, PR, and local quality-gate requirements.
