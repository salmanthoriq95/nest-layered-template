import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { z } from "zod";
import { LoggingContract } from "./logging.contract.js";
import {
  logEventSchema,
  stripDevelopmentContext,
} from "./log-event.js";
import type { LogEvent } from "./log-event.js";
import { SafeDiagnostics } from "./safe-diagnostics.js";

const acknowledgment = z.object({
  success: z.literal(true),
  data: z.object({ accepted: z.literal(true) }),
});

export class HttpLoggingAdapter implements LoggingContract {
  private readonly queue: LogEvent[] = [];
  private readonly active = new Set<AbortController>();
  private readonly waiters = new Set<() => void>();
  private closing = false;

  constructor(
    private readonly settings: Readonly<{
      url: string;
      token: string;
      timeoutMs: number;
      concurrency: number;
      capacity: number;
      maxBytes: number;
      shutdownMs: number;
      development: boolean;
    }>,
    private readonly diagnostics: SafeDiagnostics,
  ) {}

  emit(event: LogEvent): void {
    const parsed = logEventSchema.safeParse(event);
    if (!parsed.success) return this.diagnostics.report("INVALID_EVENT");
    const safe = stripDevelopmentContext(parsed.data, this.settings.development);
    if (Buffer.byteLength(JSON.stringify(safe)) > this.settings.maxBytes) {
      return this.diagnostics.report("EVENT_TOO_LARGE");
    }
    if (this.closing || this.queue.length >= this.settings.capacity) {
      return this.diagnostics.report("QUEUE_FULL");
    }
    this.queue.push(safe);
    this.drain();
  }

  async close(): Promise<void> {
    this.closing = true;
    if (!this.active.size && !this.queue.length) return;
    let timeout: NodeJS.Timeout | undefined;
    await Promise.race([
      new Promise<void>((resolve) => this.waiters.add(resolve)),
      new Promise<void>((resolve) => {
        timeout = setTimeout(() => {
          this.diagnostics.report(
            "SHUTDOWN_TIMEOUT",
            this.queue.length + this.active.size,
          );
          this.queue.length = 0;
          for (const controller of this.active) controller.abort();
          resolve();
        }, this.settings.shutdownMs);
      }),
    ]);
    if (timeout) clearTimeout(timeout);
    this.waiters.clear();
  }

  private drain(): void {
    while (
      this.queue.length &&
      this.active.size < this.settings.concurrency
    ) {
      const event = this.queue.shift();
      if (!event) break;
      const controller = new AbortController();
      this.active.add(controller);
      void this.send(event, controller)
        .catch(() => this.diagnostics.report("DELIVERY_FAILED"))
        .finally(() => {
          this.active.delete(controller);
          this.drain();
          if (!this.active.size && !this.queue.length) {
            for (const resolve of this.waiters) resolve();
          }
        });
    }
  }

  private send(event: LogEvent, controller: AbortController): Promise<void> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => controller.abort(), this.settings.timeoutMs);
      const payload = JSON.stringify(event);
      const url = new URL(this.settings.url);
      const request = (url.protocol === "https:" ? httpsRequest : httpRequest)(
        url,
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            authorization: "Bearer " + this.settings.token,
            "content-type": "application/json",
            "content-length": Buffer.byteLength(payload),
          },
        },
        (response) => {
          const chunks: Buffer[] = [];
          let bytes = 0;
          response.on("data", (chunk: Buffer) => {
            bytes += chunk.length;
            if (bytes > 4096) controller.abort();
            else chunks.push(chunk);
          });
          response.on("error", (error) => {
            clearTimeout(timer);
            reject(error);
          });
          response.on("end", () => {
            clearTimeout(timer);
            try {
              const raw: unknown = JSON.parse(Buffer.concat(chunks).toString());
              if (
                response.statusCode !== 202 ||
                !acknowledgment.safeParse(raw).success
              ) {
                reject(new Error("Log delivery rejected"));
              } else resolve();
            } catch {
              reject(new Error("Invalid log acknowledgment"));
            }
          });
        },
      );
      request.on("error", reject);
      request.end(payload);
      // Every settlement releases the total-attempt deadline.
      const finish = () => clearTimeout(timer);
      request.on("error", finish);
      request.on("close", finish);
    });
  }
}
