# Security Policy

## Reporting a Vulnerability

If you discover a security issue in this repository, do not open a public issue with exploit details.

Please report privately to the repository maintainers with:

- a clear description of the issue
- affected files or paths
- reproduction steps
- expected and observed behavior
- potential impact

Maintainers will acknowledge receipt, assess severity, and coordinate remediation and disclosure timing.

## Scope

Security-sensitive areas include:

- install scripts and extension install/update logic
- GitHub workflows and release automation
- rules and agents that govern secret handling and PHI/PII behavior
- reference data access modules and any credential handling
