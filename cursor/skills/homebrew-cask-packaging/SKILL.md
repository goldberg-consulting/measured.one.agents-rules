---
name: homebrew-cask-packaging
description: >-
  Package any software artifact as a Homebrew cask with a custom tap, dependency
  resolution, postflight hooks, and automated version bumps via GitHub Actions.
  Use when you want to make something installable via brew install --cask, ship a
  VS Code/Cursor extension with Brew, or add Homebrew distribution to a project.
---
# Homebrew Cask Packaging

Package a project's release artifact (VSIX, .app, binary, installer pkg) as a
Homebrew cask in a custom tap so users install with one command.

## When to Use

- You want `brew install --cask <name>` to install your software plus dependencies
- You are distributing a VS Code/Cursor extension that also needs system tooling
- You want a Homebrew-native install path for any downloadable artifact

## Gather Requirements

Before starting, determine:

1. **Artifact type**: What does the user download? (.vsix, .app, .pkg, .dmg, binary tarball)
2. **Dependencies**: What formulae or casks must be installed first?
3. **Post-install steps**: Does anything need to run after download? (e.g., `code --install-extension`, `launchctl load`, symlink creation)
4. **GitHub org/user**: Where will the tap repo live?
5. **Release asset naming**: What is the download URL pattern on GitHub Releases?
6. **Extension ID** (if VS Code/Cursor): publisher.extension-name for marketplace references

Use the AskQuestion tool to gather any missing details.

## Architecture

```
<org>/homebrew-<name>/           # tap repository
  Casks/
    <name>.rb                    # cask definition
  README.md                      # usage instructions

<org>/<source-repo>/             # source repository
  .github/workflows/
    release.yml                  # automated build + tap bump
```

User experience:

```bash
brew tap <org>/<name>
brew install --cask <name>
```

## Step 1: Create the Tap Repository

Homebrew taps follow the naming convention `homebrew-<name>`. Create a public
GitHub repo at `<org>/homebrew-<name>` with a `Casks/` directory.

```bash
gh repo create <org>/homebrew-<name> --public --description "Homebrew tap for <Name>"
git clone <tap-repo-url>
mkdir -p Casks
```

## Step 2: Write the Cask Definition

### Template: VS Code/Cursor Extension with Dependencies

For artifacts that are zip-based but should not be extracted (like .vsix files),
use `container type: :naked` to prevent Homebrew from auto-unzipping.

```ruby
cask "<name>" do
  version "<initial-version>"
  sha256 "<sha256-of-artifact>"

  url "https://github.com/<org>/<repo>/releases/download/v#{version}/<name>-#{version}.<ext>"
  name "<Display Name>"
  container type: :naked
  desc "<One-line description>"
  homepage "https://github.com/<org>/<repo>"

  # Formula dependencies (auto-installed)
  depends_on formula: "<formula-1>"
  depends_on formula: "<formula-2>"

  # Cask dependencies (auto-installed, skipped if present)
  depends_on cask: "<cask-1>"

  # Place the artifact in a stable location
  artifact "<name>-#{version}.<ext>", target: "#{HOMEBREW_PREFIX}/share/<name>/<name>-#{version}.<ext>"

  postflight do
    # Detect editor CLI and install extension
    cursor_paths = ["/opt/homebrew/bin/cursor", "/usr/local/bin/cursor", "#{Dir.home}/.local/bin/cursor"]
    code_paths = ["/opt/homebrew/bin/code", "/usr/local/bin/code"]
    editor = (cursor_paths.find { |p| File.exist?(p) }) || (code_paths.find { |p| File.exist?(p) })

    if editor
      system_command editor,
                     args: ["--install-extension", "#{staged_path}/<name>-#{version}.<ext>", "--force"],
                     print_stderr: true
    else
      ohai "Neither cursor nor code CLI found."
      ohai "Install manually: Cmd+Shift+P > Extensions: Install from VSIX > #{HOMEBREW_PREFIX}/share/<name>/<name>-#{version}.<ext>"
    end
  end

  uninstall_postflight do
    cursor_paths = ["/opt/homebrew/bin/cursor", "/usr/local/bin/cursor", "#{Dir.home}/.local/bin/cursor"]
    code_paths = ["/opt/homebrew/bin/code", "/usr/local/bin/code"]
    editor = (cursor_paths.find { |p| File.exist?(p) }) || (code_paths.find { |p| File.exist?(p) })

    if editor
      system_command editor,
                     args: ["--uninstall-extension", "<publisher>.<extension-name>"],
                     print_stderr: true
    end
  end

  caveats <<~EOS
    <Name> has been installed in Cursor/VS Code.

    To complete setup:
      1. Reload the editor (Cmd+Shift+P > Developer: Reload Window)
      2. <any additional setup steps>
  EOS
end
```

### Template: macOS Application (.app in .dmg or .zip)

```ruby
cask "<name>" do
  version "<initial-version>"
  sha256 "<sha256>"

  url "https://github.com/<org>/<repo>/releases/download/v#{version}/<Name>-#{version}.dmg"
  name "<Display Name>"
  desc "<One-line description>"
  homepage "https://github.com/<org>/<repo>"

  depends_on macos: ">= :monterey"

  app "<Name>.app"
  # Optional: expose a CLI binary from the app bundle
  # binary "#{appdir}/<Name>.app/Contents/MacOS/<cli-name>", target: "<cli-name>"

  zap trash: [
    "~/Library/Application Support/<Name>",
    "~/Library/Preferences/com.<org>.<name>.plist",
    "~/Library/Caches/com.<org>.<name>",
  ]
end
```

### Template: CLI Binary (tarball)

```ruby
cask "<name>" do
  arch arm: "arm64", intel: "x64"

  version "<initial-version>"
  sha256 arm: "<sha256-arm>",
         intel: "<sha256-intel>"

  url "https://github.com/<org>/<repo>/releases/download/v#{version}/<name>-#{version}-darwin-#{arch}.tar.gz"
  name "<Display Name>"
  desc "<One-line description>"
  homepage "https://github.com/<org>/<repo>"

  binary "<name>"
end
```

## Step 3: Compute SHA256 and Push

```bash
shasum -a 256 <artifact-file>
# Insert the hash into the cask .rb file
cd <tap-repo>
git add Casks/<name>.rb README.md
git commit -m "feat: add <name> cask v<version>"
git push origin main
```

## Step 4: Test End-to-End

```bash
brew untap <org>/<name> 2>/dev/null
brew tap <org>/<name>
brew info --cask <name>              # verify metadata and dependencies
brew install --cask <name>           # full install test
brew uninstall --cask <name>         # verify clean removal
```

## Step 5: Add Automated Tap Bump

Add a release workflow to the **source repo** that builds the artifact, attaches
it to the GitHub Release, computes the sha256, and pushes an update to the tap.

### GitHub Actions Workflow (`.github/workflows/release.yml`)

```yaml
name: Release

on:
  release:
    types: [published]

permissions:
  contents: write

jobs:
  build-and-publish:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build artifact
        run: <your-build-command>
        # For VS Code extensions: npx @vscode/vsce package --no-dependencies
        # For binaries: make build
        # For apps: xcodebuild archive ...

      - name: Extract version
        id: version
        run: echo "version=<version-extraction-command>" >> "$GITHUB_OUTPUT"
        # Node: node -p 'require("./package.json").version'
        # Cargo: grep '^version' Cargo.toml | head -1 | sed 's/.*"\(.*\)"/\1/'
        # Swift: xcrun agvtool what-marketing-version -terse1

      - name: Upload artifact to release
        env:
          GH_TOKEN: ${{ github.token }}
        run: |
          ARTIFACT="<name>-${{ steps.version.outputs.version }}.<ext>"
          gh release upload "${{ github.event.release.tag_name }}" "$ARTIFACT" --clobber

      - name: Compute SHA256
        id: sha
        run: |
          ARTIFACT="<name>-${{ steps.version.outputs.version }}.<ext>"
          SHA=$(shasum -a 256 "$ARTIFACT" | awk '{print $1}')
          echo "sha256=$SHA" >> "$GITHUB_OUTPUT"

      - name: Update Homebrew tap
        env:
          TAP_TOKEN: ${{ secrets.HOMEBREW_TAP_TOKEN }}
        run: |
          if [ -z "$TAP_TOKEN" ]; then
            echo "HOMEBREW_TAP_TOKEN not set; skipping tap update."
            exit 0
          fi

          VERSION="${{ steps.version.outputs.version }}"
          SHA="${{ steps.sha.outputs.sha256 }}"

          git clone "https://x-access-token:${TAP_TOKEN}@github.com/<org>/homebrew-<name>.git" /tmp/tap
          cd /tmp/tap

          CASK="Casks/<name>.rb"
          sed -i "s/version \".*\"/version \"${VERSION}\"/" "$CASK"
          sed -i "s/sha256 \".*\"/sha256 \"${SHA}\"/" "$CASK"

          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add "$CASK"
          git diff --cached --quiet && echo "No changes" && exit 0
          git commit -m "bump <name> to ${VERSION}"
          git push origin main
```

### Secret Setup

The workflow needs a `HOMEBREW_TAP_TOKEN` secret on the source repo with push
access to the tap repo.

```bash
# Create a fine-grained PAT at github.com/settings/tokens with:
#   - Repository access: <org>/homebrew-<name> only
#   - Permissions: Contents (Read and write)
# Then set it:
gh secret set HOMEBREW_TAP_TOKEN --repo <org>/<source-repo>
```

## Key Decisions Reference

| Decision | Guidance |
|----------|----------|
| `container type: :naked` | Required for .vsix, .jar, or any zip-based file that should not be extracted |
| `depends_on cask:` | Skipped automatically if the dependency is already installed |
| `depends_on formula:` | Auto-installed; does not re-install if present |
| `postflight` vs `artifact` | Use `artifact` to place the file, `postflight` for side effects (CLI commands) |
| `uninstall_postflight` | Clean up side effects on `brew uninstall` |
| Tap naming | Must be `homebrew-<name>` for `brew tap <org>/<name>` to resolve |
| SHA256 | Computed from the exact file users download; must match or install fails |

## Checklist

- [ ] Tap repo created as `<org>/homebrew-<name>` (public)
- [ ] `Casks/<name>.rb` written with correct url, sha256, dependencies
- [ ] `container type: :naked` added if artifact is zip-based but should not be extracted
- [ ] `postflight` handles the case where target CLI is not on PATH
- [ ] `uninstall_postflight` reverses postflight side effects
- [ ] `brew install --cask <name>` tested end-to-end
- [ ] `brew uninstall --cask <name>` tested for clean removal
- [ ] Release workflow in source repo builds, uploads, and bumps the tap
- [ ] `HOMEBREW_TAP_TOKEN` secret set on source repo
- [ ] README in tap repo documents `brew tap` and `brew install --cask` commands
