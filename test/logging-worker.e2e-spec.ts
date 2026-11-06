import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { envelope, httpCall, startProcess, unusedPort } from "./helpers/http-process.js";

test("worker authenticates ingestion, strips nondevelopment context and persists unexpected faults", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "nest-worker-"));
  const port = await unusedPort();
  const worker = await startProcess("logging-worker/main.js", {
    LOG_WORKER_PORT: String(port), LOG_ERROR_DIRECTORY: directory,
  }, port);
  context.after(async () => {
    await worker.stop();
    await rm(directory, { recursive: true, force: true });
  });
  const timestamp = new Date().toISOString();
  const event = {
    schemaVersion: 1, timestamp, level: "error",
    requestId: "11111111-1111-4111-8111-111111111111",
    method: "GET", route: "/health", statusCode: 500, durationMs: 1,
    unexpected: true,
    exception: { name: "TypeError", message: "Unexpected application error", stackFrames: [] },
    requestContext: { headers: { "content-type": "application/json" } },
  };
  assert.equal((await httpCall(port, "/internal/logs", {
    method: "POST", body: event,
  })).status, 401);
  const headers = { authorization: "Bearer " + "b".repeat(64) };
  const accepted = await httpCall(port, "/internal/logs", { method: "POST", body: event, headers });
  assert.equal(accepted.status, 202);
  assert.equal(envelope(accepted).data?.accepted, true);
  const path = join(directory, timestamp.slice(0, 10) + ".json");
  let written = "";
  for (let attempt = 0; attempt < 100; attempt++) {
    written = await readFile(path, "utf8").catch(() => "");
    if (written) break;
    await delay(20);
  }
  const raw: unknown = JSON.parse(written);
  assert.ok(Array.isArray(raw));
  assert.equal(raw.length, 1);
  assert.ok(!written.includes("requestContext"));
  assert.ok(written.includes("Unexpected application error"));
  assert.equal((await httpCall(port, "/internal/logs", {
    method: "POST", body: { ...event, extra: "rejected" }, headers,
  })).status, 400);
  assert.equal((await httpCall(port, "/internal/logs", {
    method: "POST", raw: "{}", headers: { ...headers, "content-type": "text/plain" },
  })).status, 415);
});

test("API and logging worker survive termination of the other process", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "nest-independent-"));
  const workerPort = await unusedPort();
  const port = await unusedPort();
  const worker = await startProcess("logging-worker/main.js", {
    LOG_WORKER_PORT: String(workerPort), LOG_ERROR_DIRECTORY: directory,
  }, workerPort);
  const api = await startProcess("main.js", {
    PORT: String(port),
    LOG_WORKER_URL: "http://127.0.0.1:" + workerPort + "/internal/logs",
  }, port);
  context.after(async () => {
    await api.stop();
    await worker.stop();
    await rm(directory, { recursive: true, force: true });
  });
  await api.stop();
  assert.equal((await httpCall(workerPort, "/health")).status, 200);
  const restarted = await startProcess("main.js", {
    PORT: String(port),
    LOG_WORKER_URL: "http://127.0.0.1:" + workerPort + "/internal/logs",
  }, port);
  context.after(restarted.stop);
  await worker.stop();
  assert.equal((await httpCall(port, "/health")).status, 200);
  assert.equal((await httpCall(port, "/examples/public")).status, 200);
});
