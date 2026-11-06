import "reflect-metadata";
import { createHash, timingSafeEqual } from "node:crypto";
import { Module } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import type { NextFunction, Response } from "express";
import { ApplicationError } from "../application/application-error.js";
import { SystemClock } from "../common/system-clock.js";
import { installFatalHandlers, installShutdown, startupFailed } from "../common/process-lifecycle.js";
import { loadEnvironment } from "../config/environment.js";
import { parseWorkerSettings } from "../config/settings.js";
import { HttpBoundary } from "../http/boundary.js";
import { HealthController } from "../http/health.controller.js";
import type { HttpRequest } from "../http/request-state.js";
import { LoggingContract } from "../logging/logging.contract.js";
import type { LogEvent } from "../logging/log-event.js";
import { stripDevelopmentContext } from "../logging/log-event.js";
import { SafeDiagnostics } from "../logging/safe-diagnostics.js";
import { DailyJsonErrorStore } from "./daily-json-error.store.js";
import { ErrorStoreContract } from "./error-store.contract.js";
import { LoggingWorkerController, WorkerDevelopmentMode } from "./logging-worker.controller.js";
import { LoggingWorkerService } from "./logging-worker.service.js";

async function bootstrap(): Promise<void> {
  installFatalHandlers();
  await loadEnvironment("worker");
  const settings = parseWorkerSettings(process.env);
  const clock = new SystemClock();
  const diagnostics = new SafeDiagnostics(clock);
  const files = new DailyJsonErrorStore(
    settings.LOG_ERROR_DIRECTORY, settings.LOG_ERROR_MAX_FILE_BYTES,
    settings.LOG_ERROR_RETENTION_DAYS, clock,
  );
  await files.initialize();
  const worker = new LoggingWorkerService(
    files, diagnostics, settings.LOG_QUEUE_CAPACITY,
    settings.LOG_SHUTDOWN_TIMEOUT_MS, clock,
  );
  const development = settings.NODE_ENV === "development";
  class LocalLoggingAdapter implements LoggingContract {
    emit(event: LogEvent): void {
      if (!worker.enqueue(stripDevelopmentContext(event, development))) {
        diagnostics.report("QUEUE_FULL");
      }
    }
    close(): Promise<void> {
      return worker.close();
    }
  }
  const logging = new LocalLoggingAdapter();
  const boundary = new HttpBoundary(clock, logging, development);
  @Module({
    controllers: [HealthController, LoggingWorkerController],
    providers: [
      { provide: LoggingWorkerService, useValue: worker },
      { provide: ErrorStoreContract, useValue: files },
      { provide: WorkerDevelopmentMode, useValue: new WorkerDevelopmentMode(development) },
    ],
  })
  class LoggingWorkerModule {}
  const app = await NestFactory.create(LoggingWorkerModule, {
    bodyParser: false, logger: false, abortOnError: false,
  });
  boundary.installEarlyMiddleware(app);
  const expected = createHash("sha256").update(settings.LOG_WORKER_TOKEN).digest();
  app.use((request: HttpRequest, response: Response, next: NextFunction) => {
    if (request.path !== "/internal/logs" || request.method !== "POST") return next();
    const match = request.headers.authorization?.match(/^Bearer ([0-9a-fA-F]{64})$/);
    const actual = createHash("sha256").update(match?.[1] ?? "").digest();
    if (!match || !timingSafeEqual(expected, actual)) {
      return boundary.respondError(
        new ApplicationError("UNAUTHORIZED", "Authentication required"),
        request, response,
      );
    }
    next();
  });
  boundary.installParser(app, settings.LOG_MAX_EVENT_BYTES);
  await app.init();
  boundary.installParserErrorHandler(app);
  await app.listen(settings.LOG_WORKER_PORT, settings.LOG_WORKER_HOST);
  let pruning: NodeJS.Timeout | undefined;
  let stopped = false;
  const schedulePrune = () => {
    const now = clock.epochMs();
    const delay = 86400000 - (now % 86400000);
    pruning = setTimeout(() => {
      void files.prune()
        .catch(() => diagnostics.report("RETENTION_FAILED"))
        .finally(() => { if (!stopped) schedulePrune(); });
    }, delay);
    pruning.unref();
  };
  schedulePrune();
  installShutdown(settings.LOG_SHUTDOWN_TIMEOUT_MS, async () => {
    stopped = true;
    if (pruning) clearTimeout(pruning);
    await app.close();
    await logging.close();
  });
}

void bootstrap().catch(startupFailed);
