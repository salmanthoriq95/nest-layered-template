import { ClockContract } from "../../src/common/clock.contract.js";

export class FakeClock implements ClockContract {
  constructor(public epoch = 1700000000000, public monotonic = 0) {}
  epochMs(): number { return this.epoch; }
  monotonicMs(): number { return this.monotonic; }
  advance(milliseconds: number): void {
    this.epoch += milliseconds;
    this.monotonic += milliseconds;
  }
}
