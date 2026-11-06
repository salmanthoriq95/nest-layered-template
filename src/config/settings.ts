import { isIP } from "node:net";
import { z } from "zod";

export type ProcessRole = "api" | "worker";

const integer = (fallback: number, maximum = Number.MAX_SAFE_INTEGER) =>
  z
    .string()
    .regex(/^[0-9]+$/)
    .default(String(fallback))
    .transform(Number)
    .refine((value) => Number.isSafeInteger(value) && value > 0 && value <= maximum);

const seconds = (fallback: number, maximum = Number.MAX_SAFE_INTEGER / 1000) =>
  integer(fallback, Math.floor(maximum));
const key = z.string().regex(/^[0-9a-fA-F]{64}$/);
const commonSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("production"),
  LOG_WORKER_TOKEN: key,
  LOG_QUEUE_CAPACITY: integer(100),
  LOG_MAX_EVENT_BYTES: integer(16384),
  LOG_SHUTDOWN_TIMEOUT_MS: integer(5000, 2147483647),
});

const apiSchema = commonSchema.extend({
  HOST: z.string().default("127.0.0.1"),
  PORT: integer(3000, 65535),
  JWT_SIGNING_KEY: key,
  JWT_ACCESS_TTL_SECONDS: seconds(900),
  AUTH_REFRESH_TTL_SECONDS: seconds(604800),
  JWT_ISSUER: z.string().min(1).default("nest-layered-template"),
  JWT_AUDIENCE: z.string().min(1).default("nest-layered-template-api"),
  AUTH_LOGIN_RATE_LIMIT_MAX_REQUESTS: integer(5),
  AUTH_LOGIN_RATE_LIMIT_WINDOW_SECONDS: seconds(60),
  AUTH_REFRESH_RATE_LIMIT_MAX_REQUESTS: integer(30),
  AUTH_REFRESH_RATE_LIMIT_WINDOW_SECONDS: seconds(60),
  AUTH_CLEANUP_INTERVAL_SECONDS: seconds(60, 2147483647 / 1000),
  SWAGGER_RATE_LIMIT_MAX_REQUESTS: integer(60),
  SWAGGER_RATE_LIMIT_WINDOW_SECONDS: seconds(60),
  TRUSTED_PROXY_ADDRESSES: z.string().default(""),
  SWAGGER_ENABLED: z.enum(["true", "false"]).default("false"),
  SWAGGER_USERNAME: z.string().optional(),
  SWAGGER_PASSWORD_HASH: z.string().optional(),
  LOG_WORKER_URL: z
    .string()
    .default("http://127.0.0.1:3001/internal/logs")
    .refine((value) => {
      try {
        const url = new URL(value);
        return (
          ["http:", "https:"].includes(url.protocol) &&
          !url.username &&
          !url.password &&
          !url.search &&
          !url.hash &&
          url.pathname === "/internal/logs"
        );
      } catch {
        return false;
      }
    }),
  LOG_WORKER_TIMEOUT_MS: integer(1000, 2147483647),
  LOG_WORKER_MAX_CONCURRENT_REQUESTS: integer(10),
});

const workerSchema = commonSchema.extend({
  LOG_WORKER_HOST: z.string().default("127.0.0.1"),
  LOG_WORKER_PORT: integer(3001, 65535),
  LOG_ERROR_DIRECTORY: z.string().min(1).default("./logs/errors"),
  LOG_ERROR_RETENTION_DAYS: integer(7),
  LOG_ERROR_MAX_FILE_BYTES: integer(10485760),
});

export type ApiSettings = z.output<typeof apiSchema>;
export type WorkerSettings = z.output<typeof workerSchema>;
export type CommonSettings = z.output<typeof commonSchema>;

export class StartupConfigurationError extends Error {
  constructor(readonly fields: readonly string[]) {
    super("Invalid configuration: " + fields.join(", "));
  }
}

export function trustedProxies(raw: string): string[] {
  if (raw === "") return [];
  return raw.split(",").map((item) => {
    const value = item.trim();
    const parts = value.split("/");
    const version = isIP(parts[0]);
    if (
      !version ||
      parts.length > 2 ||
      (parts.length === 2 &&
        (!/^\d+$/.test(parts[1]) ||
          Number(parts[1]) < 1 ||
          Number(parts[1]) > (version === 4 ? 32 : 128)))
    ) {
      throw new StartupConfigurationError(["TRUSTED_PROXY_ADDRESSES"]);
    }
    return value;
  });
}

export function parseApiSettings(raw: Record<string, unknown>): ApiSettings {
  const result = apiSchema.safeParse(raw);
  if (!result.success) {
    throw new StartupConfigurationError(
      [...new Set(result.error.issues.map((issue) => String(issue.path[0])))],
    );
  }
  const value = result.data;
  trustedProxies(value.TRUSTED_PROXY_ADDRESSES);
  if (
    value.SWAGGER_ENABLED === "true" &&
    (!value.SWAGGER_USERNAME ||
      value.SWAGGER_USERNAME.includes(":") ||
      Buffer.byteLength(value.SWAGGER_USERNAME) > 64 ||
      !/^\$2[ab]\$(1\d|2\d|3[01])\$[./A-Za-z0-9]{53}$/.test(
        value.SWAGGER_PASSWORD_HASH ?? "",
      ))
  ) {
    throw new StartupConfigurationError([
      "SWAGGER_USERNAME",
      "SWAGGER_PASSWORD_HASH",
    ]);
  }
  return value;
}

export function parseWorkerSettings(raw: Record<string, unknown>): WorkerSettings {
  const result = workerSchema.safeParse(raw);
  if (!result.success) {
    throw new StartupConfigurationError(
      [...new Set(result.error.issues.map((issue) => String(issue.path[0])))],
    );
  }
  return result.data;
}
