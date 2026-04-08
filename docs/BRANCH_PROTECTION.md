# Branch Protection Runbook

## Target Policy (Standard)

Apply to `main`:

- Require pull request before merge
- Require 1 approval
- Require status checks:
  - `Python lint`
  - `Extension typecheck & build`
  - `Shellcheck`
  - `Pre-commit hooks`
- Block force pushes
- Block branch deletion

## Apply via GitHub CLI

```bash
gh api -X PUT repos/goldberg-consulting/measured.one.agents-rules/branches/main/protection --input - <<'EOF'
{
  "required_status_checks": {
    "strict": false,
    "checks": [
      {"context": "Python lint"},
      {"context": "Extension typecheck & build"},
      {"context": "Shellcheck"},
      {"context": "Pre-commit hooks"}
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "require_code_owner_reviews": false,
    "require_last_push_approval": false,
    "required_approving_review_count": 1
  },
  "restrictions": null,
  "allow_force_pushes": false,
  "allow_deletions": false,
  "block_creations": false,
  "required_conversation_resolution": false,
  "lock_branch": false,
  "allow_fork_syncing": false,
  "required_linear_history": true
}
EOF
```

## Verify

```bash
gh api repos/goldberg-consulting/measured.one.agents-rules/branches/main/protection
```
