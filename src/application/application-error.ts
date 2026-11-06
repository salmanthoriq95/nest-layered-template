export type ApplicationErrorCode =
  | "VALIDATION_ERROR" | "UNAUTHENTICATED" | "UNAUTHORIZED" | "FORBIDDEN"
  | "NOT_FOUND" | "METHOD_NOT_ALLOWED" | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_MEDIA_TYPE" | "RATE_LIMITED" | "LOG_WORKER_UNAVAILABLE";

export class ApplicationError extends Error {
  constructor(
    readonly code: ApplicationErrorCode,
    readonly safeMessage: string,
    readonly details: readonly {
      field: string;
      code: string;
      message: string;
    }[] = [],
  ) {
    super(safeMessage);
    this.name = "ApplicationError";
  }
}

export function unauthenticated(): ApplicationError {
  return new ApplicationError("UNAUTHENTICATED", "Authentication required");
}

export function forbidden(): ApplicationError {
  return new ApplicationError("FORBIDDEN", "Access denied");
}
