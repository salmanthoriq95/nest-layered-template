import { test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { FakeClock } from "../../test/helpers/fake-clock.js";
import { HttpLoggingAdapter } from "./http-logging.adapter.js";
import { SafeDiagnostics } from "./safe-diagnostics.js";

test("background delivery cancels a hanging connection and does not retry", async (context) => {
  let requests = 0;
  let socketClosed = false;
  const server = createServer((request) => {
    requests++;
    request.resume();
    request.socket.once("close", () => { socketClosed = true; });
  });
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  context.after(() => {
    server.closeAllConnections();
    server.close();
  });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const reasons: string[] = [];
  class Diagnostics extends SafeDiagnostics {
    override report(reason: string): void { reasons.push(reason); }
  }
  const adapter = new HttpLoggingAdapter({
    url: "http://127.0.0.1:" + address.port + "/internal/logs",
    token: "b".repeat(64), timeoutMs: 100, concurrency: 1,
    capacity: 1, maxBytes: 16384, shutdownMs: 1000, development: false,
  }, new Diagnostics(new FakeClock()));
  adapter.emit({
    schemaVersion: 1, timestamp: "2026-11-06T00:00:00.000Z",
    level: "info", requestId: "11111111-1111-4111-8111-111111111111",
    method: "GET", route: "/health", statusCode: 200,
    durationMs: 1, unexpected: false,
  });
  await adapter.close();
  await new Promise<void>((done) => setImmediate(done));
  assert.equal(requests, 1);
  assert.ok(socketClosed);
  assert.deepEqual(reasons, ["DELIVERY_FAILED"]);
});
