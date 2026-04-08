# Homebrew Tap-Ready Checklist

Use this checklist to publish and maintain a Homebrew tap so teammates can install with one command.

## 1) Create the tap repository

- [ ] Use GitHub repo: `goldberg-consulting/homebrew-tap`
- [ ] Keep it public for standard `brew tap` behavior
- [ ] Add this structure:

```text
homebrew-tap/
└── Formula/
    └── measured-one-agents-rules.rb
```

## 2) Install path you are targeting

Target team install commands:

```bash
brew tap goldberg-consulting/tap
brew install goldberg-consulting/tap/measured-one-agents-rules
```

After install:

```bash
measured-one-agents-rules-install /path/to/project
```

## 3) Formula strategy

Choose one:

- **Stable formula (recommended):** pin to a tagged release tarball URL + SHA256
- **Head-only formula:** track `main` using `head` in the formula

For stable installs, use this pattern in the tap formula:

```ruby
url "https://github.com/goldberg-consulting/measured.one.agents-rules/archive/refs/tags/v0.1.0.tar.gz"
sha256 "<release_tarball_sha256>"
```

## 4) Release flow for stable formula

1. Tag and publish release in this repo, for example `v0.1.0`
2. Download release tarball and compute SHA256:

```bash
curl -L -o measured-one-agents-rules-v0.1.0.tar.gz \
  https://github.com/goldberg-consulting/measured.one.agents-rules/archive/refs/tags/v0.1.0.tar.gz
shasum -a 256 measured-one-agents-rules-v0.1.0.tar.gz
```

3. Update tap formula `url` and `sha256`
4. Commit in tap repo with message like `chore: bump measured-one-agents-rules to v0.1.0`
5. Push tap repo
6. Verify fresh install:

```bash
brew untap goldberg-consulting/tap || true
brew tap goldberg-consulting/tap
brew uninstall measured-one-agents-rules || true
brew install goldberg-consulting/tap/measured-one-agents-rules
measured-one-agents-rules-install /tmp/mor-smoke
```

## 5) Formula quality checks

- [ ] `ruby -c Formula/measured-one-agents-rules.rb` passes
- [ ] `brew audit --strict --online goldberg-consulting/tap/measured-one-agents-rules` passes (or acceptable warnings only)
- [ ] install wrappers exist after install:
  - `measured-one-agents-rules-install`
  - `measured-one-agents-rules-install-all`
- [ ] smoke install creates:
  - `.cursor/agents`
  - `.cursor/rules`
  - `.cursor/skills`

## 6) Team onboarding snippet

Use this in internal docs:

```bash
brew tap goldberg-consulting/tap
brew install goldberg-consulting/tap/measured-one-agents-rules
measured-one-agents-rules-install /path/to/your/project
```

## 7) Ongoing maintenance

- [ ] Bump formula each tagged release
- [ ] Keep wrapper command behavior aligned with `install.sh` and `install-all.sh`
- [ ] Re-run smoke install after installer changes
- [ ] Keep `README.md`, `docs/HOMEBREW.md`, and tap instructions in sync
