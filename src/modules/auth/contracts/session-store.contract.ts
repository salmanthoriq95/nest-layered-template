import type { SessionIdentity, SessionSnapshot } from "./auth.types.js";

export type CreateSessionInput = SessionIdentity &
  Readonly<{ expiresAtMs: number; refreshDigest: string }>;

export type RefreshRotationResult =
  | Readonly<{ status: "rotated"; session: SessionSnapshot }>
  | Readonly<{ status: "invalid" | "replayed" }>;

export abstract class SessionStoreContract {
  abstract create(input: CreateSessionInput): void;
  abstract findById(sessionId: string): SessionSnapshot | undefined;
  abstract rotateRefresh(
    input: Readonly<{
      refreshDigest: string;
      replacementDigest: string;
      nowMs: number;
    }>,
  ): RefreshRotationResult;
  abstract revokeSession(input: SessionIdentity): void;
  abstract removeExpired(nowMs: number): void;
}
