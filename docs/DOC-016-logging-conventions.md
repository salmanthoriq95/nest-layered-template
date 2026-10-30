# DOC-016 — Logging Conventions

**Status:** Requirements, daily JSON grouping, and internal HTTP delivery accepted; operational details open · **Updated:** 2026-10-30.
**Records:**

- [D-046 — Asynchronous logging and development diagnostics](DOC-003-decisions.md#d-046--asynchronous-logging-and-development-diagnostics)
- [D-047 — Independent logging worker](DOC-003-decisions.md#d-047--independent-logging-worker)
- [D-048 — Daily JSON error files](DOC-003-decisions.md#d-048--daily-json-error-files)
- [D-049 — Best-effort internal HTTP logging delivery](DOC-003-decisions.md#d-049--best-effort-internal-http-logging-delivery)

**Decision:** Send sanitized structured events to an independent logging process through a background internal HTTP adapter. Use best-effort delivery with a safe local stderr fallback on send failure. Persist unexpected faults in one daily `.json` file containing an array of error records. Include additional request data only in development, with secrets excluded in every environment.

**Reason:** Keep request handling responsive, retain useful debugging context, and allow the logging worker to continue processing received events after the API process crashes.

## 1. Accepted baseline

| Area | Agreement |
| --- | --- |
| Output | JSON records, one per line, to console/stdout. Deployment controls collection and retention; local error files have additional open settings below. |
| Correlation | Generate a server-assigned UUID v4 per request. Use the same value in logs and `meta.requestId`. |
| Base fields | `timestamp`, `level`, `requestId`, `method`, route, `statusCode`, and `durationMs`; add an error code when available. |
| Severity | `info` for HTTP 2xx/3xx, `warn` for 4xx, and `error` for 5xx. Severity alone does not select file persistence. |
| Async behavior | HTTP responses may finish before background log delivery or file writes complete. They do not wait for log persistence. |
| Transport | An adapter behind the API's logging contract sends events to the worker through internal HTTP in the background. |
| Send failure | The API keeps serving requests and emits a sanitized local `stderr` diagnostic. Logging delivery failure does not change the API response. |
| Persistence | The logging worker stores unexpected application faults in one daily `.json` file containing a JSON array. General feature persistence remains placeholders; no database is selected. |

## 2. Unexpected faults

- Persist unanticipated failures caused by application faults. Do not persist expected validation failures or other deliberately handled application outcomes as unexpected errors. They can still have ordinary console request logs.
- The maintainer clarified the earlier “>500” wording by failure type, not a numerical status threshold. An unexpected fault mapped to HTTP `500` qualifies; a controlled response does not qualify merely because its status is 5xx.
- A shared exception filter may catch an unexpected fault to produce the safe HTTP envelope. That boundary handling does not make the underlying fault expected.
- Syntax/build failures can occur before the application logger initializes. Capturing pre-startup failures and fatal process diagnostics needs a separate lifecycle/capture decision; application logging alone is not evidence that those failures were recorded.

## 3. Development diagnostics

- Additional request data, including query, body, and headers, may be logged only in development mode. Omit these fields in every other mode, across console, transport, and persisted output.
- Never log passwords, access/refresh tokens, password hashes, or signing keys, including in development. Remove or redact sensitive values before sending log events. This also applies to credentials inside headers and nested data.
- Runtime log context does not change the accepted HTTP response envelope or expose internal diagnostics to API clients.
- Exact environment selector, permitted development fields, redaction rules, and size/depth limits remain open. Approval of development diagnostics does not authorize an unrestricted raw request dump.

Sensitive data exclusion follows [OWASP Logging: Data to exclude](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude), retrieved 2026-10-30.

## 4. Worker and delivery boundary

- Keep the main API modular and layered. Run logging in a separate process with an independent lifecycle; it must not rely on the API process remaining alive. A worker thread in the API process does not satisfy this requirement.
- Expose the worker's own unauthenticated `GET /health`, following [DOC-015 — Demo API Contracts: Health responses](DOC-015-demo-api-contracts.md#health-responses). It checks the worker process's responsiveness; the API's health does not depend on worker availability. Logging ingestion protection remains a separate open decision.
- The API produces sanitized structured events; an internal HTTP adapter behind its logging contract delivers them in the background. The worker owns normal log output and error-file persistence. Keep transport and file implementations outside application services, behind application-owned contracts and DI.
- If delivery fails, keep the API serving requests with its original response behavior. Emit a local `stderr` diagnostic without sensitive event data. This fallback is the approved exception to worker-owned output; it must not recursively use the failed transport.
- The worker can finish processing events it has received after an API-only crash. Events still buffered or unsent in the API may be lost; background logging is not a zero-loss guarantee. Shared host failure also remains outside process-level isolation.
- Internal HTTP, background sending, best-effort semantics, and safe local send-failure diagnostics are accepted. Ingestion address/path/schema/protection, timeouts, acknowledgment/retry details, queue bounds, shutdown flushing, and process startup/supervision remain open. Do not introduce a broker, process manager, or new dependency without approval.

Node distinguishes worker threads within a process from separate child processes; independent process lifetime also depends on launch and I/O configuration. This is design guidance, not a selection of a launch mechanism. [Node.js worker threads](https://nodejs.org/api/worker_threads.html), [Node.js child processes](https://nodejs.org/api/child_process.html#optionsdetached), retrieved 2026-10-30.

## 5. File layout and remaining choices

The maintainer selected **one `.json` file per day**, containing a JSON array of unexpected-error records. Multiple errors on the same day belong to that array. The worker coordinates updates so concurrent events do not corrupt the document. The exact date timezone, file path/naming, write/recovery strategy, and size limits still require agreement.

The alternative of one file per event was explained as 100 errors producing 100 files; it is not the selected grouping.

JSON console lines do not determine the file format. Multiple independent objects appended line by line are not one ordinary JSON document. Do not silently use that format under a `.json` filename. [RFC 8259: JSON grammar](https://www.rfc-editor.org/rfc/rfc8259.html#section-2), retrieved 2026-10-30.

Still open: file path/date timezone, persisted exception schema, write/recovery coordination, access controls, rotation/retention/size limits, and capture before logger startup. Internal HTTP settings, delivery bounds, process supervision, and development diagnostics parameters also remain open. No application source, logging files, software selection, or software execution is included in this documentation change.
