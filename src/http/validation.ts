import { PipeTransform } from "@nestjs/common";
import { z } from "zod";
import { ApplicationError } from "../application/application-error.js";

export function validationError(
  field = "request",
): ApplicationError {
  return new ApplicationError(
    "VALIDATION_ERROR",
    "Request validation failed",
    [{ field, code: "INVALID_INPUT", message: "Invalid request input" }],
  );
}

export class ZodValidationPipe<T> implements PipeTransform<unknown, T> {
  constructor(private readonly schema: z.ZodType<T>) {}

  transform(value: unknown): T {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      // Schema paths/unknown keys may contain caller-controlled text.
      throw validationError("body");
    }
    return parsed.data;
  }
}

export function assertEmptyInput(value: unknown, field: string): void {
  if (value === undefined) return;
  if (!z.strictObject({}).safeParse(value).success) {
    throw validationError(field);
  }
}
