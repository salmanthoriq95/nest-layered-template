import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import type { Express } from "express";
import { AppModule } from "./app.module.js";
import { SystemClock } from "./common/system-clock.js";
import { installFatalHandlers, installShutdown, startupFailed } from "./common/process-lifecycle.js";
import { loadEnvironment } from "./config/environment.js";
import { parseApiSettings, trustedProxies } from "./config/settings.js";
import { HttpBoundary } from "./http/boundary.js";
import { installRateLimits, installSwagger } from "./http/api-gates.js";
import { HttpLoggingAdapter } from "./logging/http-logging.adapter.js";
import { SafeDiagnostics } from "./logging/safe-diagnostics.js";
import { AuthCleanup } from "./modules/auth/auth-cleanup.js";
import { PasswordVerifierContract } from "./modules/auth/contracts/password-verifier.contract.js";
import { SessionStoreContract } from "./modules/auth/contracts/session-store.contract.js";
import { SlidingWindow } from "./modules/auth/sliding-window.js";

async function bootstrap(): Promise<void> {
  installFatalHandlers();
  await loadEnvironment("api");
  const settings = parseApiSettings(process.env);
  const clock = new SystemClock();
  const diagnostics = new SafeDiagnostics(clock);
  const logging = new HttpLoggingAdapter({
    url: settings.LOG_WORKER_URL,
    token: settings.LOG_WORKER_TOKEN,
    timeoutMs: settings.LOG_WORKER_TIMEOUT_MS,
    concurrency: settings.LOG_WORKER_MAX_CONCURRENT_REQUESTS,
    capacity: settings.LOG_QUEUE_CAPACITY,
    maxBytes: settings.LOG_MAX_EVENT_BYTES,
    shutdownMs: settings.LOG_SHUTDOWN_TIMEOUT_MS,
    development: settings.NODE_ENV === "development",
  }, diagnostics);
  const boundary = new HttpBoundary(clock, logging, settings.NODE_ENV === "development");
  const limiter = new SlidingWindow(clock);
  const app = await NestFactory.create(AppModule.register(settings, clock), {
    bodyParser: false,
    logger: false,
    abortOnError: false,
  });
  const express: Express = app.getHttpAdapter().getInstance();
  express.disable("x-powered-by");
  express.set("trust proxy", trustedProxies(settings.TRUSTED_PROXY_ADDRESSES));
  express.set("query parser", "simple");
  boundary.installEarlyMiddleware(app);
  installRateLimits(app, settings, limiter, boundary);
  boundary.installParser(app, 16384);
  installSwagger(app, settings, app.get(PasswordVerifierContract), boundary);
  await app.init();
  boundary.installParserErrorHandler(app);
  const cleanup = new AuthCleanup(
    app.get(SessionStoreContract), limiter, clock,
    settings.AUTH_CLEANUP_INTERVAL_SECONDS * 1000,
    {
      login: settings.AUTH_LOGIN_RATE_LIMIT_WINDOW_SECONDS * 1000,
      refresh: settings.AUTH_REFRESH_RATE_LIMIT_WINDOW_SECONDS * 1000,
      swagger: settings.SWAGGER_RATE_LIMIT_WINDOW_SECONDS * 1000,
    },
  );
  await app.listen(settings.PORT, settings.HOST);
  cleanup.start();
  installShutdown(settings.LOG_SHUTDOWN_TIMEOUT_MS, async () => {
    cleanup.stop();
    // Stop admission while allowing already admitted requests to finish.
    await app.close();
    await logging.close();
  });
}

void bootstrap().catch(startupFailed);
