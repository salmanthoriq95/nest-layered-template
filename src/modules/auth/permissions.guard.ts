import { Inject, Injectable } from "@nestjs/common";
import type { CanActivate, ExecutionContext } from "@nestjs/common";
import { forbidden, unauthenticated } from "../../application/application-error.js";
import { ClockContract } from "../../common/clock.contract.js";
import type { HttpRequest } from "../../http/request-state.js";
import { ACCESS_POLICIES } from "./access-policy.js";
import type { AccessPolicy } from "./access-policy.js";
import { AuthorizationServiceContract } from "./contracts/authorization-service.contract.js";
import { IdentityProviderContract } from "./contracts/identity-provider.contract.js";
import { SessionStoreContract } from "./contracts/session-store.contract.js";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    @Inject(IdentityProviderContract) private readonly identity: IdentityProviderContract,
    @Inject(SessionStoreContract) private readonly sessions: SessionStoreContract,
    @Inject(AuthorizationServiceContract) private readonly authorization: AuthorizationServiceContract,
    @Inject(ClockContract) private readonly clock: ClockContract,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const handlerPolicies: AccessPolicy[] = Reflect.getOwnMetadata(ACCESS_POLICIES, context.getHandler()) ?? [];
    const classPolicies: AccessPolicy[] = Reflect.getOwnMetadata(ACCESS_POLICIES, context.getClass()) ?? [];
    const policies = [...handlerPolicies, ...classPolicies];
    const policy = policies.length === 1 ? policies[0] : undefined;
    const validPolicy = policy &&
      (policy.kind !== "permissions" ||
        (policy.permissions.length > 0 && policy.permissions.every((key) => key.length > 0)));
    if (validPolicy && policy.kind === "public") return true;
    const request = context.switchToHttp().getRequest<HttpRequest>();
    const header = request.headers.authorization;
    if (!header || header.length > 4096 || !/^Bearer \S+$/i.test(header)) {
      throw unauthenticated();
    }
    const claims = await this.identity.verifyAccessToken({ token: header.slice(7) });
    const session = this.sessions.findById(claims.sessionId);
    const now = this.clock.epochMs();
    if (
      !session || session.revoked || session.userId !== claims.userId ||
      session.expiresAtMs <= now || claims.expiresAtSeconds * 1000 <= now
    ) throw unauthenticated();
    request.identity = claims;
    if (!validPolicy || !policy) throw forbidden();
    this.authorization.assertAllowed({ identity: claims, policy });
    return true;
  }
}
