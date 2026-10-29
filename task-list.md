# DOC-002 — Project Task List

**Status:** Active checklist · **Updated:** 2026-10-29.
**Record:** [D-003 — Root task list](docs/DOC-003-decisions.md#d-003--root-task-list).

Living discussion and implementation checklist for `nest-layered-template`. Read only task sections relevant to the current request.

**Current scope:** public, permission-protected, and superadmin-only access responses; per-user in-memory role/grants; minimal signed JWT identity; UUID v4 public user IDs. General feature persistence and integrations remain placeholders. Real domain CRUD, ORM, databases, and live providers remain outside the initial template. [D-035 — Per-user permissions and public access](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access)

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
- [ ] Agree exact demo routes, input/result schemas, and token issuance.
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
- [ ] Agree exact endpoint input/result schemas and minimum API documentation format.

Real resource CRUD, pagination, sorting, money/date formats, and API lifecycle policies require a later application scope.

## 5. Data and transactions

**Current scope:** general feature persistence/integrations remain placeholders; auth has an approved in-memory role/grant adapter. [D-035 — Per-user permissions and public access](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access)

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
- [ ] Agree exact permission catalog/fixtures and how superadmin changes grants.
- [ ] Agree token issuance, signing profile, claims, key configuration, transport, and lifetime; clarify refresh/logout scope.
- [ ] Agree missing-metadata behavior, multiple-permission semantics, and superadmin-only metadata.
- [ ] Define the identity, authorization, and permission-store contract methods before implementation.

Database-backed resource catalogs, dynamic permission/delegation management, account CRUD, ownership scopes, and full login/token/session workflows are deferred. No extra authorization framework is selected.

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
| [D-035 — Per-user permissions and public access](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access) | Accepted; exact endpoint/grant details open |
| [D-036 — Minimal JWT identity and server-side access state](docs/DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state) | Accepted architecture; token profile, issuance, and tooling open |
| [D-037 — UUID v4 public user identifiers](docs/DOC-003-decisions.md#d-037--uuid-v4-public-user-identifiers) | Accepted; database key design deferred |

## Next discussions

- [x] Confirm access-only initial scope and extension placeholders. [D-028 — Placeholder-only access demonstration template](docs/DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [x] Confirm superadmin access to the admin example. [D-029 — Public, admin, and superadmin demo access](docs/DOC-003-decisions.md#d-029--public-admin-and-superadmin-demo-access)
- [x] Agree code conventions, folders, layer boundaries, placeholders, and test locations in [DOC-011 — Code Conventions](docs/DOC-011-code-conventions.md).
- [x] Approve envelopes, input handling, HTTP wiring, and status choices in [DOC-012 — HTTP Boundary Conventions](docs/DOC-012-http-conventions.md) and [DOC-013 — HTTP Status and Response Examples](docs/DOC-013-http-response-examples.md).
- [x] Accept per-user permissions, server-side in-memory lookup, JWT identity, and UUID v4 public user IDs.
- [ ] Agree demo token issuance and grant updates, then exact route/contract details and remaining access-policy semantics.
- [ ] Evaluate required Node/Nest/tooling components through preflight and explicit approval before scaffolding.
- [ ] Keep real app/domain/integration work deferred until the maintainer requests it.

## Active handoff

- Guide version: 4.0.0. Scope remains documentation and design; no source scaffolding or new software execution.
- Previous Git observation: the maintainer's local master contains `3229e53` (`docs(conventions): define code, testing, and HTTP standards`); the working tree was clean before this permission discussion. Live remote state was not checked in this discussion.
- Current progress: the maintainer explicitly accepted per-user permissions, in-memory current role/grants, `@Public()`, superadmin bypass, minimal JWT identity without embedded/encrypted grants, and UUID v4 public user IDs. The earlier blanket admin matrix is superseded; layout, tests, scope, and conventions now reflect this model.
- Next step/questions: decide demo token issuance and how superadmin changes grants, then exact routes, permission catalog/fixtures, contract methods, and remaining metadata semantics. JWT profile/key settings, request-ID format, log integration, and tooling versions remain unresolved.
- Approvals: [D-030 — Minimal code layout and conventions](docs/DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions), [D-031 — Minimal testing strategy and locations](docs/DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations), and [D-032–D-034 — HTTP validation, envelopes, and status conventions](docs/DOC-003-decisions.md#d-032--http-input-validation-and-xss-boundaries) are accepted. No new software execution or assistant commit/push is authorized by this design approval.
- Latest approval: [D-035–D-037 — Per-user permissions, JWT identity, and public user identifiers](docs/DOC-003-decisions.md#d-035--per-user-permissions-and-public-access) are accepted as design decisions. Exact external software steps still require their own preflight and explicit approval.

## Implementation backlog

Add agreed tasks with outcomes, acceptance criteria, dependencies/decisions, and relevant verification. External software steps still require preflight and explicit approval.
