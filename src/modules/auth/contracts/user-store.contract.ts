import type { UserCredentials } from "./auth.types.js";

export abstract class UserStoreContract {
  abstract findByUsername(username: string): UserCredentials | undefined;
}
