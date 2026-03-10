import * as vscode from "vscode";

export interface RepoEntry {
  name: string;
  url: string;
  description?: string;
}

const CONFIG_KEY = "cursorAgents.repositories";

export function getRepositories(): RepoEntry[] {
  const config = vscode.workspace.getConfiguration();
  return config.get<RepoEntry[]>(CONFIG_KEY, []);
}

export async function addRepository(entry: RepoEntry): Promise<void> {
  const config = vscode.workspace.getConfiguration();
  const repos = [...getRepositories()];

  const existing = repos.findIndex(
    (r) => r.url === entry.url || r.name === entry.name
  );
  if (existing >= 0) {
    repos[existing] = entry;
  } else {
    repos.push(entry);
  }

  await config.update(CONFIG_KEY, repos, vscode.ConfigurationTarget.Global);
}

export async function removeRepository(url: string): Promise<void> {
  const config = vscode.workspace.getConfiguration();
  const repos = getRepositories().filter((r) => r.url !== url);
  await config.update(CONFIG_KEY, repos, vscode.ConfigurationTarget.Global);
}

export function toQuickPickItems(
  repos: RepoEntry[]
): vscode.QuickPickItem[] {
  return repos.map((r) => ({
    label: r.name,
    description: r.url,
    detail: r.description,
  }));
}
