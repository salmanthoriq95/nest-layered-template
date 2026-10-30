# DOC-011 — Code Conventions

**Status:** Accepted layout, DI, naming, typing, and test strategy; tooling open · **Updated:** 2026-10-30.
**Records:**

- [D-030 — Minimal code layout and conventions](DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions)
- [D-031 — Minimal testing strategy and locations](DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations)
- [D-035 — Per-user permissions and public access](DOC-003-decisions.md#d-035--per-user-permissions-and-public-access)
- [D-040 — HS256 tokens, refresh rotation, and immediate logout](DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout)
- [D-041 — In-memory demo accounts and manual grants](DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants)
- [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy)

**Decision:** Keep files together by feature with controller/service/contract boundaries. Reserve general persistence/integration locations; auth has in-memory account, permission, and session adapters. Keep unit tests beside source and HTTP tests in `test/`.

**Reason:** Make a small feature easy to trace and move while keeping HTTP, application behavior, and external implementations separate.

## 1. Minimal layout

This is the agreed layout, not existing source code. It includes the permission and session-lifecycle decisions added after the first layout. API routes and demo passwords are accepted; exact internal contract methods and fixture hashes remain pending. Add test files where the behavior requires them.

The tree includes the main API and accepted logging locations. Use `src/logging/` for API logging contracts/event types and the adapter, and `src/logging-worker/` for the independent worker entry point and implementation. Detailed filenames and contract methods belong to implementation review under [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md).

API and worker health endpoints are accepted in [DOC-015 — Demo API Contracts: Health responses](DOC-015-demo-api-contracts.md#health-responses); exact health file placement remains open.

```text
src/
  main.ts
  app.module.ts
  logging/
  logging-worker/
  modules/
    examples/
      examples.module.ts
      examples.controller.ts
      examples.service.ts
      examples.permissions.ts
      contracts/
        examples-service.contract.ts
      persistence/
        .gitkeep
      integrations/
        .gitkeep
    auth/
      auth.module.ts
      auth.controller.ts
      authentication.service.ts
      permissions.guard.ts
      permissions.guard.spec.ts
      authorization.service.ts
      contracts/
        authentication-service.contract.ts
        identity-provider.contract.ts
        authorization-service.contract.ts
        permission-store.contract.ts
        user-store.contract.ts
        session-store.contract.ts
      persistence/
        in-memory-permission.store.ts
        in-memory-user.store.ts
        in-memory-session.store.ts
test/
  app.e2e-spec.ts
  logging-worker.e2e-spec.ts
docs/
```

- `main.ts` boots the application; `app.module.ts` composes feature modules.
- `examples` contains public, permission-protected, and superadmin-only response demonstrations, with feature-owned permission constants.
- `auth` contains login/refresh/logout, identity/session verification, route policy, and authorization behavior. Account credentials, current role/grants, and session/refresh state stay behind application-owned contracts. Use a shared source of current role/grant data where adapters expose different views.
- Keep exactly two dummy usernames, `superadmin` and `admin`, in the in-memory user fixture/store. Both use demo password `dev123`, stored as bcrypt hashes after approved generation. Edit grants manually; no management controller or source-file reload feature is included. Initial grants follow [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md).
- Unit tests sit beside the files they verify as `*.spec.ts`; HTTP tests live in `test/` as `*.e2e-spec.ts`. See [5. Minimal testing strategy](#5-minimal-testing-strategy). The test runner remains unselected.
- Keep tooling configuration at the root initially. Add runtime configuration structure when its actual settings are agreed.
- `.gitkeep` only tracks an empty extension location. It performs no operation and is not a provider.

## 2. Responsibilities and dependencies

| Part | Responsibility |
| --- | --- |
| Controller | Map HTTP input/output and delegate through the service contract. |
| Service | Produce the agreed demo result; keep HTTP request/response objects and vendor clients outside its API. |
| Contract | Describe operations, inputs, results, failure behavior, and ownership of side effects. |
| Module | Register providers, bind contracts to implementations, and expose only required providers. |
| Guard | Use the identity boundary, read route policy, and delegate permission decisions through the authorization contract. |
| Authorization service | Evaluate required grants and privileged-role rules using current state from the permission-store contract. |
| Authentication service | Coordinate credential verification, token issuance/refresh, and current-session logout through identity/user/session contracts. |
| Persistence/integrations | Keep general feature locations unused; auth state uses in-memory adapters. The separate logging worker owns approved error-file persistence behind its boundary. |

Controllers depend on service contracts. The guard uses identity/session verification and the authorization-service contract; the authorization service reads the permission-store contract. Authentication services use user/session contracts to coordinate the accepted token lifecycle. Keep HTTP metadata, storage code, and library-specific types outside these contracts. Modules bind implementations through DI.

Use explicit constructor injection. Import another feature through its module and exported contracts, without reaching into its concrete implementations. Nest module exports define the public provider API. [NestJS modules](https://docs.nestjs.com/modules), retrieved 2026-10-29.

Create shared code only for an actual shared need. Do not add base CRUD classes, generic repositories, entities, or DTOs solely to populate layers.

## 3. Contracts and DI

Use an abstract class for each injected contract, containing abstract operations only. Use it as both the TypeScript contract and runtime DI token; implementations use `implements`. Bind it in the owning module with `{ provide: ExamplesServiceContract, useClass: ExamplesService }`.

Abstract classes exist at runtime; TypeScript interfaces do not. An interface with a separate `Symbol` token is a valid alternative; abstract classes were selected to keep one contract artifact and simple constructor injection. [NestJS custom providers](https://docs.nestjs.com/fundamentals/custom-providers), retrieved 2026-10-29.

Contract files contain no Nest decorators, HTTP objects, ORM types, or vendor SDK types. Runtime DI tokens must remain value imports. Add persistence/provider contracts only when a real integration is requested; do not invent their methods now.

## 4. Naming and typing

| Item | Convention |
| --- | --- |
| Files and folders | `kebab-case`; Nest roles use `.module.ts`, `.controller.ts`, `.service.ts`, and `.guard.ts`. |
| Contract files/classes | `examples-service.contract.ts` / `ExamplesServiceContract`. |
| Classes, interfaces, types | `PascalCase`; no `I` prefix for interfaces. |
| Functions, methods, properties, variables | `camelCase`. |
| Decorator factories | `PascalCase`, e.g. `Public()` and `RequirePermissions()`. |
| Module-level constants | `UPPER_SNAKE_CASE`. |

- Enable TypeScript strict checking; explicitly type exported contract methods and public service results. Infer obvious local values.
- Avoid `any`. Receive unvalidated external data as `unknown`, then narrow or validate it. Do not use assertions to hide boundary mismatches.
- Use direct relative imports initially. Add aliases, barrel files, or import-enforcement tooling only through a later agreement.
- Comments explain reasons, non-obvious constraints, or contract behavior. Avoid comments that repeat code.

## 5. Minimal testing strategy

**Decision:** Use two initial test scopes: isolated unit tests for meaningful behavior and HTTP tests for the assembled application boundary. Do not require a test for every method.

**Reason:** Keep feedback useful and maintenance small, while verifying access rules and framework wiring.

| Scope | Location | Verify |
| --- | --- | --- |
| Unit | Beside the class/function, e.g. `permissions.guard.spec.ts` | Non-trivial decisions, failure branches, and contract behavior with small test doubles. |
| HTTP | `test/app.e2e-spec.ts` initially | Real routing, DI, guards, validation, status codes, and response envelopes together. |

- Cover the current access table: guest, authenticated caller with/without the required grant, and superadmin against public, permission-protected, and superadmin-only routes. Include a caller with an admin role but no required grant.
- Exercise JWT verification with valid, expired, and tampered test tokens using controlled test keys and in-memory fixtures. Keep the actual guard active. Test doubles remain useful for isolated policy decisions.
- Verify that logout invalidates every access/refresh credential for the current session, including earlier access tokens from before refresh, and that superadmin cannot bypass a revoked/missing session. Test refresh/logout races and restart with cleared sessions.
- Keep the shipped dummy account set to one admin and one superadmin. Exercise grant-present/absent cases by changing the admin fixture in isolated tests; a third runtime account is not required.
- Verify that changing grants affects the next protected check without issuing a new token. This does not require a grant-management API.
- Verify login/refresh quota accounting and separation, `429` envelopes/retry/no-store headers, restart-reset counters, and proxy IP handling. Untrusted forwarding headers must not change a client's rate-limit identity.
- Verify expiry rejection between cleanup runs and replay detection after rotation/cleanup. Cleanup must retain needed refresh evidence and leave accounts/grants available, following [DOC-014 — Authentication Lifecycle: In-memory cleanup](DOC-014-authentication-lifecycle.md#in-memory-cleanup).
- Verify unauthenticated health responses on each process, standard envelopes/no-store headers, and API health while the logging worker is unavailable.
- Add HTTP cases for invalid body/query/path inputs where accepted by actual routes, and success, denial, and unexpected-error envelopes. Do not invent endpoints solely for test coverage.
- Exercise important logic through its public API. Do not test private methods, framework internals, getters, or constant responses merely to increase coverage; a simple response can be covered by its HTTP test.
- Keep tests deterministic and independent of real databases, uploads, payment providers, and external networks. No database/vendor integration suite is needed while those integrations remain placeholders.
- No numerical coverage target or additional test framework is selected. Commands and tools require a later preflight and approval.

Colocated unit tests also follow Nest's documented recommendation. [NestJS testing](https://docs.nestjs.com/fundamentals/testing), retrieved 2026-10-29.

## 6. Extension path and remaining choices

For a future database or external provider: agree the behavior, add an application-owned contract, review and approve the exact dependency under [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md), implement the adapter, and bind it through DI. Keep provider details outside services.

HTTP validation, input policy, response envelopes, and boundary wiring are accepted in [DOC-012 — HTTP Boundary Conventions](DOC-012-http-conventions.md). Status conventions and examples are in [DOC-013 — HTTP Status and Response Examples](DOC-013-http-response-examples.md).

Token durations/signing/refresh behavior, immediate logout, two memory-only accounts, and manual grant changes are accepted in [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md).

Bcrypt, its starting cost, demo passwords, and endpoint/grant and token/session contracts are accepted in [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md). Exact packages, hash generation, and deployment cost calibration remain pending.

JWT environment names, defaults, validation, and manual key rotation are accepted in [DOC-014 — Authentication Lifecycle: 3. JWT configuration](DOC-014-authentication-lifecycle.md#3-jwt-configuration).

Structured logging, UUID request IDs, development-only diagnostics, separate-worker JSON error persistence, best-effort internal HTTP, and the initial operating policy are accepted in [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md). Use an adapter behind the logging contract; send failure produces a safe local stderr diagnostic without changing API responses. Worker ingestion, queues, file settings, and lifecycle are agreed; implementation and deployment supervision remain pending.

Still open: exact internal contract methods, fixture hashes, limiter/cleanup settings and validation, formatter/linter settings, compiler/module configuration, and exact software versions. Software execution still requires preflight and explicit approval.
