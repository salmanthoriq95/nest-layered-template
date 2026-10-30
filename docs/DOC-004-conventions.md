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

- Use Node.js and NestJS. The maintainer selected the latest supported Node 26 patch under [D-063 — Node 26 runtime direction](DOC-003-decisions.md#d-063--node-26-runtime-direction), following [D-061 — LTS-first runtime review](DOC-003-decisions.md#d-061--lts-first-runtime-review). Disclose security/compatibility findings with alternatives; artifacts and supporting tools still require full preflight and explicit execution approval.
- Demonstrate per-user permissions, signed JWT identity, and UUID v4 public user IDs. Keep two dummy accounts, grants, and session state in memory. Include login/refresh/logout; signing/expiry settings live in `.env`, while dummy-account credentials do not.
- Real articles, categories, comments, relationships, lifecycle, and CRUD are outside the initial scope. Their earlier selection is historical.
- Keep general feature persistence and third-party integration extension points as placeholders. Prisma is the selected future ORM direction under [D-069 — Prisma ORM direction](DOC-003-decisions.md#d-069--prisma-orm-direction); no database, client, schema, or live provider is added. Initial storage remains in-memory auth and logging's local error files in its independent process. See [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md).
- Add provider-specific contracts, libraries, mappings, and implementations later when requested; do not design speculative provider APIs now.
- Preserve simple flows, readable code, fast debugging/review, and controlled changes.
- Include accepted unauthenticated process health endpoints for the API and logging worker under [DOC-010 — Reliability Strategy: Minimal health checks](DOC-010-reliability.md#minimal-health-checks). Broader reliability plans remain proposed; data backup and deployment recovery work follows relevant data/hosting needs.

## 3. Architecture

**Status:** Accepted principles, code conventions, and API contracts; implementation/tooling open

**Records:**

- [D-006 — N-layered architecture, DI, and contracts](DOC-003-decisions.md#d-006--n-layered-architecture-di-and-contracts)
- [D-009 — One modular application with layers per feature](DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature)
- [D-010 — Behavioral contracts and integration boundaries](DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries)
- [D-030 — Minimal code layout and conventions](DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions)

**Decision:** Use N-layered architecture in a main API organized by feature, with DI and behavioral contracts; keep external implementations outside services. Logging runs in a separate process.

**Reason:** Localize changes and make feature flows easy to trace.

- Contracts define available operations, behavior, and responsibility boundaries.
- Preserve the modular main API while giving the logging worker its own lifecycle under [D-047 — Independent logging worker](DOC-003-decisions.md#d-047--independent-logging-worker). Background internal HTTP and send-failure fallback follow [D-049 — Best-effort internal HTTP logging delivery](DOC-003-decisions.md#d-049--best-effort-internal-http-logging-delivery). Local addressing, authentication, ingestion, queues, file settings, and initial launch/shutdown follow the accepted [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md); production supervision and exact software remain separate.
- Design boundaries to contain the impact of domain, ORM, and provider changes.
- Follow the agreed layout, abstract-class DI contracts, naming, typing, import rules, and tooling direction in [DOC-011 — Code Conventions](DOC-011-code-conventions.md). Exact tool artifacts/configuration and internal method signatures remain open.
- Deployment follows each project's needs and resources; logical layers do not prescribe physical tiers. Reference: [Microsoft N-tier guide](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier), retrieved 2026-10-28.
- Exported Nest providers form a module's public API. Reference: [NestJS modules](https://docs.nestjs.com/modules), retrieved 2026-10-28.

### Implementation conventions

**Status:** Code conventions, API contracts, and tooling direction accepted; exact internal methods and tool artifacts/configuration pending.

Use [DOC-011 — Code Conventions](DOC-011-code-conventions.md), recorded as [D-030 — Minimal code layout and conventions](DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions). Unit tests stay beside source; HTTP tests stay in `test/`.

- Use a small example module whose handlers return access-result messages.
- Demonstrate controller/service separation and DI without routing responses through unused persistence code.
- Define only contracts needed by the demo's layer boundaries. Leave future persistence/provider contracts to their actual integration work.
- Reserve documented persistence/integration extension locations without real clients, queries, transactions, uploads, payments, or simulated claims of external success.
- Use abstract classes as contracts and runtime DI tokens with explicit constructor injection and module wiring.
- Use JWT identity and current server-side permissions below. Login/refresh/logout and their API contracts are accepted; account management remains deferred. Do not trust caller-provided role claims.

### Change limits

Placeholders show where future dependencies connect. Adding a real provider still requires its contract, library, wiring, and implementation; no effortless migration or production authentication guarantee is implied.

## 4. Authorization

**Status:** Permissions, JWT/session lifecycle, public IDs, demo credentials, and API contracts accepted; implementation open

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
- [D-040 — HS256 tokens, refresh rotation, and immediate logout](DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout)
- [D-041 — In-memory demo accounts and manual grants](DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants)
- [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants)
- [D-043 — Bcrypt application password hashing](DOC-003-decisions.md#d-043--bcrypt-application-password-hashing)
- [D-044 — Public dummy login credentials](DOC-003-decisions.md#d-044--public-dummy-login-credentials)
- [D-045 — JWT configuration, validation, and key rotation](DOC-003-decisions.md#d-045--jwt-configuration-validation-and-key-rotation)
- [D-050 — Login and refresh rate limits and proxy trust](DOC-003-decisions.md#d-050--login-and-refresh-rate-limits-and-proxy-trust)
- [D-051 — Periodic in-memory state cleanup](DOC-003-decisions.md#d-051--periodic-in-memory-state-cleanup)
- [D-059 — In-memory limiter and cleanup parameters](DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters)

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
- Protected permission routes declare a non-empty list through `@RequirePermissions(...)`; every listed grant is required. `@Public()` permits anonymous access on that route without making the permission globally public. Validation still applies. The complete policy rules are in [DOC-015 — Demo API Contracts: 3. Access metadata defaults](DOC-015-demo-api-contracts.md#3-access-metadata-defaults).
- Store current per-user roles and grants in an in-memory auth adapter behind a `PermissionStore` contract. Keep storage code outside the application service layer; wire the adapter through DI.
- Read role/grants once per protected request. Subsequent checks in the same process see store changes; already-authorized requests are not cancelled. No grant snapshot in a JWT is authoritative.
- In-memory state resets on restart and is separate in each process. Shared persistence, caching, and invalidation strategies are deferred until needed.
- Keep exactly two dummy usernames, `superadmin` and `admin`, both using public demo password `dev123`. Store bcrypt hashes in the in-memory adapter/fixture, not plaintext or `.env` account settings. Admin initially has `examples:read`; superadmin uses the privileged-role bypass. Hash generation remains pending.
- Change grants manually in storage. No grant-management route is provided. Live store edits affect the next check; editing fixture source may require restarting the process and logging in again.

### JWT identity

- Use signed JWTs for minimal identity and validation claims. Verify the signature and expected issuer, audience, and validity period, then resolve current access state using the subject.
- Use HS256 with a random key of at least 256 bits and a default 15-minute access lifetime. Refresh tokens are opaque, hashed server-side, rotated on use, and limited to a seven-day refresh window from login.
- Keep permission lists and privileged role decisions in the server-side store. Do not add custom permission encryption inside JWTs.
- Protected requests also require an active server-issued session bound to the JWT subject. Logout revokes that session and its refresh family; all of its access JWTs fail later checks with `401`, even for superadmin. Permission checks happen after authentication/session checks.
- Keep refresh rotation within the same login session and coordinate it with revocation. Missing session state, including after restart, cannot authenticate an old token. Already-authorized requests are not retroactively cancelled.
- Apply accepted [DOC-014 — Authentication Lifecycle: In-memory cleanup](DOC-014-authentication-lifecycle.md#in-memory-cleanup) to expired session/refresh state and counters. Request-time validity checks and refresh replay evidence must survive cleanup; leave dummy accounts and grants available.
- Use minimal login and refresh, with signing-key/expiry values in `.env` and initial manual testing through Swagger. “Reset token” was clarified as refresh.
- Token/session claims, transport, independent sessions, strict single-use refresh, and immediate session revocation on replay follow accepted [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md). JWT environment names, hex key encoding, startup validation, duration defaults, and manual key rotation follow accepted [DOC-014 — Authentication Lifecycle: 3. JWT configuration](DOC-014-authentication-lifecycle.md#3-jwt-configuration). Retention implementation and software choices remain open.

### Swagger access

- Protect Swagger using HTTP Basic Auth, with `SWAGGER_USERNAME` and a bcrypt `SWAGGER_PASSWORD_HASH` in `.env`. The hash is configuration, not a plaintext password or an API access token.
- Cover `/docs`, `/docs/openapi.json`, `/docs/openapi.yaml`, and documentation assets/aliases. Keep the gate independent of API JWT/permission checks. Enabled Swagger with missing/invalid credentials must fail startup.
- Follow [DOC-014 — Authentication Lifecycle: 5. Swagger access protection](DOC-014-authentication-lifecycle.md#5-swagger-access-protection). Bcrypt starts at cost 12; deployment calibration, exact libraries, and environment-supplied Swagger credentials remain pending. The application demo password does not set Swagger credentials.

### Public user identifiers

- Expose UUID v4 user IDs and use them as JWT subjects. Use Node's built-in `crypto.randomUUID()` after runtime preflight and approval.
- Database primary-key types remain undecided. No Hashids dependency is selected.
- Identifier complexity does not replace object-level access checks when real resources are introduced.

Sources and rationale are linked in [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access), [D-036 — Minimal JWT identity and server-side access state](DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state), and [D-037 — UUID v4 public user identifiers](DOC-003-decisions.md#d-037--uuid-v4-public-user-identifiers).

### API contracts and remaining choices

- Follow accepted [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md) for routes, independent process health responses, schemas, initial grants, access metadata, token/session profile, and Swagger/bcrypt defaults.
- Keep the accepted envelope and HTTP status conventions in [DOC-012 — HTTP Boundary Conventions](DOC-012-http-conventions.md).
- Request IDs use server-generated UUID v4 values under [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md). Internal HTTP delivery and safe stderr fallback are accepted.
- Follow accepted [DOC-014 — Authentication Lifecycle: Limiter and cleanup parameters](DOC-014-authentication-lifecycle.md#limiter-and-cleanup-parameters) for sliding-window quotas, environment validation, atomic admission, 429 headers, native cleanup lifecycle, and explicit proxy-list configuration. Swagger has its own shared UI/schema/assets quota before Basic Auth. Actual proxy addresses, contract methods, fixture hashes, cost calibration, and exact software versions remain separate. Initial logging operating settings are accepted in [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md).

### Deferred extension

Persistent resource catalogs, advanced delegation, account CRUD, registration, password recovery, external identity providers, and all-device logout remain deferred. Login, refresh, and immediate current-session logout are required.

## 5. External interaction examples

**Status:** General persistence/integration placeholders; auth memory storage and logging process/file persistence included

**Records:**

- [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [D-010 — Behavioral contracts and integration boundaries](DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries)
- [D-011 — External interaction examples](DOC-003-decisions.md#d-011--external-interaction-examples)

**Decision:** Prepare general persistence/integration placeholders, the approved in-memory authorization adapter, and logging's separate process/file boundary. Prisma is the future ORM direction under [D-069 — Prisma ORM direction](DOC-003-decisions.md#d-069--prisma-orm-direction); database selection and actual integration remain deferred.

**Reason:** Let a consuming project add the required contract, library, and adapter later while keeping external details outside service logic.

- Document where contracts and implementations would be added and how DI would connect them.
- Keep feature demos independent of databases and third-party services. Auth account, role/grant, and session/refresh state are in-memory adapters behind contracts, following [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md). General feature persistence and live integrations remain placeholders.
- The logging worker's local error files, background internal HTTP delivery, ingestion contract, and initial operating parameters are accepted in [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md). Transport and file implementations remain outside main application services. No exact library/version is selected.
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

**Status:** Accepted; API/identity contracts and Zod direction specified, exact artifacts/wiring pending

**Records:**

- [D-032 — HTTP input validation and XSS boundaries](DOC-003-decisions.md#d-032--http-input-validation-and-xss-boundaries)
- [D-033 — Uniform JSON response envelope](DOC-003-decisions.md#d-033--uniform-json-response-envelope)
- [D-034 — HTTP status standards and response examples](DOC-003-decisions.md#d-034--http-status-standards-and-response-examples)

**Decision:** Validate consumed body/query/path input before service logic and provide consistent JSON envelopes with standard HTTP semantics.

**Reason:** Keep input boundaries and client-visible behavior predictable while reducing malformed-input and scripting risks.

Follow [DOC-012 — HTTP Boundary Conventions](DOC-012-http-conventions.md) for validation, normalization, XSS responsibilities, envelopes, and HTTP wiring. Use [DOC-013 — HTTP Status and Response Examples](DOC-013-http-response-examples.md) for status selection and examples. Bodyless responses must follow the HTTP standard; they cannot carry an envelope.

## 9. Minimal testing

**Status:** Strategy, native runner, and build/test behavior accepted; script implementations pending

**Record:** [D-031 — Minimal testing strategy and locations](DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations).

**Decision:** Keep unit tests beside source and HTTP tests in `test/`; verify meaningful behavior rather than every method.

**Reason:** Keep tests easy to locate, useful for changes, and small enough for a template.

Follow [DOC-011 — Code Conventions: 5. Minimal testing strategy](DOC-011-code-conventions.md#5-minimal-testing-strategy). Cover the access matrix and actual HTTP boundaries without databases, live external providers, or tests of framework internals.

Build success requires type checking and executed unit/HTTP tests against compiled JavaScript, using separate build/test configurations and outputs. Application artifacts exclude tests. `npm run check` also includes basic lint and default-Prettier verification. [D-073 — ESNext and verified application builds](DOC-003-decisions.md#d-073--esnext-and-verified-application-builds)
