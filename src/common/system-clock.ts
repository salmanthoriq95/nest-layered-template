import { performance } from "node:perf_hooks";
import { ClockContract } from "./clock.contract.js";

export class SystemClock implements ClockContract {
  epochMs(): number {
    return Date.now();
  }

  monotonicMs(): number {
    return performance.now();
  }
}
