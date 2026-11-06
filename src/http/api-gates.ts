import type { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import type { NextFunction, Response } from "express";
import { ApplicationError } from "../application/application-error.js";
import type { ApiSettings } from "../config/settings.js";
import { PasswordVerifierContract } from "../modules/auth/contracts/password-verifier.contract.js";
import { SlidingWindow } from "../modules/auth/sliding-window.js";
import { canonicalIp, HttpBoundary } from "./boundary.js";
import type { HttpRequest } from "./request-state.js";

export function installRateLimits(
  app: INestApplication,
  settings: ApiSettings,
  limiter: SlidingWindow,
  boundary: HttpBoundary,
): void {
  app.use((request: HttpRequest, response: Response, next: NextFunction) => {
    let scope: string | undefined;
    let maximum = 0;
    let windowMs = 0;
    if (request.method === "POST" && request.path === "/auth/login") {
      scope = "login";
      maximum = settings.AUTH_LOGIN_RATE_LIMIT_MAX_REQUESTS;
      windowMs = settings.AUTH_LOGIN_RATE_LIMIT_WINDOW_SECONDS * 1000;
    } else if (request.method === "POST" && request.path === "/auth/refresh") {
      scope = "refresh";
      maximum = settings.AUTH_REFRESH_RATE_LIMIT_MAX_REQUESTS;
      windowMs = settings.AUTH_REFRESH_RATE_LIMIT_WINDOW_SECONDS * 1000;
    } else if (
      settings.SWAGGER_ENABLED === "true" &&
      (request.path === "/docs" || request.path.startsWith("/docs/"))
    ) {
      scope = "swagger";
      maximum = settings.SWAGGER_RATE_LIMIT_MAX_REQUESTS;
      windowMs = settings.SWAGGER_RATE_LIMIT_WINDOW_SECONDS * 1000;
    }
    if (!scope) return next();
    const result = limiter.admit({
      scope,
      clientIp: canonicalIp(request.ip ?? request.socket.remoteAddress),
      maximum,
      windowMs,
    });
    if (result.allowed) return next();
    response.setHeader("Retry-After", result.retryAfter);
    boundary.respondError(
      new ApplicationError("RATE_LIMITED", "Too many requests"), request, response,
    );
  });
}

export function installSwagger(
  app: INestApplication,
  settings: ApiSettings,
  passwords: PasswordVerifierContract,
  boundary: HttpBoundary,
): void {
  if (settings.SWAGGER_ENABLED !== "true") return;
  app.use((request: HttpRequest, response: Response, next: NextFunction) => {
    if (request.path !== "/docs" && !request.path.startsWith("/docs/")) return next();
    void (async () => {
      const header = request.headers.authorization ?? "";
      let username = "";
      let password = "";
      if (header.length <= 1024 && /^Basic [A-Za-z0-9+/]+={0,2}$/i.test(header)) {
        const encoded = header.slice(6);
        const decoded = Buffer.from(encoded, "base64");
        if (decoded.toString("base64").replace(/=+$/, "") === encoded.replace(/=+$/, "")) {
          const text = decoded.toString("utf8");
          if (Buffer.from(text).equals(decoded)) {
            const separator = text.indexOf(":");
            if (separator >= 0) {
              username = text.slice(0, separator);
              password = text.slice(separator + 1);
            }
          }
        }
      }
      if (
        username !== settings.SWAGGER_USERNAME ||
        !password ||
        !(await passwords.verify({
          password,
          passwordHash: settings.SWAGGER_PASSWORD_HASH ?? "",
        }))
      ) {
        response.setHeader("WWW-Authenticate", 'Basic realm="API documentation", charset="UTF-8"');
        return boundary.respondError(
          new ApplicationError("UNAUTHENTICATED", "Authentication required"),
          request, response,
        );
      }
      next();
    })().catch((error: unknown) => boundary.respondError(error, request, response));
  });
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle("nest-layered-template")
      .setDescription("In-memory authentication and permission examples")
      .setVersion("0.0.0")
      .addBearerAuth()
      .build(),
  );
  SwaggerModule.setup("docs", app, document, {
    jsonDocumentUrl: "/docs/openapi.json",
    yamlDocumentUrl: "/docs/openapi.yaml",
    swaggerOptions: { persistAuthorization: false },
  });
}
