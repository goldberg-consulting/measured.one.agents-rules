# Homebrew Distribution

## Install

Extension and CLI tools (recommended):

```bash
brew install --cask goldberg-consulting/tap/measured-one-agents-rules
```

CLI tools only (no extension):

```bash
brew install goldberg-consulting/tap/measured-one-agents-rules
```

## What Gets Installed

### Cask (`--cask`)

- Downloads the `.vsix` extension from the latest GitHub Release
- Installs it into Cursor or VS Code (auto-detected)
- Installs the formula as a dependency, which provides CLI tools

### Formula (no `--cask`)

- `measured-one-agents-rules-install` wraps `install.sh`
- `measured-one-agents-rules-install-all` wraps `install-all.sh`

## Tap Repository

The formula and cask live in [goldberg-consulting/homebrew-tap](https://github.com/goldberg-consulting/homebrew-tap):

```
homebrew-tap/
├── Casks/
│   ├── measured-one-agents-rules.rb
│   ├── tidaldrift.rb
│   └── distribute-metal.rb
├── Formula/
│   └── measured-one-agents-rules.rb
└── README.md
```

## Release Flow

When a new GitHub Release is published on the source repo:

1. The `release.yml` workflow builds the `.vsix` and uploads it to the release.
2. It computes the SHA256 and updates the cask in `goldberg-consulting/homebrew-tap`.
3. Users get the new version on their next `brew update && brew upgrade`.

Requires `HOMEBREW_TAP_TOKEN` secret on the source repo (fine-grained PAT with Contents write access to `homebrew-tap`).

## Installed Commands

| Command | Purpose |
|---------|---------|
| `measured-one-agents-rules-install <path>` | Install agents, rules, and skills into a project |
| `measured-one-agents-rules-install-all` | Install into all projects listed in `.env` |
