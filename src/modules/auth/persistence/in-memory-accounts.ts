import type { DemoAccount } from "./demo-accounts.fixture.js";
import { DEMO_ACCOUNTS } from "./demo-accounts.fixture.js";

export class InMemoryAccounts {
  readonly records: readonly DemoAccount[];

  constructor(records: readonly DemoAccount[] = DEMO_ACCOUNTS) {
    const ids = new Set<string>();
    for (const account of records) {
      if (
        !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
          account.userId,
        ) ||
        !/^\$2[ab]\$(1\d|2\d|3[01])\$[./A-Za-z0-9]{53}$/.test(account.passwordHash) ||
        ids.has(account.userId)
      ) {
        throw new Error("Demo fixture generation is required");
      }
      ids.add(account.userId);
    }
    this.records = records.map((record) => ({
      ...record,
      grants: [...record.grants],
    }));
  }
}
