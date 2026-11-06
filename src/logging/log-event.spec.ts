import { test } from "node:test";
import assert from "node:assert/strict";
import { logEventSchema, safeException, stripDevelopmentContext } from "./log-event.js";

test("fault details exclude raw messages, causes and function arguments", () => {
  const error = new TypeError("password=private-value");
  error.stack = "TypeError: password=private-value\n at run(password=private-value) (/app/src/service.ts:12:4)";
  const safe = safeException(error);
  assert.equal(safe?.message, "Unexpected application error");
  assert.deepEqual(safe?.stackFrames, ["/app/src/service.ts:12:4"]);
  assert.ok(!JSON.stringify(safe).includes("private-value"));
});

test("worker strips development context and rejects mismatched severity", () => {
  const event = logEventSchema.parse({
    schemaVersion: 1, timestamp: "2026-11-06T00:00:00.000Z",
    level: "warn", requestId: "11111111-1111-4111-8111-111111111111",
    method: "GET", route: "/health", statusCode: 400, durationMs: 1,
    unexpected: false, requestContext: { headers: { "content-type": "application/json" } },
  });
  assert.ok(!("requestContext" in stripDevelopmentContext(event, false)));
  assert.equal(logEventSchema.safeParse({ ...event, level: "info" }).success, false);
});
