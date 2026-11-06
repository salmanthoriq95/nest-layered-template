import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { FakeClock } from "../../test/helpers/fake-clock.js";
import { DailyJsonErrorStore } from "./daily-json-error.store.js";
import type { LogEvent } from "../logging/log-event.js";

test("daily JSON updates serialize and preserve corrupt files without repair", async (context) => {
  const directory = await mkdtemp(join(tmpdir(), "nest-errors-"));
  context.after(() => rm(directory, { recursive: true, force: true }));
  const clock = new FakeClock(Date.UTC(2026, 10, 6));
  const store = new DailyJsonErrorStore(directory, 10485760, 7, clock);
  await store.initialize();
  const event: LogEvent = {
    schemaVersion: 1,
    timestamp: new Date(clock.epochMs()).toISOString(),
    requestId: "11111111-1111-4111-8111-111111111111",
    level: "error", method: "GET", route: "/health",
    statusCode: 500, durationMs: 1, unexpected: true,
  };
  await Promise.all([
    store.append({ event, receivedAtMs: clock.epochMs() }),
    store.append({ event, receivedAtMs: clock.epochMs() }),
  ]);
  const path = join(directory, "2026-11-06.json");
  const records: unknown = JSON.parse(await readFile(path, "utf8"));
  assert.ok(Array.isArray(records));
  assert.equal(records.length, 2);
  assert.equal((await stat(path)).mode & 0o777, 0o600);
  await writeFile(path, "corrupt", { mode: 0o600 });
  await assert.rejects(store.append({ event, receivedAtMs: clock.epochMs() }));
  assert.equal(await readFile(path, "utf8"), "corrupt");
  await assert.rejects(store.initialize());
});
