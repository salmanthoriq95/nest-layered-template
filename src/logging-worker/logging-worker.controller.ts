import { Body, Controller, HttpCode, Inject, Post } from "@nestjs/common";
import { ApplicationError } from "../application/application-error.js";
import { ZodValidationPipe } from "../http/validation.js";
import { logEventSchema, stripDevelopmentContext } from "../logging/log-event.js";
import type { LogEvent } from "../logging/log-event.js";
import { LoggingWorkerService } from "./logging-worker.service.js";

export class WorkerDevelopmentMode {
  constructor(readonly enabled: boolean) {}
}

@Controller("internal")
export class LoggingWorkerController {
  constructor(
    @Inject(LoggingWorkerService) private readonly worker: LoggingWorkerService,
    @Inject(WorkerDevelopmentMode) private readonly development: WorkerDevelopmentMode,
  ) {}

  @Post("logs")
  @HttpCode(202)
  ingest(
    @Body(new ZodValidationPipe(logEventSchema)) event: LogEvent,
  ): { accepted: true } {
    if (!this.worker.enqueue(stripDevelopmentContext(event, this.development.enabled))) {
      throw new ApplicationError("LOG_WORKER_UNAVAILABLE", "Logging worker unavailable");
    }
    return { accepted: true };
  }
}
