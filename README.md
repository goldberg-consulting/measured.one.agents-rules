# measured.one Agents & Rules

Shared Cursor configuration for measured.one projects: agent definitions, workspace rules, skills, reference data, and reusable prompts.

## Installation

### Option A: Cursor Extension (recommended)

Install the bundled VS Code / Cursor extension, then use the command palette to install agents, rules, and skills into any workspace.

1. Download the `.vsix` from the [latest release](https://github.com/goldberg-consulting/measured.one.agents-rules/releases) or build it yourself:

```bash
cd extension && npm install && npx @vscode/vsce package -o measured.one.agents-rules-extension-0.1.0.vsix
```

2. Install the extension:

```bash
cursor --install-extension extension/measured.one.agents-rules-extension-0.1.0.vsix
```

3. Open any project in Cursor, then run one of these commands from the command palette (`Cmd+Shift+P`):

| Command | What it does |
|---------|-------------|
| **Cursor Agents: Install from Repository** | Pick a repo from the registry (or enter a custom URL), clone it, and copy agents/rules/skills into `.cursor/` |
| **Cursor Agents: Update from Repository** | Re-install from a registered repo, overwriting all files without conflict prompts |
| **Cursor Agents: Install Scaffolding** | Install the bundled scaffolding from the extension's own repo |
| **Cursor Agents: Manage Repositories** | View, add, or remove repos from the registry |

The extension ships with two default repositories:

- **measured.one defaults** -- this repo
- **[Anthropic skills](https://github.com/anthropics/skills)** -- official Anthropic skills (PDF, DOCX, XLSX, MCP builder, webapp testing, and more)

Additional repositories can be added through the Manage Repositories command or in VS Code settings under `cursorAgents.repositories`.

### Option B: Shell Script

```bash
git clone git@github.com:goldberg-consulting/measured.one.agents-rules.git
cd measured.one.agents-rules
./install.sh /path/to/your/project
```

This copies `cursor/` into `.cursor/` inside the target project (agents, rules, and skills), then optionally builds and installs the reference database.

#### Install to Multiple Projects

```bash
cp .env.example .env
# Edit .env: add your project paths to PROJECTS, one per line
./install-all.sh
```

Use `--dry-run` to preview which projects would be updated:

```bash
./install-all.sh --dry-run
```

### Prerequisites (shell install only)

- Python 3.12+
- `duckdb` and `polars` Python packages (for reference data verification)
- The `reference.duckdb` file must be built or obtained separately (see Reference Data section). The installer copies agents and rules regardless; reference data queries require the database file.

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
│   ├── package.json
│   ├── esbuild.js
│   └── tsconfig.json
├── ReferenceData/              ← clinical/claims reference database and access module
│   ├── reference.duckdb        ← not tracked; build from source or download separately
│   ├── reference_db.py
│   ├── DATA_DICTIONARY.md
│   └── __init__.py
├── prompts/                    ← reusable prompts for common review and validation tasks
├── install.sh
├── install-all.sh
└── README.md
```

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
| `python-standards.mdc` | `**/*.py` | OO design, vectorization, Polars, black (line length 100), ruff, pytest, Python 3.12+ |
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
| Anthropic skills | [anthropics/skills](https://github.com/anthropics/skills) | PDF, DOCX, XLSX, PPTX, MCP builder, webapp testing, frontend design, canvas, and more |

Install Anthropic skills through the extension: run **Cursor Agents: Install from Repository**, select **Anthropic skills**, and the extension copies them into `.cursor/skills/`.

## Reference Data

The `ReferenceData/` directory contains a Python access module and data dictionary for a DuckDB database of clinical and claims reference tables (CPT, ICD-10, DRG, revenue codes, bill types, chronic conditions, and more). The `reference-data-librarian` agent and the `reference-data.mdc` rule guide when and how to query it.

The `reference.duckdb` file is **not included** in this repo due to third-party data licensing constraints (ETG data from OptumInsight, CPT descriptions from AMA). To use the reference data module, build the database from source using the build script, or place a pre-built copy at `ReferenceData/reference.duckdb`. The access module, data dictionary, and all agent/rule references will work once the database file is present.

After install, reference data is available via:

```python
from ReferenceData.reference_db import query, get_er_revenue_codes, lookup_drg
```

See `ReferenceData/DATA_DICTIONARY.md` for full column-level documentation.

## How It Works

The `agent-routing.mdc` rule is always active and routes tasks through three phases:

**Plan**: When you describe something to build, the routing rule pulls in the domain specialist (e.g., @databricks-engineer) to draft an approach, then routes the plan to a reviewer (e.g., @healthcare-data-reviewer) for critique before you see it. Triggered by words like "plan", "design", "how should we".

**Build**: Once you approve a plan (or ask to build something straightforward), the agent routes to the implementation specialist. Triggered by "build", "implement", "write", or approval of a plan.

**Review**: After building, or when you paste code or a diff, the agent routes to the appropriate reviewer. Healthcare context always goes to @healthcare-data-reviewer; everything else goes to @code-reviewer. Triggered by "review", "check", "before I commit".

You can override routing at any time by typing `@agent-name` directly in your prompt.

## Updating

### Via the extension

Run **Cursor Agents: Update from Repository** from the command palette, select the repo, and the extension re-clones and overwrites all files in `.cursor/` without prompts.

### Via the shell

```bash
cd measured.one.agents-rules && git pull
./install.sh /path/to/your/project
```

Set `REBUILD_DB=1` to force-rebuild the reference database during update:

```bash
REBUILD_DB=1 ./install.sh /path/to/your/project
```

## License

MIT. See [LICENSE](LICENSE).
