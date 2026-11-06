import type { LogEvent } from "../logging/log-event.js";

export abstract class ErrorStoreContract {
  abstract initialize(): Promise<void>;
  abstract append(
    input: Readonly<{ event: LogEvent; receivedAtMs: number }>,
  ): Promise<void>;
  abstract prune(): Promise<void>;
}
