# DOC-011 — Code Conventions

**Status:** Accepted layout, DI, naming, typing, and test strategy; tooling open · **Updated:** 2026-10-29.
**Records:**

- [D-030 — Minimal code layout and conventions](DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions)
- [D-031 — Minimal testing strategy and locations](DOC-003-decisions.md#d-031--minimal-testing-strategy-and-locations)

**Decision:** Keep files together by feature, separate controller/service/contract responsibilities, and reserve persistence/integration locations. Keep unit tests beside source and HTTP tests in `test/`.

**Reason:** Make a small feature easy to trace and move while keeping HTTP, application behavior, and external implementations separate.

## 1. Minimal layout

This is the agreed layout, not existing source code. Exact routes and demo identity handling remain open. Add test files where the behavior requires them.

```text
src/
  main.ts
  app.module.ts
  modules/
    examples/
      examples.module.ts
      examples.controller.ts
      examples.service.ts
      contracts/
        examples-service.contract.ts
      persistence/
        .gitkeep
      integrations/
        .gitkeep
    auth/
      auth.module.ts
      roles.guard.ts
      roles.guard.spec.ts
      contracts/
        identity-provider.contract.ts
test/
  app.e2e-spec.ts
docs/
```

- `main.ts` boots the application; `app.module.ts` composes feature modules.
- `examples` contains the public/admin/superadmin response demonstrations.
- `auth` contains access enforcement and the identity-provider boundary. Its implementation follows the separate identity decision.
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
| Guard | Enforce the accepted access matrix using the agreed identity boundary and route policy. |
| Persistence/integrations | Reserve locations for later adapters; remain unused by the initial response demo. |

The initial controller depends on a service contract; the guard depends on an identity-provider contract. Concrete providers are selected in module wiring. Services do not depend on controllers or concrete external adapters. Future adapters implement application-owned contracts.

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
| Unit | Beside the class/function, e.g. `roles.guard.spec.ts` | Non-trivial decisions, failure branches, and contract behavior with small test doubles. |
| HTTP | `test/app.e2e-spec.ts` initially | Real routing, DI, guards, validation, status codes, and response envelopes together. |

- Cover all nine guest/admin/superadmin versus public/admin/superadmin combinations at the HTTP boundary. Keep the actual guard active; substitute the identity provider according to the agreed demo mechanism.
- Add HTTP cases for invalid body/query/path inputs where accepted by actual routes, and success, denial, and unexpected-error envelopes. Do not invent endpoints solely for test coverage.
- Exercise important logic through its public API. Do not test private methods, framework internals, getters, or constant responses merely to increase coverage; a simple response can be covered by its HTTP test.
- Keep tests deterministic and independent of real databases, uploads, payment providers, and external networks. No separate provider integration suite is needed while those locations are placeholders.
- No numerical coverage target or additional test framework is selected. Commands and tools require a later preflight and approval.

Colocated unit tests also follow Nest's documented recommendation. [NestJS testing](https://docs.nestjs.com/fundamentals/testing), retrieved 2026-10-29.

## 6. Extension path and remaining choices

For a future database or external provider: agree the behavior, add an application-owned contract, review and approve the exact dependency under [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md), implement the adapter, and bind it through DI. Keep provider details outside services.

HTTP validation, input policy, response envelopes, and boundary wiring are accepted in [DOC-012 — HTTP Boundary Conventions](DOC-012-http-conventions.md). Status conventions and examples are in [DOC-013 — HTTP Status and Response Examples](DOC-013-http-response-examples.md).

Still open: exact contract methods, demo identities, public-route handling, endpoint contracts, request-ID format and log integration, missing-value rules, formatter/linter settings, compiler/module configuration, and exact software versions. These agreements do not approve software execution or production authentication.
