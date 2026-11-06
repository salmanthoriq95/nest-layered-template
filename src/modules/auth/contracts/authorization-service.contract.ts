import type { SessionIdentity } from "./auth.types.js";
import type { AccessPolicy } from "../access-policy.js";

export abstract class AuthorizationServiceContract {
  abstract assertAllowed(
    input: Readonly<{ identity: SessionIdentity; policy: AccessPolicy }>,
  ): void;
}
