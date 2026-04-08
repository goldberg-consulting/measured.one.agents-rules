# Contributing

## Workflow

1. Create an issue describing the change.
2. Branch from `main` with one of: `feature/`, `fix/`, `refactor/`, `docs/`, `chore/`.
3. Make one logical change per commit.
4. Run local quality gates before pushing.
5. Open a PR to `main` and request at least one reviewer.

## Local Setup

```bash
uv sync --extra dev
pre-commit install
```

## Required Checks Before PR

Run these from repo root:

```bash
pre-commit run --all-files
ruff check .
ruff format --check .
mypy ReferenceData/ --ignore-missing-imports
```

For extension changes:

```bash
cd extension
npm ci
npx tsc --noEmit
npm run build
```

## Pull Request Requirements

- PR title format: `<type>: <description>` where type is one of `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `perf`, `ci`.
- Link the issue in the PR body with `Closes #<issue-number>`.
- Include a short test plan and expected verification evidence.
- Do not commit `.cursor/`, `.env`, generated data files, or local scratch artifacts.

## Branch Protection Target

`main` uses standard protection:

- pull requests required
- at least one approval required
- required status checks must pass
- force-push and delete disabled
