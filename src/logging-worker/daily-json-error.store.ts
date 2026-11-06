import {
  chmod,
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { ClockContract } from "../common/clock.contract.js";
import { logEventSchema } from "../logging/log-event.js";
import type { LogEvent } from "../logging/log-event.js";
import { ErrorStoreContract } from "./error-store.contract.js";

export class DailyJsonErrorStore implements ErrorStoreContract {
  private pending: Promise<void> = Promise.resolve();

  constructor(
    private readonly directory: string,
    private readonly maxBytes: number,
    private readonly retentionDays: number,
    private readonly clock: ClockContract,
  ) {}

  async initialize(): Promise<void> {
    await mkdir(this.directory, { recursive: true, mode: 0o700 });
    const directory = await lstat(this.directory);
    if (!directory.isDirectory() || directory.isSymbolicLink()) {
      throw new Error("Invalid logging directory");
    }
    await chmod(this.directory, 0o700);
    await this.readDay(this.day());
    const probe = join(this.directory, "." + this.day() + "." + randomUUID() + ".tmp");
    await writeFile(probe, "[]", { flag: "wx", mode: 0o600 });
    await unlink(probe);
    for (const name of await readdir(this.directory)) {
      if (/^\.\d{4}-\d{2}-\d{2}\.[a-f0-9-]+\.tmp$/.test(name)) {
        await unlink(join(this.directory, name));
      }
    }
    await this.prune();
  }

  append(input: { event: LogEvent; receivedAtMs: number }): Promise<void> {
    const { event } = input;
    const receiptDay = new Date(input.receivedAtMs).toISOString().slice(0, 10);
    const work = this.pending.catch(() => {}).then(async () => {
      if (!event.unexpected) return;
      const entries = await this.readDay(receiptDay);
      const payload = JSON.stringify([...entries, event]);
      if (Buffer.byteLength(payload) > this.maxBytes) {
        throw new Error("Daily error file limit reached");
      }
      const temporary = join(
        this.directory,
        "." + receiptDay + "." + randomUUID() + ".tmp",
      );
      try {
        await writeFile(temporary, payload, { mode: 0o600, flag: "wx" });
        await rename(temporary, join(this.directory, receiptDay + ".json"));
      } catch (error) {
        await unlink(temporary).catch(() => {});
        throw error;
      }
    });
    this.pending = work;
    return work;
  }

  prune(): Promise<void> {
    const work = this.pending.catch(() => {}).then(async () => {
      const today = Date.parse(this.day() + "T00:00:00.000Z");
      const first = today - (this.retentionDays - 1) * 86400000;
      for (const name of await readdir(this.directory)) {
        if (!/^\d{4}-\d{2}-\d{2}\.json$/.test(name)) continue;
        const date = Date.parse(name.slice(0, 10) + "T00:00:00.000Z");
        if (
          Number.isFinite(date) &&
          new Date(date).toISOString().slice(0, 10) === name.slice(0, 10) &&
          date < first
        ) {
          const entry = await lstat(join(this.directory, name));
          if (entry.isFile() && !entry.isSymbolicLink()) {
            await unlink(join(this.directory, name));
          }
        }
      }
    });
    this.pending = work;
    return work;
  }

  private day(): string {
    return new Date(this.clock.epochMs()).toISOString().slice(0, 10);
  }

  private async readDay(day: string): Promise<LogEvent[]> {
    const filename = join(this.directory, day + ".json");
    let info;
    try {
      info = await lstat(filename);
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "ENOENT"
      ) return [];
      throw error;
    }
    if (
      !info.isFile() ||
      info.isSymbolicLink() ||
      info.size > this.maxBytes
    ) throw new Error("Invalid daily error file");
    await chmod(filename, 0o600);
    const raw: unknown = JSON.parse(await readFile(filename, "utf8"));
    if (!Array.isArray(raw)) throw new Error("Invalid daily error array");
    return raw.map((item: unknown) => {
      const event = logEventSchema.parse(item);
      if (!event.unexpected) throw new Error("Invalid persisted log record");
      return event;
    });
  }
}
