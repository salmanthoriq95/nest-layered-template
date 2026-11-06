import type { LogEvent } from "../logging/log-event.js";
import { SafeDiagnostics } from "../logging/safe-diagnostics.js";
import { ErrorStoreContract } from "./error-store.contract.js";
import { ClockContract } from "../common/clock.contract.js";

export class LoggingWorkerService {
  private readonly queue: { event: LogEvent; receivedAtMs: number }[] = [];
  private busy = false;
  private closing = false;
  private readonly waiters = new Set<() => void>();

  constructor(
    private readonly files: ErrorStoreContract,
    private readonly diagnostics: SafeDiagnostics,
    private readonly capacity: number,
    private readonly shutdownMs: number,
    private readonly clock: ClockContract,
  ) {}

  enqueue(event: LogEvent): boolean {
    if (this.closing || this.queue.length >= this.capacity) return false;
    this.queue.push({ event, receivedAtMs: this.clock.epochMs() });
    void this.drain();
    return true;
  }

  async close(): Promise<void> {
    this.closing = true;
    if (!this.busy && !this.queue.length) return;
    let timer: NodeJS.Timeout | undefined;
    await Promise.race([
      new Promise<void>((resolve) => this.waiters.add(resolve)),
      new Promise<void>((resolve) => {
        timer = setTimeout(() => {
          this.diagnostics.report(
            "SHUTDOWN_TIMEOUT",
            this.queue.length + Number(this.busy),
          );
          this.queue.length = 0;
          resolve();
        }, this.shutdownMs);
      }),
    ]);
    if (timer) clearTimeout(timer);
    this.waiters.clear();
  }

  private async drain(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      while (this.queue.length) {
        const entry = this.queue.shift();
        if (!entry) break;
        const { event, receivedAtMs } = entry;
        const { exception: _exception, ...consoleEvent } = event;
        try {
          await new Promise<void>((resolve, reject) => {
            process.stdout.write(
              JSON.stringify(consoleEvent) + "\n",
              (error) => error ? reject(error) : resolve(),
            );
          });
        } catch {
          this.diagnostics.report("CONSOLE_WRITE_FAILED");
        }
        if (event.unexpected) {
          try {
            await this.files.append({ event, receivedAtMs });
          } catch {
            this.diagnostics.report("FILE_WRITE_FAILED");
          }
        }
      }
    } finally {
      this.busy = false;
      for (const resolve of this.waiters) resolve();
    }
  }
}
