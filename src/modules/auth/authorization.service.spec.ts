import { test } from "node:test";
import assert from "node:assert/strict";
import { AuthorizationService } from "./authorization.service.js";
import type { AccessSnapshot } from "./contracts/auth.types.js";

test("current grants apply immediately and superadmin-only access stays separate", () => {
  let snapshot: AccessSnapshot = { userId: "user", role: "admin", grants: ["examples:read"] };
  const service = new AuthorizationService({ findByUserId: () => ({ ...snapshot, grants: [...snapshot.grants] }) });
  const identity = { userId: "user", sessionId: "session" };
  const policy = { kind: "permissions" as const, permissions: ["examples:read"] };
  service.assertAllowed({ identity, policy });
  snapshot = { ...snapshot, grants: [] };
  assert.throws(() => service.assertAllowed({ identity, policy }));
  assert.throws(() => service.assertAllowed({ identity, policy: { kind: "superadmin" } }));
  snapshot = { ...snapshot, role: "superadmin" };
  service.assertAllowed({ identity, policy });
  service.assertAllowed({ identity, policy: { kind: "superadmin" } });
  assert.throws(() => service.assertAllowed({
    identity, policy: { kind: "permissions", permissions: [] },
  }));
});
