import { UserStoreContract } from "../contracts/user-store.contract.js";
import type { UserCredentials } from "../contracts/auth.types.js";
import { InMemoryAccounts } from "./in-memory-accounts.js";

export class InMemoryUserStore implements UserStoreContract {
  constructor(private readonly accounts: InMemoryAccounts) {}

  findByUsername(username: string): UserCredentials | undefined {
    const account = this.accounts.records.find(
      (record) => record.username === username,
    );
    return account
      ? {
          userId: account.userId,
          username: account.username,
          passwordHash: account.passwordHash,
        }
      : undefined;
  }
}
