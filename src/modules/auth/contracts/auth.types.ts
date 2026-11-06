export type Role = "admin" | "superadmin";

export type SessionIdentity = Readonly<{
  userId: string;
  sessionId: string;
}>;

export type VerifiedAccessClaims = SessionIdentity &
  Readonly<{ issuedAtSeconds: number; expiresAtSeconds: number }>;

export type LoginInput = Readonly<{ username: string; password: string }>;
export type RefreshInput = Readonly<{ refreshToken: string }>;
export type TokenResult = Readonly<{
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}>;

export type UserCredentials = Readonly<{
  userId: string;
  username: string;
  passwordHash: string;
}>;

export type AccessSnapshot = Readonly<{
  userId: string;
  role: Role;
  grants: readonly string[];
}>;

export type SessionSnapshot = SessionIdentity &
  Readonly<{ expiresAtMs: number; revoked: boolean }>;
