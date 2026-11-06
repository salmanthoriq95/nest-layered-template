import { test } from "node:test";
import assert from "node:assert/strict";
import { FakeClock } from "../../../../test/helpers/fake-clock.js";
import { JoseIdentityProvider } from "./jose-identity.provider.js";

test("JWT verification returns owned metadata and rejects expiry, tampering and issuer mismatch", async () => {
  const clock = new FakeClock();
  const options = { signingKey: "a".repeat(64), issuer: "test-issuer", audience: "test-audience" };
  const provider = new JoseIdentityProvider(clock, options);
  const input = {
    userId: "11111111-1111-4111-8111-111111111111",
    sessionId: "22222222-2222-4222-8222-222222222222",
    issuedAtSeconds: Math.floor(clock.epochMs() / 1000),
    expiresAtSeconds: Math.floor(clock.epochMs() / 1000) + 2,
  };
  const token = await provider.issueAccessToken(input);
  assert.deepEqual(await provider.verifyAccessToken({ token }), input);
  await assert.rejects(provider.verifyAccessToken({ token: token.slice(0, -8) + "tampered" }));
  await assert.rejects(new JoseIdentityProvider(clock, {
    ...options, issuer: "wrong",
  }).verifyAccessToken({ token }));
  clock.advance(2000);
  await assert.rejects(provider.verifyAccessToken({ token }));
});
