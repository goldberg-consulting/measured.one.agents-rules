# Repo Review Report (2026-04-05)

## Scope

Review focused on documentation quality, install reliability, agent/skill/rule modernity, and GitHub branch protection.

## Findings

### Critical

- Shell install path did not copy `cursor/skills/`, while README claimed skills were installed.
- `README.md` had outdated lifecycle wording ("three phases") while routing rule defined five phases.
- Branch protection on `main` required zero approvals.

### Warning

- Environment variable docs used `CODE_LOOK_ME_UP` while installer expected `REFERENCE_DB_REPO`.
- Governance docs were incomplete for external contributors (`CONTRIBUTING.md`, PR template, issue templates, `CODEOWNERS`, `SECURITY.md` missing).
- Rule docs had policy drift in shipped `cursor/rules/` (line length and hook inventory wording).

### Suggestion

- Keep `cursor/` as explicit source of truth for shipped assets and periodically verify local `.cursor/` parity during development.
- Add periodic release checklist for extension and shell install parity tests.

## Implemented Changes

- Updated installer and docs:
  - `install.sh` now installs `agents`, `rules`, and `skills`.
  - `install.sh` now supports `REFERENCE_DB_REPO` with backward-compatible alias `CODE_LOOK_ME_UP`.
  - `.env.example` updated to document `REFERENCE_DB_REPO` and legacy alias.
  - `README.md` updated for install behavior, five-phase routing description, and local dev setup.
- Modernized shipped rules:
  - `cursor/rules/agent-routing.mdc` updated to "five phases".
  - `cursor/rules/agent-routing.mdc` includes `scientific-writer` in the routing table.
  - `cursor/rules/git-workflow.mdc` aligned with actual pre-commit behavior.
  - `cursor/rules/python-standards.mdc` now references `ruff format`.
- Expanded shipped skills:
  - Added `cursor/skills/xlsx/SKILL.md`.
- Added governance files:
  - `CONTRIBUTING.md`
  - `.github/pull_request_template.md`
  - `.github/CODEOWNERS`
  - `.github/ISSUE_TEMPLATE/bug_report.md`
  - `.github/ISSUE_TEMPLATE/feature_request.md`
  - `SECURITY.md`

## Branch Protection Outcome

Applied standard protection to `main` for `goldberg-consulting/measured.one.agents-rules`:

- Pull requests required
- Required approvals: 1
- Required status checks:
  - `Python lint`
  - `Extension typecheck & build`
  - `Shellcheck`
  - `Pre-commit hooks`
- Force-push blocked
- Branch deletion blocked

## Prioritized Backlog

### Quick Wins

1. Add a small CI check that verifies `cursor/skills/` includes at least one non-template skill.
2. Add a release checklist section in `README.md` for extension packaging and shell install smoke tests.

### Structural

1. Add a sync check between local `.cursor/` and shipped `cursor/` content during maintainers' release process.
2. Consider enabling code owner review requirement once team ownership mapping stabilizes.
