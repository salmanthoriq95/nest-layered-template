import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import bcrypt from "bcrypt";
import { envelope, httpCall, startProcess, unusedPort } from "./helpers/http-process.js";

const tokensSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().regex(/^[0-9a-f]{64}$/),
  tokenType: z.literal("Bearer"),
  expiresIn: z.number().positive(),
});

test("compiled API enforces permissions, rotation, replay and logout while worker is down", async (context) => {
  const port = await unusedPort();
  const workerPort = await unusedPort();
  const api = await startProcess("main.js", {
    PORT: String(port),
    LOG_WORKER_URL: "http://127.0.0.1:" + workerPort + "/internal/logs",
  }, port);
  context.after(api.stop);
  assert.equal((await httpCall(port, "/examples/public")).status, 200);
  assert.equal(envelope(await httpCall(port, "/examples/admin")).error?.code, "UNAUTHENTICATED");
  const login = async (username: string) => tokensSchema.parse(envelope(await httpCall(port, "/auth/login", {
    method: "POST", body: { username, password: "dev123" },
  })).data);
  const admin = await login("admin");
  const headers = { authorization: "Bearer " + admin.accessToken };
  assert.equal((await httpCall(port, "/examples/admin", {
    headers: { authorization: "Bearer " + admin.refreshToken },
  })).status, 401);
  assert.equal((await httpCall(port, "/auth/refresh", {
    method: "POST", body: { refreshToken: admin.accessToken },
  })).status, 401);
  assert.equal((await httpCall(port, "/examples/admin", { headers })).status, 200);
  assert.equal((await httpCall(port, "/examples/superadmin", { headers })).status, 403);
  const superadmin = await login("superadmin");
  for (const path of ["/examples/admin", "/examples/superadmin"]) {
    assert.equal((await httpCall(port, path, {
      headers: { authorization: "Bearer " + superadmin.accessToken },
    })).status, 200);
  }
  const refreshed = tokensSchema.parse(envelope(await httpCall(port, "/auth/refresh", {
    method: "POST", body: { refreshToken: admin.refreshToken },
  })).data);
  assert.equal((await httpCall(port, "/auth/refresh", {
    method: "POST", body: { refreshToken: admin.refreshToken },
  })).status, 401);
  assert.equal((await httpCall(port, "/examples/admin", {
    headers: { authorization: "Bearer " + refreshed.accessToken },
  })).status, 401);
  const independent = await login("admin");
  assert.equal((await httpCall(port, "/auth/logout", {
    method: "POST", headers: { authorization: "Bearer " + independent.accessToken },
  })).status, 200);
  assert.equal((await httpCall(port, "/auth/refresh", {
    method: "POST", body: { refreshToken: independent.refreshToken },
  })).status, 401);
  assert.equal((await httpCall(port, "/health")).status, 200);
});

test("validation/parser failures count toward login quota and ignore untrusted forwarded IP", async (context) => {
  const port = await unusedPort();
  const api = await startProcess("main.js", {
    PORT: String(port),
    AUTH_LOGIN_RATE_LIMIT_MAX_REQUESTS: "2",
  }, port);
  context.after(api.stop);
  assert.equal(envelope(await httpCall(port, "/auth/login", {
    method: "POST", raw: "{",
  })).error?.code, "VALIDATION_ERROR");
  assert.equal((await httpCall(port, "/auth/login", {
    method: "POST", body: { username: "admin", password: "dev123", role: "superadmin" },
  })).status, 400);
  const limited = await httpCall(port, "/auth/login", {
    method: "POST",
    headers: { "x-forwarded-for": "198.51.100.12" },
    body: { username: "admin", password: "dev123" },
  });
  assert.equal(limited.status, 429);
  assert.equal(envelope(limited).error?.code, "RATE_LIMITED");
  assert.ok(Number(limited.headers["retry-after"]) >= 1);
  assert.equal(limited.headers["cache-control"], "no-store");
  assert.equal((await httpCall(port, "/health?unused=true")).status, 400);
  assert.equal((await httpCall(port, "/missing")).status, 404);
  const method = await httpCall(port, "/health", { method: "POST" });
  assert.equal(method.status, 405);
  assert.equal(method.headers.allow, "GET, HEAD");
});

test("Swagger UI/schema are gated independently and bcrypt dollar signs remain literal", async (context) => {
  const port = await unusedPort();
  const passwordHash = await bcrypt.hash("documentation-test-password", 10);
  const api = await startProcess("main.js", {
    PORT: String(port),
    SWAGGER_ENABLED: "true",
    SWAGGER_USERNAME: "test-docs",
    SWAGGER_PASSWORD_HASH: passwordHash,
  }, port);
  context.after(api.stop);
  for (const path of ["/docs", "/docs/openapi.json", "/docs/openapi.yaml", "/docs/swagger-ui.css"]) {
    const denied = await httpCall(port, path);
    assert.equal(denied.status, 401);
    assert.match(String(denied.headers["www-authenticate"]), /^Basic /);
  }
  const headers = { authorization: "Basic " + Buffer.from("test-docs:documentation-test-password").toString("base64") };
  assert.equal((await httpCall(port, "/docs/openapi.json", { headers })).status, 200);
  assert.equal((await httpCall(port, "/docs/openapi.yaml", { headers })).status, 200);
  assert.equal((await httpCall(port, "/examples/admin", { headers })).status, 401);
});
