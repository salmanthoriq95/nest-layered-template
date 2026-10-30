# DOC-004 — Conventions

**Status:** Accepted rules; proposals labeled · **Updated:** 2026-10-30.
**Format and reading:**

- [D-019 — Lightweight decision documentation](DOC-003-decisions.md#d-019--lightweight-decision-documentation)
- [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading)
- [D-023 — Document identifiers and descriptive references](DOC-003-decisions.md#d-023--document-identifiers-and-descriptive-references)

**Decision:** Apply accepted rules below; keep proposals and open questions unresolved until the maintainer decides.

**Reason:** Provide a concise implementation reference without treating ideas as agreements.

Read the relevant section and its linked [DOC-003 — Decision Records](DOC-003-decisions.md), not the whole documentation set. Progress lives in the [DOC-002 — Project Task List](../task-list.md).

## 1. Documentation

**Status:** Accepted

**Records:**

- [D-004 — Decision records and conventions](DOC-003-decisions.md#d-004--decision-records-and-conventions)
- [D-015 — Concise English documentation](DOC-003-decisions.md#d-015--concise-english-documentation)
- [D-016 — AI collaboration and attribution](DOC-003-decisions.md#d-016--ai-collaboration-and-attribution)
- [D-017 — Versioned AI agreements and context recovery](DOC-003-decisions.md#d-017--versioned-ai-agreements-and-context-recovery)
- [D-018 — No improvisation and required clarification](DOC-003-decisions.md#d-018--no-improvisation-and-required-clarification)
- [D-019 — Lightweight decision documentation](DOC-003-decisions.md#d-019--lightweight-decision-documentation)
- [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading)
- [D-023 — Document identifiers and descriptive references](DOC-003-decisions.md#d-023--document-identifiers-and-descriptive-references)

**Decision:** Use concise English, lightweight decision records, versioned agent rules, and task-based reading.

**Reason:** Preserve rationale and history with minimal repetition and context overhead.

- Write concise, clear English without losing context or technical meaning.
- Record each agreed decision with a stable ID and clear status. Decision and reason are required; add dates, context, consequences, alternatives, and review triggers only when useful.
- Use stable `DOC-XXX` document IDs in filenames and top-level titles; keep `D-XXX` IDs for decision records. Allocate the next unused document ID without renumbering or reusing earlier IDs.
- Keep standard root filenames: `README.md`, `AGENTS.md`, `task-list.md`, and `CODE_OF_CONDUCT.md`; show their document IDs in their titles. Keep `LICENSE` unchanged with its standard MIT identifier.
- Label document links `DOC-XXX — Document title`, adding a section when needed. Label decision references `D-XXX — Decision title`; name grouped historical ranges as well.
- IDs support sorting and lookup; continue loading documentation only when the current task requires it.
- Update affected conventions and tasks in the same change.
- Distinguish accepted decisions, proposals, and open questions.
- Preserve history when replacing a decision; link its successor and mark it superseded.
- Keep AI attribution and [DOC-001 — AI Contributor Guide](../AGENTS.md) accurate as the project evolves.
- Version AI working agreements separately from application releases; retain a dated changelog linked to decision records.
- After context compaction or agreement changes, reread AGENTS.md and load only relevant sections to recover scope, progress, questions, and approvals.
- AI assistants must not improvise or assume unclear requirements. Ask the maintainer about ambiguity or proposed deviations and wait before affected work; unanswered questions never imply approval.

## 2. Scope and priorities

**Status:** Accepted; earlier CRUD scope superseded

**Records:**

- [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [D-029 — Public, admin, and superadmin demo access](DOC-003-decisions.md#d-029--public-admin-and-superadmin-demo-access)
- [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access)
- [D-005 — Scope and priorities](DOC-003-decisions.md#d-005--scope-and-priorities)
- [D-025 — Minimum monitoring, backup, and disaster recovery](DOC-003-decisions.md#d-025--minimum-monitoring-backup-and-disaster-recovery)

**Decision:** Build an access-demonstration template for solo developers or teams of 2–3. Return allow/deny messages for public, admin, and superadmin examples.

**Reason:** Demonstrate structure, DI, and access boundaries without implementing a real application.

- Use Node.js and NestJS; exact versions and supporting tools still require preflight and explicit approval.
- Demonstrate per-user permissions with an in-memory role/grant store, public metadata, signed JWT identity, and UUID v4 public user IDs. Use minimal login and refresh; signing/expiry settings live in `.env`. Detailed token policies remain open.
- Real articles, categories, comments, relationships, lifecycle, and CRUD are outside the initial scope. Their earlier selection is historical.
- Keep general feature persistence and third-party integration extension points as placeholders. The auth module's in-memory access store is an approved exception; no ORM, database, or real external I/O is required.
- Add provider-specific contracts, libraries, mappings, and implementations later when requested; do not design speculative provider APIs now.
- Preserve simple flows, readable code, fast debugging/review, and controlled changes.
- Minimum reliability guidance remains documented in [DOC-010 — Reliability Strategy](DOC-010-reliability.md). Real data backup and recovery work is deferred until relevant data and deployment exist.

## 3. Architecture

**Status:** Accepted principles and minimal code conventions; token policies and endpoint details open

**Records:**

- [D-006 — N-layered architecture, DI, and contracts](DOC-003-decisions.md#d-006--n-layered-architecture-di-and-contracts)
- [D-009 — One modular application with layers per feature](DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature)
- [D-010 — Behavioral contracts and integration boundaries](DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries)
- [D-030 — Minimal code layout and conventions](DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions)

**Decision:** Use N-layered architecture in one application organized by feature, with DI and behavioral contracts; keep external implementations outside services.

**Reason:** Localize changes and make feature flows easy to trace.

- Contracts define available operations, behavior, and responsibility boundaries.
- Design boundaries to contain the impact of domain, ORM, and provider changes.
- Follow the agreed layout, abstract-class DI contracts, naming, typing, and import rules in [DOC-011 — Code Conventions](DOC-011-code-conventions.md). Tooling and exact method signatures remain open.
- Deployment follows each project's needs and resources; logical layers do not prescribe physical tiers. Reference: [Microsoft N-tier guide](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier), retrieved 2026-10-28.
- Exported Nest providers form a module's public API. Reference: [NestJS modules](https://docs.nestjs.com/modules), retrieved 2026-10-28.

### Implementation conventions

**Status:** Minimal code conventions accepted; token policies and endpoint specifics remain open.

Use [DOC-011 — Code Conventions](DOC-011-code-conventions.md), recorded as [D-030 — Minimal code layout and conventions](DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions). Unit tests stay beside source; HTTP tests stay in `test/`.

- Use a small example module whose handlers return access-result messages.
- Demonstrate controller/service separation and DI without routing responses through unused persistence code.
- Define only contracts needed by the demo's layer boundaries. Leave future persistence/provider contracts to their actual integration work.
- Reserve documented persistence/integration extension locations without real clients, queries, transactions, uploads, payments, or simulated claims of external success.
- Use abstract classes as contracts and runtime DI tokens with explicit constructor injection and module wiring.
- Use JWT identity and current server-side permissions below. Minimal login/refresh is selected; account management and detailed lifecycle policies remain outside the approved scope unless explicitly agreed. Do not trust caller-provided role claims.

### Change limits

Placeholders show where future dependencies connect. Adding a real provider still requires its contract, library, wiring, and implementation; no effortless migration or production authentication guarantee is implied.

## 4. Authorization

**Status:** Permission, JWT identity, public IDs, and minimal login/refresh accepted; detailed token policies and route contracts open

**Records:**

- [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [D-029 — Public, admin, and superadmin demo access](DOC-003-decisions.md#d-029--public-admin-and-superadmin-demo-access)
- [D-007 — Configurable authorization](DOC-003-decisions.md#d-007--configurable-authorization)
- [D-012 — Resource identity and access policies](DOC-003-decisions.md#d-012--resource-identity-and-access-policies)
- [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access)
- [D-036 — Minimal JWT identity and server-side access state](DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state)
- [D-037 — UUID v4 public user identifiers](DOC-003-decisions.md#d-037--uuid-v4-public-user-identifiers)
- [D-038 — Minimal login, refresh, and environment configuration](DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration)
- [D-039 — Swagger Basic Auth with bcrypt](DOC-003-decisions.md#d-039--swagger-basic-auth-with-bcrypt)

**Decision:** Authorize protected example operations through per-user grants. Use `@Public()` for anonymous routes and current server-side role/grant state for protected requests. An authenticated superadmin passes permission checks; superadmin-only routes remain exclusive to that role.

**Reason:** Allow different capabilities for individual admins/users while keeping the template independent of real domain CRUD and database technology.

| Caller | Public example | Permission-protected example | Superadmin-only example |
| --- | --- | --- | --- |
| Guest | Allow | Deny | Deny |
| Authenticated non-superadmin without required grant | Allow | Deny | Deny |
| Authenticated non-superadmin with required grant | Allow | Allow | Deny |
| Superadmin | Allow | Allow | Allow |

An admin role alone grants no protected permission. This replaces the unconditional admin allowance in the earlier matrix; endpoint handlers still return access-result messages.

### Permission definitions and storage

- Define stable `resource:action` keys near the feature, initially in `examples.permissions.ts`. Keys such as `article:read` or `article:update` describe capabilities; multiple endpoints may require the same key.
- Protected routes declare required permissions through metadata such as `@RequirePermissions()`. `@Public()` permits anonymous access on that route without making the permission globally public. Validation still applies.
- Store current per-user roles and grants in an in-memory auth adapter behind a `PermissionStore` contract. Keep storage code outside the application service layer; wire the adapter through DI.
- Read role/grants once per protected request. Subsequent checks in the same process see store changes; already-authorized requests are not cancelled. No grant snapshot in a JWT is authoritative.
- In-memory state resets on restart and is separate in each process. Shared persistence, caching, and invalidation strategies are deferred until needed.

### JWT identity

- Use signed JWTs for minimal identity and validation claims. Verify the signature and expected issuer, audience, and validity period, then resolve current access state using the subject.
- Keep permission lists and privileged role decisions in the server-side store. Do not add custom permission encryption inside JWTs.
- Token encryption does not prevent bearer-token reuse after a leak; permission lookup alone does not provide logout or full token revocation.
- Use minimal login and refresh, with signing-key/expiry values in `.env` and initial manual testing through Swagger. “Reset token” was clarified as refresh.
- JWT library/version, signing profile, key format/rotation, lifetimes, transport, refresh policy, and logout/revocation remain open. Accepted requirements and proposed defaults are separated in [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md).

### Swagger access

- Protect Swagger using HTTP Basic Auth, with `SWAGGER_USERNAME` and a bcrypt `SWAGGER_PASSWORD_HASH` in `.env`. The hash is configuration, not a plaintext password or an API access token.
- Cover enabled documentation UI/schema routes and keep the gate independent of API JWT/permission checks. Exact credential values, route/configuration handling, bcrypt parameters, and library versions remain open.
- Follow [DOC-014 — Authentication Lifecycle: 5. Swagger access protection](DOC-014-authentication-lifecycle.md#5-swagger-access-protection). Application-user password hashing and the earlier token baseline are still undecided.

### Public user identifiers

- Expose UUID v4 user IDs and use them as JWT subjects. Use Node's built-in `crypto.randomUUID()` after runtime preflight and approval.
- Database primary-key types remain undecided. No Hashids dependency is selected.
- Identifier complexity does not replace object-level access checks when real resources are introduced.

Sources and rationale are linked in [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access), [D-036 — Minimal JWT identity and server-side access state](DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state), and [D-037 — UUID v4 public user identifiers](DOC-003-decisions.md#d-037--uuid-v4-public-user-identifiers).

### Open for the demo

- Exact endpoint paths, methods, input schemas, and response data. Envelope and access status conventions are accepted in [DOC-012 — HTTP Boundary Conventions](DOC-012-http-conventions.md).
- Approve or revise the login/refresh baseline in [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md), including credentials/fixtures, lifetimes, signing profile, rotation, transport, and logout behavior.
- Exact permission catalog, grant fixtures, and how superadmin changes grants. No grant-management endpoint is selected.
- Behavior for missing route metadata, multiple required permissions, and exact superadmin-only metadata.

### Deferred extension

Persistent resource catalogs, advanced delegation, account CRUD, registration, password recovery, and external identity providers remain deferred. Minimal login/refresh is now required; advanced session and revocation behavior needs an explicit decision.

## 5. External interaction examples

**Status:** General persistence/integration placeholders; auth in-memory access store explicitly included

**Records:**

- [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [D-010 — Behavioral contracts and integration boundaries](DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries)
- [D-011 — External interaction examples](DOC-003-decisions.md#d-011--external-interaction-examples)

**Decision:** Prepare general persistence/integration placeholders and the approved in-memory authorization adapter. Do not select a database, ORM, or live external provider.

**Reason:** Let a consuming project add the required contract, library, and adapter later while keeping external details outside service logic.

- Document where contracts and implementations would be added and how DI would connect them.
- Keep the demo independent of databases and external services. The in-memory role/grant adapter follows [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access). Additional credential/refresh storage responsibilities remain proposed in [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md).
- Do not add repositories, schema, migrations, real upload/payment behavior, or vendor SDK wrappers merely to populate a layer.
- Real integrations require a new agreed scope and the normal supply chain preflight/approval process.

## 6. Supply chain

**Status:** Accepted · **Record:** [D-002 — Software supply chain policy](DOC-003-decisions.md#d-002--software-supply-chain-policy).

**Decision:** Complete the full policy and obtain explicit approval before affected software steps.

**Reason:** Keep external software decisions evidence-based and under maintainer control.

Follow the full [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md) and its [DOC-002 — Project Task List: 7. Dependencies and supply chain](../task-list.md#7-dependencies-and-supply-chain).

Architecture references are neither artifact security audits nor approval to use software.

## 7. Project identity and attribution

**Status:** Accepted; conduct wording proposed

**Records:**

- [D-013 — Public GitHub repository](DOC-003-decisions.md#d-013--public-github-repository)
- [D-014 — Descriptive project name](DOC-003-decisions.md#d-014--descriptive-project-name)
- [D-015 — Concise English documentation](DOC-003-decisions.md#d-015--concise-english-documentation)
- [D-016 — AI collaboration and attribution](DOC-003-decisions.md#d-016--ai-collaboration-and-attribution)
- [D-021 — MIT license and downstream scope](DOC-003-decisions.md#d-021--mit-license-and-downstream-scope)
- [D-022 — Community conduct and reporting](DOC-003-decisions.md#d-022--community-conduct-and-reporting)
- [D-026 — Direct master workflow for this repository](DOC-003-decisions.md#d-026--direct-master-workflow-for-this-repository)
- [D-027 — Conventional Commits message format](DOC-003-decisions.md#d-027--conventional-commits-message-format)

**Decision:** Use nest-layered-template, concise English, and evidenced AI attribution for a public repository.

**Reason:** Keep the project descriptive, easy to scan, and transparent about collaboration.

- Project and repository name: `nest-layered-template`. Prefer descriptive, distinctive, memorable wording.
- Repository description: “A modular NestJS backend starter with clear boundaries, explicit contracts, and flexible authorization.”
- The maintainer plans a public GitHub repository and handles commits and pushes.
- Follow [DOC-007 — Git Conventions](DOC-007-git-conventions.md): work directly on master and use Conventional Commits. General branching strategy belongs in the maintainer's separate personal engineering handbook.
- All repository documentation uses concise English.
- Use the standard [MIT License](../LICENSE), copyright 2026 salmanthoriq95. Preserve its terms; third-party licenses remain separate.
- Do not imply upstream support, endorsement, or operation of independent forks or deployments. Liability disclaimers are not a promise of universal legal immunity.
- Keep conduct rules separate from software-license permissions. GitHub reporting is approved; [DOC-009 — Code of Conduct](../CODE_OF_CONDUCT.md) remains proposed. Read [DOC-008 — Licensing and Community Scope](DOC-008-licensing.md) when working on these topics.
- Credit collaboration with OpenAI Codex in the README and agent guide.
- Available session identity: GPT-6 model family; exact variant unavailable. Do not infer a specific model ID from a product catalog.

## 8. HTTP boundaries

**Status:** Accepted; endpoint-specific schemas, identity, and tooling open

**Records:**

- [D-032 — HTTP input validation and XSS boundaries](DOC-003-decisions.md#d-032--http-input-validation-and-xss-boundaries)
- [D-033 — Uniform JSON response envelope](DOC-003-decisions.md#d-033--uniform-json-response-envelope)
- [D-034 — HTTP status standards and response examples](DOC-003-decisions.md#d-034--http-status-standards-and-response-examples)

**Decision:** Validate consumed body/query/path input before service logic and provide consistent JSON envelopes with standard HTTP semantics.

**Reason:** Keep input boundaries and client-visible behavior predictable while reducing malformed-input and scripting risks.

Follow [DOC-012 — HTTP Boundary Conventions](DOC-012-http-conventions.md) for validation, normalization, XSS responsibilities, envelopes, and HTTP wiring. Use [DOC-013 — HTTP Status and Response Examples](DOC-013-http-response-examples.md) for status selection and examples. Bodyless responses must follow the HTTP standard; they cannot carry an envelope.

## 9. Minimal testing

**Status:** Strategy accepted; runner and commands open

**Record:** [D-031 — Minimal testing strategy and locations](DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations).

**Decision:** Keep unit tests beside source and HTTP tests in `test/`; verify meaningful behavior rather than every method.

**Reason:** Keep tests easy to locate, useful for changes, and small enough for a template.

Follow [DOC-011 — Code Conventions: 5. Minimal testing strategy](DOC-011-code-conventions.md#5-minimal-testing-strategy). Cover the access matrix and actual HTTP boundaries without databases, live external providers, or tests of framework internals.
