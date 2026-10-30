# DOC-016 — Logging Conventions

**Status:** Accepted initial logging policy; implementation and software selection pending · **Updated:** 2026-10-30.
**Records:**

- [D-046 — Asynchronous logging and development diagnostics](DOC-003-decisions.md#d-046--asynchronous-logging-and-development-diagnostics)
- [D-047 — Independent logging worker](DOC-003-decisions.md#d-047--independent-logging-worker)
- [D-048 — Daily JSON error files](DOC-003-decisions.md#d-048--daily-json-error-files)
- [D-049 — Best-effort internal HTTP logging delivery](DOC-003-decisions.md#d-049--best-effort-internal-http-logging-delivery)
- [D-053 — Default logging worker ingestion address](DOC-003-decisions.md#d-053--default-logging-worker-ingestion-address)
- [D-054 — Shared-token logging worker authentication](DOC-003-decisions.md#d-054--shared-token-logging-worker-authentication)
- [D-055 — Logging delivery timeout and cancellation](DOC-003-decisions.md#d-055--logging-delivery-timeout-and-cancellation)
- [D-056 — Single-attempt logging delivery](DOC-003-decisions.md#d-056--single-attempt-logging-delivery)
- [D-057 — Concurrent logging delivery limit](DOC-003-decisions.md#d-057--concurrent-logging-delivery-limit)
- [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy)

**Decision:** Send sanitized structured events to an independent logging process through a background internal HTTP adapter. Use best-effort delivery with a safe local stderr fallback on send failure. Persist unexpected faults in one daily `.json` file containing an array of error records. Include additional request data only in development, with secrets excluded in every environment.

**Reason:** Keep request handling responsive, retain useful debugging context, and allow the logging worker to continue processing received events after the API process crashes.

## 1. Accepted baseline

| Area | Agreement |
| --- | --- |
| Output | JSON records, one per line, to console/stdout. Deployment controls console collection/retention; local error files follow the accepted settings in section 6. |
| Correlation | Generate a server-assigned UUID v4 per request. Use the same value in logs and `meta.requestId`. |
| Base fields | `timestamp`, `level`, `requestId`, `method`, route, `statusCode`, and `durationMs`; add an error code when available. |
| Severity | `info` for HTTP 2xx/3xx, `warn` for 4xx, and `error` for 5xx. Severity alone does not select file persistence. |
| Async behavior | HTTP responses may finish before background log delivery or file writes complete. They do not wait for log persistence. |
| Transport | An adapter behind the API's logging contract sends events to the worker through internal HTTP in the background. |
| Authentication | Protect `POST /internal/logs` with the shared `LOG_WORKER_TOKEN` supplied through an Authorization Bearer header. Worker health remains unauthenticated. |
| Timeout | Default `LOG_WORKER_TIMEOUT_MS=1000` per HTTP delivery attempt, with active request cancellation on expiry. |
| Retry | One HTTP delivery attempt per event for the initial version; no automatic retries after failure or timeout. |
| Concurrency | Default `LOG_WORKER_MAX_CONCURRENT_REQUESTS=10`: at most ten active HTTP log deliveries per API process. Queue capacity/overflow follow section 6. |
| Send failure | The API keeps serving requests and emits a sanitized local `stderr` diagnostic. Logging delivery failure does not change the API response. |
| Persistence | The logging worker stores unexpected application faults in one daily `.json` file containing a JSON array. General feature persistence remains placeholders; no database is selected. |

## 2. Unexpected faults

- Persist unanticipated failures caused by application faults. Do not persist expected validation failures or other deliberately handled application outcomes as unexpected errors. They can still have ordinary console request logs.
- The maintainer clarified the earlier “>500” wording by failure type, not a numerical status threshold. An unexpected fault mapped to HTTP `500` qualifies; a controlled response does not qualify merely because its status is 5xx.
- A shared exception filter may catch an unexpected fault to produce the safe HTTP envelope. That boundary handling does not make the underlying fault expected.
- Syntax/build failures can occur before the application logger initializes. The accepted initial policy uses runtime/tool `stderr` for these failures, with no guarantee of daily JSON capture; see section 6 for fatal-process handling.

## 3. Development diagnostics

- Additional request data, including query, body, and headers, may be logged only in development mode. Omit these fields in every other mode, across console, transport, and persisted output.
- Never log passwords, access/refresh tokens, worker tokens, password hashes, or signing keys, including in development. Remove or redact sensitive values before sending log events. This also applies to credentials inside headers and nested data.
- Runtime log context does not change the accepted HTTP response envelope or expose internal diagnostics to API clients.
- Follow the accepted `NODE_ENV` selector, field allowlists, secret exclusion, and size/depth limits in section 6. Development diagnostics never authorize an unrestricted raw request dump.

Sensitive data exclusion follows [OWASP Logging: Data to exclude](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude), retrieved 2026-10-30.

## 4. Worker and delivery boundary

- Keep the main API modular and layered. Run logging in a separate process with an independent lifecycle; it must not rely on the API process remaining alive. A worker thread in the API process does not satisfy this requirement.
- Expose the worker's own unauthenticated `GET /health`, following [DOC-015 — Demo API Contracts: Health responses](DOC-015-demo-api-contracts.md#health-responses). It checks the worker process's responsiveness; the API's health does not depend on worker availability. Log ingestion uses the separate authentication rule below.
- The API produces sanitized structured events; an internal HTTP adapter behind its logging contract delivers them in the background. The worker owns normal log output and error-file persistence. Keep transport and file implementations outside application services, behind application-owned contracts and DI.
- If delivery fails, keep the API serving requests with its original response behavior. Emit a local `stderr` diagnostic without sensitive event data. This fallback is the approved exception to worker-owned output; it must not recursively use the failed transport.
- The worker can finish processing events it has received after an API-only crash. Events still buffered or unsent in the API may be lost; background logging is not a zero-loss guarantee. Shared host failure also remains outside process-level isolation.
- Internal HTTP, local addressing, authentication, timeout/cancellation, one-attempt delivery, bounded concurrency, and the operating policy in section 6 are accepted. Initially launch the processes separately; production supervision and non-loopback deployment remain deployment concerns. Do not introduce a broker, process manager, or new dependency without approval.

Node distinguishes worker threads within a process from separate child processes; independent process lifetime also depends on launch and I/O configuration. This is design guidance, not a selection of a launch mechanism. [Node.js worker threads](https://nodejs.org/api/worker_threads.html), [Node.js child processes](https://nodejs.org/api/child_process.html#optionsdetached), retrieved 2026-10-30.

### Default ingestion address

**Status:** Accepted default for the initial deployment.

```text
POST http://127.0.0.1:3001/internal/logs
```

- By default, run the API and worker as separate processes on the same host. The worker listens on `127.0.0.1:3001`; its log-ingestion path is `POST /internal/logs`.
- Configure the API target through `LOG_WORKER_URL`; the worker uses `LOG_WORKER_HOST` and `LOG_WORKER_PORT`. Defaults and validation follow section 6; non-loopback deployment requires explicit transport/access configuration.
- The worker's existing public health route is `GET /health` at that worker address, giving a default URL of `http://127.0.0.1:3001/health`.
- Ingestion authentication is defined separately below; payload/reply schemas and settings follow section 6. Software selection/preflight remains separate from these accepted contracts.

The IPv4 loopback range is host-local. [RFC 1122: IP addressing](https://www.rfc-editor.org/rfc/rfc1122.html#section-3.2.1.3), retrieved 2026-10-30.

### Ingestion authentication

**Status:** Mechanism, credential policy, and configuration accepted; actual secret generation pending approved execution.

- Configure the same dedicated random static credential as `LOG_WORKER_TOKEN` in the API and worker environments, through `.env`.
- The API sends `Authorization: Bearer <LOG_WORKER_TOKEN>` when posting to `/internal/logs`. The worker compares the supplied credential with its configured value.
- A missing or mismatched request token returns HTTP `401`, using the accepted safe HTTP boundary conventions. Authentication failure does not open ingestion anonymously.
- Redact this credential from every log destination and diagnostic, including development headers and send-failure output. Keep actual secrets outside Git.
- `GET /health` remains unauthenticated. This token is dedicated to API-to-worker log delivery.

Credential format, startup validation, and manual rotation follow section 6. No token value is created by this document. Credentials belong in request headers rather than URLs. [OWASP REST Security: Sensitive information in HTTP requests](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#sensitive-information-in-http-requests), retrieved 2026-10-30.

### Delivery timeout

**Status:** Default, setting name, cancellation, and configuration validation accepted; HTTP client selection pending.

```dotenv
LOG_WORKER_TIMEOUT_MS=1000
```

- Bound each HTTP delivery attempt with a default total timeout of 1000 milliseconds (one second), configurable through `.env`.
- If the attempt has not completed by that deadline, actively cancel the pending HTTP request and handle it through the accepted sanitized local `stderr` fallback.
- Delivery stays in the background. The API's main response does not wait for this timeout and is not changed by logging failure.
- This limit applies to the single delivery attempt allowed below. Queue waiting/capacity follow section 6; active concurrency is specified separately below.

Node HTTP timeout notification alone does not cancel a request; cancellation requires an explicit action. [Node.js HTTP request behavior](https://nodejs.org/api/http.html#httprequestoptions-callback), retrieved 2026-10-30. Cancelling the local attempt does not prove that the worker has not already received or stored the event; its processing is independent.

### Delivery retries

**Status:** Accepted initial policy.

- Attempt each event's HTTP delivery once. Do not automatically retry or re-enqueue a failed or timed-out attempt; HTTP-client retry features must respect this rule.
- After failure, emit the accepted safe local `stderr` diagnostic. Continue handling subsequent events normally, with no change to the main API response.
- Events not received by the worker may be lost. A timeout alone cannot establish whether the event was already received or stored.
- Queue capacity/overflow, acknowledgment, and shutdown behavior follow section 6. Active concurrency follows the accepted limit below. A future retry mechanism requires a new maintainer decision.

Repeating a POST that appends a log record can duplicate it when the first attempt's outcome is unknown. Automatic retries of non-idempotent operations need explicit safeguards. [RFC 9110: Idempotent methods](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2), retrieved 2026-10-30.

### Concurrent deliveries

**Status:** Accepted default and setting name; queue policy accepted in section 6.

```dotenv
LOG_WORKER_MAX_CONCURRENT_REQUESTS=10
```

- Allow at most ten active HTTP log deliveries per API process by default, configurable through `.env`.
- This bounds simultaneous log sends, not main API concurrency or requests per second. Queue capacity, overflow, and worker processing concurrency follow section 6.

## 5. File layout and remaining choices

The maintainer selected **one `.json` file per day**, containing a JSON array of unexpected-error records. Multiple errors on the same day belong to that array. The worker coordinates updates so concurrent events do not corrupt the document. UTC grouping, `logs/errors/YYYY-MM-DD.json`, serialized replacement writes, seven-day retention, and the 10 MiB daily limit are accepted in section 6.

The alternative of one file per event was explained as 100 errors producing 100 files; it is not the selected grouping.

JSON console lines do not determine the file format. Multiple independent objects appended line by line are not one ordinary JSON document. Do not silently use that format under a `.json` filename. [RFC 8259: JSON grammar](https://www.rfc-editor.org/rfc/rfc8259.html#section-2), retrieved 2026-10-30.

The initial file, delivery, diagnostics, and lifecycle policies below are accepted. Actual implementation, exact software/preflight, build commands, and deployment-specific supervision remain separate work. No application source, logging files, secrets, software selection, or execution is included in this documentation change.

## 6. Initial logging operating policy

**Status:** Accepted in full; implementation pending.

**Decision:** Use the defaults below for the initial logging design. The maintainer explicitly approved all nine groups together under [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy).

**Reason:** Keep a small template bounded and understandable, with the remaining operating choices resolved in one review. Numeric limits are accepted template defaults, not universal performance recommendations.

### 1. Queues and overflow

- Use a FIFO queue of at most 100 waiting events in each process, excluding active work. The API uses the accepted delivery concurrency; the worker processes one queued event at a time.
- Do not add age-based eviction or a separate queue-wait deadline initially. The accepted one-second HTTP timeout starts when an actual delivery attempt begins, not while its event waits in the API queue.
- When the API queue is full, drop the new event without waiting or changing the API response. When the worker queue is full or closing, reject ingestion with `503` / `LOG_WORKER_UNAVAILABLE`. Neither case triggers automatic retry.
- Report dropped events and logging failures through sanitized local `stderr`, with counts and stable reason codes only. Limit summaries to one per ten seconds per process; never include the event payload, credentials, raw URLs, or raw error messages. The worker never sends its own diagnostics through ingestion.

### 2. Ingestion contract and acknowledgment

- Accept one JSON object per request, at most 16 KiB of UTF-8 JSON; no compressed bodies or batches. Reject unexpected fields, query parameters, malformed values, and unsupported content types. The API drops an oversized event locally with the safe diagnostic.
- Require `schemaVersion: 1`, the accepted base fields (`timestamp`, `level`, `requestId`, `method`, `route`, `statusCode`, `durationMs`), and `unexpected: boolean`. Allow only optional `errorCode`, safe `exception`, and development `requestContext` described below. Require a UTC ISO timestamp, UUID v4 request ID, finite nonnegative duration, and matching severity/status. `unexpected: true` requires error severity.
- Use a route template without query/path values; use a fixed `unmatched` label when routing fails. Persist the same sanitized event shape, with `exception` restricted to unexpected faults. Distinguish an event's originating `requestId` from the worker HTTP request's own response metadata.
- Return `202`, message `Log accepted`, and `data: { "accepted": true }` after enqueueing. This confirms memory acceptance, not console output or durable file persistence. No delivery-status endpoint or deduplication is added.
- Use the standard envelope and `Cache-Control: no-store` for worker JSON replies: `400` / `VALIDATION_ERROR`, `401` / `UNAUTHORIZED`, `413` / `PAYLOAD_TOO_LARGE`, `415` / `UNSUPPORTED_MEDIA_TYPE`, or `503` / `LOG_WORKER_UNAVAILABLE` as applicable. Reject authentication before admitting an event. Any unsuccessful delivery uses the accepted no-retry fallback.

The acknowledgment follows [RFC 9110: 202 Accepted](https://www.rfc-editor.org/rfc/rfc9110.html#section-15.3.3), retrieved 2026-10-30. It does not promise completed processing.

### 3. Development request context

- Enable additional request context only when `NODE_ENV=development` in both producer and worker. Default an absent value to `production`; accept only `development`, `test`, or `production`. The worker also removes context outside development.
- Capture only validated, explicitly allowlisted body/query fields per route; the initial allowlists are empty. Omit login/refresh bodies entirely. Only a normalized `content-type` value is eligible from headers; never capture raw headers, cookies, authorization, or raw URLs.
- Limit development context to 4 KiB, nesting depth three, and 512 UTF-8 bytes per string. Omit fields beyond the limits rather than copying the raw request. Apply secret exclusion before queueing and again at ingestion.

### 4. Unexpected-error details

- Use a fixed safe message instead of copying exception messages, causes, rejected values, or vendor objects. An optional `exception` contains `name` (a recognized built-in error type, otherwise `Error`), `message: "Unexpected application error"`, and `stackFrames` (parsed source locations only), capped at 8 KiB. Exclude the original stack's message line and function arguments.
- Send these safe details to the worker and include them only in the unexpected-error file. Console request records contain base fields, the unexpected flag, and an error code; permitted development context can also appear there. API error responses retain their existing safe envelope.
- Never rely on key-name redaction to make arbitrary text safe. Unknown exception data is omitted; only the defined fields are serialized.

### 5. Daily files and retention

- Write `logs/errors/YYYY-MM-DD.json`, grouping by the worker's UTC receipt date. Persist only unexpected faults as the agreed top-level JSON array; exclude the directory from Git and HTTP serving.
- Keep today's UTC file and the previous six dates. Remove only recognized older daily files at startup and each UTC midnight; do not delete unrelated files.
- Cap each daily file at 10 MiB. When another record would exceed the limit, skip that file record and emit a safe diagnostic; console processing continues. Do not split the day into extra files or discard earlier records silently.

### 6. File writing and recovery

- Use one worker as the sole writer for its local directory. Serialize asynchronous updates: validate the current array, write its replacement to a temporary file in the same directory, then rename it over the daily file after successful completion. Do not overlap writes to that file.
- On POSIX, restrict the directory to its owner (`0700`) and files, including temporary files, to owner read/write (`0600`). Other platforms require equivalent access restrictions. Do not use a public or shared-writer directory.
- Fail worker startup if the directory is unusable or today's existing file is invalid/oversized. At runtime, preserve the existing file on write failure or detected corruption, report safely, and continue console output; manual recovery is required for a corrupt file. Remove only recognized stale temporary files at startup.
- Runtime file failures do not redefine `/health`; it remains the accepted process-liveness check, not proof of successful writes.
- This is crash damage reduction, not a power-loss durability or automatic repair guarantee. `202` remains memory acceptance even if a later file write fails.

Serializing writes follows the warning in [Node.js filesystem documentation](https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options), retrieved 2026-10-30. Exact runtime and filesystem behavior still need verification during implementation.

### 7. Process layout, startup, shutdown, and fatal errors

- Put the API logging contract/event types and adapter in `src/logging/`; use an independent entry point under `src/logging-worker/`. Keep unit tests beside source and worker HTTP tests in `test/logging-worker.e2e-spec.ts`. Exact contract method names are an implementation review item, not another operating-policy decision.
- Initially start the two processes separately in two terminals. The API does not spawn or supervise the worker, and does not wait for a reachable worker during startup. Production supervision remains a deployment concern; no process-manager dependency is added.
- Validate each process's own configuration before serving. The worker checks its output directory and current daily file. Invalid configuration stops the affected process without printing supplied values.
- On `SIGTERM`/`SIGINT`, stop accepting new work, then allow up to five seconds to drain that process's accepted logging work. Cancel remaining API sends and report abandoned work safely at the deadline. API shutdown cannot flush the worker's separate memory queue.
- Fatal runtime faults use a safe local diagnostic and terminate the affected process; do not continue normal service after an uncaught exception. Build/syntax errors before initialization remain runtime/tool `stderr`, with no promise of daily JSON capture. Forced termination or host failure can still lose pending logs.

### 8. Shared credential and network boundary

- Generate a dedicated credential from 32 cryptographically random bytes, encoded as 64 hex characters, only after approved software execution. Configure the same value in both processes; validate its format at startup and compare credentials without content-dependent early exit.
- Missing or invalid configured credentials stop the affected process. Rotate manually by updating both environments and restarting both processes; no expiry or overlapping-token mechanism is introduced.
- Keep the accepted loopback default. A non-loopback deployment needs explicit transport/access configuration, including HTTPS across untrusted networks; it is outside this initial same-host operating policy.

### 9. Configuration names and defaults

All names/defaults in this table are accepted for the initial version. Store actual credentials outside Git; a future `.env.example` contains a placeholder only.

| Setting | Initial value | Consumer |
| --- | --- | --- |
| `NODE_ENV` | `production` when absent; set `development` explicitly for local diagnostics | Both |
| `LOG_WORKER_URL` | `http://127.0.0.1:3001/internal/logs` | API |
| `LOG_WORKER_HOST` | `127.0.0.1` | Worker |
| `LOG_WORKER_PORT` | `3001` | Worker |
| `LOG_WORKER_TOKEN` | Required; no default | Both |
| `LOG_WORKER_TIMEOUT_MS` | `1000` | API |
| `LOG_WORKER_MAX_CONCURRENT_REQUESTS` | `10` | API |
| `LOG_QUEUE_CAPACITY` | `100` waiting events per process | Both |
| `LOG_MAX_EVENT_BYTES` | `16384` | Both |
| `LOG_SHUTDOWN_TIMEOUT_MS` | `5000` | Both |
| `LOG_ERROR_DIRECTORY` | `./logs/errors`, relative to project root | Worker |
| `LOG_ERROR_RETENTION_DAYS` | `7`, including today | Worker |
| `LOG_ERROR_MAX_FILE_BYTES` | `10485760` | Worker |

Use defaults only for absent optional settings. Supplied numeric settings must be positive integers; the port must be in `1..65535`. Reject blank/invalid values, invalid URLs, URL user information/query/fragments, and a target path other than `/internal/logs`. Diagnostic depth/string/context limits and the ten-second summary interval are code constants for this initial policy.

Secret exclusion, bounded resource use, and failure testing draw on [OWASP Logging: Verification](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#verification) and [OWASP Logging: Data to exclude](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#data-to-exclude), retrieved 2026-10-30. The limits are project choices. Exact software selection/preflight, tooling/build commands, and deployment supervision remain separate; this documentation neither installs software nor creates source, secrets, or runtime files.
