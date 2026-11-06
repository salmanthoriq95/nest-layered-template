import { test } from "node:test";
import assert from "node:assert/strict";
import { InMemorySessionStore } from "./in-memory-session.store.js";

const identity = {
  userId: "11111111-1111-4111-8111-111111111111",
  sessionId: "22222222-2222-4222-8222-222222222222",
};

test("rotation retains replay evidence and revokes the current branch", () => {
  const store = new InMemorySessionStore();
  store.create({ ...identity, expiresAtMs: 1000, refreshDigest: "first" });
  assert.equal(store.rotateRefresh({
    refreshDigest: "first", replacementDigest: "second", nowMs: 1,
  }).status, "rotated");
  store.removeExpired(999);
  assert.equal(store.rotateRefresh({
    refreshDigest: "first", replacementDigest: "third", nowMs: 999,
  }).status, "replayed");
  assert.equal(store.findById(identity.sessionId)?.revoked, true);
  assert.equal(store.rotateRefresh({
    refreshDigest: "second", replacementDigest: "fourth", nowMs: 999,
  }).status, "invalid");
  store.removeExpired(1000);
  assert.equal(store.findById(identity.sessionId), undefined);
});

test("expiry is checked during rotation before cleanup", () => {
  const store = new InMemorySessionStore();
  store.create({ ...identity, expiresAtMs: 1000, refreshDigest: "first" });
  assert.equal(store.rotateRefresh({
    refreshDigest: "first", replacementDigest: "second", nowMs: 1000,
  }).status, "invalid");
});

test("lookup snapshots and unrelated logout cannot mutate another session", () => {
  const store = new InMemorySessionStore();
  store.create({ ...identity, expiresAtMs: 1000, refreshDigest: "first" });
  const snapshot = store.findById(identity.sessionId);
  assert.ok(snapshot);
  // Deliberately mutate a JS consumer's copy to verify storage ownership.
  Object.assign(snapshot, { revoked: true, expiresAtMs: 0 });
  assert.equal(store.findById(identity.sessionId)?.revoked, false);
  store.revokeSession({ ...identity, userId: "different-user" });
  assert.equal(store.findById(identity.sessionId)?.revoked, false);
  store.revokeSession(identity);
  assert.equal(store.findById(identity.sessionId)?.revoked, true);
});
