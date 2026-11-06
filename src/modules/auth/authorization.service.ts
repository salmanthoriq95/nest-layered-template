import { forbidden, unauthenticated } from "../../application/application-error.js";
import { AuthorizationServiceContract } from "./contracts/authorization-service.contract.js";
import { PermissionStoreContract } from "./contracts/permission-store.contract.js";
import type { SessionIdentity } from "./contracts/auth.types.js";
import type { AccessPolicy } from "./access-policy.js";

export class AuthorizationService implements AuthorizationServiceContract {
  constructor(private readonly permissions: PermissionStoreContract) {}
  assertAllowed(input: { identity: SessionIdentity; policy: AccessPolicy }): void {
    const access = this.permissions.findByUserId(input.identity.userId);
    if (!access) throw unauthenticated();
    if (input.policy.kind === "authenticated") return;
    if (input.policy.kind === "superadmin") {
      if (access.role === "superadmin") return;
      throw forbidden();
    }
    if (input.policy.kind === "permissions") {
      if (!input.policy.permissions.length) throw forbidden();
      if (access.role === "superadmin") return;
      if (input.policy.permissions.every((key) => access.grants.includes(key))) return;
    }
    throw forbidden();
  }
}
