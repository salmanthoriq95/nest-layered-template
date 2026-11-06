import { PermissionStoreContract } from "../contracts/permission-store.contract.js";
import type { AccessSnapshot } from "../contracts/auth.types.js";
import { InMemoryAccounts } from "./in-memory-accounts.js";

export class InMemoryPermissionStore implements PermissionStoreContract {
  constructor(private readonly accounts: InMemoryAccounts) {}

  findByUserId(userId: string): AccessSnapshot | undefined {
    const account = this.accounts.records.find(
      (record) => record.userId === userId,
    );
    return account
      ? {
          userId: account.userId,
          role: account.role,
          grants: [...account.grants],
        }
      : undefined;
  }
}
