import { SessionStoreContract } from "../contracts/session-store.contract.js";
import type {
  CreateSessionInput,
  RefreshRotationResult,
} from "../contracts/session-store.contract.js";
import type {
  SessionIdentity,
  SessionSnapshot,
} from "../contracts/auth.types.js";

type SessionState = {
  snapshot: SessionSnapshot;
  digests: Set<string>;
  currentDigest: string;
};

export class InMemorySessionStore implements SessionStoreContract {
  private readonly sessions = new Map<string, SessionState>();
  private readonly refreshOwners = new Map<string, string>();

  create(input: CreateSessionInput): void {
    if (
      this.sessions.has(input.sessionId) ||
      this.refreshOwners.has(input.refreshDigest)
    ) {
      throw new Error("Duplicate session state");
    }
    const snapshot: SessionSnapshot = {
      userId: input.userId,
      sessionId: input.sessionId,
      expiresAtMs: input.expiresAtMs,
      revoked: false,
    };
    this.sessions.set(input.sessionId, {
      snapshot,
      digests: new Set([input.refreshDigest]),
      currentDigest: input.refreshDigest,
    });
    this.refreshOwners.set(input.refreshDigest, input.sessionId);
  }

  findById(sessionId: string): SessionSnapshot | undefined {
    const state = this.sessions.get(sessionId);
    return state ? { ...state.snapshot } : undefined;
  }

  rotateRefresh(input: {
    refreshDigest: string;
    replacementDigest: string;
    nowMs: number;
  }): RefreshRotationResult {
    const owner = this.refreshOwners.get(input.refreshDigest);
    const state = owner ? this.sessions.get(owner) : undefined;
    if (!state || state.snapshot.expiresAtMs <= input.nowMs) {
      return { status: "invalid" };
    }
    if (state.currentDigest !== input.refreshDigest) {
      // Return after committing revocation: throwing inside a future DB
      // transaction could otherwise roll back the replay response.
      state.snapshot = { ...state.snapshot, revoked: true };
      return { status: "replayed" };
    }
    if (state.snapshot.revoked) return { status: "invalid" };
    if (this.refreshOwners.has(input.replacementDigest)) {
      throw new Error("Duplicate refresh state");
    }
    // No await separates admission, consumption, and successor insertion.
    state.currentDigest = input.replacementDigest;
    state.digests.add(input.replacementDigest);
    this.refreshOwners.set(input.replacementDigest, state.snapshot.sessionId);
    return { status: "rotated", session: { ...state.snapshot } };
  }

  revokeSession(input: SessionIdentity): void {
    const state = this.sessions.get(input.sessionId);
    if (state?.snapshot.userId === input.userId) {
      state.snapshot = { ...state.snapshot, revoked: true };
    }
  }

  removeExpired(nowMs: number): void {
    for (const [id, state] of this.sessions) {
      if (state.snapshot.expiresAtMs > nowMs) continue;
      for (const digest of state.digests) this.refreshOwners.delete(digest);
      this.sessions.delete(id);
    }
  }
}
