import type {
  SessionIdentity,
  VerifiedAccessClaims,
} from "./auth.types.js";

export type IssueAccessTokenInput = SessionIdentity &
  Readonly<{ issuedAtSeconds: number; expiresAtSeconds: number }>;

export abstract class IdentityProviderContract {
  abstract issueAccessToken(input: IssueAccessTokenInput): Promise<string>;
  abstract verifyAccessToken(
    input: Readonly<{ token: string }>,
  ): Promise<VerifiedAccessClaims>;
}
