import type { Role } from "../contracts/auth.types.js";

export type DemoAccount = Readonly<{
  userId: string;
  username: string;
  passwordHash: string;
  role: Role;
  grants: readonly string[];
}>;

// Generate once with the reviewed fixture script after execution approval.
// Pending hashes intentionally fail startup rather than becoming credentials.
export const DEMO_ACCOUNTS: readonly DemoAccount[] = [
  {
    userId: "PENDING_APPROVED_GENERATION",
    username: "superadmin",
    passwordHash: "PENDING_APPROVED_GENERATION",
    role: "superadmin",
    grants: [],
  },
  {
    userId: "PENDING_APPROVED_GENERATION",
    username: "admin",
    passwordHash: "PENDING_APPROVED_GENERATION",
    role: "admin",
    grants: ["examples:read"],
  },
];
