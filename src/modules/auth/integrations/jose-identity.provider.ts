import { SignJWT, jwtVerify, errors } from "jose";
import { z } from "zod";
import { ApplicationError, unauthenticated } from "../../../application/application-error.js";
import { ClockContract } from "../../../common/clock.contract.js";
import { IdentityProviderContract } from "../contracts/identity-provider.contract.js";
import type { IssueAccessTokenInput } from "../contracts/identity-provider.contract.js";
import type { VerifiedAccessClaims } from "../contracts/auth.types.js";

const claimsSchema = z.object({
  sub: z.uuidv4(),
  sid: z.uuidv4(),
  iat: z.number().int().nonnegative(),
  exp: z.number().int().positive(),
});

export class JoseIdentityProvider implements IdentityProviderContract {
  private readonly key: Uint8Array;

  constructor(
    private readonly clock: ClockContract,
    private readonly settings: Readonly<{
      signingKey: string;
      issuer: string;
      audience: string;
    }>,
  ) {
    this.key = Buffer.from(settings.signingKey, "hex");
  }

  issueAccessToken(input: IssueAccessTokenInput): Promise<string> {
    return new SignJWT({ sid: input.sessionId })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setSubject(input.userId)
      .setIssuer(this.settings.issuer)
      .setAudience(this.settings.audience)
      .setIssuedAt(input.issuedAtSeconds)
      .setExpirationTime(input.expiresAtSeconds)
      .sign(this.key);
  }

  async verifyAccessToken(input: {
    token: string;
  }): Promise<VerifiedAccessClaims> {
    try {
      const result = await jwtVerify(input.token, this.key, {
        algorithms: ["HS256"],
        typ: "JWT",
        issuer: this.settings.issuer,
        audience: this.settings.audience,
        requiredClaims: ["sub", "sid", "iat", "exp"],
        currentDate: new Date(this.clock.epochMs()),
      });
      if (result.protectedHeader.typ !== "JWT") throw unauthenticated();
      const claims = claimsSchema.parse(result.payload);
      if (
        claims.exp <= claims.iat ||
        claims.iat > Math.floor(this.clock.epochMs() / 1000)
      ) {
        throw unauthenticated();
      }
      return {
        userId: claims.sub,
        sessionId: claims.sid,
        issuedAtSeconds: claims.iat,
        expiresAtSeconds: claims.exp,
      };
    } catch (error) {
      if (
        error instanceof errors.JOSEError ||
        error instanceof z.ZodError ||
        error instanceof ApplicationError
      ) throw unauthenticated();
      throw error;
    }
  }
}
