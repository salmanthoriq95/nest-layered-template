import { ClockContract } from "../../common/clock.contract.js";
import { SessionStoreContract } from "./contracts/session-store.contract.js";
import { SlidingWindow } from "./sliding-window.js";

export class AuthCleanup {
  private timer?: NodeJS.Timeout;
  private stopped = false;

  constructor(
    private readonly sessions: SessionStoreContract,
    private readonly limiter: SlidingWindow,
    private readonly clock: ClockContract,
    private readonly delayMs: number,
    private readonly windows: Readonly<Record<string, number>>,
  ) {}

  start(): void {
    if (this.timer || this.stopped) return;
    this.timer = setTimeout(() => {
      this.timer = undefined;
      if (this.stopped) return;
      this.sessions.removeExpired(this.clock.epochMs());
      this.limiter.cleanup(this.windows);
      this.start();
    }, this.delayMs);
    this.timer.unref();
  }

  stop(): void {
    this.stopped = true;
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }
}
