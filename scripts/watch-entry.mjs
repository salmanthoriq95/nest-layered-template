import { spawn } from "node:child_process";
import { existsSync, watch } from "node:fs";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";

const entry = resolve(process.argv[2] ?? "");
if (!entry.endsWith(".js") || !entry.includes("/dist/")) {
  throw new Error("A compiled dist entry point is required");
}
const directory = resolve("dist");
await mkdir(directory, { recursive: true });
let child;
let debounce;
let restarting = false;
let queued = false;
let stopping = false;

async function stopChild() {
  const current = child;
  child = undefined;
  if (!current || current.exitCode !== null || current.signalCode !== null) return;
  await new Promise((done) => {
    const timeout = setTimeout(() => current.kill("SIGKILL"), 5000);
    current.once("exit", () => { clearTimeout(timeout); done(); });
    current.kill("SIGTERM");
  });
}

async function restart() {
  if (stopping) return;
  if (restarting) { queued = true; return; }
  restarting = true;
  try {
    await stopChild();
    if (!stopping && existsSync(entry)) {
      child = spawn(process.execPath, ["--enable-source-maps", entry], {
        stdio: "inherit", cwd: process.cwd(), shell: false,
      });
      child.once("error", () => {
        process.stderr.write('{"kind":"watch","reason":"START_FAILED"}\n');
      });
    }
  } finally {
    restarting = false;
    if (queued && !stopping) { queued = false; schedule(); }
  }
}

function schedule() {
  if (debounce) clearTimeout(debounce);
  debounce = setTimeout(() => void restart(), 250);
}

const watcher = watch(directory, { recursive: true }, schedule);
const stop = async () => {
  if (stopping) return;
  stopping = true;
  watcher.close();
  if (debounce) clearTimeout(debounce);
  await stopChild();
  process.exit(0);
};
process.once("SIGINT", () => void stop());
process.once("SIGTERM", () => void stop());
schedule();
