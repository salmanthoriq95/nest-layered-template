import { Module } from "@nestjs/common";
import type { DynamicModule } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ClockContract } from "../../common/clock.contract.js";
import type { ApiSettings } from "../../config/settings.js";
import { AuthController } from "./auth.controller.js";
import { AuthenticationService } from "./authentication.service.js";
import { AuthorizationService } from "./authorization.service.js";
import { PermissionsGuard } from "./permissions.guard.js";
import { AuthenticationServiceContract } from "./contracts/authentication-service.contract.js";
import { AuthorizationServiceContract } from "./contracts/authorization-service.contract.js";
import { IdentityProviderContract } from "./contracts/identity-provider.contract.js";
import { PasswordVerifierContract } from "./contracts/password-verifier.contract.js";
import { PermissionStoreContract } from "./contracts/permission-store.contract.js";
import { SessionStoreContract } from "./contracts/session-store.contract.js";
import { UserStoreContract } from "./contracts/user-store.contract.js";
import { BcryptPasswordVerifier } from "./integrations/bcrypt-password.verifier.js";
import { JoseIdentityProvider } from "./integrations/jose-identity.provider.js";
import { InMemoryAccounts } from "./persistence/in-memory-accounts.js";
import { InMemoryPermissionStore } from "./persistence/in-memory-permission.store.js";
import { InMemorySessionStore } from "./persistence/in-memory-session.store.js";
import { InMemoryUserStore } from "./persistence/in-memory-user.store.js";

@Module({})
export class AuthModule {
  static register(settings: ApiSettings, clock: ClockContract): DynamicModule {
    return {
      module: AuthModule,
      controllers: [AuthController],
      providers: [
        { provide: ClockContract, useValue: clock },
        { provide: InMemoryAccounts, useFactory: () => new InMemoryAccounts() },
        {
          provide: UserStoreContract,
          useFactory: (accounts: InMemoryAccounts) => new InMemoryUserStore(accounts),
          inject: [InMemoryAccounts],
        },
        {
          provide: PermissionStoreContract,
          useFactory: (accounts: InMemoryAccounts) => new InMemoryPermissionStore(accounts),
          inject: [InMemoryAccounts],
        },
        { provide: SessionStoreContract, useClass: InMemorySessionStore },
        { provide: PasswordVerifierContract, useClass: BcryptPasswordVerifier },
        {
          provide: IdentityProviderContract,
          useFactory: (time: ClockContract) => new JoseIdentityProvider(time, {
            signingKey: settings.JWT_SIGNING_KEY,
            issuer: settings.JWT_ISSUER,
            audience: settings.JWT_AUDIENCE,
          }),
          inject: [ClockContract],
        },
        {
          provide: AuthorizationServiceContract,
          useFactory: (permissions: PermissionStoreContract) => new AuthorizationService(permissions),
          inject: [PermissionStoreContract],
        },
        {
          provide: AuthenticationServiceContract,
          useFactory: (
            users: UserStoreContract,
            sessions: SessionStoreContract,
            identity: IdentityProviderContract,
            passwords: PasswordVerifierContract,
            time: ClockContract,
          ) => new AuthenticationService(users, sessions, identity, passwords, time, {
            accessTtlSeconds: settings.JWT_ACCESS_TTL_SECONDS,
            refreshTtlSeconds: settings.AUTH_REFRESH_TTL_SECONDS,
          }),
          inject: [
            UserStoreContract, SessionStoreContract, IdentityProviderContract,
            PasswordVerifierContract, ClockContract,
          ],
        },
        { provide: APP_GUARD, useClass: PermissionsGuard },
      ],
      exports: [SessionStoreContract, PasswordVerifierContract],
    };
  }
}
