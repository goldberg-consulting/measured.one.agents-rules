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

export interface FileEntry {
  src: string;
  destRel: string;
}

const CURSOR_DIRS = ["agents", "rules", "skills"] as const;

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
  repoDir: string,
  pathMapping?: Record<string, string>
): Promise<Map<string, FileEntry[]>> {
  const found = new Map<string, FileEntry[]>();

  if (pathMapping) {
    for (const [sourceDir, targetCategory] of Object.entries(pathMapping)) {
      if (!(CURSOR_DIRS as readonly string[]).includes(targetCategory)) {
        continue;
      }
      const absSource = path.join(repoDir, sourceDir);
      const files = await collectFiles(absSource);
      if (files.length > 0) {
        const existing = found.get(targetCategory) ?? [];
        const entries: FileEntry[] = files.map((f) => ({
          src: f,
          destRel: path.join(targetCategory, path.relative(absSource, f)),
        }));
        found.set(targetCategory, [...existing, ...entries]);
      }
    }
  }

  if (found.size === 0) {
    const root = await findCursorRoot(repoDir);
    if (!root) {
      throw new Error(
        "No cursor content found. Expected a cursor/ directory or top-level agents/, rules/, skills/ folders."
      );
    }

    for (const category of CURSOR_DIRS) {
      const categoryDir = path.join(root, category);
      const files = await collectFiles(categoryDir);
      if (files.length > 0) {
        found.set(
          category,
          files.map((f) => ({
            src: f,
            destRel: path.relative(root, f),
          }))
        );
      }
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
  workspaceRoot: string,
  filesByCategory: Map<string, FileEntry[]>,
  conflictStrategy: ConflictStrategy,
  progress: vscode.Progress<{ message?: string; increment?: number }>
): Promise<InstallResult> {
  const dotCursor = path.join(workspaceRoot, ".cursor");
  const result: InstallResult = { files: [], skipped: [] };
  const allFiles = [...filesByCategory.values()].flat();
  const increment = allFiles.length > 0 ? 80 / allFiles.length : 0;
  let strategy = conflictStrategy;

  for (const [category, entries] of filesByCategory.entries()) {
    for (const { src, destRel } of entries) {
      const dest = path.join(dotCursor, destRel);

      progress.report({
        message: `Installing ${destRel}`,
        increment,
      });

      const destExists = await fs
        .access(dest)
        .then(() => true)
        .catch(() => false);

      if (destExists && strategy !== "overwriteAll") {
        if (strategy === "skip") {
          result.skipped.push(destRel);
          continue;
        }

        const choice = await vscode.window.showWarningMessage(
          `${destRel} already exists. Overwrite?`,
          "Overwrite",
          "Skip",
          "Overwrite All",
          "Skip All"
        );

        if (choice === "Skip") {
          result.skipped.push(destRel);
          continue;
        }
        if (choice === "Skip All") {
          strategy = "skip";
          result.skipped.push(destRel);
          continue;
        }
        if (choice === "Overwrite All") {
          strategy = "overwriteAll";
        }
        if (!choice) {
          result.skipped.push(destRel);
          continue;
        }
      }

      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.copyFile(src, dest);
      result.files.push({
        relativePath: destRel,
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
  progress: vscode.Progress<{ message?: string; increment?: number }>,
  pathMapping?: Record<string, string>
): Promise<InstallResult> {
  progress.report({ message: "Scanning for agents, rules, and skills..." });
  const filesByCategory = await discoverFiles(sourceDir, pathMapping);
  return installFiles(workspaceRoot, filesByCategory, conflictStrategy, progress);
}

export async function cleanup(tmpDir: string): Promise<void> {
  await fs.rm(tmpDir, { recursive: true, force: true });
}
