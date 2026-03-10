import * as vscode from "vscode";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

const exec = promisify(execFile);

export interface InstalledFile {
  relativePath: string;
  category: "agents" | "rules" | "skills";
  overwritten: boolean;
}

export interface InstallResult {
  files: InstalledFile[];
  skipped: string[];
}

const CURSOR_DIRS = ["agents", "rules", "skills"] as const;

/**
 * Locate the cursor content root inside a cloned repo.
 * Checks for `cursor/` first (this repo's convention), then falls back
 * to top-level `agents/` / `rules/` / `skills/` directories.
 */
async function findCursorRoot(repoDir: string): Promise<string | null> {
  const cursorSub = path.join(repoDir, "cursor");
  try {
    const stat = await fs.stat(cursorSub);
    if (stat.isDirectory()) {
      return cursorSub;
    }
  } catch {
    // fall through
  }

  for (const dir of CURSOR_DIRS) {
    try {
      const stat = await fs.stat(path.join(repoDir, dir));
      if (stat.isDirectory()) {
        return repoDir;
      }
    } catch {
      // continue
    }
  }

  return null;
}

async function collectFiles(dir: string): Promise<string[]> {
  const results: string[] = [];
  let entries: import("node:fs").Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await collectFiles(full)));
    } else {
      results.push(full);
    }
  }
  return results;
}

export async function cloneRepo(
  url: string,
  progress: vscode.Progress<{ message?: string; increment?: number }>
): Promise<string> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "cursor-agents-"));
  progress.report({ message: "Cloning repository..." });
  try {
    await exec("git", ["clone", "--depth", "1", "--single-branch", url, tmpDir]);
  } catch (err: unknown) {
    await fs.rm(tmpDir, { recursive: true, force: true });
    const msg = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to clone ${url}: ${msg}`);
  }
  return tmpDir;
}

export async function discoverFiles(
  repoDir: string
): Promise<Map<string, string[]>> {
  const root = await findCursorRoot(repoDir);
  if (!root) {
    throw new Error(
      "No cursor content found. Expected a cursor/ directory or top-level agents/, rules/, skills/ folders."
    );
  }

  const found = new Map<string, string[]>();
  for (const category of CURSOR_DIRS) {
    const categoryDir = path.join(root, category);
    const files = await collectFiles(categoryDir);
    if (files.length > 0) {
      found.set(
        category,
        files.map((f) => path.relative(root, f))
      );
    }
  }

  if (found.size === 0) {
    throw new Error(
      "Repository cloned but no agent, rule, or skill files were found."
    );
  }

  return found;
}

export type ConflictStrategy = "overwrite" | "skip" | "overwriteAll";

export async function installFiles(
  sourceRoot: string,
  workspaceRoot: string,
  filesByCategory: Map<string, string[]>,
  conflictStrategy: ConflictStrategy,
  progress: vscode.Progress<{ message?: string; increment?: number }>
): Promise<InstallResult> {
  const cursorRoot = await findCursorRoot(sourceRoot);
  if (!cursorRoot) {
    throw new Error("Source root lost during install.");
  }

  const dotCursor = path.join(workspaceRoot, ".cursor");
  const result: InstallResult = { files: [], skipped: [] };
  const allFiles = [...filesByCategory.entries()].flatMap(([, files]) => files);
  const increment = allFiles.length > 0 ? 80 / allFiles.length : 0;
  let strategy = conflictStrategy;

  for (const [category, files] of filesByCategory.entries()) {
    for (const relPath of files) {
      const src = path.join(cursorRoot, relPath);
      const dest = path.join(dotCursor, relPath);

      progress.report({
        message: `Installing ${relPath}`,
        increment,
      });

      const destExists = await fs
        .access(dest)
        .then(() => true)
        .catch(() => false);

      if (destExists && strategy !== "overwriteAll") {
        if (strategy === "skip") {
          result.skipped.push(relPath);
          continue;
        }

        const choice = await vscode.window.showWarningMessage(
          `${relPath} already exists. Overwrite?`,
          "Overwrite",
          "Skip",
          "Overwrite All",
          "Skip All"
        );

        if (choice === "Skip") {
          result.skipped.push(relPath);
          continue;
        }
        if (choice === "Skip All") {
          strategy = "skip";
          result.skipped.push(relPath);
          continue;
        }
        if (choice === "Overwrite All") {
          strategy = "overwriteAll";
        }
        if (!choice) {
          result.skipped.push(relPath);
          continue;
        }
      }

      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.copyFile(src, dest);
      result.files.push({
        relativePath: relPath,
        category: category as InstalledFile["category"],
        overwritten: destExists,
      });
    }
  }

  return result;
}

export async function installFromDirectory(
  sourceDir: string,
  workspaceRoot: string,
  conflictStrategy: ConflictStrategy,
  progress: vscode.Progress<{ message?: string; increment?: number }>
): Promise<InstallResult> {
  progress.report({ message: "Scanning for agents, rules, and skills..." });
  const filesByCategory = await discoverFiles(sourceDir);
  return installFiles(
    sourceDir,
    workspaceRoot,
    filesByCategory,
    conflictStrategy,
    progress
  );
}

export async function cleanup(tmpDir: string): Promise<void> {
  await fs.rm(tmpDir, { recursive: true, force: true });
}
