import type { LogEvent } from "./log-event.js";

export abstract class LoggingContract {
  abstract emit(event: LogEvent): void;
  abstract close(): Promise<void>;
}
