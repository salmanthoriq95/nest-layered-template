import "reflect-metadata";
import { test } from "node:test";
import assert from "node:assert/strict";
import type { ExecutionContext } from "@nestjs/common";
import { FakeClock } from "../../../test/helpers/fake-clock.js";
import { ACCESS_POLICIES } from "./access-policy.js";
import { PermissionsGuard } from "./permissions.guard.js";
import { InMemorySessionStore } from "./persistence/in-memory-session.store.js";
import type { VerifiedAccessClaims } from "./contracts/auth.types.js";

test("unclassified/conflicting policies fail closed, including for privileged callers", async () => {
  const clock = new FakeClock(1000);
  const sessions = new InMemorySessionStore();
  const claims: VerifiedAccessClaims = {
    userId: "11111111-1111-4111-8111-111111111111",
    sessionId: "22222222-2222-4222-8222-222222222222",
    issuedAtSeconds: 0,
    expiresAtSeconds: 2,
  };
  sessions.create({ ...claims, expiresAtMs: 2000, refreshDigest: "refresh" });
  let authorizationCalls = 0;
  const guard = new PermissionsGuard(
    { async issueAccessToken() { return "unused"; }, async verifyAccessToken() { return claims; } },
    sessions,
    { assertAllowed() { authorizationCalls++; } },
    clock,
  );
  const handler = () => {};
  class Controller {}
  const request = { headers: { authorization: "Bearer test-token" } };
  // Only methods used by this guard are supplied; subprocess tests cover Nest wiring.
  const context = {
    getHandler: () => handler,
    getClass: () => Controller,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  await assert.rejects(guard.canActivate(context));
  Reflect.defineMetadata(ACCESS_POLICIES, [{ kind: "public" }, { kind: "authenticated" }], handler);
  await assert.rejects(guard.canActivate(context));
  Reflect.defineMetadata(ACCESS_POLICIES, [{ kind: "permissions", permissions: [] }], handler);
  await assert.rejects(guard.canActivate(context));
  assert.equal(authorizationCalls, 0);
  Reflect.defineMetadata(ACCESS_POLICIES, [{ kind: "authenticated" }], handler);
  assert.equal(await guard.canActivate(context), true);
  sessions.revokeSession(claims);
  await assert.rejects(guard.canActivate(context));
});
