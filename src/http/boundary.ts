import {
  Catch,
  HttpException,
} from "@nestjs/common";
import type {
  ArgumentsHost,
  CallHandler,
  ExecutionContext,
  ExceptionFilter,
  INestApplication,
  NestInterceptor,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { isIP } from "node:net";
import express from "express";
import type { Express, NextFunction, Response } from "express";
import { map } from "rxjs";
import { ApplicationError } from "../application/application-error.js";
import { ClockContract } from "../common/clock.contract.js";
import { LoggingContract } from "../logging/logging.contract.js";
import { ROUTES, safeException } from "../logging/log-event.js";
import type { LogEvent } from "../logging/log-event.js";
import type { HttpRequest } from "./request-state.js";
import { assertEmptyInput } from "./validation.js";

const STATUSES: Readonly<Record<string, number>> = {
  VALIDATION_ERROR: 400,
  UNAUTHENTICATED: 401,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  PAYLOAD_TOO_LARGE: 413,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RATE_LIMITED: 429,
  LOG_WORKER_UNAVAILABLE: 503,
};

const ROUTE_METHODS: Readonly<Record<string, string>> = {
  "/health": "GET",
  "/auth/login": "POST",
  "/auth/refresh": "POST",
  "/auth/logout": "POST",
  "/examples/public": "GET",
  "/examples/admin": "GET",
  "/examples/superadmin": "GET",
  "/internal/logs": "POST",
};

const MESSAGES: Readonly<Record<string, string>> = {
  "/health": "Service is running",
  "/auth/login": "Signed in",
  "/auth/refresh": "Token refreshed",
  "/auth/logout": "Logged out",
  "/internal/logs": "Log accepted",
};

export function routeLabel(request: HttpRequest): LogEvent["route"] {
  if (request.path === "/docs" || request.path.startsWith("/docs/")) {
    return "/docs/*";
  }
  return ROUTES.find((value) => value === request.route?.path) ?? "unmatched";
}

export function canonicalIp(raw: string | undefined): string {
  if (!raw) return "unknown";
  if (isIP(raw) === 4) return raw;
  if (isIP(raw) !== 6) return "unknown";
  let normalized: string;
  try {
    normalized = new URL("http://[" + raw + "]").hostname.slice(1, -1);
  } catch {
    return "unknown";
  }
  const mapped = normalized.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/);
  if (mapped) {
    const high = parseInt(mapped[1], 16);
    const low = parseInt(mapped[2], 16);
    return [high >> 8, high & 255, low >> 8, low & 255].join(".");
  }
  return normalized;
}

export class HttpBoundary {
  constructor(
    private readonly clock: ClockContract,
    private readonly logging: LoggingContract,
    private readonly development: boolean,
  ) {}

  envelope(
    request: HttpRequest,
    statusCode: number,
    message: string,
    data: unknown,
    error: unknown = null,
  ): unknown {
    return {
      success: statusCode < 400,
      statusCode,
      message,
      data,
      error,
      meta: {
        requestId: request.state?.requestId ?? randomUUID(),
        timestamp: new Date(this.clock.epochMs()).toISOString(),
      },
    };
  }

  respondError(
    error: unknown,
    request: HttpRequest,
    response: Response,
  ): void {
    if (response.headersSent) return;
    let status = 500;
    let code = "INTERNAL_ERROR";
    let message = "Unexpected application error";
    let details: ApplicationError["details"] = [];
    let unexpected = true;
    if (error instanceof ApplicationError) {
      status = STATUSES[error.code] ?? 500;
      code = error.code;
      message = error.safeMessage;
      details = error.details;
      unexpected = false;
    } else if (error instanceof HttpException && error.getStatus() < 500) {
      status = error.getStatus();
      code = status === 404 ? "NOT_FOUND" : "HTTP_ERROR";
      message = status === 404 ? "Route not found" : "Request rejected";
      unexpected = false;
    } else if (error instanceof URIError && "status" in error && error.status === 400) {
      status = 400; code = "VALIDATION_ERROR"; message = "Request validation failed"; unexpected = false;
    } else if (error instanceof Error && "type" in error) {
      const type: unknown = error.type;
      if (type === "entity.parse.failed") {
        status = 400; code = "VALIDATION_ERROR"; message = "Request validation failed"; unexpected = false;
      } else if (type === "entity.too.large") {
        status = 413; code = "PAYLOAD_TOO_LARGE"; message = "Request body too large"; unexpected = false;
      } else if (type === "encoding.unsupported" || type === "charset.unsupported") {
        status = 415; code = "UNSUPPORTED_MEDIA_TYPE"; message = "Unsupported request encoding"; unexpected = false;
      }
    }
    if (request.state) {
      request.state.errorCode = code;
      request.state.unexpected = unexpected;
      if (unexpected) request.state.exception = safeException(error);
    }
    response.setHeader("Cache-Control", "no-store");
    if (status === 401 && !response.hasHeader("WWW-Authenticate")) {
      response.setHeader("WWW-Authenticate", "Bearer");
    }
    response.status(status).json(
      this.envelope(request, status, message, null, { code, details }),
    );
  }

  installEarlyMiddleware(app: INestApplication): void {
    app.use((request: HttpRequest, response: Response, next: NextFunction) => {
      request.state = {
        requestId: randomUUID(),
        startedAtMs: this.clock.monotonicMs(),
        unexpected: false,
      };
      response.setHeader("X-Request-Id", request.state.requestId);
      response.on("finish", () => {
        const state = request.state;
        if (!state) return;
        const method = [
          "GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS",
        ].includes(request.method) ? request.method as LogEvent["method"] : "OTHER";
        const statusCode = response.statusCode;
        const event: LogEvent = {
          schemaVersion: 1,
          timestamp: new Date(this.clock.epochMs()).toISOString(),
          level: statusCode >= 500 ? "error" : statusCode >= 400 ? "warn" : "info",
          requestId: state.requestId,
          method,
          route: routeLabel(request),
          statusCode,
          durationMs: Math.max(0, this.clock.monotonicMs() - state.startedAtMs),
          unexpected: state.unexpected,
          ...(state.errorCode ? { errorCode: state.errorCode } : {}),
          ...(state.exception ? { exception: state.exception } : {}),
        };
        if (this.development && request.headers["content-type"]) {
          event.requestContext = {
            headers: {
              "content-type": request.headers["content-type"]
                .split(";")[0].trim().toLowerCase() === "application/json"
                ? "application/json" : "other",
            },
          };
        }
        this.logging.emit(event);
      });
      next();
    });
  }

  installParser(app: INestApplication, maxBytes: number): void {
    app.use((request: HttpRequest, response: Response, next: NextFunction) => {
      const expected = ROUTE_METHODS[request.path];
      if (
        expected &&
        request.method !== expected &&
        !(expected === "GET" && request.method === "HEAD")
      ) {
        response.setHeader("Allow", expected === "GET" ? "GET, HEAD" : expected);
        return this.respondError(
          new ApplicationError("METHOD_NOT_ALLOWED", "Method not allowed"),
          request, response,
        );
      }
      const hasBody =
        Number(request.headers["content-length"] ?? 0) > 0 ||
        request.headers["transfer-encoding"] !== undefined;
      if (
        hasBody &&
        (request.headers["content-type"]?.split(";")[0].trim().toLowerCase() !== "application/json" ||
          (request.headers["content-encoding"] !== undefined &&
            request.headers["content-encoding"] !== "identity"))
      ) {
        return this.respondError(
          new ApplicationError("UNSUPPORTED_MEDIA_TYPE", "JSON body required"),
          request, response,
        );
      }
      next();
    });
    app.use(express.json({ limit: maxBytes, inflate: false }));
    app.useGlobalFilters(new BoundaryExceptionFilter(this));
    app.useGlobalInterceptors(new EnvelopeInterceptor(this));
  }

  installParserErrorHandler(app: INestApplication): void {
    const server: Express = app.getHttpAdapter().getInstance();
    server.use((
      error: unknown,
      request: HttpRequest,
      response: Response,
      _next: NextFunction,
    ) => this.respondError(error, request, response));
  }
}

@Catch()
class BoundaryExceptionFilter implements ExceptionFilter {
  constructor(private readonly boundary: HttpBoundary) {}
  catch(error: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    this.boundary.respondError(
      error, http.getRequest<HttpRequest>(), http.getResponse<Response>(),
    );
  }
}

class EnvelopeInterceptor implements NestInterceptor {
  constructor(private readonly boundary: HttpBoundary) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp();
    const request = http.getRequest<HttpRequest>();
    const response = http.getResponse<Response>();
    assertEmptyInput(request.query, "query");
    if (!["/auth/login", "/auth/refresh", "/internal/logs"].includes(request.route?.path)) {
      assertEmptyInput(request.body, "body");
    }
    response.setHeader("Cache-Control", "no-store");
    return next.handle().pipe(map((data: unknown) => this.boundary.envelope(
      request, response.statusCode,
      MESSAGES[request.route?.path] ?? "Access granted", data,
    )));
  }
}
