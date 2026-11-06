import { test } from "node:test";
import assert from "node:assert/strict";
import { parseApiSettings, parseWorkerSettings, trustedProxies } from "./settings.js";

const required = { JWT_SIGNING_KEY: "a".repeat(64), LOG_WORKER_TOKEN: "b".repeat(64) };

test("configuration defaults only apply to absent settings", () => {
  assert.equal(parseApiSettings(required).JWT_ACCESS_TTL_SECONDS, 900);
  for (const value of ["", "0", "-1", "1.5", "NaN"]) {
    assert.throws(() => parseApiSettings({ ...required, AUTH_CLEANUP_INTERVAL_SECONDS: value }));
  }
  assert.throws(() => parseApiSettings({ ...required, AUTH_CLEANUP_INTERVAL_SECONDS: "2147484" }));
  assert.throws(() => parseApiSettings({ ...required, LOG_WORKER_URL: "http://user:secret@localhost/internal/logs" }));
  assert.throws(() => parseWorkerSettings({}));
  assert.throws(() => parseApiSettings({ ...required, SWAGGER_ENABLED: "true" }));
});

test("proxy trust accepts explicit networks and rejects blanket or boolean trust", () => {
  assert.deepEqual(trustedProxies(""), []);
  assert.deepEqual(trustedProxies("127.0.0.1, 10.0.0.0/8"), ["127.0.0.1", "10.0.0.0/8"]);
  for (const value of ["true", "1", "0.0.0.0/0", "::/0", "10.0.0.1,"]) {
    assert.throws(() => trustedProxies(value));
  }
});
