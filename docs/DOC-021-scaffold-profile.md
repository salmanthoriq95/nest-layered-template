# DOC-021 — Initial Scaffold Profile

**Status:** Accepted profile and acceptance criteria; exact artifacts/configuration pending · **Updated:** 2026-10-30.
**Records:**

- [D-070 — Initial scaffold configuration](DOC-003-decisions.md#d-070--initial-scaffold-configuration)
- [D-071 — First-release acceptance and review](DOC-003-decisions.md#d-071--first-release-acceptance-and-review)

## 1. Configuration profile

**Decision:** Apply the nine choices below while preserving existing architecture, HTTP behavior, in-memory auth, native cleanup, and independent logging.

**Reason:** The maintainer chose familiar tools, baseline checks, automatic feedback, and synchronous memory operations where appropriate.

| Area | Accepted choice |
| --- | --- |
| HTTP adapter | Express. Exact Nest/Express artifacts and middleware remain subject to preflight. |
| TypeScript | `strict` initially; do not add `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes`. Keep accepted ESM/NodeNext and `tsc` compilation. |
| ESLint | Basic checks, without a type-aware lint preset initially. Type checking remains a separate compiler check. |
| Prettier | Use the approved exact version's defaults, without custom formatting preferences. No separate quote/width/semicolon convention is selected. |
| Development | Automatic watching: one compiler-watch command and separate API/worker watch commands. Keep the two application processes independent; the API does not launch or supervise the worker. |
| Environment | `@nestjs/config` plus Zod startup validation. Preserve all accepted environment names, defaults, units, secret handling, and per-process validation. Verify literal bcrypt-hash loading before relying on the loader. |
| Memory operations | In-memory implementations and their current contracts may be synchronous. Use `Promise<T>` when an operation actually needs async work; no blanket async abstraction is required for future persistence. |
| Expected failures | Throw application-owned typed errors from services. Map them to the accepted HTTP status/envelope at the boundary. Keep Nest HTTP exceptions and request/response objects outside application contracts/services. |
| Tests | `npm test` runs unit and HTTP tests. Also provide `test:unit` and `test:e2e`. `npm run check` aggregates type checking, lint, formatting verification, build, and all tests. |

The maintainer's numbered reply repeated basic lint, then gave the remaining choices in order. The record follows the answer content: default Prettier, automatic watch, `@nestjs/config`/Zod, synchronous memory allowed, typed application errors, and both test scopes. The repetition adds no separate convention.

Exact compiler target/remaining flags, emitted paths, watcher startup details, other command names, configuration files, internal method signatures, fixtures, and exact package versions remain implementation review items. Earlier `login`/`refresh`/`logout` signature examples do not settle every contract's exact types or method-specific error cases. Do not introduce a mixed sync/async return abstraction or speculative persistence methods without agreement.

## 2. Boundary behavior

**Decision:** Keep provider and transport details outside application behavior while following the selected error and sync/async conventions.

**Reason:** Preserve readable flows and localize future integration changes without adding abstractions that the current memory implementation does not need.

- A sync memory choice does not change atomic refresh/logout, current-session verification, grant updates, limiter admission, cleanup, or replay-retention requirements.
- Expected application errors retain safe client-facing mappings. Unexpected exceptions still follow existing fault logging; validation/expected denials are not reclassified as unexpected faults.
- Logging remains background delivery with independent worker/file processing. Allowing synchronous memory access does not make log delivery or file persistence synchronous.
- Future Prisma integration still requires its actual contracts, adapter mapping, exact database/driver scope, and supply-chain approval. The initial template contains persistence placeholders only.

See [DOC-011 — Code Conventions](DOC-011-code-conventions.md), [DOC-012 — HTTP Boundary Conventions](DOC-012-http-conventions.md), [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md), and [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md) for accepted behavior.

## 3. First-release acceptance and review

**Decision:** Review the completed first version as one complete result, with all criteria below satisfied.

**Reason:** The maintainer explicitly selected complete-result review after approving unit and HTTP tests.

- Build, type checking, basic lint, default-Prettier verification, and all unit/HTTP tests pass. Focused commands do not replace the aggregate check.
- Tests verify the existing accepted behavior, including auth/permissions, HTTP boundaries, process health, limiter/cleanup, and logging failure paths. No per-method test mandate or new feature is added.
- The agreed Swagger workflow can be tried successfully, including its separate access protection and API token flow.
- The API keeps serving when the logging worker is unavailable, with the accepted safe delivery-failure behavior.
- README and `.env.example` explain how to configure and run both processes. Real secrets and runtime files remain outside Git.

These are acceptance criteria, not completed verification. Implementing and checking incrementally is compatible with reviewing the completed result together. No commit/push, publishing, installation, or execution is authorized by this review choice.

## 4. Software approval boundary

Express and `@nestjs/config` are selected directions; their exact versions, published graphs, support, advisories, install behavior, and provenance still need the full [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md). Existing assessment remains [DOC-017 — Tooling Preflight](DOC-017-tooling-preflight.md), with overall **UNKNOWN** artifact clearance. No package, source scaffold, config file, `.env`, secret, hash, or test execution was created by these documentation decisions.
