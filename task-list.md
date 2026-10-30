# DOC-002 — Project Task List

**Status:** Active checklist · **Updated:** 2026-10-30.
**Record:** [D-003 — Root task list](docs/DOC-003-decisions.md#d-003--root-task-list).

Living discussion and implementation checklist for `nest-layered-template`. Read only task sections relevant to the current request.

**Current scope:** public, permission-protected, and superadmin-only responses; two in-memory dummy accounts; manual in-memory grants; HS256 access JWTs (15-minute default), opaque rotating refresh tokens (seven-day refresh window), and immediate current-session logout. JWT signing/expiry and Swagger Basic Auth settings live in `.env`; dummy-account credentials do not. General feature persistence/integrations remain placeholders. An independent logging process handles async logs and unexpected-fault JSON files, with development-only request context. The API and worker expose independent unauthenticated health endpoints. [D-040–D-041 — Token lifecycle and in-memory accounts/grants](docs/DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout), [DOC-016 — Logging Conventions](docs/DOC-016-logging-conventions.md), [D-052 — Minimal process health endpoints](docs/DOC-003-decisions.md#d-052--minimal-process-health-endpoints)

## Working rules

- Check a discussion item when its outcome is documented, including justified deferral or exclusion.
- Record each accepted decision and reason in [DOC-003 — Decision Records](docs/DOC-003-decisions.md); add trade-offs or review triggers only when useful. Update affected [DOC-004 — Conventions](docs/DOC-004-conventions.md) and tasks together.
- Add implementation work only after scope is agreed, with outcomes, acceptance criteria, dependencies, and relevant verification.
- Keep proposals distinct from accepted rules; update this list and its date as decisions evolve.
- Track the AGENTS.md agreement version. After context recovery, load only relevant rules and unfinished-work handoffs before resuming.
- Ask the maintainer about unclear points or proposed deviations; wait before affected work rather than inventing an answer.
- Follow the [DOC-005 — Global Software Supply Chain Security Policy](docs/DOC-005-supply-chain-security.md) and obtain explicit approval for external software steps.

## 1. Scope and goals

- [x] Replace real CRUD scope with minimal access demos and extension placeholders. [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [x] Retain public/superadmin rules and require per-user grants for other protected access. [D-035 — Per-user permissions and public access](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access)
- [x] Agree routes, input/result schemas, and token/session contracts. [D-042 — Minimal API contracts and initial demo grants](docs/DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants)
- [x] Target solo developers or teams of 2–3. [D-005 — Scope and priorities](docs/DOC-003-decisions.md#d-005--scope-and-priorities)
- [x] Prioritize comprehension, delivery, controlled evolution, cleanliness, debugging, and review.
- [ ] Define a small first-release acceptance checklist for the access template.

## 2. Architecture and module boundaries

- [x] Keep N-layered organization, DI, and clear behavioral boundaries. [D-006 — N-layered architecture, DI, and contracts](docs/DOC-003-decisions.md#d-006--n-layered-architecture-di-and-contracts)
- [x] Keep a modular main API; deployment follows each project's needs. Logging has an independent process. [D-009 — One modular application with layers per feature](docs/DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature), [D-047 — Independent logging worker](docs/DOC-003-decisions.md#d-047--independent-logging-worker)
- [x] Keep persistence and external implementation details outside services. [D-010 — Behavioral contracts and integration boundaries](docs/DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries)
- [x] Define the smallest example/auth module layout and controller/service responsibilities. [D-030 — Minimal code layout and conventions](docs/DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions)
- [x] Choose abstract-class contracts and runtime DI tokens for demonstrated boundaries.
- [x] Define dependency direction, exports, and shared-code limits.
- [x] Document persistence/integration extension locations without unused repositories or clients.

## 3. Code and folder conventions

- [x] Document and approve [D-030 — Minimal code layout and conventions](docs/DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions) in [DOC-011 — Code Conventions](docs/DOC-011-code-conventions.md).
- [x] Define source, root configuration, test, and documentation locations.
- [x] Define naming for files, folders, classes, interfaces, types, functions, and variables.
- [x] Agree strict typing, boundary types, and limits on `any` and assertions.
- [ ] Choose remaining compiler/module settings after runtime/tooling selection.
- [x] Define direct imports, exports, and folder dependencies; defer aliases and barrel files.
- [ ] Define `null`, `undefined`, optional properties, and defaults.
- [ ] Define formatting, linting, comments, code documentation, and automated enforcement.

## 4. API contracts

- [x] Require runtime validation for body/query/path inputs, including `GET`. [D-032 — HTTP input validation and XSS boundaries](docs/DOC-003-decisions.md#d-032--http-input-validation-and-xss-boundaries)
- [x] Require a uniform JSON envelope. [D-033 — Uniform JSON response envelope](docs/DOC-003-decisions.md#d-033--uniform-json-response-envelope)
- [x] Document common standard statuses with examples. [DOC-013 — HTTP Status and Response Examples](docs/DOC-013-http-response-examples.md)
- [x] Approve the detailed input policy and expanded envelope in [DOC-012 — HTTP Boundary Conventions](docs/DOC-012-http-conventions.md).
- [x] Approve HTTP wiring and project-specific status mappings.
- [x] Agree the public, admin, and superadmin example paths and methods.
- [x] Agree the envelope, access success/denial statuses, and safe unexpected-error handling.
- [x] Choose Swagger for initial API documentation/manual token testing. [D-038 — Minimal login, refresh, and environment configuration](docs/DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration)
- [x] Document and accept [DOC-015 — Demo API Contracts](docs/DOC-015-demo-api-contracts.md), including routes, inputs/results, grants, and access/session defaults.
- [x] Approve [D-042 — Minimal API contracts and initial demo grants](docs/DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants).
- [x] Agree endpoint input/result schemas and Swagger contracts.

Real resource CRUD, pagination, sorting, money/date formats, and API lifecycle policies require a later application scope.

## 5. Data and transactions

**Current scope:** general feature persistence/integrations remain placeholders; auth has in-memory account, role/grant, and session adapters. The independent logging worker owns local unexpected-error file persistence. [D-040–D-041 — Token lifecycle and in-memory accounts/grants](docs/DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout), [DOC-016 — Logging Conventions](docs/DOC-016-logging-conventions.md)

- [ ] Describe how a future project adds persistence contracts, libraries, implementations, and DI wiring.
- [ ] Ensure placeholder paths perform no real I/O or misleading simulated persistence.
- [ ] Document the future integration approval/preflight boundary.

Database/ORM selection, schema, relationships, indexes, migrations, database seeds, transactions, and upload/payment implementations are deferred. Auth fixture usernames, passwords, roles, and grants are accepted; actual hashes and UUID values remain pending.

## 6. Authentication, authorization, and data protection

- [x] Replace blanket admin access with the permission-aware access table in [DOC-004 — Conventions: 4. Authorization](docs/DOC-004-conventions.md#4-authorization).
- [x] Confirm automatic permission access for an authenticated superadmin. [D-035 — Per-user permissions and public access](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access)
- [x] Accept per-user permission metadata, in-memory grants, and `@Public()`. [D-035 — Per-user permissions and public access](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access)
- [x] Read current role/grants server-side for each protected request; defer caching.
- [x] Accept minimal signed JWT identity without embedded grants or custom permission encryption. [D-036 — Minimal JWT identity and server-side access state](docs/DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state)
- [x] Accept UUID v4 public user IDs using Node's built-in generator. [D-037 — UUID v4 public user identifiers](docs/DOC-003-decisions.md#d-037--uuid-v4-public-user-identifiers)
- [x] Keep caller-provided roles and unverified claims separate from trusted identity and current store state.
- [x] Use agreed safe `401`/`403` error envelopes for authentication/access failures.
- [x] Select minimal login and refresh; clarify that “reset token” means refresh. [D-038 — Minimal login, refresh, and environment configuration](docs/DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration)
- [x] Keep signing-key and expiry settings in `.env`.
- [x] Protect Swagger with HTTP Basic Auth using an environment-configured username and bcrypt password hash. [D-039 — Swagger Basic Auth with bcrypt](docs/DOC-003-decisions.md#d-039--swagger-basic-auth-with-bcrypt)
- [x] Agree Swagger routes, bcrypt defaults/input bounds, and startup failure for invalid enabled-documentation credentials. [D-042 — Minimal API contracts and initial demo grants](docs/DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants)
- [x] Accept HS256/15-minute access tokens, opaque seven-day refresh rotation, and immediate access/refresh logout. [D-040 — HS256 tokens, refresh rotation, and immediate logout](docs/DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout)
- [x] Keep one superadmin and one admin dummy account, including credential hashes, in memory; do not load application-account credentials from `.env`. [D-041 — In-memory demo accounts and manual grants](docs/DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants)
- [x] Change grants manually in storage, without a management endpoint.
- [x] Select bcrypt for application-account hashing as well as the separate Swagger password gate. [D-043 — Bcrypt application password hashing](docs/DOC-003-decisions.md#d-043--bcrypt-application-password-hashing)
- [x] Select `dev123` for both dummy logins; keep bcrypt hashes in memory fixtures. [D-044 — Public dummy login credentials](docs/DOC-003-decisions.md#d-044--public-dummy-login-credentials)
- [x] Agree starting bcrypt cost 12 and initial admin grant `examples:read`.
- [ ] Generate fixture hashes after exact software preflight and execution approval; calibrate cost before deployment.
- [x] Agree Swagger-to-API token transport, JWT claims, issuer/audience defaults, and independent-session/replay rules.
- [x] Accept JWT environment names, 64-character hex key encoding, startup validation, duration defaults, and manual key rotation/restart. [D-045 — JWT configuration, validation, and key rotation](docs/DOC-003-decisions.md#d-045--jwt-configuration-validation-and-key-rotation)
- [x] Accept login/refresh rate limits, environment configuration, in-memory counters, 429 headers, and explicit proxy trust. [D-050 — Login and refresh rate limits and proxy trust](docs/DOC-003-decisions.md#d-050--login-and-refresh-rate-limits-and-proxy-trust)
- [x] Accept periodic cleanup every 60 seconds by default, configurable through `.env`, preserving request-time validity, refresh replay evidence, accounts, and grants. [D-051 — Periodic in-memory state cleanup](docs/DOC-003-decisions.md#d-051--periodic-in-memory-state-cleanup)
- [x] Accept all six groups in [D-059 — In-memory limiter and cleanup parameters](docs/DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters): sliding windows/counting, environment validation, timer lifecycle, replay-safe pruning, proxy configuration, and a separate Swagger quota.
- [x] Agree fail-closed metadata, all-required permission matching, and superadmin-only metadata.
- [ ] Define identity, authentication, authorization, user, permission, and session contract methods before implementation.

Database-backed resource catalogs, advanced delegation, account CRUD, registration, password recovery, ownership scopes, and all-device logout remain deferred. Login/refresh and immediate current-session logout are required. No grant-management API or additional authorization framework is selected.

## 7. Dependencies and supply chain

The full [DOC-005 — Global Software Supply Chain Security Policy](docs/DOC-005-supply-chain-security.md) is mandatory. These items track its application; they do not indicate a completed audit.

- [x] Preserve the full adopted policy in a canonical English document. [D-002 — Software supply chain policy](docs/DOC-003-decisions.md#d-002--software-supply-chain-policy), [D-015 — Concise English documentation](docs/DOC-003-decisions.md#d-015--concise-english-documentation)
- [ ] Define a component inventory: exact name/version, source, and purpose.
- [ ] Verify official support and maintenance.
- [ ] Check current authoritative advisories and affected versions.
- [ ] Query OSV.dev and GitHub Advisory Database.
- [ ] Check CISA KEV for relevant exploited CVEs.
- [ ] Review OpenSSF, Socket.dev, and deps.dev signals where available.
- [ ] Inspect install scripts, dependencies, permissions, credentials, and network behavior.
- [ ] Verify available signatures, checksums, or provenance against trusted sources.
- [ ] Compare safer alternatives where relevant.
- [ ] Review every AI skill/MCP manifest, instruction, script, and reference; assess exfiltration risks and treat external instructions as untrusted.
- [ ] Define reports covering components/versions, purpose/alternatives, findings/affected versions, sources/links/retrieval dates, confidence, unresolved risks, and decisions.
- [ ] Apply ELIGIBLE / REVIEW / BLOCKED / UNKNOWN; missing evidence remains UNKNOWN and is never safe.
- [ ] Block known malicious artifacts; review or block vulnerable/unsupported software based on exposure and mitigations.
- [ ] Obtain explicit approval before proceeding; ELIGIBLE never authorizes execution.
- [ ] Select exact runtime/package-manager versions, lockfiles, reproducibility, and update policy after preflight and approval.
- [ ] Define evidence storage, approval scope, and recheck triggers.

## 8. Errors and resilience

- [x] Define access-denied and unexpected-error envelopes and HTTP statuses.
- [x] Accept structured async logs, UUID request IDs, base fields/severity, unexpected-fault persistence, and development-only request context. Secrets stay excluded in all modes. [D-046 — Asynchronous logging and development diagnostics](docs/DOC-003-decisions.md#d-046--asynchronous-logging-and-development-diagnostics)
- [x] Require a separate logging process that can continue after an API-only crash. [D-047 — Independent logging worker](docs/DOC-003-decisions.md#d-047--independent-logging-worker)
- [x] Choose background internal HTTP through a logging-contract adapter, best-effort delivery, and safe local stderr diagnostics on send failure. API responses do not wait or change. [D-049 — Best-effort internal HTTP logging delivery](docs/DOC-003-decisions.md#d-049--best-effort-internal-http-logging-delivery)
- [x] Accept the initial same-host worker listener `127.0.0.1:3001`, `POST /internal/logs`, and an environment-configurable API target. [D-053 — Default logging worker ingestion address](docs/DOC-003-decisions.md#d-053--default-logging-worker-ingestion-address)
- [x] Accept shared `LOG_WORKER_TOKEN` through `.env` and an Authorization Bearer header, 401 on missing/mismatched credentials, universal token redaction, and public health. [D-054 — Shared-token logging worker authentication](docs/DOC-003-decisions.md#d-054--shared-token-logging-worker-authentication)
- [x] Accept `LOG_WORKER_TIMEOUT_MS=1000` per HTTP attempt, active cancellation, and safe stderr fallback with unchanged API responses. [D-055 — Logging delivery timeout and cancellation](docs/DOC-003-decisions.md#d-055--logging-delivery-timeout-and-cancellation)
- [x] Accept one HTTP attempt per event with no automatic retry for the initial version; preserve safe failure diagnostics and normal handling of later events. [D-056 — Single-attempt logging delivery](docs/DOC-003-decisions.md#d-056--single-attempt-logging-delivery)
- [x] Accept `LOG_WORKER_MAX_CONCURRENT_REQUESTS=10` active HTTP log sends per API process by default. [D-057 — Concurrent logging delivery limit](docs/DOC-003-decisions.md#d-057--concurrent-logging-delivery-limit)
- [x] Accept all nine operating groups together under [D-058 — Minimal logging operating policy](docs/DOC-003-decisions.md#d-058--minimal-logging-operating-policy); do not reopen accepted settings one parameter at a time.
- [x] Define ingestion/202 acknowledgment, settings/protection, bounded queues/overflow, separate manual process launch, and shutdown handling. Production supervision remains deployment-specific.
- [x] Select one daily `.json` file containing an array of unexpected-error records. [D-048 — Daily JSON error files](docs/DOC-003-decisions.md#d-048--daily-json-error-files)
- [x] Accept UTC file grouping/path/schema, owner-only access, seven-day retention, 10 MiB daily limits, serialized replacement/recovery rules, development capture limits, and pre-startup stderr limitations.

Third-party-call resilience and event idempotency belong to a later integration scope. Logging's initial operating policy is accepted in [DOC-016 — Logging Conventions](docs/DOC-016-logging-conventions.md); implementation, software approval, and deployment supervision remain separate work.

## 9. Testing and completion criteria

- [x] Agree colocated unit tests, HTTP tests in `test/`, and behavior-focused coverage. [D-031 — Minimal testing strategy and locations](docs/DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations)
- [ ] Verify the permission-aware access table, including admin without a grant and superadmin bypass.
- [ ] Verify expired/tampered JWT rejection and permission changes taking effect on subsequent protected checks.
- [ ] Verify login, accepted refresh rotation/reuse behavior, environment validation, and Swagger use against the accepted contracts.
- [ ] Verify immediate access/refresh logout, previous tokens from the same session, refresh/logout races, missing sessions after restart, and superadmin session checks.
- [ ] Verify login/refresh quotas, success/failure counting, IP/endpoint separation, required 429 headers, counter reset, and ignored untrusted forwarding headers.
- [ ] Verify exact sliding-window boundary pruning/Retry-After, atomic concurrent admission, validation/parser/content-type failure counting, canonical IP keys, and rejected requests not extending the window.
- [ ] Verify Swagger's shared UI/schema/assets quota before Basic Auth, success/failure counting, and isolation from login/refresh scopes.
- [ ] Verify expiry rejection between cleanup runs, retained replay evidence, and preserved accounts/grants after cleanup.
- [ ] Verify cleanup configuration/delay validation, first-run timing, nonoverlapping passes, monotonic limiter time versus UTC session expiry, and cancellation/no rescheduling on shutdown using controlled clocks.
- [ ] Verify unauthenticated health endpoints on the API and worker, 200 envelopes/no-store headers, and API health while the worker is unavailable.
- [ ] Verify worker ingestion accepts only the configured shared token, rejects missing/mismatched credentials, and never exposes the token in logs or diagnostics in any mode.
- [ ] Verify timed-out logging attempts are actively cancelled and safely reported without awaiting delivery on the main API request or changing its response.
- [ ] Verify failed/timed-out events are not automatically retried and later events can still be delivered.
- [ ] Verify active HTTP log sends respect the configured per-API-process concurrency limit.
- [ ] Verify FIFO queue limits/overflow, bounded safe stderr summaries, ingestion field/size/content-type validation, 202 memory acceptance, and safe 400/401/413/415/503 envelopes.
- [ ] Verify development allowlists and capture limits, production/test context omission at both boundaries, secret exclusion, and safe unexpected-error details in files only.
- [ ] Verify UTC daily JSON arrays, retention/size limits, serialized replacement writes, file permissions, and preserved files/safe diagnostics on write failure or corruption.
- [ ] Verify logging configuration validation, startup without a reachable worker, separate worker lifetime, five-second graceful drain, and fatal/pre-startup diagnostic limitations.
- [ ] Verify Swagger UI/schema access protection, Basic Auth challenges, valid/invalid credentials, literal hash loading, and independence from API authentication.
- [ ] Verify validation, response envelopes, real status codes, and safe error details against the accepted HTTP contract.
- [ ] Verify required contracts/DI and that placeholders do not perform external I/O.
- [ ] Define relevant type checks, linting, and test commands after tooling approval.
- [ ] Define Done for the demonstrative responses, boundaries, and documentation.

No database, business-transaction, or provider integration tests are required before those integrations exist.

## 10. Configuration and operations

- [x] Retain minimum monitoring, backup, and DR planning guidance. [D-025 — Minimum monitoring, backup, and disaster recovery](docs/DOC-003-decisions.md#d-025--minimum-monitoring-backup-and-disaster-recovery)
- [x] Accept async logging, a separate worker, best-effort internal HTTP, and the complete initial ingestion/file/lifecycle policy. [DOC-016 — Logging Conventions](docs/DOC-016-logging-conventions.md)
- [x] Accept independent public `GET /health` on the API and logging worker, with standard 200 envelopes and no-store headers. [D-052 — Minimal process health endpoints](docs/DOC-003-decisions.md#d-052--minimal-process-health-endpoints)
- [x] Define JWT configuration/startup rules and invalid enabled-Swagger credential handling. [D-045 — JWT configuration, validation, and key rotation](docs/DOC-003-decisions.md#d-045--jwt-configuration-validation-and-key-rotation)
- [x] Finalize limiter/cleanup settings, Swagger throttling, and proxy-list configuration. [D-059 — In-memory limiter and cleanup parameters](docs/DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters)
- [ ] Finalize tooling and exact internal contract methods before affected implementation; initial auth, logging, limiter/cleanup, and minimal process-health policies are accepted.

[DOC-010 — Reliability Strategy](docs/DOC-010-reliability.md) is planning guidance. Backup schedules, retention, RPO/RTO, restore drills, incident runbooks, and deployment infrastructure are project-specific future work when actual data/hosting exist.

## 11. Developer experience and maintenance

- [ ] Define first-checkout setup.
- [ ] Define standard development, build, quality, and test commands.
- [ ] Complete setup, contribution, and troubleshooting documentation.
- [x] Maintain conventions and decision records with the task list. [D-004 — Decision records and conventions](docs/DOC-003-decisions.md#d-004--decision-records-and-conventions)
- [ ] Add representative code examples for conventions.
- [x] Establish the decision-record format and location. [DOC-003 — Decision Records](docs/DOC-003-decisions.md)
- [x] Use master directly until the maintainer requests branch separation; keep general branching strategy in a separate handbook. [D-026 — Direct master workflow for this repository](docs/DOC-003-decisions.md#d-026--direct-master-workflow-for-this-repository)
- [x] Adopt Conventional Commits for commit messages. [D-027 — Conventional Commits message format](docs/DOC-003-decisions.md#d-027--conventional-commits-message-format)
- [ ] Define the minimal access-demo reference implementation.
- [ ] Define template versioning, changelog, and downstream updates.
- [x] Record the plan for a public GitHub repository. [D-013 — Public GitHub repository](docs/DOC-003-decisions.md#d-013--public-github-repository)
- [x] Choose an English project/repository name. [D-013 — Public GitHub repository](docs/DOC-003-decisions.md#d-013--public-github-repository), [D-014 — Descriptive project name](docs/DOC-003-decisions.md#d-014--descriptive-project-name)
- [x] Set `nest-layered-template` and its repository description. [D-014 — Descriptive project name](docs/DOC-003-decisions.md#d-014--descriptive-project-name)
- [x] Translate existing documentation into concise English. [D-015 — Concise English documentation](docs/DOC-003-decisions.md#d-015--concise-english-documentation)
- [x] Add the AI contributor guide and Codex/model-family attribution. [D-016 — AI collaboration and attribution](docs/DOC-003-decisions.md#d-016--ai-collaboration-and-attribution)
- [x] Version AI working agreements and document history, context recovery, and unfinished-work handoffs. [D-017 — Versioned AI agreements and context recovery](docs/DOC-003-decisions.md#d-017--versioned-ai-agreements-and-context-recovery)
- [x] Require maintainer clarification for ambiguity or deviations; prohibit improvisation and assumed approval. [D-018 — No improvisation and required clarification](docs/DOC-003-decisions.md#d-018--no-improvisation-and-required-clarification)
- [x] Adopt lightweight decision headers; require decision and reason, with other sections optional. [D-019 — Lightweight decision documentation](docs/DOC-003-decisions.md#d-019--lightweight-decision-documentation)
- [x] Replace blanket context loading with a compact agent router and task-specific documentation. [D-020 — Task-based context loading](docs/DOC-003-decisions.md#d-020--task-based-context-loading)
- [x] Select MIT, use GitHub username salmanthoriq95 for copyright, and document downstream scope. [D-021 — MIT license and downstream scope](docs/DOC-003-decisions.md#d-021--mit-license-and-downstream-scope)
- [x] Prepare a concise Code of Conduct draft using GitHub reporting without a project email. [D-022 — Community conduct and reporting](docs/DOC-003-decisions.md#d-022--community-conduct-and-reporting)
- [x] Add ordered document IDs, readable filenames/titles, and descriptive decision references. [D-023 — Document identifiers and descriptive references](docs/DOC-003-decisions.md#d-023--document-identifiers-and-descriptive-references)
- [ ] Review and adopt the proposed conduct and moderation wording.

## Decision index

Decisions, reasons, status, and any useful supporting details live in [DOC-003 — Decision Records](docs/DOC-003-decisions.md).

| Decision | Status |
| --- | --- |
| [D-001 — Node.js and NestJS](docs/DOC-003-decisions.md#d-001--nodejs-and-nestjs) | Accepted |
| [D-002 — Software supply chain policy](docs/DOC-003-decisions.md#d-002--software-supply-chain-policy) | Accepted |
| [D-003 — Root task list](docs/DOC-003-decisions.md#d-003--root-task-list) | Accepted |
| [D-004 — Decision records and conventions](docs/DOC-003-decisions.md#d-004--decision-records-and-conventions) | Accepted; format updated by [D-019 — Lightweight decision documentation](docs/DOC-003-decisions.md#d-019--lightweight-decision-documentation) |
| [D-005 — Scope and priorities](docs/DOC-003-decisions.md#d-005--scope-and-priorities) | Priorities/team accepted; CRUD scope superseded; [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) |
| [D-006 — N-layered architecture, DI, and contracts](docs/DOC-003-decisions.md#d-006--n-layered-architecture-di-and-contracts) | Accepted |
| [D-007 — Configurable authorization](docs/DOC-003-decisions.md#d-007--configurable-authorization) | Initial model defined by [D-035 — Per-user permissions and public access](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access); advanced delegation deferred |
| [D-008 — Upload and payment isolation](docs/DOC-003-decisions.md#d-008--upload-and-payment-isolation) | Superseded by [D-011 — External interaction examples](docs/DOC-003-decisions.md#d-011--external-interaction-examples) |
| [D-009 — One modular application with layers per feature](docs/DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature) | Main API organization accepted; separate logging process added |
| [D-010 — Behavioral contracts and integration boundaries](docs/DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries) | Accepted |
| [D-011 — External interaction examples](docs/DOC-003-decisions.md#d-011--external-interaction-examples) | Separation retained; feature integrations deferred; [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) |
| [D-012 — Resource identity and access policies](docs/DOC-003-decisions.md#d-012--resource-identity-and-access-policies) | Database-backed implementation deferred; [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) |
| [D-013 — Public GitHub repository](docs/DOC-003-decisions.md#d-013--public-github-repository) | Accepted |
| [D-014 — Descriptive project name](docs/DOC-003-decisions.md#d-014--descriptive-project-name) | Accepted |
| [D-015 — Concise English documentation](docs/DOC-003-decisions.md#d-015--concise-english-documentation) | Accepted |
| [D-016 — AI collaboration and attribution](docs/DOC-003-decisions.md#d-016--ai-collaboration-and-attribution) | Accepted |
| [D-017 — Versioned AI agreements and context recovery](docs/DOC-003-decisions.md#d-017--versioned-ai-agreements-and-context-recovery) | Accepted versioning; reading rule replaced by [D-020 — Task-based context loading](docs/DOC-003-decisions.md#d-020--task-based-context-loading) |
| [D-018 — No improvisation and required clarification](docs/DOC-003-decisions.md#d-018--no-improvisation-and-required-clarification) | Accepted |
| [D-019 — Lightweight decision documentation](docs/DOC-003-decisions.md#d-019--lightweight-decision-documentation) | Accepted |
| [D-020 — Task-based context loading](docs/DOC-003-decisions.md#d-020--task-based-context-loading) | Accepted |
| [D-021 — MIT license and downstream scope](docs/DOC-003-decisions.md#d-021--mit-license-and-downstream-scope) | Accepted |
| [D-022 — Community conduct and reporting](docs/DOC-003-decisions.md#d-022--community-conduct-and-reporting) | Reporting accepted; conduct wording proposed |
| [D-023 — Document identifiers and descriptive references](docs/DOC-003-decisions.md#d-023--document-identifiers-and-descriptive-references) | Accepted |
| [D-024 — Article, category, and comment examples](docs/DOC-003-decisions.md#d-024--article-category-and-comment-examples) | Superseded by placeholder-only scope; [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) |
| [D-025 — Minimum monitoring, backup, and disaster recovery](docs/DOC-003-decisions.md#d-025--minimum-monitoring-backup-and-disaster-recovery) | Requirement/logging/liveness accepted; broader baseline proposed |
| [D-026 — Direct master workflow for this repository](docs/DOC-003-decisions.md#d-026--direct-master-workflow-for-this-repository) | Accepted until explicitly changed |
| [D-027 — Conventional Commits message format](docs/DOC-003-decisions.md#d-027--conventional-commits-message-format) | Accepted |
| [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) | Minimal scope retained; auth state extended |
| [D-029 — Public, admin, and superadmin demo access](docs/DOC-003-decisions.md#d-029--public-admin-and-superadmin-demo-access) | Public/superadmin rules retained; blanket admin allowance superseded |
| [D-030 — Minimal code layout and conventions](docs/DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions) | Accepted; tooling open |
| [D-031 — Minimal testing strategy and locations](docs/DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations) | Accepted; tooling open |
| [D-032 — HTTP input validation and XSS boundaries](docs/DOC-003-decisions.md#d-032--http-input-validation-and-xss-boundaries) | Accepted; API schemas specified, tooling open |
| [D-033 — Uniform JSON response envelope](docs/DOC-003-decisions.md#d-033--uniform-json-response-envelope) | Accepted |
| [D-034 — HTTP status standards and response examples](docs/DOC-003-decisions.md#d-034--http-status-standards-and-response-examples) | Accepted; endpoint contracts specified |
| [D-035 — Per-user permissions and public access](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access) | Accepted; manual grants and route policies specified by follow-up records |
| [D-036 — Minimal JWT identity and server-side access state](docs/DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state) | Accepted architecture/profile; implementation/tooling open |
| [D-037 — UUID v4 public user identifiers](docs/DOC-003-decisions.md#d-037--uuid-v4-public-user-identifiers) | Accepted; database key design deferred |
| [D-038 — Minimal login, refresh, and environment configuration](docs/DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration) | Requirements accepted; lifecycle specified by subsequent records |
| [D-039 — Swagger Basic Auth with bcrypt](docs/DOC-003-decisions.md#d-039--swagger-basic-auth-with-bcrypt) | Requirements and Basic Auth accepted; implementation parameters open |
| [D-040 — HS256 tokens, refresh rotation, and immediate logout](docs/DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout) | Accepted; API/session details specified |
| [D-041 — In-memory demo accounts and manual grants](docs/DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants) | Accepted; credentials/defaults specified by follow-up records |
| [D-042 — Minimal API contracts and initial demo grants](docs/DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants) | Accepted |
| [D-043 — Bcrypt application password hashing](docs/DOC-003-decisions.md#d-043--bcrypt-application-password-hashing) | Algorithm/defaults accepted; implementation open |
| [D-044 — Public dummy login credentials](docs/DOC-003-decisions.md#d-044--public-dummy-login-credentials) | Accepted; actual fixture hashes pending |
| [D-045 — JWT configuration, validation, and key rotation](docs/DOC-003-decisions.md#d-045--jwt-configuration-validation-and-key-rotation) | Accepted; implementation pending |
| [D-046 — Asynchronous logging and development diagnostics](docs/DOC-003-decisions.md#d-046--asynchronous-logging-and-development-diagnostics) | Accepted; operating details resolved in D-058 |
| [D-047 — Independent logging worker](docs/DOC-003-decisions.md#d-047--independent-logging-worker) | Accepted; initial launch/lifecycle resolved in D-058; production supervision deferred |
| [D-048 — Daily JSON error files](docs/DOC-003-decisions.md#d-048--daily-json-error-files) | Accepted; file operating details resolved in D-058 |
| [D-049 — Best-effort internal HTTP logging delivery](docs/DOC-003-decisions.md#d-049--best-effort-internal-http-logging-delivery) | Accepted; ingestion/operating details resolved in D-058 |
| [D-050 — Login and refresh rate limits and proxy trust](docs/DOC-003-decisions.md#d-050--login-and-refresh-rate-limits-and-proxy-trust) | Accepted; initial parameters resolved; actual deployment proxy addresses pending |
| [D-051 — Periodic in-memory state cleanup](docs/DOC-003-decisions.md#d-051--periodic-in-memory-state-cleanup) | Accepted; configuration/timer parameters resolved; implementation pending |
| [D-052 — Minimal process health endpoints](docs/DOC-003-decisions.md#d-052--minimal-process-health-endpoints) | Accepted; implementation pending |
| [D-053 — Default logging worker ingestion address](docs/DOC-003-decisions.md#d-053--default-logging-worker-ingestion-address) | Accepted; configuration resolved in D-058 |
| [D-054 — Shared-token logging worker authentication](docs/DOC-003-decisions.md#d-054--shared-token-logging-worker-authentication) | Accepted; credential/configuration policy resolved in D-058; generation pending |
| [D-055 — Logging delivery timeout and cancellation](docs/DOC-003-decisions.md#d-055--logging-delivery-timeout-and-cancellation) | Accepted; validation resolved in D-058; HTTP client selection pending |
| [D-056 — Single-attempt logging delivery](docs/DOC-003-decisions.md#d-056--single-attempt-logging-delivery) | Accepted initial policy |
| [D-057 — Concurrent logging delivery limit](docs/DOC-003-decisions.md#d-057--concurrent-logging-delivery-limit) | Default and setting name accepted |
| [D-058 — Minimal logging operating policy](docs/DOC-003-decisions.md#d-058--minimal-logging-operating-policy) | All nine groups accepted; implementation pending |
| [D-059 — In-memory limiter and cleanup parameters](docs/DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters) | All six groups accepted; implementation pending |

## Next discussions

- [x] Confirm access-only initial scope and extension placeholders. [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [x] Confirm superadmin access to the admin example. [D-029 — Public, admin, and superadmin demo access](docs/DOC-003-decisions.md#d-029--public-admin-and-superadmin-demo-access)
- [x] Agree code conventions, folders, layer boundaries, placeholders, and test locations in [DOC-011 — Code Conventions](docs/DOC-011-code-conventions.md).
- [x] Approve envelopes, input handling, HTTP wiring, and status choices in [DOC-012 — HTTP Boundary Conventions](docs/DOC-012-http-conventions.md) and [DOC-013 — HTTP Status and Response Examples](docs/DOC-013-http-response-examples.md).
- [x] Accept per-user permissions, server-side in-memory lookup, JWT identity, and UUID v4 public user IDs.
- [x] Select minimal login/refresh, `.env` signing/expiry configuration, and Swagger-first manual testing.
- [x] Select Swagger Basic Auth with a bcrypt hash in `.env`, separately from API authentication.
- [x] Accept token lifetimes/signing, refresh rotation, immediate logout, two memory-only accounts, and manual grant changes.
- [x] Choose bcrypt for application-account passwords.
- [x] Accept authentication/access routes, schemas, initial grants, metadata rules, session profile, and Swagger/bcrypt defaults in [DOC-015 — Demo API Contracts](docs/DOC-015-demo-api-contracts.md).
- [x] Select `dev123` for both application dummy passwords; Swagger credentials and JWT key remain separate.
- [x] Accept the JWT configuration proposal, including names, hex key format, validation, duration defaults, and manual rotation/restart. Explain TTL as Time To Live.
- [x] Accept logging/request-ID requirements, background delivery, unexpected-fault files, development diagnostics, and an independent logging process.
- [x] Explain per-event files and accept the maintainer's choice of a single JSON array file per day.
- [x] Accept internal HTTP logging delivery and safe stderr fallback while API requests continue.
- [x] Accept login/refresh quotas and proxy trust; explain how a reverse proxy affects client IP and rate limiting.
- [x] Accept in-memory cleanup without delaying expiry/revocation or deleting required replay evidence, dummy accounts, or grants.
- [x] Accept [D-052 — Minimal process health endpoints](docs/DOC-003-decisions.md#d-052--minimal-process-health-endpoints): independent public `GET /health` on the API and worker, with standard 200 envelopes and no-store headers.
- [x] Accept the initial worker ingestion URL `http://127.0.0.1:3001/internal/logs` and independent same-host processes; keep deployment target configuration in `.env`.
- [x] Accept the dedicated shared-token mechanism for ingestion while leaving health public.
- [x] Accept a configurable one-second timeout per log-delivery attempt, with cancellation and safe failure handling.
- [x] Accept one attempt per event with no automatic retry for the initial version.
- [x] Accept a default maximum of ten active HTTP log deliveries per API process.
- [x] Accept all nine logging operating groups in one review, as requested by the maintainer.
- [x] Accept all six limiter/cleanup groups together, including the additional separate Swagger quota.
- [ ] Finish remaining code/tooling defaults and a small first-release acceptance checklist.
- [ ] Evaluate required Node/Nest/tooling components through preflight and explicit approval before scaffolding.
- [ ] Keep real app/domain/integration work deferred until the maintainer requests it.

## Active handoff

- Guide version: 4.19.0. Scope remains documentation and design; no source scaffolding or new software execution.
- Git observation: local master contains `e19f252` (`docs(logging): finalize worker contracts and operating policy`). The three-file limiter/cleanup proposal was already uncommitted at this turn's start and is preserved. Live remote state was not checked here.
- Current progress: the maintainer answered “setuju semua” to all six groups in [D-059 — In-memory limiter and cleanup parameters](docs/DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters). Exact sliding-window admission/counting, environment defaults/validation, native timer lifecycle, replay-safe pruning, proxy-list configuration, and the separate Swagger quota are accepted. Related docs, earlier open-status references, and verification tasks are synchronized. The accepted logging policy remains recorded in [D-058 — Minimal logging operating policy](docs/DOC-003-decisions.md#d-058--minimal-logging-operating-policy). No secret, fixture hash, runtime log, or application source has been generated.
- Earlier approvals: [D-030–D-037 — Code, tests, HTTP boundaries, permissions, JWT identity, and public IDs](docs/DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions); [D-038–D-041 — Login, Swagger protection, token lifecycle, and in-memory accounts/grants](docs/DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration); [D-043 — Bcrypt application password hashing](docs/DOC-003-decisions.md#d-043--bcrypt-application-password-hashing).
- Next step/questions: no limiter/cleanup policy approval is pending in [DOC-014 — Authentication Lifecycle: Limiter and cleanup parameters](docs/DOC-014-authentication-lifecycle.md#limiter-and-cleanup-parameters). Prepare the tooling/dependency preflight, exact internal contract review, and first-release acceptance checklist as the next work areas; group related questions and do not reopen accepted policies. Exact software needs full preflight and explicit execution approval before scaffolding/installing/running. Actual proxy addresses and production supervision remain deployment inputs.
- Approval boundary: no exact external software/version, hashing command, installation/execution, or assistant commit/push is authorized by these design decisions. Swagger credentials and the JWT signing key remain separate from public dummy passwords. [DOC-010 — Reliability Strategy](docs/DOC-010-reliability.md) still contains proposed monitoring/backup/recovery details beyond accepted logging requirements.

## Implementation backlog

Add agreed tasks with outcomes, acceptance criteria, dependencies/decisions, and relevant verification. External software steps still require preflight and explicit approval.
