import { createHash, randomBytes, randomUUID } from "node:crypto";
import { ClockContract } from "../../common/clock.contract.js";
import { unauthenticated } from "../../application/application-error.js";
import { AuthenticationServiceContract } from "./contracts/authentication-service.contract.js";
import { IdentityProviderContract } from "./contracts/identity-provider.contract.js";
import { PasswordVerifierContract } from "./contracts/password-verifier.contract.js";
import { UserStoreContract } from "./contracts/user-store.contract.js";
import { SessionStoreContract } from "./contracts/session-store.contract.js";
import type {
  LoginInput,
  RefreshInput,
  SessionIdentity,
  SessionSnapshot,
  TokenResult,
} from "./contracts/auth.types.js";

export function refreshDigest(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export class AuthenticationService implements AuthenticationServiceContract {
  constructor(
    private readonly users: UserStoreContract,
    private readonly sessions: SessionStoreContract,
    private readonly identity: IdentityProviderContract,
    private readonly passwords: PasswordVerifierContract,
    private readonly clock: ClockContract,
    private readonly settings: Readonly<{
      accessTtlSeconds: number;
      refreshTtlSeconds: number;
    }>,
  ) {}

  async login(input: LoginInput): Promise<TokenResult> {
    const user = this.users.findByUsername(input.username);
    // The maintainer selected immediate rejection for unknown usernames.
    if (!user) throw unauthenticated();
    if (
      !(await this.passwords.verify({
        password: input.password,
        passwordHash: user.passwordHash,
      }))
    ) {
      throw unauthenticated();
    }
    const now = this.clock.epochMs();
    const refreshToken = randomBytes(32).toString("hex");
    const session: SessionSnapshot = {
      userId: user.userId,
      sessionId: randomUUID(),
      expiresAtMs: now + this.settings.refreshTtlSeconds * 1000,
      revoked: false,
    };
    this.sessions.create({
      ...session,
      refreshDigest: refreshDigest(refreshToken),
    });
    try {
      return await this.tokens(session, refreshToken);
    } catch (error) {
      this.sessions.revokeSession(session);
      throw error;
    }
  }

  async refresh(input: RefreshInput): Promise<TokenResult> {
    const refreshToken = randomBytes(32).toString("hex");
    const result = this.sessions.rotateRefresh({
      refreshDigest: refreshDigest(input.refreshToken),
      replacementDigest: refreshDigest(refreshToken),
      nowMs: this.clock.epochMs(),
    });
    if (result.status !== "rotated") throw unauthenticated();
    try {
      return await this.tokens(result.session, refreshToken);
    } catch (error) {
      this.sessions.revokeSession(result.session);
      throw error;
    }
  }

  logout(input: SessionIdentity): void {
    this.sessions.revokeSession(input);
  }

  private async tokens(
    session: SessionSnapshot,
    refreshToken: string,
  ): Promise<TokenResult> {
    const issuedAtSeconds = Math.floor(this.clock.epochMs() / 1000);
    const expiresAtSeconds = Math.min(
      issuedAtSeconds + this.settings.accessTtlSeconds,
      Math.floor(session.expiresAtMs / 1000),
    );
    if (expiresAtSeconds <= issuedAtSeconds) throw unauthenticated();
    const accessToken = await this.identity.issueAccessToken({
      userId: session.userId,
      sessionId: session.sessionId,
      issuedAtSeconds,
      expiresAtSeconds,
    });
    // JWT signing awaits crypto work. A concurrent logout/replay must win.
    const current = this.sessions.findById(session.sessionId);
    if (
      !current ||
      current.revoked ||
      current.userId !== session.userId ||
      current.expiresAtMs <= this.clock.epochMs()
    ) {
      throw unauthenticated();
    }
    return {
      accessToken,
      refreshToken,
      tokenType: "Bearer",
      expiresIn: expiresAtSeconds - issuedAtSeconds,
    };
  }
}
