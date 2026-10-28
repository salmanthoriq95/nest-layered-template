# DOC-002 — Project Task List

**Status:** Active checklist · **Updated:** 2026-10-28.
**Record:** [D-003 — Root task list](docs/DOC-003-decisions.md#d-003--root-task-list).

Living discussion and implementation checklist for `nest-layered-template`. Read only task sections relevant to the current request.

## Working rules

- Check a discussion item when its outcome is documented, including justified deferral or exclusion.
- Record each accepted decision and reason in [DOC-003 — Decision Records](docs/DOC-003-decisions.md); add trade-offs or review triggers only when useful. Update affected [DOC-004 — Conventions](docs/DOC-004-conventions.md) and tasks together.
- Add implementation work only after scope is agreed, with outcomes, acceptance criteria, dependencies, and relevant verification.
- Keep proposals distinct from accepted rules; update this list and its date as decisions evolve.
- Track the AGENTS.md agreement version. After context recovery, load only relevant rules and unfinished-work handoffs before resuming.
- Ask the maintainer about unclear points or proposed deviations; wait before affected work rather than inventing an answer.
- Follow the [DOC-005 — Global Software Supply Chain Security Policy](docs/DOC-005-supply-chain-security.md) and obtain explicit approval for external software steps.

## 1. Scope and goals

- [x] Establish authentication, flexible authorization, and 2–3 access-controlled CRUD examples. [D-005 — Scope and priorities](docs/DOC-003-decisions.md#d-005--scope-and-priorities)
- [ ] Choose concrete CRUD domains and use cases.
- [x] Target solo developers or teams of 2–3. [D-005 — Scope and priorities](docs/DOC-003-decisions.md#d-005--scope-and-priorities)
- [ ] Define team collaboration.
- [ ] Estimate traffic, data volume, availability, and response-time targets.
- [ ] Assess multitenancy, background jobs, and external integrations.
- [ ] Define required/optional features and first-release boundaries.
- [x] Treat database, upload, and payment as integration example categories; select concrete examples with release scope. [D-011 — External interaction examples](docs/DOC-003-decisions.md#d-011--external-interaction-examples)
- [x] Prioritize comprehension, delivery, code evolution, cleanliness, debugging, and review. [D-005 — Scope and priorities](docs/DOC-003-decisions.md#d-005--scope-and-priorities)
- [ ] Define measurable success criteria and scope-expansion triggers.

## 2. Architecture and module boundaries

- [x] Adopt N-layered architecture, DI, and contracts between layers. [D-006 — N-layered architecture, DI, and contracts](docs/DOC-003-decisions.md#d-006--n-layered-architecture-di-and-contracts)
- [x] Organize one application by feature, with layers inside each module. [D-009 — One modular application with layers per feature](docs/DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature)
- [x] Let each project choose deployment based on needs and resources. [D-006 — N-layered architecture, DI, and contracts](docs/DOC-003-decisions.md#d-006--n-layered-architecture-di-and-contracts)
- [ ] Define concrete domain modules.
- [ ] Assign controller, service, domain, and data-access responsibilities.
- [x] Require behavioral contracts and keep ORM/gateway/external I/O implementations outside services. [D-010 — Behavioral contracts and integration boundaries](docs/DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries)
- [ ] Choose contract forms, ownership, DI tokens, inputs, outputs, and errors.
- [ ] Define dependency direction and intermodule communication.
- [ ] Define shared code, abstraction rules, and common-module boundaries.
- [x] Separate external implementations from application logic. [D-010 — Behavioral contracts and integration boundaries](docs/DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries), [D-011 — External interaction examples](docs/DOC-003-decisions.md#d-011--external-interaction-examples)
- [ ] Define integration boundaries and test substitutes.
- [ ] Specify persistence and transaction contracts that limit ORM coupling.
- [ ] If upload is selected, define its contract, ownership, access, validation, and storage mapping.
- [ ] If payment is selected, define its contract, statuses, idempotency, webhook authenticity, duplicate/out-of-order handling, and business-data consistency.

## 3. Code and folder conventions

- [ ] Define source, configuration, test, and documentation folders.
- [ ] Define naming for files, folders, classes, interfaces, types, functions, and variables.
- [ ] Choose TypeScript settings, explicit typing rules, and limits on `any` and assertions.
- [ ] Define imports, exports, aliases, and folder dependencies.
- [ ] Define `null`, `undefined`, optional properties, and defaults.
- [ ] Define formatting, linting, comments, code documentation, and automated enforcement.

## 4. API contracts

- [ ] Choose REST, GraphQL, WebSocket, or other interfaces as needed.
- [ ] Define endpoints, HTTP methods/statuses, and versioning.
- [ ] Define input validation, unknown-field handling, and request-size limits.
- [ ] Define success/error responses and stable error codes.
- [ ] Define pagination, filtering, sorting, and result limits.
- [ ] Define identifier, date/time, timezone, number, and money formats.
- [ ] Define compatibility, deprecation, and API documentation.

## 5. Data and transactions

- [ ] Identify storage needs and database/data-access selection criteria.
- [ ] Define table/collection, column, identifier, and timestamp naming.
- [ ] Define constraints, indexes, and data integrity rules.
- [ ] Define transactions, consistency, and concurrency handling.
- [ ] Define migrations, seeds, and development/test data.
- [ ] Define deletion, soft deletion, retention, and recovery.
- [ ] Define schema changes compatible with application deployments.

## 6. Authentication, authorization, and data protection

- [x] Require superadmin control over admin/user access. [D-007 — Configurable authorization](docs/DOC-003-decisions.md#d-007--configurable-authorization)
- [x] Register unique resource-type identities in the database; keep admin delegation adaptable. [D-012 — Resource identity and access policies](docs/DOC-003-decisions.md#d-012--resource-identity-and-access-policies)
- [x] Support public access to selected resources/operations. [D-012 — Resource identity and access policies](docs/DOC-003-decisions.md#d-012--resource-identity-and-access-policies)
- [ ] Define user identity needs and identity-provider integration.
- [ ] Choose session/token behavior, expiry, revocation, and logout.
- [ ] Define roles, permissions, resource ownership, and access checks.
- [ ] Define when admins may manage user access.
- [ ] Define resource catalogs, actions, scopes, delegation, and synchronization with code.
- [ ] Choose public-access metadata, such as `@Public()`, including granularity and authorization interaction.
- [ ] Define fixed/dynamic roles, inheritance, and role/direct-user grants.
- [ ] Define data scopes and whether hierarchy means organization or roles.
- [ ] Assess deny-by-default behavior and per-resource enforcement points.
- [ ] Define permission-management limits and last-administrator protection.
- [ ] Define when permission changes affect active sessions/tokens.
- [ ] Define tenant isolation if required.
- [ ] Classify sensitive data and define access, retention, and protection.
- [ ] Define secrets management, credential rotation, and least privilege.
- [ ] Define applicable request protections, including rate limits, CORS, and CSRF.
- [ ] Define audit trails and data excluded from logs.

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

- [ ] Classify validation, business, authorization, and infrastructure errors.
- [ ] Map internal errors to public responses without sensitive information.
- [ ] Define external-operation timeouts, retries, backoff, and attempt limits.
- [ ] Define idempotency and duplicate request/event handling.
- [ ] Define behavior during database or external-service failures.
- [ ] If jobs are needed, define failure handling, retries, and recovery.

## 9. Testing and completion criteria

- [ ] Define risk-based unit, integration, and end-to-end coverage.
- [ ] Define real dependencies, mocks, fixtures, and test-database isolation.
- [ ] Test important permission, validation, transaction, and failure paths.
- [ ] Assess contract, migration, security, and performance testing.
- [ ] Define required type checks, linting, and relevant tests before acceptance.
- [ ] Define Done across behavior, security, documentation, and schema changes.

## 10. Configuration and operations

- [ ] Define supported environments and configuration sources.
- [ ] Define startup validation, defaults, and secret-free configuration examples.
- [ ] Define structured logs, levels, request/correlation IDs, and sensitive-data redaction.
- [ ] Define metrics, tracing, alerts, and service targets.
- [ ] Define health checks, readiness, liveness, and graceful shutdown.
- [ ] Define hosting, packaging, and resource management.
- [ ] Define CI/CD, environment separation, and deployment access.
- [ ] Define deployment/migration ordering, rollback or forward recovery, and verification.
- [ ] Define backups, restore tests, log retention, and incident procedures.

## 11. Developer experience and maintenance

- [ ] Define first-checkout setup.
- [ ] Define standard development, build, quality, and test commands.
- [ ] Complete setup, contribution, and troubleshooting documentation.
- [x] Maintain conventions and decision records with the task list. [D-004 — Decision records and conventions](docs/DOC-003-decisions.md#d-004--decision-records-and-conventions)
- [ ] Add representative code examples for conventions.
- [x] Establish the decision-record format and location. [DOC-003 — Decision Records](docs/DOC-003-decisions.md)
- [ ] Define branch, commit, pull-request, and review practices.
- [ ] Choose a reference feature implementation.
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
| [D-005 — Scope and priorities](docs/DOC-003-decisions.md#d-005--scope-and-priorities) | Accepted |
| [D-006 — N-layered architecture, DI, and contracts](docs/DOC-003-decisions.md#d-006--n-layered-architecture-di-and-contracts) | Accepted |
| [D-007 — Configurable authorization](docs/DOC-003-decisions.md#d-007--configurable-authorization) | Accepted requirements; model details open |
| [D-008 — Upload and payment isolation](docs/DOC-003-decisions.md#d-008--upload-and-payment-isolation) | Superseded by [D-011 — External interaction examples](docs/DOC-003-decisions.md#d-011--external-interaction-examples) |
| [D-009 — One modular application with layers per feature](docs/DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature) | Accepted |
| [D-010 — Behavioral contracts and integration boundaries](docs/DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries) | Accepted |
| [D-011 — External interaction examples](docs/DOC-003-decisions.md#d-011--external-interaction-examples) | Accepted |
| [D-012 — Resource identity and access policies](docs/DOC-003-decisions.md#d-012--resource-identity-and-access-policies) | Accepted direction; model details open |
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

## Next discussions

- [x] Establish application shape and team size. [D-005 — Scope and priorities](docs/DOC-003-decisions.md#d-005--scope-and-priorities)
- [x] Choose the project/repository name. [D-014 — Descriptive project name](docs/DOC-003-decisions.md#d-014--descriptive-project-name)
- [ ] Define the resource catalog, admin delegation, and public-access mechanism.
- [ ] Finalize module layout, layer responsibilities, contracts, and DI wiring from the [DOC-004 — Conventions: Proposed implementation](docs/DOC-004-conventions.md#proposed-implementation).
- [ ] Choose 2–3 CRUD domains demonstrating access rules and module boundaries.
- [ ] Prioritize the remaining agenda and first-release scope.

## Implementation backlog

Add agreed tasks with outcomes, acceptance criteria, dependencies/decisions, and relevant verification. External software steps still require preflight and explicit approval.
