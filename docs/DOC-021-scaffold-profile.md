# DOC-021 — Initial Scaffold Profile

**Status:** Accepted profile, configuration layout, and auth contract conventions; artifacts/implementation pending · **Updated:** 2026-10-30.
**Records:**

- [D-070 — Initial scaffold configuration](DOC-003-decisions.md#d-070--initial-scaffold-configuration)
- [D-071 — First-release acceptance and review](DOC-003-decisions.md#d-071--first-release-acceptance-and-review)
- [D-072 — JWT and native bcrypt implementations](DOC-003-decisions.md#d-072--jwt-and-native-bcrypt-implementations)
- [D-073 — ESNext and verified application builds](DOC-003-decisions.md#d-073--esnext-and-verified-application-builds)
- [D-074 — Internal contract inputs and values](DOC-003-decisions.md#d-074--internal-contract-inputs-and-values)
- [D-075 — Stable public demo fixtures](DOC-003-decisions.md#d-075--stable-public-demo-fixtures)
- [D-076 — Dependency ranges and committed lockfile](DOC-003-decisions.md#d-076--dependency-ranges-and-committed-lockfile)
- [D-077 — Compiler configuration and script layout](DOC-003-decisions.md#d-077--compiler-configuration-and-script-layout)
- [D-078 — Authentication service and crypto boundaries](DOC-003-decisions.md#d-078--authentication-service-and-crypto-boundaries)
- [D-079 — Storage lookup snapshots](DOC-003-decisions.md#d-079--storage-lookup-snapshots)
- [D-080 — Hexadecimal refresh tokens and SHA-256 verifiers](DOC-003-decisions.md#d-080--hexadecimal-refresh-tokens-and-sha-256-verifiers)
- [D-081 — Caret dependency ranges](DOC-003-decisions.md#d-081--caret-dependency-ranges)

## 1. Configuration profile

**Decision:** Apply the nine choices below while preserving existing architecture, HTTP behavior, in-memory auth, native cleanup, and independent logging.

**Reason:** The maintainer chose familiar tools, baseline checks, automatic feedback, and synchronous memory operations where appropriate.

| Area | Accepted choice |
| --- | --- |
| HTTP adapter | Express. Exact Nest/Express artifacts and middleware remain subject to preflight. |
| TypeScript | `strict` initially; target `ESNext` with ESM/NodeNext and `tsc` compilation. Do not add `noUncheckedIndexedAccess` or `exactOptionalPropertyTypes`. |
| ESLint | Basic checks, without a type-aware lint preset initially. Type checking remains a separate compiler check. |
| Prettier | Use the approved exact version's defaults, without custom formatting preferences. No separate quote/width/semicolon convention is selected. |
| Development | Automatic watching: one compiler-watch command and separate API/worker watch commands. Keep the two application processes independent; the API does not launch or supervise the worker. |
| Environment | `@nestjs/config` plus Zod startup validation. Preserve all accepted environment names, defaults, units, secret handling, and per-process validation. Verify literal bcrypt-hash loading before relying on the loader. |
| Memory operations | In-memory implementations and their current contracts may be synchronous. Use `Promise<T>` when an operation actually needs async work; no blanket async abstraction is required for future persistence. |
| Expected failures | Throw application-owned typed errors from services. Map them to the accepted HTTP status/envelope at the boundary. Keep Nest HTTP exceptions and request/response objects outside application contracts/services. |
| Tests | `npm test` runs unit and HTTP tests. Also provide `test:unit` and `test:e2e`. Build success requires type checking and passing compiled unit/HTTP tests; application artifacts exclude tests. `npm run check` also includes basic lint and default-Prettier verification. |

The maintainer's numbered reply repeated basic lint, then gave the remaining choices in order. The record follows the answer content: default Prettier, automatic watch, `@nestjs/config`/Zod, synchronous memory allowed, typed application errors, and both test scopes. The repetition adds no separate convention.

The target, selected flags, config/output layout, auth service signatures, and conventions in sections 5–6 are accepted. Complete config/script contents, watcher startup details, remaining store/provider signatures, actual fixture values, dependency baselines/resolutions, and artifacts still require review. Do not introduce a mixed sync/async return abstraction or speculative persistence methods without agreement.

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

Express, `@nestjs/config`, `jose`, and native `bcrypt` are selected directions; exact artifacts, published graphs, support, advisories, install behavior, and provenance still need the full [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md). The maintainer selected `bcrypt@6.0.0` as the review baseline; `jose@6.2.14` remains the current review target, not a cleared artifact. Existing assessment remains [DOC-017 — Tooling Preflight](DOC-017-tooling-preflight.md), with overall **UNKNOWN** artifact clearance. No package, source scaffold, config file, `.env`, secret, hash, or test execution was created by these documentation decisions.

## 5. Implementation selections

**Decision:** Apply the selected library, build, contract, fixture, and dependency conventions below.

**Reason:** The maintainer chose these nine items and separately confirmed that tests must execute against compiled JavaScript before a build succeeds.

| Area | Accepted choice |
| --- | --- |
| JWT | `jose`, behind the application-owned identity contract. Keep the accepted HS256 claims, validation, key format, expiry, and session checks. |
| Password hashing | Native `bcrypt`, review baseline `6.0.0`, for both application accounts and the separate Swagger credential check. Use its async API for request-time checks; retain cost and UTF-8 length rules. |
| Compiler target | `ESNext`. Its meaning follows the chosen TypeScript version, so compiler updates require runtime compatibility review. |
| Build and tests | Separate build/test configurations and output locations. Build success requires type checking plus executed unit and HTTP tests against compiled JavaScript. Ship application artifacts without test files. |
| Method inputs | Prefer named input objects, e.g. `login({ username, password })`. A simple lookup such as `findById(id)` may take its single value directly. |
| Missing lookup | Return `undefined` from storage lookups when no record exists. This does not change required JSON `null` fields in HTTP envelopes. |
| Internal session time | Use epoch milliseconds with explicit names such as `expiresAtMs`. JWT NumericDate claims and environment TTLs remain seconds; limiter elapsed time remains monotonic. |
| Demo fixtures | Generate UUID v4 IDs and separately salted bcrypt hashes once, after execution approval, and commit them as public demo fixtures. Both passwords remain `dev123`; do not regenerate IDs/hashes at startup. |
| Dependencies | Use caret ranges with a committed `package-lock.json`; use `npm ci` for repeat installs after approval. Actual version baselines and every resolved artifact still need review. |

### Build and test artifacts

Compilation checks types and emits JavaScript; the test runner separately executes behavioral assertions. A successful compilation alone does not establish runtime behavior. See the [Node test runner](https://nodejs.org/api/test.html) and [TypeScript compiler options](https://www.typescriptlang.org/tsconfig/noEmitOnError.html), retrieved 2026-10-30.

- Compile application code and tests using the same application compiler profile, with test-specific file selection/output kept separate.
- Run compiled unit and HTTP tests as part of the build workflow. A failed type check, compilation, or required test makes the build fail.
- Keep test sources, compiled tests, and test fixtures outside the application artifact. Deployment/startup does not run the test suite.
- Preserve focused test commands and the aggregate check. Compose compilation/build/test steps without recursive commands or redundant full-suite runs. Output paths are fixed in section 6; exact scripts remain review items.
- Test results describe the exercised behavior of the checked revision/configuration; they do not prove every runtime environment behaves identically.

The accepted target is `ESNext`, not a fixed language-year target. Its semantics can change with a compiler upgrade. [TypeScript target documentation](https://www.typescriptlang.org/tsconfig/target.html), retrieved 2026-10-30.

Only public dummy-account fixtures belong in Git. JWT signing keys, Swagger credentials, logging credentials, real account data, and runtime state retain their existing secret exclusions. Version ranges do not authorize automatic updates: any new resolution/lockfile change requires full preflight and explicit approval before affected software steps.

## 6. Configuration layout and auth contracts

**Decision:** Apply all seven selected configuration/contract choices below, using hexadecimal refresh tokens.

**Reason:** The maintainer selected A for questions 1–5 and 7, and B for question 6. This fixes the proposed layout and boundaries without authorizing software execution.

| Area | Accepted detail |
| --- | --- |
| Source maps | Include source maps in application builds, including deployment artifacts, for debugging compiled code. |
| Compiler configuration | Root `tsconfig.json` is the shared basis; `tsconfig.build.json` and `tsconfig.test.json` extend it. Application output is `dist/`; test compilation output is `.test-dist/`. |
| Workflow scripts | Use small project-owned Node scripts in `scripts/`, invoked through npm, to coordinate compilation, test execution, output cleanup, and exit codes. Add no orchestration library. |
| Crypto boundaries | `IdentityProviderContract` owns JWT issuance/verification through jose. A separate `PasswordVerifierContract` owns bcrypt password checks for application/Swagger use. Keep library types outside application contracts. |
| Lookup ownership | Return copied record snapshots with readonly types. Do not expose mutable nested state owned by storage; apply changes through explicit storage operations. Missing records still return `undefined`. |
| Refresh credentials | Generate 32 cryptographically random bytes and encode them as hexadecimal, producing 64-character tokens. Store only a SHA-256 digest with existing user/session/expiry and replay bindings. |
| Dependency declarations | Use caret ranges, e.g. `^6.0.0` for the selected bcrypt baseline after artifact approval. Keep the lockfile and review every actual resolution; caret is not update permission. |

Selected shared `compilerOptions`, in addition to the accepted ESNext/NodeNext/strict profile:

```json
{
  "experimentalDecorators": true,
  "emitDecoratorMetadata": true,
  "noEmitOnError": true,
  "sourceMap": true
}
```

The accepted authentication-service shape is:

```ts
abstract class AuthenticationServiceContract {
  abstract login(input: LoginInput): Promise<TokenResult>;
  abstract refresh(input: RefreshInput): Promise<TokenResult>;
  abstract logout(input: SessionIdentity): void;
}
```

`LoginInput` contains username/password; `RefreshInput` contains the refresh token. `SessionIdentity` carries the verified user/session identity, never an arbitrary target from a logout request body. `TokenResult` follows the accepted token result in [DOC-015 — Demo API Contracts: 2. Input and token result schemas](DOC-015-demo-api-contracts.md#2-input-and-token-result-schemas). Logout is synchronous for the current memory implementation; JWT and password operations require async work. Retain typed application errors and atomic refresh/logout behavior.

Hash the complete refresh-token representation consistently for storage/lookup. Keep raw refresh tokens out of storage and logs; retain consumed-token evidence until the existing session deadline. This generator choice does not change HTTP input bounds, credential-error mappings, token transport, or rotation rules. Passwords still use bcrypt.

Copied lookup results do not introduce grant-management endpoints or unused persistence operations. Exact JWT/password-provider and session-store methods remain review items. The snippets are documentation, not generated configuration/source or executed checks.
