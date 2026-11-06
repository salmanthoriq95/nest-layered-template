import type { Request } from "express";
import type { VerifiedAccessClaims } from "../modules/auth/contracts/auth.types.js";
import type { LogEvent } from "../logging/log-event.js";

export type RequestState = {
  requestId: string;
  startedAtMs: number;
  errorCode?: string;
  unexpected: boolean;
  exception?: LogEvent["exception"];
};

export type HttpRequest = Request & {
  state?: RequestState;
  identity?: VerifiedAccessClaims;
};
