import { z } from "zod";

export const ROUTES = [
  "/health",
  "/auth/login",
  "/auth/refresh",
  "/auth/logout",
  "/examples/public",
  "/examples/admin",
  "/examples/superadmin",
  "/internal/logs",
  "/docs/*",
  "unmatched",
] as const;

export const exceptionSchema = z.strictObject({
  name: z.enum([
    "Error",
    "TypeError",
    "SyntaxError",
    "RangeError",
    "ReferenceError",
    "URIError",
    "EvalError",
    "AggregateError",
  ]),
  message: z.literal("Unexpected application error"),
  stackFrames: z.array(
    z.string().regex(/^(?:file:\/\/)?\/[^()\s?#]+:\d+:\d+$/)
      .refine((value) => Buffer.byteLength(value) <= 512),
  ).max(12),
}).refine((value) => Buffer.byteLength(JSON.stringify(value)) <= 8192);

export const logEventSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    timestamp: z.iso.datetime(),
    level: z.enum(["info", "warn", "error"]),
    requestId: z.uuidv4(),
    method: z.enum([
      "GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "OTHER",
    ]),
    route: z.enum(ROUTES),
    statusCode: z.number().int().min(100).max(599),
    durationMs: z.number().finite().nonnegative(),
    unexpected: z.boolean(),
    errorCode: z.enum([
      "VALIDATION_ERROR", "UNAUTHENTICATED", "UNAUTHORIZED", "FORBIDDEN",
      "NOT_FOUND", "METHOD_NOT_ALLOWED", "PAYLOAD_TOO_LARGE",
      "UNSUPPORTED_MEDIA_TYPE", "RATE_LIMITED", "LOG_WORKER_UNAVAILABLE",
      "INTERNAL_ERROR", "HTTP_ERROR",
    ]).optional(),
    exception: exceptionSchema.optional(),
    requestContext: z
      .strictObject({
        headers: z.strictObject({
          "content-type": z.enum(["application/json", "other"]),
        }),
      })
      .optional(),
  })
  .refine((event) => {
    const expected = event.statusCode >= 500
      ? "error"
      : event.statusCode >= 400
        ? "warn"
        : "info";
    return (
      event.level === expected &&
      (!event.unexpected || event.level === "error") &&
      (!event.exception || event.unexpected)
    );
  });

export type LogEvent = z.infer<typeof logEventSchema>;

export function stripDevelopmentContext(
  event: LogEvent,
  development: boolean,
): LogEvent {
  if (development) return event;
  const { requestContext: _context, ...safe } = event;
  return safe;
}

export function safeException(error: unknown): LogEvent["exception"] {
  if (!(error instanceof Error)) return undefined;
  const names = exceptionSchema.shape.name.options;
  const name = names.find((value) => value === error.name) ?? "Error";
  const stackFrames = (error.stack ?? "")
    .split("\n")
    .slice(1)
    .flatMap((line) => {
      const match = line.match(/\(?((?:file:\/\/)?\/[^()\s?#]+:\d+:\d+)\)?$/);
      return match && Buffer.byteLength(match[1]) <= 512 ? [match[1]] : [];
    })
    .slice(0, 12);
  return {
    name,
    message: "Unexpected application error",
    stackFrames,
  };
}
