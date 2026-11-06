import { ClockContract } from "../../common/clock.contract.js";

export class SlidingWindow {
  private readonly entries = new Map<string, number[]>();

  constructor(private readonly clock: ClockContract) {}

  admit(input: {
    scope: string;
    clientIp: string;
    maximum: number;
    windowMs: number;
  }): { allowed: true } | { allowed: false; retryAfter: number } {
    const now = this.clock.monotonicMs();
    const key = input.scope + "\0" + input.clientIp;
    const times = (this.entries.get(key) ?? []).filter(
      (time) => time > now - input.windowMs,
    );
    if (times.length >= input.maximum) {
      this.entries.set(key, times);
      return {
        allowed: false,
        retryAfter: Math.max(
          1,
          Math.ceil((times[0] + input.windowMs - now) / 1000),
        ),
      };
    }
    times.push(now);
    this.entries.set(key, times);
    return { allowed: true };
  }

  cleanup(windows: Readonly<Record<string, number>>): void {
    const now = this.clock.monotonicMs();
    for (const [key, times] of this.entries) {
      const windowMs = windows[key.split("\0")[0]];
      if (windowMs === undefined) continue;
      const active = times.filter((time) => time > now - windowMs);
      if (active.length) this.entries.set(key, active);
      else this.entries.delete(key);
    }
  }
}
