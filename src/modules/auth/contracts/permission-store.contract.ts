import type { AccessSnapshot } from "./auth.types.js";

export abstract class PermissionStoreContract {
  abstract findByUserId(userId: string): AccessSnapshot | undefined;
}
