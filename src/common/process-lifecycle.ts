import { StartupConfigurationError } from "../config/settings.js";

export function installFatalHandlers(): void {
  const fatal = () => {
    process.stderr.write('{"kind":"fatal","reason":"UNEXPECTED_PROCESS_FAULT"}\n');
    process.exit(1);
  };
  process.on("uncaughtException", fatal);
  process.on("unhandledRejection", fatal);
}

export function startupFailed(error: unknown): void {
  process.stderr.write(JSON.stringify({
    kind: "startup_failure",
    reason: error instanceof StartupConfigurationError
      ? "INVALID_CONFIGURATION" : "STARTUP_FAILED",
    ...(error instanceof StartupConfigurationError
      ? { settings: error.fields } : {}),
  }) + "\n");
  process.exit(1);
}

export function installShutdown(
  timeoutMs: number,
  close: () => Promise<void>,
): void {
  let closing = false;
  const stop = () => {
    if (closing) return;
    closing = true;
    const timeout = setTimeout(() => {
      process.stderr.write('{"kind":"shutdown","reason":"DRAIN_TIMEOUT"}\n');
      process.exit(1);
    }, timeoutMs);
    void close().then(() => {
      clearTimeout(timeout);
      process.exit(0);
    }).catch(() => {
      clearTimeout(timeout);
      process.stderr.write('{"kind":"shutdown","reason":"SHUTDOWN_FAILED"}\n');
      process.exit(1);
    });
  };
  process.once("SIGTERM", stop);
  process.once("SIGINT", stop);
}
