# Maintenance Checklist

Use this checklist before release or major update.

## Documentation

- [ ] `README.md` install steps match `install.sh` and extension behavior.
- [ ] Rule lifecycle descriptions match `cursor/rules/agent-routing.mdc`.
- [ ] Environment variable names in docs match installer behavior.
- [ ] Governance docs exist and are current (`CONTRIBUTING.md`, `SECURITY.md`, PR template).

## Install Reliability

- [ ] `./install.sh /tmp/smoke-target` installs `agents/`, `rules/`, and `skills/` into `.cursor/`.
- [ ] `./install-all.sh --dry-run` parses `.env` project list correctly.
- [ ] Reference DB path behavior works with `REFERENCE_DB_REPO` and legacy alias.
- [ ] Extension scaffolding install still discovers and copies all categories.

## Agents, Rules, Skills

- [ ] `cursor/agents/` inventory reflects intended agent set.
- [ ] `cursor/rules/` policy text matches repo configuration (`pyproject.toml`, `.pre-commit-config.yaml`).
- [ ] `cursor/skills/` includes current non-template skills.

## Quality Gates

- [ ] `pre-commit run --all-files` passes.
- [ ] `ruff check .` passes.
- [ ] `ruff format --check .` passes.
- [ ] `mypy ReferenceData/ --ignore-missing-imports` passes.
- [ ] Extension build passes:
  - [ ] `npm ci`
  - [ ] `npx tsc --noEmit`
  - [ ] `npm run build`

## GitHub Governance

- [ ] `main` branch protection still requires PR + 1 approval.
- [ ] Required checks still include:
  - [ ] `Python lint`
  - [ ] `Extension typecheck & build`
  - [ ] `Shellcheck`
  - [ ] `Pre-commit hooks`
- [ ] Force-push and branch deletion remain blocked.
