import { spawn } from "node:child_process";
import { readdir, rm } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../", import.meta.url));

export function runNode(file, args = []) {
  return new Promise((done, reject) => {
    const child = spawn(process.execPath, [resolve(root, file), ...args], {
      cwd: root, stdio: "inherit", shell: false,
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) done();
      else reject(new Error("Command failed: " + file + " (" + (signal ?? code) + ")"));
    });
  });
}

async function files(directory, suffix) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await files(path, suffix));
    else if (entry.isFile() && path.endsWith(suffix)) result.push(path);
  }
  return result.sort();
}

export async function compile(scope = "all") {
  if (scope !== "unit") await rm(join(root, "dist"), { recursive: true, force: true });
  await rm(join(root, ".test-dist"), { recursive: true, force: true });
  await runNode("node_modules/typescript/bin/tsc", ["--noEmit", "-p", "tsconfig.json"]);
  if (scope !== "unit") {
    await runNode("node_modules/typescript/bin/tsc", ["-p", "tsconfig.build.json"]);
  }
  await runNode("node_modules/typescript/bin/tsc", ["-p", "tsconfig.test.json"]);
}

export async function runTests(scope = "all") {
  const selected = [];
  if (scope !== "e2e") selected.push(...await files(join(root, ".test-dist/src"), ".spec.js"));
  if (scope !== "unit") selected.push(...await files(join(root, ".test-dist/test"), ".e2e-spec.js"));
  if (!selected.length) throw new Error("No tests selected");
  await new Promise((done, reject) => {
    const child = spawn(process.execPath, [
      "--enable-source-maps", "--test", "--test-concurrency=1", ...selected,
    ], { cwd: root, stdio: "inherit", shell: false });
    child.once("error", reject);
    child.once("exit", (code) => code === 0 ? done() : reject(new Error("Tests failed")));
  });
}

export function failed(error) {
  process.stderr.write((error instanceof Error ? error.message : "Workflow failed") + "\n");
  process.exitCode = 1;
}
