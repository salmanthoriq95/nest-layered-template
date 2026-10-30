# DOC-002 — Project Task List

**Status:** Active checklist · **Updated:** 2026-10-30.
**Record:** [D-003 — Root task list](docs/DOC-003-decisions.md#d-003--root-task-list).

Living discussion and implementation checklist for `nest-layered-template`. Read only task sections relevant to the current request.

**Current scope:** public, permission-protected, and superadmin-only responses; two in-memory dummy accounts; manual in-memory grants; HS256 access JWTs (15-minute default), opaque rotating refresh tokens (seven-day refresh window), and immediate current-session logout. JWT signing/expiry and Swagger Basic Auth settings live in `.env`; dummy-account credentials do not. General feature persistence/integrations remain placeholders. [D-040–D-041 — Token lifecycle and in-memory accounts/grants](docs/DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout)

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
- [ ] Agree exact routes, input/result schemas, and remaining token/session parameters.
- [x] Target solo developers or teams of 2–3. [D-005 — Scope and priorities](docs/DOC-003-decisions.md#d-005--scope-and-priorities)
- [x] Prioritize comprehension, delivery, controlled evolution, cleanliness, debugging, and review.
- [ ] Define a small first-release acceptance checklist for the access template.

## 2. Architecture and module boundaries

- [x] Keep N-layered organization, DI, and clear behavioral boundaries. [D-006 — N-layered architecture, DI, and contracts](docs/DOC-003-decisions.md#d-006--n-layered-architecture-di-and-contracts)
- [x] Keep one modular application; deployment follows each project's needs. [D-009 — One modular application with layers per feature](docs/DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature)
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
- [ ] Agree the public, admin, and superadmin example paths and methods.
- [x] Agree the envelope, access success/denial statuses, and safe unexpected-error handling.
- [x] Choose Swagger for initial API documentation/manual token testing. [D-038 — Minimal login, refresh, and environment configuration](docs/DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration)
- [x] Prepare a reviewable [DOC-015 — Demo API Contracts](docs/DOC-015-demo-api-contracts.md) draft; its routes, inputs/results, grants, and additional defaults remain proposed.
- [ ] Approve or revise [D-042 — Minimal API contracts and initial demo grants](docs/DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants).
- [ ] Agree exact endpoint input/result schemas and Swagger contracts.

Real resource CRUD, pagination, sorting, money/date formats, and API lifecycle policies require a later application scope.

## 5. Data and transactions

**Current scope:** general feature persistence/integrations remain placeholders; auth has in-memory account, role/grant, and session adapters. [D-040–D-041 — Token lifecycle and in-memory accounts/grants](docs/DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout)

- [ ] Describe how a future project adds persistence contracts, libraries, implementations, and DI wiring.
- [ ] Ensure placeholder paths perform no real I/O or misleading simulated persistence.
- [ ] Document the future integration approval/preflight boundary.

Database/ORM selection, schema, relationships, indexes, migrations, database seeds, transactions, and upload/payment implementations are deferred. Auth in-memory fixtures are part of the demo; exact fixture assignments remain open.

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
- [ ] Agree Swagger bcrypt cost/input bounds, route coverage/configuration handling, and startup/error behavior before implementation.
- [x] Accept HS256/15-minute access tokens, opaque seven-day refresh rotation, and immediate access/refresh logout. [D-040 — HS256 tokens, refresh rotation, and immediate logout](docs/DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout)
- [x] Keep one superadmin and one admin dummy account, including credential hashes, in memory; do not load application-account credentials from `.env`. [D-041 — In-memory demo accounts and manual grants](docs/DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants)
- [x] Change grants manually in storage, without a management endpoint.
- [x] Select bcrypt for application-account hashing as well as the separate Swagger password gate. [D-043 — Bcrypt application password hashing](docs/DOC-003-decisions.md#d-043--bcrypt-application-password-hashing)
- [ ] Agree actual dummy passwords/hashes, hashing parameters, and the proposed initial `examples:read` admin grant/catalog.
- [ ] Agree Swagger-to-API token transport and login/refresh-throttling parameters.
- [ ] Agree exact token claims, environment variable names/validation, key encoding/rotation, and session-count/retry policies.
- [ ] Agree missing-metadata behavior, multiple-permission semantics, and superadmin-only metadata.
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
- [ ] Define minimal request/error context and redaction for debugging.

External-call timeouts, retries, queues, and event idempotency belong to a later real integration scope.

## 9. Testing and completion criteria

- [x] Agree colocated unit tests, HTTP tests in `test/`, and behavior-focused coverage. [D-031 — Minimal testing strategy and locations](docs/DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations)
- [ ] Verify the permission-aware access table, including admin without a grant and superadmin bypass.
- [ ] Verify expired/tampered JWT rejection and permission changes taking effect on subsequent protected checks.
- [ ] Verify login, accepted refresh rotation/reuse behavior, environment validation, and Swagger use once remaining contracts are agreed.
- [ ] Verify immediate access/refresh logout, previous tokens from the same session, refresh/logout races, missing sessions after restart, and superadmin session checks.
- [ ] Verify Swagger UI/schema access protection, Basic Auth challenges, valid/invalid credentials, literal hash loading, and independence from API authentication.
- [ ] Verify validation, response envelopes, real status codes, and safe error details after the HTTP contract is approved.
- [ ] Verify required contracts/DI and that placeholders do not perform external I/O.
- [ ] Define relevant type checks, linting, and test commands after tooling approval.
- [ ] Define Done for the demonstrative responses, boundaries, and documentation.

No database, business-transaction, or provider integration tests are required before those integrations exist.

## 10. Configuration and operations

- [x] Retain minimum monitoring, backup, and DR planning guidance. [D-025 — Minimum monitoring, backup, and disaster recovery](docs/DOC-003-decisions.md#d-025--minimum-monitoring-backup-and-disaster-recovery)
- [ ] Review which minimal logging/health demonstrations belong in the initial template.
- [ ] Define only configuration/startup behavior needed by the selected demo.

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
| [D-009 — One modular application with layers per feature](docs/DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature) | Accepted |
| [D-010 — Behavioral contracts and integration boundaries](docs/DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries) | Accepted |
| [D-011 — External interaction examples](docs/DOC-003-decisions.md#d-011--external-interaction-examples) | Separation retained; initial real I/O deferred; [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) |
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
| [D-025 — Minimum monitoring, backup, and disaster recovery](docs/DOC-003-decisions.md#d-025--minimum-monitoring-backup-and-disaster-recovery) | Requirement accepted; baseline proposed |
| [D-026 — Direct master workflow for this repository](docs/DOC-003-decisions.md#d-026--direct-master-workflow-for-this-repository) | Accepted until explicitly changed |
| [D-027 — Conventional Commits message format](docs/DOC-003-decisions.md#d-027--conventional-commits-message-format) | Accepted |
| [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) | Minimal scope retained; auth state extended |
| [D-029 — Public, admin, and superadmin demo access](docs/DOC-003-decisions.md#d-029--public-admin-and-superadmin-demo-access) | Public/superadmin rules retained; blanket admin allowance superseded |
| [D-030 — Minimal code layout and conventions](docs/DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions) | Accepted; tooling open |
| [D-031 — Minimal testing strategy and locations](docs/DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations) | Accepted; tooling open |
| [D-032 — HTTP input validation and XSS boundaries](docs/DOC-003-decisions.md#d-032--http-input-validation-and-xss-boundaries) | Accepted; endpoint schemas and tooling open |
| [D-033 — Uniform JSON response envelope](docs/DOC-003-decisions.md#d-033--uniform-json-response-envelope) | Accepted |
| [D-034 — HTTP status standards and response examples](docs/DOC-003-decisions.md#d-034--http-status-standards-and-response-examples) | Accepted; exact endpoint contracts open |
| [D-035 — Per-user permissions and public access](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access) | Accepted; manual updates selected; initial grants/contracts open |
| [D-036 — Minimal JWT identity and server-side access state](docs/DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state) | Accepted architecture; detailed token profile and tooling open |
| [D-037 — UUID v4 public user identifiers](docs/DOC-003-decisions.md#d-037--uuid-v4-public-user-identifiers) | Accepted; database key design deferred |
| [D-038 — Minimal login, refresh, and environment configuration](docs/DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration) | Requirements accepted; lifecycle specified by subsequent records |
| [D-039 — Swagger Basic Auth with bcrypt](docs/DOC-003-decisions.md#d-039--swagger-basic-auth-with-bcrypt) | Requirements and Basic Auth accepted; implementation parameters open |
| [D-040 — HS256 tokens, refresh rotation, and immediate logout](docs/DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout) | Accepted behavior; remaining contracts/configuration open |
| [D-041 — In-memory demo accounts and manual grants](docs/DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants) | Accepted; credential values/hash parameters/initial grants open |
| [D-042 — Minimal API contracts and initial demo grants](docs/DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants) | Proposed; awaiting review |
| [D-043 — Bcrypt application password hashing](docs/DOC-003-decisions.md#d-043--bcrypt-application-password-hashing) | Algorithm accepted; parameters/implementation open |

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
- [ ] Review the six routes, input/result schemas, initial admin grant, metadata defaults, and session/configuration proposals in [DOC-015 — Demo API Contracts](docs/DOC-015-demo-api-contracts.md).
- [ ] Agree actual fixture passwords/hashes and any remaining parameters before generating credentials or scaffolding.
- [ ] Evaluate required Node/Nest/tooling components through preflight and explicit approval before scaffolding.
- [ ] Keep real app/domain/integration work deferred until the maintainer requests it.

## Active handoff

- Guide version: 4.4.0. Scope remains documentation and design; no source scaffolding or new software execution.
- Previous Git observation: local master contains `7483334` (`docs(auth): document login, refresh, and Swagger protection`); the working tree was clean when this token/account discussion began. Live remote state was not checked here.
- Current progress: the maintainer requested a commit message and continuation of the contract discussion, then selected bcrypt for application credentials. [DOC-015 — Demo API Contracts](docs/DOC-015-demo-api-contracts.md) proposes six API routes, schemas, `examples:read` for admin, metadata defaults, session/replay choices, and Swagger/configuration/hash defaults. It remains Proposed; continuing the discussion is not approval of the new contract.
- Next step/questions: obtain review of [D-042 — Minimal API contracts and initial demo grants](docs/DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants), choose actual dummy passwords/hashes and remaining parameters, then complete software preflight before scaffolding. No fixture credentials or hashes have been generated.
- Approvals: [D-030 — Minimal code layout and conventions](docs/DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions), [D-031 — Minimal testing strategy and locations](docs/DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations), and [D-032–D-034 — HTTP validation, envelopes, and status conventions](docs/DOC-003-decisions.md#d-032--http-input-validation-and-xss-boundaries) are accepted. No new software execution or assistant commit/push is authorized by this design approval.
- Latest approval: [D-035–D-037 — Per-user permissions, JWT identity, and public user identifiers](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access) are accepted as design decisions. Exact external software steps still require their own preflight and explicit approval.
- Latest scope request: [D-038 — Minimal login, refresh, and environment configuration](docs/DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration) is accepted at the requirement level. No exact package/version, proposed lifecycle default, software execution, or assistant commit/push is authorized by that request.
- Earlier addition: [D-039 — Swagger Basic Auth with bcrypt](docs/DOC-003-decisions.md#d-039--swagger-basic-auth-with-bcrypt) selected documentation access protection. Application bcrypt is now accepted separately; credential sources and API permissions remain distinct. No hash generation, package execution, or assistant commit/push is authorized by these algorithm/configuration choices.
- Latest decisions: [D-040–D-041 — Token lifecycle, immediate logout, and in-memory accounts/grants](docs/DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout) are accepted. Logout requires a live server-side session check; earlier delayed-access logout and environment-sourced account credentials are not the selected design. Exact software preflight/execution approval remains required.
- Latest algorithm decision: [D-043 — Bcrypt application password hashing](docs/DOC-003-decisions.md#d-043--bcrypt-application-password-hashing) is accepted. Proposed parameters and new endpoint/session defaults in [D-042 — Minimal API contracts and initial demo grants](docs/DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants) require their own maintainer approval.

## Implementation backlog

Add agreed tasks with outcomes, acceptance criteria, dependencies/decisions, and relevant verification. External software steps still require preflight and explicit approval.
