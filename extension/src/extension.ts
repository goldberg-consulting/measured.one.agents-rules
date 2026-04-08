import * as vscode from "vscode";
import * as path from "node:path";
import {
  cloneRepo,
  installFromDirectory,
  cleanup,
  type InstallResult,
} from "./installer.js";
import {
  getRepositories,
  addRepository,
  removeRepository,
  toQuickPickItems,
  type RepoEntry,
} from "./registry.js";

function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

function formatResult(result: InstallResult): string {
  const installed = result.files.length;
  const skipped = result.skipped.length;
  const byCategory = result.files.reduce(
    (acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const parts = Object.entries(byCategory).map(
    ([cat, count]) => `${count} ${cat}`
  );
  let msg = `Installed ${installed} files (${parts.join(", ")})`;
  if (skipped > 0) {
    msg += `, skipped ${skipped}`;
  }
  return msg;
}

async function installFromRepoCommand(): Promise<void> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    vscode.window.showErrorMessage(
      "Open a workspace folder before installing agents."
    );
    return;
  }

  const repos = getRepositories();
  const items: vscode.QuickPickItem[] = [
    ...toQuickPickItems(repos),
    { label: "$(link) Enter a custom URL...", description: "", detail: "" },
  ];

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: "Select a repository or enter a custom URL",
    title: "Install Cursor Agents from Repository",
  });

  if (!selected) {
    return;
  }

  let url: string;
  let pathMapping: Record<string, string> | undefined;
  if (selected.label.includes("Enter a custom URL")) {
    const input = await vscode.window.showInputBox({
      prompt: "Git repository URL (HTTPS or SSH)",
      placeHolder: "https://github.com/org/repo.git",
      validateInput: (v) =>
        v.trim().length === 0 ? "URL is required" : undefined,
    });
    if (!input) {
      return;
    }
    url = input.trim();
  } else {
    url = selected.description!;
    const repo = repos.find((r) => r.url === url);
    pathMapping = repo?.pathMapping;
  }

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Cursor Agents",
      cancellable: false,
    },
    async (progress) => {
      let tmpDir: string | undefined;
      try {
        tmpDir = await cloneRepo(url, progress);
        const result = await installFromDirectory(
          tmpDir,
          workspaceRoot,
          "overwrite",
          progress,
          pathMapping
        );
        vscode.window.showInformationMessage(formatResult(result));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`Installation failed: ${msg}`);
      } finally {
        if (tmpDir) {
          await cleanup(tmpDir);
        }
      }
    }
  );
}

async function installScaffoldingCommand(): Promise<void> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    vscode.window.showErrorMessage(
      "Open a workspace folder before installing scaffolding."
    );
    return;
  }

  const scaffoldDir = path.resolve(__dirname, "..", "cursor");
  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Cursor Agents",
      cancellable: false,
    },
    async (progress) => {
      try {
        // The cursor/ folder is bundled inside the extension package.
        // We point at its parent so discoverFiles finds `cursor/` inside.
        const parentDir = path.resolve(scaffoldDir, "..");
        const result = await installFromDirectory(
          parentDir,
          workspaceRoot,
          "overwrite",
          progress
        );
        vscode.window.showInformationMessage(
          `Scaffolding installed. ${formatResult(result)}`
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(
          `Scaffolding installation failed: ${msg}`
        );
      }
    }
  );
}

async function updateFromRepoCommand(): Promise<void> {
  const workspaceRoot = getWorkspaceRoot();
  if (!workspaceRoot) {
    vscode.window.showErrorMessage(
      "Open a workspace folder before updating agents."
    );
    return;
  }

  const repos = getRepositories();
  if (repos.length === 0) {
    vscode.window.showInformationMessage(
      "No repositories configured. Add one with 'Cursor Agents: Manage Repositories'."
    );
    return;
  }

  const items = toQuickPickItems(repos);
  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: "Select a repository to update from",
    title: "Update Cursor Agents from Repository",
  });

  if (!selected) {
    return;
  }

  const url = selected.description!;
  const repo = repos.find((r) => r.url === url);
  const pathMapping = repo?.pathMapping;

  await vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Cursor Agents – Updating",
      cancellable: false,
    },
    async (progress) => {
      let tmpDir: string | undefined;
      try {
        tmpDir = await cloneRepo(url, progress);
        const result = await installFromDirectory(
          tmpDir,
          workspaceRoot,
          "overwriteAll",
          progress,
          pathMapping
        );
        const msg = formatResult(result);
        vscode.window.showInformationMessage(`Updated: ${msg}`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        vscode.window.showErrorMessage(`Update failed: ${msg}`);
      } finally {
        if (tmpDir) {
          await cleanup(tmpDir);
        }
      }
    }
  );
}

async function manageReposCommand(): Promise<void> {
  const action = await vscode.window.showQuickPick(
    [
      { label: "$(list-unordered) View repositories", action: "view" },
      { label: "$(add) Add repository", action: "add" },
      { label: "$(trash) Remove repository", action: "remove" },
    ],
    { placeHolder: "Manage your Cursor Agents repository registry" }
  );

  if (!action) {
    return;
  }

  switch ((action as { action: string }).action) {
    case "view": {
      const repos = getRepositories();
      if (repos.length === 0) {
        vscode.window.showInformationMessage(
          "No repositories configured. Add one with 'Cursor Agents: Manage Repositories'."
        );
        return;
      }
      const items = toQuickPickItems(repos);
      await vscode.window.showQuickPick(items, {
        placeHolder: `${repos.length} registered repositories`,
        title: "Registered Repositories",
      });
      break;
    }
    case "add": {
      const name = await vscode.window.showInputBox({
        prompt: "Repository name",
        placeHolder: "my-cursor-agents",
      });
      if (!name) {
        return;
      }
      const url = await vscode.window.showInputBox({
        prompt: "Git URL (HTTPS or SSH)",
        placeHolder: "https://github.com/org/repo.git",
        validateInput: (v) =>
          v.trim().length === 0 ? "URL is required" : undefined,
      });
      if (!url) {
        return;
      }
      const description = await vscode.window.showInputBox({
        prompt: "Description (optional)",
        placeHolder: "Agents for data engineering workflows",
      });

      const entry: RepoEntry = {
        name,
        url: url.trim(),
        description: description || undefined,
      };
      await addRepository(entry);
      vscode.window.showInformationMessage(`Added repository: ${name}`);
      break;
    }
    case "remove": {
      const repos = getRepositories();
      if (repos.length === 0) {
        vscode.window.showInformationMessage("No repositories to remove.");
        return;
      }
      const items = toQuickPickItems(repos);
      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: "Select a repository to remove",
      });
      if (!selected) {
        return;
      }
      await removeRepository(selected.description!);
      vscode.window.showInformationMessage(
        `Removed repository: ${selected.label}`
      );
      break;
    }
  }
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "cursorAgents.installFromRepo",
      installFromRepoCommand
    ),
    vscode.commands.registerCommand(
      "cursorAgents.installScaffolding",
      installScaffoldingCommand
    ),
    vscode.commands.registerCommand(
      "cursorAgents.updateFromRepo",
      updateFromRepoCommand
    ),
    vscode.commands.registerCommand(
      "cursorAgents.manageRepos",
      manageReposCommand
    )
  );
}

export function deactivate(): void {}
