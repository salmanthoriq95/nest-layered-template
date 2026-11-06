import { ClockContract } from "../common/clock.contract.js";

export class SafeDiagnostics {
  private lastOutput = Number.NEGATIVE_INFINITY;
  private readonly counts: Record<string, number> = {};

  constructor(private readonly clock: ClockContract) {}

  report(reason: string, count = 1): void {
    this.counts[reason] = (this.counts[reason] ?? 0) + count;
    const now = this.clock.monotonicMs();
    if (now - this.lastOutput < 10000) return;
    this.lastOutput = now;
    process.stderr.write(
      JSON.stringify({ kind: "logging_failure", counts: this.counts }) + "\n",
    );
    for (const key of Object.keys(this.counts)) delete this.counts[key];
  }
}
