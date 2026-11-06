import { test } from "node:test";
import assert from "node:assert/strict";
import { FakeClock } from "../../../test/helpers/fake-clock.js";
import { AuthenticationService } from "./authentication.service.js";
import { InMemorySessionStore } from "./persistence/in-memory-session.store.js";
import type { IdentityProviderContract, IssueAccessTokenInput } from "./contracts/identity-provider.contract.js";
import type { VerifiedAccessClaims } from "./contracts/auth.types.js";

test("unknown users fail before password work; signing cannot undo concurrent logout", async () => {
  const clock = new FakeClock();
  const sessions = new InMemorySessionStore();
  let comparisons = 0;
  let signInput: IssueAccessTokenInput | undefined;
  let resume: ((value: string) => void) | undefined;
  const identity: IdentityProviderContract = {
    issueAccessToken(input) {
      signInput = input;
      return new Promise<string>((resolve) => { resume = resolve; });
    },
    async verifyAccessToken(): Promise<VerifiedAccessClaims> { throw new Error("Unused"); },
  };
  const service = new AuthenticationService(
    { findByUsername: (name) => name === "admin" ? {
      userId: "11111111-1111-4111-8111-111111111111",
      username: name, passwordHash: "test-only",
    } : undefined },
    sessions,
    identity,
    { async verify() { comparisons++; return true; } },
    clock,
    { accessTtlSeconds: 900, refreshTtlSeconds: 30 },
  );
  await assert.rejects(service.login({ username: "missing", password: "test" }));
  assert.equal(comparisons, 0);
  const pending = service.login({ username: "admin", password: "test" });
  await new Promise<void>((resolve) => setImmediate(resolve));
  assert.ok(signInput);
  assert.equal(signInput.expiresAtSeconds - signInput.issuedAtSeconds, 30);
  sessions.revokeSession(signInput);
  assert.ok(resume);
  resume("signed-test-token");
  await assert.rejects(pending);
});
