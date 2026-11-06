import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import type { ChildProcess } from "node:child_process";
import { request } from "node:http";
import { createServer } from "node:net";
import { once } from "node:events";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { z } from "zod";

export async function unusedPort(): Promise<number> {
  const server = createServer();
  await new Promise<void>((done) => server.listen(0, "127.0.0.1", done));
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const port = address.port;
  await new Promise<void>((done, reject) => server.close((error) => error ? reject(error) : done()));
  return port;
}

export async function httpCall(
  port: number,
  path: string,
  input: {
    method?: string;
    body?: unknown;
    raw?: string;
    headers?: Record<string, string>;
  } = {},
) {
  const payload = input.raw ?? (input.body === undefined ? undefined : JSON.stringify(input.body));
  return new Promise<{
    status: number;
    headers: import("node:http").IncomingHttpHeaders;
    text: string;
  }>((done, reject) => {
    const call = request({
      hostname: "127.0.0.1", port, path,
      method: input.method ?? "GET",
      agent: false,
      headers: {
        ...(payload !== undefined ? {
          "content-type": "application/json",
          "content-length": String(Buffer.byteLength(payload)),
        } : {}),
        ...input.headers,
      },
    }, (response) => {
      const chunks: Buffer[] = [];
      response.on("data", (chunk: Buffer) => chunks.push(chunk));
      response.on("error", reject);
      response.on("end", () => done({
        status: response.statusCode ?? 0,
        headers: response.headers,
        text: Buffer.concat(chunks).toString("utf8"),
      }));
    });
    call.setTimeout(2000, () => call.destroy(new Error("HTTP test timeout")));
    call.on("error", reject);
    call.end(payload);
  });
}

const envelopeSchema = z.strictObject({
  success: z.boolean(),
  statusCode: z.number().int(),
  message: z.string(),
  data: z.record(z.string(), z.unknown()).nullable(),
  error: z.object({
    code: z.string(),
    details: z.array(z.object({ field: z.string(), code: z.string(), message: z.string() })),
  }).nullable(),
  meta: z.object({ requestId: z.uuidv4(), timestamp: z.iso.datetime() }),
});

export function envelope(response: Awaited<ReturnType<typeof httpCall>>) {
  const raw: unknown = JSON.parse(response.text);
  const result = envelopeSchema.parse(raw);
  assert.equal(result.statusCode, response.status);
  assert.equal(result.success, response.status < 400);
  assert.equal(result.meta.requestId, response.headers["x-request-id"]);
  return result;
}

export const testEnvironment = {
  NODE_ENV: "test",
  HOST: "127.0.0.1",
  LOG_WORKER_HOST: "127.0.0.1",
  JWT_SIGNING_KEY: "a".repeat(64),
  LOG_WORKER_TOKEN: "b".repeat(64),
  JWT_ISSUER: "test-issuer",
  JWT_AUDIENCE: "test-audience",
  JWT_ACCESS_TTL_SECONDS: "900",
  AUTH_REFRESH_TTL_SECONDS: "604800",
  AUTH_LOGIN_RATE_LIMIT_MAX_REQUESTS: "100",
  AUTH_REFRESH_RATE_LIMIT_MAX_REQUESTS: "100",
  AUTH_LOGIN_RATE_LIMIT_WINDOW_SECONDS: "60",
  AUTH_REFRESH_RATE_LIMIT_WINDOW_SECONDS: "60",
  AUTH_CLEANUP_INTERVAL_SECONDS: "60",
  SWAGGER_RATE_LIMIT_MAX_REQUESTS: "100",
  SWAGGER_RATE_LIMIT_WINDOW_SECONDS: "60",
  SWAGGER_ENABLED: "false",
  TRUSTED_PROXY_ADDRESSES: "",
  LOG_WORKER_TIMEOUT_MS: "50",
  LOG_WORKER_MAX_CONCURRENT_REQUESTS: "2",
  LOG_QUEUE_CAPACITY: "100",
  LOG_MAX_EVENT_BYTES: "16384",
  LOG_SHUTDOWN_TIMEOUT_MS: "500",
  LOG_ERROR_RETENTION_DAYS: "7",
  LOG_ERROR_MAX_FILE_BYTES: "10485760",
};

export async function startProcess(
  entry: "main.js" | "logging-worker/main.js",
  environment: Record<string, string>,
  port: number,
) {
  const child = spawn(process.execPath, ["--enable-source-maps", resolve("dist", entry)], {
    env: { ...process.env, ...testEnvironment, ...environment },
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  });
  let stderr = "";
  child.stdout?.resume();
  child.stderr?.on("data", (chunk: Buffer) => {
    if (stderr.length < 16384) stderr += chunk.toString();
  });
  try {
    const deadline = Date.now() + 10000;
    while (Date.now() < deadline) {
      if (child.exitCode !== null || child.signalCode !== null) {
        throw new Error("Test process failed startup; inspect fixture/configuration setup");
      }
      const response = await httpCall(port, "/health").catch(() => undefined);
      if (response?.status === 200) return {
        child, stderr: () => stderr, stop: () => stopProcess(child),
      };
      await delay(30);
    }
    throw new Error("Test process did not become healthy");
  } catch (error) {
    await stopProcess(child);
    throw error;
  }
}

export async function stopProcess(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = once(child, "exit");
  const timeout = setTimeout(() => child.kill("SIGKILL"), 6000);
  child.kill("SIGTERM");
  await exited;
  clearTimeout(timeout);
}
