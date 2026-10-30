# DOC-003 — Decision Records

**Status:** Current register · **Updated:** 2026-10-30.
**Format record:** [D-019 — Lightweight decision documentation](DOC-003-decisions.md#d-019--lightweight-decision-documentation).

**Decision:** Keep stable decision IDs and explicit status. Every decision document states the decision and its reason; other sections are optional.

**Reason:** Make current agreements and their rationale easy to scan without boilerplate.

## Reading and writing records

- Read only records linked by the current task or needed to resolve a conflict.
- Use a short header with ID/title and status: Accepted, Proposed, Superseded, or Deferred, specifying the affected scope. Add dates, scope, and replacement links when useful.
- Require **Decision** and **Reason** in decision documents. Context, consequences, alternatives, pros/cons, and review triggers are optional; omit empty or unnecessary sections.
- A maintainer-confirmed change can replace an earlier rule. Mark the affected scope and link the replacement; preserve history and stable IDs.
- [D-001–D-003 — Original project decisions](DOC-003-decisions.md#d-001--nodejs-and-nestjs) retain their original 2026-10-27 dates. Historical extra sections remain for their useful context.

Active rules: [DOC-004 — Conventions](DOC-004-conventions.md). Progress: relevant [DOC-002 — Project Task List](../task-list.md).

## D-001 — Node.js and NestJS

**Status:** Accepted · **Date:** 2026-10-27.

- Reason: the maintainer requested a Node.js and NestJS backend template.
- Decision: use these as the technology direction.
- Consequences: exact runtime, package manager, framework, and dependency versions still require preflight and explicit approval.
- Review when: application needs, support status, or component security findings change.

## D-002 — Software supply chain policy

**Status:** Accepted · **Date:** 2026-10-27.

- Reason: the maintainer supplied a mandatory software supply chain policy.
- Decision: apply the [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md) to external software, including transitive dependencies, tools, AI skills, MCP servers, containers, and CI actions.
- Consequences: record evidence, findings, uncertainty, and a decision; obtain explicit approval before proceeding. UNKNOWN never means safe.
- Review when: the maintainer changes the policy.

## D-003 — Root task list

**Status:** Accepted · **Date:** 2026-10-27.

- Reason: discussions and work need a living repository checklist.
- Decision: keep `task-list.md` at the project root.
- Consequences: update progress and link decisions or results when discussions or tasks finish.
- Review when: the agreed workflow changes.

## D-004 — Decision records and conventions

**Status:** Accepted; record format updated by [D-019 — Lightweight decision documentation](DOC-003-decisions.md#d-019--lightweight-decision-documentation) · **Date:** 2026-10-28.

- Reason: tasks alone do not explain conventions or their rationale.
- Decision: document every agreed decision and reflect active rules in `docs/DOC-004-conventions.md`.
- Consequences: synchronize decisions, conventions, and affected tasks. Proposals remain explicitly provisional.
- Review when: more decisions or convention areas require splitting documents.

## D-005 — Scope and priorities

**Status:** Priorities/team accepted; CRUD scope superseded by [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) · **Date:** 2026-10-28.

- Reason: a solo developer or team of 2–3 needs a CRUD backend with access control.
- Original decision: cover authentication, flexible authorization, and 2–3 CRUD examples. Prioritize comprehension, delivery, code evolution, cleanliness, debugging, review, and coding speed.
- Scope update: [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) replaces the CRUD requirement and the later article/category/comment implementation scope. Small-team priorities remain active.
- Review when: team size, domains, priorities, or operational load change.

## D-006 — N-layered architecture, DI, and contracts

**Status:** Accepted · **Date:** 2026-10-28. Initially proposed, then confirmed by the maintainer on the same date.

- Reason: fast initial delivery must leave understandable boundaries for future domain, ORM, and architecture changes.
- Decision: use N-layered architecture, DI, and contracts between layers. Deployment follows each project's needs and resources.
- Consequences: specify contract behavior and wiring. Contracts contain migration impact, without guaranteeing a one-class replacement. [D-009 — One modular application with layers per feature](DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature) defines module organization; [D-010 — Behavioral contracts and integration boundaries](DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries) clarifies external implementation boundaries.
- Review when: contracts obstruct real needs, dependencies cross agreed boundaries, or dependency direction needs to change.
- Details: [DOC-004 — Conventions: 3. Architecture](DOC-004-conventions.md#3-architecture).

## D-007 — Configurable authorization

**Status:** Initial permission model defined by [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access); advanced delegation deferred · **Date:** 2026-10-28.

- Reason: superadmin must control admin/user access; CRUD examples need restrictions.
- Decision: make configurable authorization part of the template's foundation.
- Consequences: define permission managers, actions, resources, data scopes, and revocation behavior. Access levels do not imply automatic inheritance.
- Review when: user structure, delegation, scopes, or tenant isolation needs change.
- Open questions: [DOC-004 — Conventions: 4. Authorization](DOC-004-conventions.md#4-authorization).

## D-008 — Upload and payment isolation

**Status:** Superseded by [D-011 — External interaction examples](DOC-003-decisions.md#d-011--external-interaction-examples) · **Date:** 2026-10-28.

- Reason: upload and payment logic should be separate from business modules.
- Original decision: isolate these integrations behind provider-independent contracts.
- Consequences: specify behavior, required capabilities, business consistency, and migration impact; separate code does not require separate deployments.
- Clarification: the maintainer later confirmed upload and payment are examples, not mandatory first-release features.
- Review when: provider capabilities or operational needs change; current scope follows [D-011 — External interaction examples](DOC-003-decisions.md#d-011--external-interaction-examples).

## D-009 — One modular application with layers per feature

**Status:** Accepted · **Date:** 2026-10-28.

- Reason: the maintainer approved one application, organized by feature, with layers inside each module.
- Decision: use this modular organization as the foundation.
- Consequences: keep feature flows together for tracing and localized changes. Exact modules, folders, and intermodule communication remain open.
- Follow-up: the minimal module/folder layout and export rules were accepted in [D-030 — Minimal code layout and conventions](DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions).
- Logging extension: the main API retains this modular organization. [D-047 — Independent logging worker](DOC-003-decisions.md#d-047--independent-logging-worker) adds a separate operational process for logging; business features are not split into services.
- Review when: feature boundaries no longer fit the domain, cross-dependencies obstruct change, or deployment needs evolve.

## D-010 — Behavioral contracts and integration boundaries

**Status:** Accepted principles · **Date:** 2026-10-28. Contract specifications remain open.

- Reason: contracts must cover behavior and boundaries; services should not contain ORM, gateway, or external I/O implementations.
- Decision: define operations, behavior, and responsibilities through contracts; keep external implementations outside the service layer.
- Consequences: services coordinate application logic through contracts. Assess abstractions by traceability and controlled change cost. Inputs, outputs, errors, and transaction details remain open.
- Review when: contracts expose provider details, technology changes spread into services, or abstraction costs outweigh benefits.

## D-011 — External interaction examples

**Status:** Separation retained; initial external I/O scope superseded by [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) · **Date:** 2026-10-28. Previously replaced the scope in [D-008 — Upload and payment isolation](DOC-003-decisions.md#d-008--upload-and-payment-isolation).

- Reason: database access, upload, and payment illustrate external interactions.
- Decision: demonstrate this pattern through contracts and separate implementations; choose concrete examples according to release scope.
- Consequences: upload and payment are optional first-release examples. Selected examples still need transaction and cross-operation consistency design.
- Review when: representative examples or release scope change.
- Details: [DOC-004 — Conventions: 5. External interaction examples](DOC-004-conventions.md#5-external-interaction-examples).

## D-012 — Resource identity and access policies

**Status:** Database-backed implementation deferred by [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) · **Date:** 2026-10-28. Retained as a possible future extension.

- Reason: uniquely named resource types live in a database; superadmin manages access, admin delegation is adaptable, and some access is public.
- Decision: register resource identities in the database, support configurable admin delegation, and accommodate unauthenticated access. `@Public()` remains a candidate.
- Consequences: names identify resources but do not define actions, scopes, delegation, or authentication/authorization interaction. Schema and authorization technology remain unselected.
- Follow-up: initial code-owned permission keys, per-user in-memory grants, and `@Public()` are accepted in [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access). Database registration remains deferred.
- Review when: resource domains, access policies, or organizational models change.
- Open questions: [DOC-004 — Conventions: 4. Authorization](DOC-004-conventions.md#4-authorization).

## D-013 — Public GitHub repository

**Status:** Accepted publication intent · **Date:** 2026-10-28.

- Reason: the maintainer plans a public GitHub repository with a distinctive, memorable English name.
- Decision: prepare documentation for public use; [D-014 — Descriptive project name](DOC-003-decisions.md#d-014--descriptive-project-name) selects the name. The license was initially open and is now selected in [D-021 — MIT license and downstream scope](DOC-003-decisions.md#d-021--mit-license-and-downstream-scope).
- Consequences: the maintainer controls repository publication, commits, and pushes.
- History: English naming was confirmed before the final name was selected.
- Review when: naming or publication plans change.

## D-014 — Descriptive project name

**Status:** Accepted · **Date:** 2026-10-28.

- Reason: the maintainer prefers descriptive, memorable wording over branding.
- Decision: use `nest-layered-template` and the description: “A modular NestJS backend starter with clear boundaries, explicit contracts, and flexible authorization.”
- Consequences: apply the identity consistently. The maintainer added a remote and will commit and push after reviewing the prepared changes.
- Review when: project scope makes the name misleading or the maintainer requests a rename.

## D-015 — Concise English documentation

**Status:** Accepted · **Date:** 2026-10-28.

- Reason: repository documentation should be quick for developers to scan.
- Decision: write all documentation and agent instructions in concise, clear English.
- Consequences: retain technical meaning, context, statuses, history, and open questions. Keep the full supply chain policy in one canonical document.
- Review when: content becomes ambiguous, loses context, or repeats unnecessarily.

## D-016 — AI collaboration and attribution

**Status:** Accepted attribution requirement · **Date:** 2026-10-28.

- Reason: the maintainer requested visible AI collaboration, an agent guide, and the Codex model used.
- Decision: add `AGENTS.md` and credit OpenAI Codex in the README. Record GPT-6 as the model family identified in this session; the exact variant was unavailable.
- Consequences: the maintainer and AI assistant collaborate on design and documentation. Future attribution must reflect available session evidence, not an inferred product default.
- Review when: another assistant/model contributes or verified model metadata becomes available.

## D-017 — Versioned AI agreements and context recovery

**Status:** Accepted versioning; blanket context loading superseded by [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading) · **Date:** 2026-10-28.

- Reason: AI assistants must recover earlier agreements after context compaction and track changes without relying on memory.
- Decision: version AGENTS.md independently of application releases and retain a dated changelog linked to decision IDs. The original recovery rule required rereading all referenced documents; [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading) replaces that scope with task-based reading.
- Consequences: the first version is 1.0.0; the earlier guide is recorded as an unversioned baseline. Approved rule changes update the version, baseline, history, decisions, and affected documentation together. Unfinished work requires a concise task-list handoff covering scope, progress, next steps, questions, and approvals.
- Review when: version history or handoffs fail to reconstruct an agreement or current work accurately.

## D-018 — No improvisation and required clarification

**Status:** Accepted · **Date:** 2026-10-28.

- Reason: the maintainer requires explicit clarification to prevent invented requirements, assumed agreements, and unsupported LLM claims.
- Decision: AI assistants must not improvise. Ask the maintainer whenever a relevant point is unclear or a deviation is proposed, and obtain an answer or explicit approval before affected work.
- Consequences: distinguish facts, proposals, and unknowns; pause dependent work while continuing only clearly independent, authorized work. Silence is not approval. Record confirmed changes before relying on them.
- Review when: ambiguity remains unreported, assumptions appear as facts, or implementation exceeds approved scope.

## D-019 — Lightweight decision documentation

**Status:** Accepted · **Date:** 2026-10-28.

- Decision: use compact ADR-style headers to show status and related records. Decision documents require only the decision and its reason; context, consequences, alternatives, pros/cons, and review triggers are optional.
- Reason: make relevance and rationale visible while keeping documentation concise and useful.
- Replaces: the earlier mandatory context/consequences/review-trigger format associated with [D-004 — Decision records and conventions](DOC-003-decisions.md#d-004--decision-records-and-conventions). Its requirement to document agreed decisions remains active.

## D-020 — Task-based context loading

**Status:** Accepted · **Date:** 2026-10-28.

- Decision: keep AGENTS.md as a compact router. Load relevant documentation only when a task requires it, including the full supply chain policy before external software steps and Git conventions before Git writes. Retain version/history recovery and mandatory maintainer clarification.
- Reason: reduce unnecessary context loading while preserving approval gates and preventing unapproved improvisation.
- Replaces: [D-017 — Versioned AI agreements and context recovery](DOC-003-decisions.md#d-017--versioned-ai-agreements-and-context-recovery)'s blanket read-all recovery rule. Guide version 2.0.0 records this behavior change; earlier history remains in [DOC-006 — AI Working Agreements: Version history](DOC-006-agent-agreements.md#version-history).

## D-021 — MIT license and downstream scope

**Status:** Accepted · **Date:** 2026-10-28.

- Decision: adopt the unchanged MIT License, copyright 2026 salmanthoriq95. Permit commercial and closed-source forks, retain required notices, and explain upstream support/endorsement boundaries separately.
- Reason: the maintainer selected permissive reuse without license fees or warranty promises, and does not want independent forks or deployments treated as upstream responsibilities.
- Confirmation: MIT and GitHub-username attribution were explicitly selected. The username was read from the origin remote owner.
- Limits: MIT's disclaimers remain subject to applicable law and do not guarantee immunity from every claim. Third-party components keep their licenses.
- Details: [DOC-008 — Licensing and Community Scope](DOC-008-licensing.md).

## D-022 — Community conduct and reporting

**Status:** Reporting accepted; conduct wording proposed · **Date:** 2026-10-28.

- Decision: prepare an original, concise Code of Conduct draft for upstream spaces. Use GitHub reporting without publishing a project email, as selected by the maintainer.
- Reason: establish constructive participation standards and a usable reporting route without assuming control over independent communities or changing MIT permissions.
- Review needed: the maintainer must review the proposed behavior and moderation wording before adoption. GitHub Support reports are not automatically sent to the repository maintainer; admin reporting depends on availability.
- Draft: [DOC-009 — Code of Conduct](../CODE_OF_CONDUCT.md).

## D-023 — Document identifiers and descriptive references

**Status:** Accepted · **Date:** 2026-10-28.

- Decision: assign stable, ordered DOC-XXX identifiers to documentation filenames and titles. Keep existing D-XXX decision IDs and show the title beside each reference. Preserve standard root filenames and the unchanged MIT license text.
- Reason: make document order, purpose, and referenced decisions recognizable at a glance without opening each link.
- Scope: document IDs identify files; decision IDs identify agreements within them. Numeric order supports navigation, not mandatory sequential reading.

## D-024 — Article, category, and comment examples

**Status:** Superseded by [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template) · **Date:** 2026-10-29.

- Decision: use articles, categories, and comments as the three CRUD examples.
- Reason: the maintainer accepted these concrete domains as a starting point for access rules and module design.
- Historical note: the maintainer clarified that real entities and CRUD are not needed. Their relationships, lifecycle, and ownership are no longer initial-template prerequisites.

## D-025 — Minimum monitoring, backup, and disaster recovery

**Status:** Requirement, logging, and minimal liveness accepted; remaining baseline proposed · **Date:** 2026-10-29.

- Decision: add minimum monitoring, backup, and disaster recovery strategy to the template's scope.
- Reason: the maintainer wants a small, understandable reliability foundation that supports failure detection and recovery.
- Follow-up: [D-046 — Asynchronous logging and development diagnostics](DOC-003-decisions.md#d-046--asynchronous-logging-and-development-diagnostics), [D-047 — Independent logging worker](DOC-003-decisions.md#d-047--independent-logging-worker), and [D-052 — Minimal process health endpoints](DOC-003-decisions.md#d-052--minimal-process-health-endpoints) accept logging and basic liveness requirements; they do not approve all monitoring, backup, or recovery proposals.
- Open: approve the proposed [DOC-010 — Reliability Strategy](DOC-010-reliability.md), then choose project-specific tools, schedules, retention, alerting, RPO/RTO, and recovery procedures. No implementation or recovery guarantee is claimed.

## D-026 — Direct master workflow for this repository

**Status:** Accepted until explicitly changed · **Date:** 2026-10-29.

- Decision: work directly on master in this repository. Create or switch branches only when the maintainer explicitly requests it. General branching strategy belongs in a separate personal engineering handbook.
- Reason: the maintainer prefers direct commits for this project and will decide when branch separation is needed.
- Scope: this sets the workflow, not permission for the assistant to commit, push, change remotes, or create the handbook repository.

## D-027 — Conventional Commits message format

**Status:** Accepted · **Date:** 2026-10-29.

- Decision: use Conventional Commits 1.0.0 for commit messages, with optional scope/body/footers and explicit breaking-change markers.
- Reason: the maintainer explicitly selected this concrete format after clarifying the request for a common Git convention.
- Reference: [official Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/), retrieved 2026-10-29. No commit hooks or release automation are selected.

## D-028 — Placeholder-only access demonstration template

**Status:** Minimal scope retained; auth state extended by [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access) · **Date:** 2026-10-29.

- Decision: prepare a minimal template with access-response examples and persistence/integration placeholders only. No real article/category/comment CRUD, ORM, database, upload/payment provider, or permissions-management application is required initially.
- Reason: the maintainer wants a reusable skeleton that demonstrates access and extension locations, not a real application.
- Replaces: the CRUD implementation scope in [D-005 — Scope and priorities](DOC-003-decisions.md#d-005--scope-and-priorities) and [D-024 — Article, category, and comment examples](DOC-003-decisions.md#d-024--article-category-and-comment-examples). Initial real external I/O and database-backed permissions from earlier directions are deferred.
- Retained: N-layered modules, DI, clear contracts/boundaries, minimum reliability planning, and all approval requirements. Add future provider contracts/libraries only for a later agreed integration.
- Scope extension: [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access) adds actual in-memory authorization state; [D-036 — Minimal JWT identity and server-side access state](DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state) selects JWT identity. General feature persistence and external integrations remain placeholders; real CRUD and permission-management endpoints are not implied.
- Follow-up: code conventions and placeholder layout were accepted in [D-030 — Minimal code layout and conventions](DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions). Demo identity and exact endpoint/response contracts remain open.

## D-029 — Public, admin, and superadmin demo access

**Status:** Public/superadmin rules retained; unconditional admin access superseded by [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access) · **Date:** 2026-10-29.

- Decision: public access allows everyone; admin access allows admin and superadmin; superadmin access allows only superadmin. Demo handlers report allowed or denied access without real business operations.
- Reason: the maintainer requested the smallest meaningful access demonstration and explicitly confirmed that superadmin may access the admin example.
- Clarification: the maintainer confirmed automatic permission access for an authenticated superadmin, then accepted the granular model in [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access). An admin now needs the required grant for a protected permission endpoint.
- Open: exact route names/methods, endpoint input/result schemas, and token issuance. JWT identity is selected in [D-036 — Minimal JWT identity and server-side access state](DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state); a full login flow remains unselected.
- Follow-up: envelopes and access status defaults were accepted in [D-033 — Uniform JSON response envelope](DOC-003-decisions.md#d-033--uniform-json-response-envelope) and [D-034 — HTTP status standards and response examples](DOC-003-decisions.md#d-034--http-status-standards-and-response-examples).

## D-030 — Minimal code layout and conventions

**Status:** Accepted layout, contracts, DI, naming, and typing; tooling open · **Date:** 2026-10-29.

- Decision: use small `examples` and `auth` feature modules, controller/service separation, application-owned contracts, explicit constructor DI, and empty persistence/integration extension locations. Use abstract classes as injected contract tokens, with concise naming and strict typing rules.
- Reason: provide an easy-to-trace starting structure without unused layers or speculative provider APIs.
- Approval: the maintainer accepted the remaining code conventions while requesting a test-location decision, validation, and envelopes. The test choice is recorded separately below.
- Follow-up: [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access) extends the auth layout with permission metadata and an in-memory store behind a contract. The guard now checks permissions and trusted privileged roles; general feature persistence stays empty.
- Details: [DOC-011 — Code Conventions](DOC-011-code-conventions.md). Tool/version selection and software execution remain subject to preflight and explicit approval.

## D-031 — Minimal testing strategy and locations

**Status:** Accepted; tooling open · **Date:** 2026-10-29.

- Decision: keep unit tests beside source as `*.spec.ts` and HTTP tests in `test/` as `*.e2e-spec.ts`. Test meaningful behavior and important branches rather than every method. Verify the complete demo access matrix and agreed HTTP boundaries without real external services.
- Reason: keep tests close to the code while reserving one small HTTP suite for framework wiring and client-visible behavior. The maintainer explicitly selected this proposal.
- Details: [DOC-011 — Code Conventions: 5. Minimal testing strategy](DOC-011-code-conventions.md#5-minimal-testing-strategy). Test tools, commands, and numerical coverage thresholds are not selected.

## D-032 — HTTP input validation and XSS boundaries

**Status:** Accepted; endpoint schemas specified by follow-up records, tooling open · **Date:** 2026-10-29.

- Decision: validate and handle untrusted body, query, and path inputs at the HTTP boundary, including `GET` inputs, before application logic. Account for XSS risks without claiming that validation alone prevents them.
- Reason: the maintainer requested validators and input cleaning to reduce malformed-input and scripting risks.
- Accepted policy: field-specific normalization, strict field allowlists, explicit parsing, safe validation errors, and context-appropriate output handling. No blanket strip-tags behavior or sanitizer/validator dependency is selected.
- Approval: the maintainer explicitly accepted the HTTP proposals together with the expanded envelope.
- Details: [DOC-012 — HTTP Boundary Conventions](DOC-012-http-conventions.md).

## D-033 — Uniform JSON response envelope

**Status:** Accepted · **Date:** 2026-10-29.

- Decision: provide consistent JSON success and error envelopes, preserving actual HTTP status semantics and keeping transport wrapping outside services.
- Reason: the maintainer wants uniform client responses and requested more detail than the initial minimal `data`/`error` proposal.
- Accepted shape: `success`, `statusCode`, `message`, `data`, `error`, and `meta` with request ID and UTC timestamp; safe field-level error details where relevant. The minimal shape was declined; the maintainer then explicitly approved this replacement and HTTP boundary wiring.
- Details: [DOC-012 — HTTP Boundary Conventions: 4. Response envelope](DOC-012-http-conventions.md#4-response-envelope).

## D-034 — HTTP status standards and response examples

**Status:** Accepted; endpoint contracts added in [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants) · **Date:** 2026-10-29.

- Decision: document standard HTTP status usage, relevant headers, and response examples. Preserve bodyless response semantics rather than attaching JSON where the protocol forbids a body.
- Reason: the maintainer explicitly requested HTTP status standards and an example response for each documented status.
- Accepted mappings: `200` for granted demo access, `401` for missing/invalid authentication, `403` for insufficient access, and `400` for request-schema validation. Reserve `422` for an agreed semantic/domain rejection. Preserve protocol-required headers and bodyless responses.
- Details: [DOC-013 — HTTP Status and Response Examples](DOC-013-http-response-examples.md). Common status examples are a reference, not a requirement to implement new application features. Initial route/data schemas were later accepted in [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants).

## D-035 — Per-user permissions and public access

**Status:** Accepted; manual grants and endpoint policies specified by follow-up records · **Date:** 2026-10-29.

- Decision: use stable `resource:action` permission keys on protected endpoints, per-user grants in an in-memory store, and `@Public()` metadata for anonymous access. Keep permission definitions near their feature and grant storage behind an application-owned contract.
- Reason: the maintainer clarified that individual admins need different capabilities; a shared role alone does not express the intended access policy. Real article CRUD and a permission-management API are not implied.
- Access: an authenticated superadmin automatically passes permission checks. Read current role and grants from the server-side store; superadmin-only routes remain restricted to that role. Other callers need the endpoint's required grant. Public access is per route and does not make a permission globally public; input validation still applies.
- Updates: read current role/grants once per protected request. In one process, subsequent checks see changes in that store; this does not cancel requests already authorized. Cache behavior is deferred.
- Approval: the maintainer explicitly accepted all recommendations after reviewing permission placement, server-side lookup, JWT identity, and UUID public identifiers. Token and identifier choices are recorded separately below.
- Follow-up: grant changes are manual in storage, without a management endpoint, as accepted in [D-041 — In-memory demo accounts and manual grants](DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants).
- Contract follow-up: [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants) selects `examples:read`, the initial admin grant, fail-closed metadata, all-required permission matching, and superadmin-only metadata. Exact decorator implementation and internal contract methods remain open.
- Boundaries: in-memory state is process-local and resets on restart. Caching, shared persistence, real account CRUD, and provider integrations require later scope. No new dependency is selected or audited by this discussion.
- Reference: [NestJS authorization](https://docs.nestjs.com/security/authorization#claims-based-authorization), retrieved 2026-10-29.

## D-036 — Minimal JWT identity and server-side access state

**Status:** Accepted JWT architecture; token profile extended below; remaining contracts/tooling open · **Date:** 2026-10-29.

- Decision: use signed JWTs with minimal identity/validation claims. Resolve current role and permission grants from the server-side store using the authenticated subject; do not embed permission snapshots or custom encrypted permission payloads.
- Reason: permission changes should affect later checks without reissuing a token, and the grant list need not be exposed in token contents. Encrypting a bearer token does not prevent a holder from replaying it.
- Validation: verify the signature and expected claims, including issuer, audience, and validity period. Use the public user identifier for the subject. A caller-supplied role or an unverified token claim is not a trusted permission source.
- Initial limits: this selected neither a JWT library/version nor a signing algorithm, key configuration, token lifetime, transport, issuance, refresh, logout, or revocation workflow. Permission lookup alone does not revoke a leaked token's identity.
- Follow-up: minimal login, refresh, `.env` signing/expiry configuration, and Swagger-first use were selected in [D-038 — Minimal login, refresh, and environment configuration](DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration). Token/session claims and transport were later accepted in [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants).
- Profile update: [D-040 — HS256 tokens, refresh rotation, and immediate logout](DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout) selects token lifetimes, signing, and immediate logout. Protected requests also require active server-side session state; signature/expiry checks alone are insufficient.
- References: [OWASP REST Security: JWT](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#jwt), [RFC 6750: bearer-token properties](https://www.rfc-editor.org/rfc/rfc6750.html#section-1.2), retrieved 2026-10-29. No software preflight or execution approval is implied.

## D-037 — UUID v4 public user identifiers

**Status:** Accepted; database key design deferred · **Date:** 2026-10-29.

- Decision: expose UUID v4 user identifiers and use them as JWT subjects. Generate them through Node's built-in `crypto.randomUUID()` when the approved runtime is in place; no Hashids dependency is needed for this purpose.
- Reason: avoid exposing sequential numeric user identifiers while keeping the template small. Database primary keys remain a later schema choice.
- Boundary: UUIDs do not replace object-level authorization when real resources are added. Hashids is reversible ID encoding, not encryption; it is not the selected identifier strategy.
- References: [Node.js crypto.randomUUID](https://nodejs.org/api/crypto.html#cryptorandomuuidoptions), [Hashids security notice](https://github.com/niieani/hashids.js), [OWASP IDOR prevention](https://cheatsheetseries.owasp.org/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html), retrieved 2026-10-29. Exact runtime selection still requires preflight and explicit approval.

## D-038 — Minimal login, refresh, and environment configuration

**Status:** Requirements accepted; token lifecycle defined by [D-040 — HS256 tokens, refresh rotation, and immediate logout](DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout); remaining parameters open · **Date:** 2026-10-30.

- Decision: issue tokens through minimal login, support refresh, keep signing-key and expiry settings in `.env`, and use Swagger for initial manual testing. The maintainer explicitly clarified that “reset token” means refresh.
- Reason: provide a directly usable token flow with configurable secrets and lifetimes for the access template.
- Initial scope: this extended earlier deferral of token issuance without selecting account CRUD, password recovery, logout, a database, an external identity provider, or an exact software package/version. Later lifecycle/account approvals are linked below.
- Initially open: credentials/fixtures, signing profile, lifetimes, refresh mechanics, transport, logout, and exact routes/contracts. The follow-up records below capture the maintainer's later approvals; unspecified parameters remain open.
- Details: [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md) distinguishes accepted requirements, recommendations, and remaining choices. Software preflight and execution approval remain mandatory.
- Follow-up: token signing/lifetime/refresh and immediate logout were accepted in [D-040 — HS256 tokens, refresh rotation, and immediate logout](DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout). Two in-memory accounts and manual grant updates follow [D-041 — In-memory demo accounts and manual grants](DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants).

## D-039 — Swagger Basic Auth with bcrypt

**Status:** Requirements and Basic Auth accepted; implementation parameters open · **Date:** 2026-10-30.

- Decision: protect Swagger with HTTP Basic Auth. Configure its username through `SWAGGER_USERNAME` and its bcrypt password hash through `SWAGGER_PASSWORD_HASH` in `.env`; compare submitted passwords against the hash. Protect enabled documentation UI and schema routes without changing API authentication or permissions.
- Reason: the maintainer requested a password gate with bcrypt storage in `.env`, then explicitly selected the browser's username/password Basic Auth flow.
- Initial boundary: this selected bcrypt for documentation credentials. Application bcrypt was accepted later in [D-043 — Bcrypt application password hashing](DOC-003-decisions.md#d-043--bcrypt-application-password-hashing). Keep credential sources and API permissions separate. No exact bcrypt/Swagger middleware package or version is selected or audited.
- Follow-up: [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants) accepts Swagger routes, bcrypt cost/input defaults, and startup failure for invalid enabled-documentation credentials.
- Throttling follow-up: [D-059 — In-memory limiter and cleanup parameters](DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters) accepts a separate shared Swagger scope of 60 requests per IP per 60 seconds before Basic Auth, covering UI/schema/assets together.
- Open: environment-supplied credential values, parser/middleware implementation, deployment cost calibration, and exact software. The dummy-account password choice does not set Swagger credentials.
- Details: [DOC-014 — Authentication Lifecycle: 5. Swagger access protection](DOC-014-authentication-lifecycle.md#5-swagger-access-protection). Library selection and hash-generation execution require the full supply chain preflight and explicit approval.

## D-040 — HS256 tokens, refresh rotation, and immediate logout

**Status:** Accepted behavior; remaining contract/configuration details open · **Date:** 2026-10-30.

- Decision: use HS256 access JWTs with a default 15-minute lifetime and a random signing key of at least 256 bits. Use random opaque refresh tokens, storing their hashes and session binding in memory, with a seven-day refresh deadline from login. Rotate on successful refresh, reject reused tokens, and revoke the affected refresh family.
- Reason: the maintainer explicitly accepted the proposed durations/signing and refresh mechanics, then required logout to invalidate both access and refresh tokens immediately.
- Logout: revoke the current login session. Every protected access request must verify a server-issued session reference and its binding to the authenticated subject after JWT verification. Missing or revoked state returns `401`, including for superadmin. All access tokens previously issued for that session become unusable on later checks; its refresh tokens cannot mint replacements.
- Consistency: refreshing stays within the same login session. Refresh consumption/rotation and logout must not allow a revoked session to produce a new active branch. Already-authorized requests cannot be retroactively cancelled.
- Follow-up: [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants) accepts transport, route/claim/result schemas, independent sessions, expiry caps, strict rotation, and immediate whole-session revocation on refresh replay.
- Configuration follow-up: [D-045 — JWT configuration, validation, and key rotation](DOC-003-decisions.md#d-045--jwt-configuration-validation-and-key-rotation) accepts environment names, hex key encoding, startup validation, duration defaults, and manual key rotation.
- Limits: state-retention implementation and exact software remain open. All-device logout is not selected. This replaces the earlier unapproved proposal to let access JWTs remain usable after logout.
- References: [OWASP session invalidation](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#manual-session-expiration), [OWASP REST JWT state](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#jwt), retrieved 2026-10-30. Detailed rules: [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md). No exact software version or execution approval is implied.

## D-041 — In-memory demo accounts and manual grants

**Status:** Accepted; credentials, hashing, and grants specified by follow-up records · **Date:** 2026-10-30.

- Decision: provide exactly two dummy accounts: one superadmin and one admin. Keep their account data and password hashes in the in-memory fixture/storage adapter, not in `.env`. Change grants manually in storage; provide no grant-management endpoint.
- Reason: the maintainer wants a small template whose real projects replace the account/grant storage according to their needs. The maintainer explicitly rejected loading dummy-account credentials from `.env`.
- Boundary: `.env` continues to hold JWT signing/expiry configuration and Swagger Basic Auth credentials. The application accounts, Swagger gate, and JWT key are separate concerns. No database, account CRUD, registration, or delegation API is introduced.
- Updates: changing live in-memory grant data affects later checks. Editing fixture/seed source may require a restart; it does not add a runtime reload mechanism. Restart clears session state, so old access/refresh credentials cannot pass the required session checks.
- Follow-up: [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants) accepts usernames, initial grants, schemas, and bcrypt defaults. The algorithm is recorded in [D-043 — Bcrypt application password hashing](DOC-003-decisions.md#d-043--bcrypt-application-password-hashing); password values follow [D-044 — Public dummy login credentials](DOC-003-decisions.md#d-044--public-dummy-login-credentials).
- Open: actual fixture hashes/UUID values and internal contract methods. Hash generation requires an approved implementation and execution approval.
- Details: [DOC-004 — Conventions: 4. Authorization](DOC-004-conventions.md#4-authorization), [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md).

## D-042 — Minimal API contracts and initial demo grants

**Status:** Accepted · **Date:** 2026-10-30.

- Decision: expose login/refresh/logout and three access-message routes, seed admin with `examples:read`, and use explicit per-handler public/authenticated/permission/superadmin policies. Define concrete input/result schemas and session/Swagger defaults.
- Reason: turn the approved behavior into a small, reviewable contract before scaffolding and tests.
- Approval: the maintainer explicitly accepted the contract draft after selecting bcrypt for application accounts. This accepts its route names, grants, metadata rules, transport, JWT/session claims, replay/deadline rules, Swagger paths, bcrypt defaults, and documentation startup policy.
- Details: [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md). Exact software, hash generation, remaining runtime settings, and internal method signatures remain open. This design approval does not authorize external software execution or assistant Git writes.

## D-043 — Bcrypt application password hashing

**Status:** Accepted algorithm and contract defaults; implementation open · **Date:** 2026-10-30.

- Decision: use bcrypt for both in-memory application-account password hashes and the separately configured Swagger password hash. Keep their credential sources and access boundaries separate.
- Reason: after comparing Argon2id and bcrypt, the maintainer explicitly selected bcrypt for application accounts as well as Swagger.
- Alternative considered: OWASP prefers Argon2id for new applications; bcrypt was selected for consistency. Review byte limits, cost, supported hash formats, and verification behavior when choosing an implementation.
- Follow-up: [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants) accepts cost 12 as the starting default, at least 10 after deployment calibration, and a 72-byte input limit. [D-044 — Public dummy login credentials](DOC-003-decisions.md#d-044--public-dummy-login-credentials) selects the demo password values.
- Open: exact library/version and preflight, actual fixture hashes, generation workflow, and runtime performance. No hashing command has been run or approved by these design decisions.
- Reference: [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), retrieved 2026-10-30. Accepted parameters and contracts are in [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md).

## D-044 — Public dummy login credentials

**Status:** Accepted · **Date:** 2026-10-30.

- Decision: use password `dev123` for both application dummy usernames, `superadmin` and `admin`. Document these public example credentials; store bcrypt hashes in their in-memory fixtures, not plaintext passwords or application-account settings in `.env`.
- Reason: the maintainer explicitly chose one memorable password for both dummy logins used to try the template.
- Boundary: this choice applies only to the two application demo accounts. Swagger Basic Auth credentials and the JWT signing key remain separately configured through `.env`; neither receives this password as a default.
- Pending: generate fixture hashes only after full software preflight and explicit execution approval. No hash, signing key, or `.env` file has been generated.
- Details: [DOC-015 — Demo API Contracts: 1. Routes and initial grants](DOC-015-demo-api-contracts.md#1-routes-and-initial-grants).

## D-045 — JWT configuration, validation, and key rotation

**Status:** Accepted · **Date:** 2026-10-30.

- Decision: use `JWT_SIGNING_KEY`, `JWT_ACCESS_TTL_SECONDS`, and `AUTH_REFRESH_TTL_SECONDS`. Require a key generated from 32 random bytes, encoded as exactly 64 hexadecimal characters and decoded before HS256 use. Missing/invalid keys or supplied durations that are not positive integers stop startup without exposing values. Absent duration variables use 900 and 604800 seconds respectively.
- Reason: the maintainer accepted the complete configuration proposal to keep setup predictable, validate mistakes early, and make lifetime units explicit. `TTL` means Time To Live.
- Rotation: replace the key manually and restart. Restart clears in-memory sessions and requires fresh login. Automatic rotation and overlapping signing keys are outside the initial implementation.
- Boundary: access expiry remains capped by the session deadline; refresh rotation does not extend that deadline. Issuer/audience and separate Swagger settings retain their earlier accepted defaults. No actual key, `.env`, software selection, or execution is authorized or generated by this decision.
- Details: [DOC-014 — Authentication Lifecycle: 3. JWT configuration](DOC-014-authentication-lifecycle.md#3-jwt-configuration).

## D-046 — Asynchronous logging and development diagnostics

**Status:** Accepted; initial operating details resolved in D-058 · **Date:** 2026-10-30.

- Decision: use JSON console/stdout logs, UUID v4 request correlation, the accepted request metadata, and HTTP severity levels. Emit logs asynchronously in the background so responses do not wait for persistence. Persist unexpected application faults to local `.json` files. Additional body/query/header context is development-only; secrets stay excluded in every environment.
- Reason: the maintainer accepted the logging baseline with async behavior, error-file persistence, and development-only request diagnostics, then explicitly allowed responses to finish before background file writes.
- Clarification: persist unexpected faults such as application bugs, not expected validation failures. Failure classification replaces the ambiguous “>500” threshold; catching a fault at the global HTTP boundary does not make it expected. Pre-startup and fatal-error handling follow [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy).
- Boundary: this adds real local logging persistence without adding a database or real domain persistence. Development capture, buffering/failure behavior, file settings, and lifecycle policies were subsequently accepted in [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy). No logging package or implementation is selected or executed.
- Follow-up: [D-047 — Independent logging worker](DOC-003-decisions.md#d-047--independent-logging-worker) places output and persistence in a separate process.
- File grouping: [D-048 — Daily JSON error files](DOC-003-decisions.md#d-048--daily-json-error-files) selects one array-based JSON file per day.
- Details: [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md).

## D-047 — Independent logging worker

**Status:** Accepted; initial launch/lifecycle resolved in D-058, production supervision deferred · **Date:** 2026-10-30.

- Decision: separate logging from the main API into an independently running process that owns log output and unexpected-error persistence. Keep the API modular and layered; this adds a dedicated logging process rather than splitting business features.
- Reason: the maintainer wants the logging worker to remain alive and continue processing received events when the backend crashes.
- Boundary: process isolation does not recover events that were never sent or guarantee survival of a shared host failure. Keep transport/file details outside application services through contracts and DI. No broker, process manager, additional runtime/package, or execution is approved.
- Follow-up: [D-048 — Daily JSON error files](DOC-003-decisions.md#d-048--daily-json-error-files) selects daily arrays; [D-049 — Best-effort internal HTTP logging delivery](DOC-003-decisions.md#d-049--best-effort-internal-http-logging-delivery) selects transport and send-failure behavior.
- Operating follow-up: [D-053–D-057 — Worker addressing, authentication, delivery timeout, retries, and concurrency](DOC-003-decisions.md#d-053--default-logging-worker-ingestion-address) and [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy) resolve the initial operating choices. Production supervision and exact software remain separate work.
- Details: [DOC-016 — Logging Conventions: 4. Worker and delivery boundary](DOC-016-logging-conventions.md#4-worker-and-delivery-boundary).

## D-048 — Daily JSON error files

**Status:** Accepted; initial file operating details resolved in D-058 · **Date:** 2026-10-30.

- Decision: the independent logging worker groups unexpected-error records into one `.json` file per day, whose top-level value is a JSON array. Coordinate updates to preserve a valid document under concurrent events.
- Reason: after the per-event file option was explained, the maintainer explicitly chose one daily file containing an array of errors.
- Operating follow-up: [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy) accepts UTC grouping, file path/schema, serialized replacement writes, recovery/access rules, seven-day retention, and a 10 MiB daily limit. Transport follows [D-049 — Best-effort internal HTTP logging delivery](DOC-003-decisions.md#d-049--best-effort-internal-http-logging-delivery). No runtime file has been created.
- Details: [DOC-016 — Logging Conventions: 5. File layout and remaining choices](DOC-016-logging-conventions.md#5-file-layout-and-remaining-choices).

## D-049 — Best-effort internal HTTP logging delivery

**Status:** Accepted; initial ingestion/operating policy resolved in D-058 · **Date:** 2026-10-30.

- Decision: the API depends on a logging contract; an adapter sends sanitized events to the independent worker through internal HTTP in the background. The worker handles normal output and daily unexpected-error persistence. API responses do not wait for delivery or file writes.
- Reason: the maintainer accepted the proposed simple transport and best-effort behavior for the initial version, keeping delivery details outside main application services.
- Failure behavior: if sending fails, keep serving API requests and emit a sanitized local `stderr` diagnostic. Do not change the API response or recursively send that fallback through the failed logger transport.
- Delivery limits: events not yet received by the worker can be lost if the API crashes or delivery fails. This is not a durable or zero-loss delivery guarantee.
- Address follow-up: [D-053 — Default logging worker ingestion address](DOC-003-decisions.md#d-053--default-logging-worker-ingestion-address) selects the initial same-host listener and ingestion URL, with an environment-configurable API target.
- Authentication follow-up: [D-054 — Shared-token logging worker authentication](DOC-003-decisions.md#d-054--shared-token-logging-worker-authentication) selects the dedicated shared credential, header, and rejection behavior.
- Timeout follow-up: [D-055 — Logging delivery timeout and cancellation](DOC-003-decisions.md#d-055--logging-delivery-timeout-and-cancellation) accepts a one-second default total timeout per attempt and active cancellation.
- Retry follow-up: [D-056 — Single-attempt logging delivery](DOC-003-decisions.md#d-056--single-attempt-logging-delivery) selects one attempt per event with no automatic retry for the initial version.
- Concurrency follow-up: [D-057 — Concurrent logging delivery limit](DOC-003-decisions.md#d-057--concurrent-logging-delivery-limit) accepts at most ten active HTTP deliveries per API process by default.
- Operating follow-up: [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy) accepts ingestion/202 acknowledgment, queue bounds, shutdown handling, separate manual launch, file/development settings, and configuration validation. Exact software and deployment supervision remain separate; this decision does not approve installation, execution, commit, or push.
- Details: [DOC-016 — Logging Conventions: 4. Worker and delivery boundary](DOC-016-logging-conventions.md#4-worker-and-delivery-boundary).

## D-050 — Login and refresh rate limits and proxy trust

**Status:** Accepted; parameters resolved in D-059, implementation/tooling pending · **Date:** 2026-10-30.

- Decision: default to 5 login requests and 30 refresh requests per 60 seconds, counted separately per client IP and endpoint, including successes and failures. Configure limits/periods through `.env`; invalid settings stop startup. Counters stay in API-process memory and reset on restart.
- Reason: the maintainer accepted the complete initial rate-limit proposal for the template, with adjustable defaults and a small in-memory implementation.
- Rejection: return `429` with the accepted envelope, `RATE_LIMITED`, `Retry-After` reflecting the remaining wait, and `Cache-Control: no-store`.
- Proxy trust: default to the direct peer's IP and no trusted proxy. Proxy deployments must explicitly identify trusted proxies before using forwarded client IP; a raw client-supplied header is not authoritative.
- Cleanup follow-up: [D-051 — Periodic in-memory state cleanup](DOC-003-decisions.md#d-051--periodic-in-memory-state-cleanup) accepts periodic removal of expired counters while preserving rate-limit semantics.
- Parameter follow-up: [D-059 — In-memory limiter and cleanup parameters](DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters) accepts exact sliding-window admission/counting, configuration/validation, proxy-list format, cleanup lifecycle, and a separate Swagger quota.
- Boundary: actual trusted proxy addresses, implementation, and exact software/preflight remain separate. No proxy product, HTTP adapter, rate-limit package, distributed counter store, or execution command is selected.
- Details: [DOC-014 — Authentication Lifecycle: Rate limiting and proxy trust](DOC-014-authentication-lifecycle.md#rate-limiting-and-proxy-trust).

## D-051 — Periodic in-memory state cleanup

**Status:** Accepted; configuration/timer parameters resolved in D-059, implementation pending · **Date:** 2026-10-30.

- Decision: clean expired session/refresh state and rate-limit counters periodically, using a default 60-second interval configurable through `.env`. Keep validity checks on requests independent of this schedule. Preserve consumed refresh-token evidence until the session deadline; keep dummy accounts and grants available.
- Reason: the maintainer accepted periodic memory cleanup while retaining immediate expiry/revocation enforcement and refresh replay detection.
- Boundary: remove only runtime state that no longer affects the accepted token or rate-limit behavior. Cleanup runs in the API's process-local state; the logging worker does not own this state. No new persistence, scheduler package, runtime execution, or Git write is authorized.
- Parameter follow-up: [D-059 — In-memory limiter and cleanup parameters](DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters) accepts the native timer lifecycle, configuration/validation, and replay-safe expiry-pruning behavior. Exact internal method signatures, software approval, and implementation remain separate.
- Details: [DOC-014 — Authentication Lifecycle: In-memory cleanup](DOC-014-authentication-lifecycle.md#in-memory-cleanup).

## D-052 — Minimal process health endpoints

**Status:** Accepted; implementation pending · **Date:** 2026-10-30.

- Decision: expose unauthenticated `GET /health` on the API and logging worker at their respective addresses. Respond with `200`, the standard envelope, message `Service is running`, `data: { "status": "ok" }`, and `Cache-Control: no-store`.
- Reason: provide a minimal liveness check for each independently running process.
- Approval: the maintainer accepted every row of the minimal health-check proposal.
- Boundary: check the responding process. The API's health does not depend on worker availability. Dependency readiness, monitoring schedules/alerts, and deployment tooling remain separate decisions. This approval selects no library, runtime/version, or execution command.
- Details: [DOC-010 — Reliability Strategy: Minimal health checks](DOC-010-reliability.md#minimal-health-checks), [DOC-015 — Demo API Contracts: Health responses](DOC-015-demo-api-contracts.md#health-responses).

## D-053 — Default logging worker ingestion address

**Status:** Accepted initial default; settings resolved in D-058 · **Date:** 2026-10-30.

- Decision: initially run the API and logging worker as separate processes on the same host. Listen on `127.0.0.1:3001` and receive logs through `POST /internal/logs`, giving the default API target `http://127.0.0.1:3001/internal/logs`. Allow the target address to be configured through `.env` for deployment needs.
- Reason: the maintainer accepted this concrete local default for now while retaining configurable deployment addressing.
- Boundary: preserve independent worker lifecycle and best-effort delivery. The existing unauthenticated worker health route remains `GET /health`. Payload/reply schemas and configuration follow [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy); non-loopback deployment, software selection, and execution remain separate. Authentication follows [D-054 — Shared-token logging worker authentication](DOC-003-decisions.md#d-054--shared-token-logging-worker-authentication).
- Details: [DOC-016 — Logging Conventions: Default ingestion address](DOC-016-logging-conventions.md#default-ingestion-address).

## D-054 — Shared-token logging worker authentication

**Status:** Accepted; credential/configuration policy resolved in D-058 · **Date:** 2026-10-30.

- Decision: protect `POST /internal/logs` using a dedicated random static `LOG_WORKER_TOKEN`, configured with the same value in the API and worker `.env` settings. Send it as `Authorization: Bearer <LOG_WORKER_TOKEN>`; missing or mismatched request credentials return `401`. Redact the token in all modes and log outputs. Worker `GET /health` remains unauthenticated.
- Reason: the maintainer explicitly accepted the proposed shared-token mechanism for local API-to-worker communication.
- Boundary: this is a dedicated machine credential for log delivery. Its random-byte/hex format, startup validation, and manual rotation follow [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy). Non-loopback deployment remains separate. No actual secret, runtime file, software selection, or execution is generated or approved by this decision.
- Details: [DOC-016 — Logging Conventions: Ingestion authentication](DOC-016-logging-conventions.md#ingestion-authentication).

## D-055 — Logging delivery timeout and cancellation

**Status:** Accepted; validation resolved in D-058, HTTP client selection pending · **Date:** 2026-10-30.

- Decision: default each HTTP log-delivery attempt to a total timeout of 1000 milliseconds, configurable through `LOG_WORKER_TIMEOUT_MS` in `.env`. Actively cancel an unfinished request when the deadline is reached and emit the accepted safe local `stderr` diagnostic. API responses remain independent of logging completion.
- Reason: the maintainer accepted the proposed one-second bound and explicit cancellation for background log delivery.
- Boundary: cancellation affects the local HTTP attempt; the worker might already have received or stored its event. This does not select retry behavior, queue bounds, an HTTP client/library, exact runtime versions, or execution.
- Details: [DOC-016 — Logging Conventions: Delivery timeout](DOC-016-logging-conventions.md#delivery-timeout).

## D-056 — Single-attempt logging delivery

**Status:** Accepted for the initial version · **Date:** 2026-10-30.

- Decision: make one HTTP delivery attempt per log event, with no automatic retry after failure or timeout. Emit the accepted safe local `stderr` diagnostic on failure and continue processing later events without changing the main API response.
- Reason: the maintainer accepted this simple initial behavior and its delivery-loss trade-off. Repeating a POST with an uncertain outcome could create duplicate records.
- Boundary: honor this rule in the HTTP client as well as the logging adapter. Delivery remains best effort; a timeout does not prove the worker never received the event. Queue, acknowledgment, and shutdown behavior follow [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy); concurrency follows [D-057 — Concurrent logging delivery limit](DOC-003-decisions.md#d-057--concurrent-logging-delivery-limit). No HTTP client/library or execution is selected.
- Details: [DOC-016 — Logging Conventions: Delivery retries](DOC-016-logging-conventions.md#delivery-retries).

## D-057 — Concurrent logging delivery limit

**Status:** Accepted default · **Date:** 2026-10-30.

- Decision: allow at most ten active HTTP log deliveries per API process by default, configurable through `LOG_WORKER_MAX_CONCURRENT_REQUESTS=10` in `.env`.
- Reason: the maintainer accepted this concrete initial bound on simultaneous background sends.
- Boundary: this limits log deliveries, not main API request concurrency or requests per second. Queue capacity, overflow, and worker processing follow [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy). No HTTP client/library or execution is selected.
- Details: [DOC-016 — Logging Conventions: Concurrent deliveries](DOC-016-logging-conventions.md#concurrent-deliveries).

## D-058 — Minimal logging operating policy

**Status:** Accepted for the initial version · **Date:** 2026-10-30.

- Decision: adopt all nine operating groups in [DOC-016 — Logging Conventions: 6. Initial logging operating policy](DOC-016-logging-conventions.md#6-initial-logging-operating-policy): queues/overflow, ingestion/acknowledgment, development capture, safe exception details, daily files/retention, writing/recovery, process layout/lifecycle, credential handling, and configuration defaults.
- Reason: the maintainer explicitly accepted the complete package, resolving the remaining first-version logging policy in one review and keeping the template bounded and understandable.
- Approval: the maintainer answered “setuju semua” to the numbered 1–9 proposal. Defaults and failure/loss trade-offs are accepted; implementation has not started.
- Boundary: delivery remains best effort. Exact runtime/tooling versions, software preflight/execution, build commands, and production supervision/non-loopback deployment remain separate work. No source, secret, runtime file, commit, or push is created by this documentation approval.

## D-059 — In-memory limiter and cleanup parameters

**Status:** Accepted for the initial version · **Date:** 2026-10-30.

- Decision: adopt all six parameter groups: exact sliding-window admission/counting, named environment defaults and validation, one process-owned cleanup timer and its lifecycle, expiry pruning that preserves replay evidence, an explicit proxy-address list, and a separate 60-request/60-second Swagger scope.
- Reason: the maintainer accepted the complete package, resolving the remaining limiter/cleanup policy in one review with precise window behavior and no additional scheduler service or package selected.
- Approval: the maintainer answered “setuju semua” to the numbered 1–6 proposal. Existing login/refresh quotas and cleanup-retention constraints retain their earlier approvals.
- Boundary: exact software/preflight, internal method signatures, actual deployment proxy addresses, and implementation remain separate. No source, `.env`, runtime execution, commit, or push is included in this documentation approval.
- Details: [DOC-014 — Authentication Lifecycle: Limiter and cleanup parameters](DOC-014-authentication-lifecycle.md#limiter-and-cleanup-parameters).

## D-060 — Initial tooling candidate review

**Status:** Tooling direction accepted; exact candidates/preflight UNKNOWN · **Date:** 2026-10-30.

- Decision: use npm, ESM/NodeNext, TypeScript compilation through `tsc`, native Node tests/assertions/HTTP requests, and ESLint/typescript-eslint/Prettier as the tooling direction. Continue reviewing candidate versions in [DOC-017 — Tooling Preflight](DOC-017-tooling-preflight.md) before any artifact adoption or execution.
- Reason: the maintainer accepted the proposed convention profile to keep tooling small and understandable while retaining supply-chain control.
- Approval: the maintainer explicitly agreed to the tooling direction, then requested Node 24/LTS review and alternatives to ORM, scheduler, and validator integrations. This does not adopt Express, class-validator, or other candidate libraries.
- Evidence boundary: this is an incomplete initial assessment, not an audit completion or software selection. Registry access, full dependency resolution, support commitments, provider signals, and artifact integrity/provenance remain incomplete; the outcome is UNKNOWN.
- Approval boundary: accepted tooling conventions do not waive preflight or authorize a commit/push, software download/install/execution, or a new ORM/scheduler/validator integration. Details: [DOC-011 — Code Conventions: 7. Tooling direction](DOC-011-code-conventions.md#7-tooling-direction).

## D-061 — LTS-first runtime review

**Status:** Accepted review policy; runtime direction resolved by D-063 · **Date:** 2026-10-30.

- Decision: prioritize the latest supported Node LTS release/current patch. Check Node 24's current patch alongside the newest LTS line, disclose security and compatibility findings, offer alternatives, and let the maintainer choose the exact runtime before adoption.
- Reason: the maintainer wants supported runtime updates and control over security/compatibility trade-offs.
- Original boundary: “TLS” was interpreted as LTS in this runtime context. Neither Node `24.22.2` nor `26.13.0` was adopted by that request. [D-063 — Node 26 runtime direction](#d-063--node-26-runtime-direction) later selects Node 26; full preflight and explicit execution approval remain mandatory.
- Details: [DOC-017 — Tooling Preflight: Node LTS comparison](DOC-017-tooling-preflight.md#node-lts-comparison).

## D-062 — ORM, scheduler, and validator comparison

**Status:** Comparison retained; validator resolved by D-064, further review in D-065/D-066 · **Date:** 2026-10-30.

- Decision: document alternative persistence tools, calendar schedulers, and schema validators with syntax, trade-offs, compatibility, and unresolved security evidence. The maintainer clarified that “worker” meant scheduler.
- Reason: the maintainer had poor experiences with the customary integrations and wants understandable alternatives before choosing.
- Original boundary: this authorized comparison only. General persistence remains placeholders; no ORM/database is added. The accepted native cleanup timer and independent logging process remain separate. [D-064 — Zod validation direction](#d-064--zod-validation-direction) later selects Zod as a design choice; no artifact is cleared for installation/execution.
- Details: [DOC-018 — Integration Alternatives](DOC-018-integration-alternatives.md).

## D-063 — Node 26 runtime direction

**Status:** Accepted runtime line; artifact clearance UNKNOWN · **Date:** 2026-10-30.

- Decision: use the latest supported Node 26 patch after confirming its LTS status. The verified review target on this date is `26.13.0`, bundled with npm `11.20.0`; recheck the latest patch before preparing installation.
- Reason: the maintainer chose Node 26 if its LTS status was confirmed. Official release metadata confirms that Node 26 entered LTS on 2026-10-28.
- Boundary: this resolves the runtime-line choice in [D-061 — LTS-first runtime review](#d-061--lts-first-runtime-review), not software eligibility or execution. It does not introduce automatic upgrades, installation, platform selection, or a version file before full preflight and explicit execution approval.
- Details: [DOC-017 — Tooling Preflight: Node LTS comparison](DOC-017-tooling-preflight.md#node-lts-comparison).

## D-064 — Zod validation direction

**Status:** Accepted design choice; exact artifact/configuration pending · **Date:** 2026-10-30.

- Decision: use Zod for request-validation schemas. Retain accepted field normalization, unknown-field rejection, safe validation errors, HTTP envelopes, and Swagger contracts.
- Reason: the maintainer prefers Zod's readability.
- Boundary: `4.6.7` remains the current review target, not an independently approved artifact. Exact package/adapter versions, schemas, Swagger mapping, and installation/execution remain subject to preflight and approval. This resolves the validator comparison in [D-062 — ORM, scheduler, and validator comparison](#d-062--orm-scheduler-and-validator-comparison).
- Details: [DOC-018 — Integration Alternatives: 4. Validator alternatives](DOC-018-integration-alternatives.md#4-validator-alternatives).

## D-065 — Drizzle security and compatibility review

**Status:** Review retained; ORM direction resolved by D-069 · **Date:** 2026-10-30.

- Decision: review Drizzle's security and Node 26 compatibility, using stable `drizzle-orm@0.45.4` as the current review target. Keep database, driver, Drizzle Kit, and integration choices open.
- Reason: the maintainer has used Drizzle comfortably and wants current evidence before choosing a future persistence implementation.
- Boundary: this is not approval to add an ORM or database to the placeholder-only template. The known identifier-injection advisory is fixed before the review target, but artifact clearance and full driver/tooling compatibility remain UNKNOWN.
- Details: [DOC-019 — Drizzle Security and Compatibility Review](DOC-019-drizzle-review.md).

## D-066 — Readable scheduling preference

**Status:** Accepted preference; scheduler direction resolved by D-067 · **Date:** 2026-10-30.

- Decision: compare durations, numeric time units, and explicit calendar fields instead of requiring maintainers to read cron expressions. Keep intervals distinct from daily wall-clock schedules. The earlier node-cron/Croner examples are not selected.
- Reason: the maintainer finds cron expressions difficult to read and requested forms such as `1h`, `14:00:00`, or calculated durations.
- Original boundary: no custom scheduling API, parser, library, job, timezone default, or lifecycle change was approved by that comparison. [D-067 — Node Schedule direction](#d-067--node-schedule-direction) later selects Node Schedule as a design direction. The native cleanup timer and independent logging process retain their accepted behavior.
- Details: [DOC-018 — Integration Alternatives: 6. Readable scheduling options](DOC-018-integration-alternatives.md#6-readable-scheduling-options).

## D-067 — Node Schedule direction

**Status:** Accepted design choice; exact artifact/configuration pending · **Date:** 2026-10-30.

- Decision: use Node Schedule as the scheduler direction, with explicit recurrence fields rather than requiring cron strings.
- Reason: the maintainer selected Node Schedule after reviewing readable duration and calendar alternatives.
- Boundary: exact published version, Node 26 compatibility, dependency/advisory/provenance checks, installation, and execution remain pending. This does not create a calendar job, adopt the sample timezone, replace the accepted native cleanup timer, or merge logging into the API process.
- Evidence boundary: earlier tagged review target `2.1.0` and current moving-source manifest `2.1.2` are distinct observations. Registry metadata was inaccessible; neither establishes the exact artifact to install.
- Details: [DOC-018 — Integration Alternatives: Node Schedule: explicit calendar fields](DOC-018-integration-alternatives.md#node-schedule-explicit-calendar-fields).

## D-068 — Additional persistence alternatives

**Status:** Comparison retained; ORM direction resolved by D-069 · **Date:** 2026-10-30.

- Decision: compare Kysely, Knex, and MikroORM as additional persistence options, including syntax, abstraction costs, Node 26 declarations, and unresolved security evidence. Keep Drizzle/Prisma out of this new comparison while preserving earlier records.
- Reason: the maintainer requested options beyond Drizzle and Prisma before choosing a persistence direction.
- Boundary: no database, driver, ORM/query builder, migrations, provider contracts, or real CRUD are added. The template retains general persistence placeholders and in-memory auth storage. Comparison targets remain UNKNOWN for installation/execution until full preflight and approval.
- Details: [DOC-020 — Persistence Alternatives](DOC-020-persistence-alternatives.md).

## D-069 — Prisma ORM direction

**Status:** Accepted future ORM direction; exact artifacts/integration pending · **Date:** 2026-10-30.

- Decision: use Prisma when a consuming project adds database persistence. Close the ORM/query-builder comparison without adding a database implementation to the initial template.
- Reason: the maintainer prefers Prisma for its perceived ecosystem maturity. This records the maintainer's selection, not a verified ranking of every alternative.
- Resolves: the unselected ORM direction in [D-068 — Additional persistence alternatives](#d-068--additional-persistence-alternatives); the earlier [D-065 — Drizzle security and compatibility review](#d-065--drizzle-security-and-compatibility-review) remains historical evidence, not the selected direction.
- Boundary: initial persistence stays placeholders, auth accounts/grants/sessions stay in memory, and logging keeps its independent process/file boundary. No schema, migrations, client generation, driver, database, real CRUD, installation, or execution is authorized by this design choice.
- Version boundary: the earlier Prisma `7.10.1` example is a historical review target, not an approved version or a claim about the latest release. Recheck exact versions, Node 26 support, advisories, dependencies, scripts, and artifact provenance before future integration under the full supply-chain policy.
- Details: [DOC-011 — Code Conventions: 7. Tooling direction](DOC-011-code-conventions.md#7-tooling-direction), [DOC-017 — Tooling Preflight](DOC-017-tooling-preflight.md).

## D-070 — Initial scaffold configuration

**Status:** Accepted profile; refined by [D-073 — ESNext and verified application builds](#d-073--esnext-and-verified-application-builds) and [D-074 — Internal contract inputs and values](#d-074--internal-contract-inputs-and-values); exact artifacts/configuration pending · **Date:** 2026-10-30.

- Decision: use Express, TypeScript `strict` without the two proposed extra strictness flags, basic lint, default Prettier, native automatic watch, `@nestjs/config` with Zod, synchronous in-memory operations where appropriate, typed application errors, and `npm test` covering unit and HTTP tests. Provide focused test commands and an aggregate `npm run check`.
- Reason: the maintainer explicitly chose this baseline to keep development familiar and understandable, without speculative async contracts or extra lint/format policy.
- Approval: interpret the numbered reply by content. Basic lint was repeated; the following answers clearly selected default Prettier, watch, the configuration package, sync memory, typed errors, and both test scopes. This does not approve a custom formatting profile or type-aware lint.
- Boundary: preserve all accepted auth/HTTP/logging behavior, initial placeholders, native cleanup, and independent processes. Exact scripts/config files, compiler target/remaining flags, contract signatures, artifacts, installation/execution, and Git writes remain separate review items.
- Details: [DOC-021 — Initial Scaffold Profile: 1. Configuration profile](DOC-021-scaffold-profile.md#1-configuration-profile).

## D-071 — First-release acceptance and review

**Status:** Accepted criteria and review method; implementation/verification pending · **Date:** 2026-10-30.

- Decision: review the completed first version together. Require passing build/type/lint/format and all unit/HTTP checks, a working agreed Swagger workflow, continued API service while the logging worker is unavailable, and usable README/`.env.example` instructions for both processes.
- Reason: after the test-command answer, the maintainer explicitly selected “A — Tinjau hasil lengkap sekaligus” in the acceptance/review clarification.
- Boundary: these are required outcomes, not reported test results. Incremental implementation/checking remains possible; no new feature, numerical coverage target, commit/push, publication, installation, or execution is authorized.
- Details: [DOC-021 — Initial Scaffold Profile: 3. First-release acceptance and review](DOC-021-scaffold-profile.md#3-first-release-acceptance-and-review).

## D-072 — JWT and native bcrypt implementations

**Status:** Accepted implementation directions; artifact clearance UNKNOWN · **Date:** 2026-10-30.

- Decision: use `jose` behind the identity contract and native `bcrypt` for application/Swagger password checks. The selected bcrypt review baseline is `6.0.0`; jose's current review target remains `6.2.14`.
- Reason: the maintainer explicitly selected jose and native bcrypt from the presented alternatives.
- Boundary: preserve HS256/session rules and bcrypt cost/length limits. These choices do not clear published artifacts, native binaries, install hooks, or execution. Bcryptjs and Nest JWT remain historical alternatives.
- Details: [DOC-021 — Initial Scaffold Profile: 5. Implementation selections](DOC-021-scaffold-profile.md#5-implementation-selections), [DOC-017 — Tooling Preflight](DOC-017-tooling-preflight.md).

## D-073 — ESNext and verified application builds

**Status:** Accepted target and build/test behavior; scripts/configuration pending · **Date:** 2026-10-30.

- Decision: target `ESNext` with the accepted strict/ESM/NodeNext profile. Separate build/test configurations and outputs. Require type checking and executed unit/HTTP tests against compiled JavaScript before build success; exclude tests from application artifacts.
- Reason: the maintainer chose ESNext and separate configurations, then confirmed the recommendation to execute compiled tests as part of build verification.
- Clarification: TypeScript compilation does not run behavioral tests. Shipping artifacts without tests does not remove the build-time test requirement or imply identical behavior in every environment.
- Boundary: keep focused test commands and aggregate checks without recursive command composition or redundant full-suite runs. Exact flags, paths, scripts, and software execution remain review items.
- Refines: compiler-target/build details left open in [D-070 — Initial scaffold configuration](#d-070--initial-scaffold-configuration); first-release review criteria in D-071 remain accepted.
- Details: [DOC-021 — Initial Scaffold Profile: Build and test artifacts](DOC-021-scaffold-profile.md#build-and-test-artifacts).

## D-074 — Internal contract inputs and values

**Status:** Accepted conventions; complete signatures pending · **Date:** 2026-10-30.

- Decision: prefer named input objects, allow direct single-value lookups, return `undefined` for missing storage records, and store session times as epoch milliseconds with explicit unit names.
- Reason: the maintainer selected these conventions to make contract inputs and internal values consistent.
- Boundary: preserve application-owned types, typed errors, and sync memory where appropriate. HTTP envelope `null` fields, JWT NumericDate seconds, environment TTL seconds, and monotonic limiter timing are unchanged. Complete method types and unrelated optional/default rules remain open.
- Details: [DOC-011 — Code Conventions: 3. Contracts and DI](DOC-011-code-conventions.md#3-contracts-and-di), [DOC-021 — Initial Scaffold Profile: 5. Implementation selections](DOC-021-scaffold-profile.md#5-implementation-selections).

## D-075 — Stable public demo fixtures

**Status:** Accepted fixture policy; generation pending · **Date:** 2026-10-30.

- Decision: generate the two accounts' UUID v4 IDs and separately salted bcrypt hashes once, then commit them as public demo fixtures instead of regenerating them at startup. Both demo passwords remain `dev123`.
- Reason: the maintainer selected stable fixtures for consistent demo identities and a simpler startup.
- Boundary: generation requires approved software execution. No IDs or hashes were generated by this decision. JWT/Swagger/logging secrets and real account data remain outside Git.
- Details: [DOC-021 — Initial Scaffold Profile: 5. Implementation selections](DOC-021-scaffold-profile.md#5-implementation-selections).

## D-076 — Dependency ranges and committed lockfile

**Status:** Accepted versioning policy; exact ranges/artifacts pending · **Date:** 2026-10-30.

- Decision: use dependency version ranges with a committed `package-lock.json`; repeat installs use `npm ci` after approval. Review exact range expressions and resolved versions before adopting them.
- Reason: the maintainer chose ranges with a lockfile over exact direct-dependency declarations.
- Boundary: a range is not approval for future resolutions. Every dependency/lockfile change still requires full preflight and explicit approval for affected software steps. No package manifest, lockfile, installation, or update was created by this policy.
- Details: [DOC-021 — Initial Scaffold Profile: 5. Implementation selections](DOC-021-scaffold-profile.md#5-implementation-selections), [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md).
