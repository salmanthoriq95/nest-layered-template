# DOC-017 — Tooling Preflight

**Status:** Node 26, Zod, Node Schedule, Prisma, and tooling directions accepted; artifact preflight incomplete · **Decision:** UNKNOWN · **Retrieved:** 2026-10-30.
**Records:**

- [D-002 — Software supply chain policy](DOC-003-decisions.md#d-002--software-supply-chain-policy)
- [D-060 — Initial tooling candidate review](DOC-003-decisions.md#d-060--initial-tooling-candidate-review)
- [D-061 — LTS-first runtime review](DOC-003-decisions.md#d-061--lts-first-runtime-review)
- [D-063 — Node 26 runtime direction](DOC-003-decisions.md#d-063--node-26-runtime-direction)
- [D-064 — Zod validation direction](DOC-003-decisions.md#d-064--zod-validation-direction)
- [D-067 — Node Schedule direction](DOC-003-decisions.md#d-067--node-schedule-direction)
- [D-069 — Prisma ORM direction](DOC-003-decisions.md#d-069--prisma-orm-direction)

**Decision:** Use Node 26's latest supported patch, Zod, Node Schedule, and future Prisma persistence as design directions; keep artifact adoption, download, installation, and execution pending. None of the candidates below has installation clearance. Missing registry, provenance, maintenance, and transitive evidence prevents an ELIGIBLE decision.

**Reason:** Identify a small compatible stack while applying the complete [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md). This is an evidence ledger and proposal, not a completed audit or an installation manifest.

## 1. Candidate profile

Accepted directions: Node 26's latest supported patch, Zod validation, Node Schedule, Prisma for future database persistence, npm, ESM/NodeNext, compilation through TypeScript, native Node tests/assertions and HTTP requests, and separate ESLint/typescript-eslint/Prettier checks. The current Node target is `26.13.0`; recheck the patch before installation review. The HTTP adapter and exact artifacts remain candidates. Keep accepted DI, test locations, validation behavior, auth, and logging policy.

Use native Node facilities for environment loading, crypto/UUIDs, timers, HTTP delivery, and log files where they meet accepted contracts. Test literal bcrypt-hash loading before relying on any environment loader. Node Schedule is the calendar-scheduler direction; it does not replace accepted native cleanup or create a job. No additional config, logging, process-manager, or test-runner package is proposed initially. Build/watch commands and exact configuration still need review.

Node's TypeScript stripping does not transform decorators or read `tsconfig.json`; compile the Nest application before running it. [Node TypeScript support](https://nodejs.org/api/typescript.html#typescript-features). Native testing and environment loading are documented in [Node test runner](https://nodejs.org/api/test.html) and [Node environment variables](https://nodejs.org/api/environment_variables.html). These are feasibility references, not execution approval.

### Candidate inventory

All source links below were retrieved on **2026-10-30**. Node 26, Zod, and Node Schedule are accepted design directions; exact versions identify review targets, not cleared artifacts. Historical alternatives are labeled. Upstream manifests are not proof of published contents. Every listed candidate remains **UNKNOWN** for installation because section 4's evidence gaps remain unresolved.

| Component | Exact review version | Purpose and source | Maintenance/support evidence |
| --- | --- | --- | --- |
| Node.js | `26.13.0` | Selected runtime line, current patch target; [official release index](https://nodejs.org/dist/index.json) | Official [LTS release](https://nodejs.org/en/blog/release/v26.13.0). Platform-specific artifact remains unverified. |
| Node.js, historical LTS alternative | `24.22.2` | Earlier comparison; [official release](https://nodejs.org/en/blog/release/v24.22.2) | 24.x is Maintenance LTS; support ends 2028-04-30. Not the selected runtime direction. |
| npm | `11.20.0` | Package manager bundled with that Node release; [upstream manifest](https://raw.githubusercontent.com/npm/cli/v11.20.0/package.json) | Bundle version confirmed by Node index; independent support/complete bundled-dependency review pending. |
| npm, Node 24 bundle | `11.19.1` | Alternative bundled manager; [upstream manifest](https://raw.githubusercontent.com/npm/cli/v11.19.1/package.json) | Bundle version confirmed by the Node index; separate exact-version/bundled graph review remains pending. |
| `@nestjs/common` | `12.3.0` | Framework primitives; [tagged manifest](https://raw.githubusercontent.com/nestjs/nest/v12.3.0/packages/common/package.json) | Current tagged release activity; formal version-support window not established. |
| `@nestjs/core` | `12.3.0` | DI and application runtime; [tagged manifest](https://raw.githubusercontent.com/nestjs/nest/v12.3.0/packages/core/package.json) | Same release evidence; Node engine `>=20`. |
| `@nestjs/platform-express` | `12.3.0` | HTTP adapter; [tagged manifest](https://raw.githubusercontent.com/nestjs/nest/v12.3.0/packages/platform-express/package.json) | Same release; depends on Express `5.3.0`. |
| `@nestjs/swagger` | `12.0.5` | OpenAPI generation/UI; [tagged manifest](https://raw.githubusercontent.com/nestjs/swagger/12.0.5/package.json) | Active release; peers include Nest 12 and TypeScript `^5.5.0 || ^6.0.0`. |
| `reflect-metadata` | `0.2.2` | Decorator metadata required by the proposed compiler profile | Version appears in Swagger's tagged manifest; direct published manifest/support evidence unavailable. |
| `rxjs` | `7.8.2` | Nest observable/interceptor support; [tagged manifest](https://raw.githubusercontent.com/ReactiveX/rxjs/7.8.2/package.json) | Fits Nest's `^7.1.0` peer; formal support confirmation pending. |
| `zod` | `4.6.7` | Selected validation direction, artifact review target; [tagged manifest](https://raw.githubusercontent.com/colinhacks/zod/v4.6.7/packages/zod/package.json) | Upstream release reviewed; formal support window, full graph checks, and published artifact remain unverified. |
| `node-schedule` | Tagged review `2.1.0`; moving-source observation `2.1.2` | Selected calendar-scheduler direction; [tagged manifest](https://raw.githubusercontent.com/node-schedule/node-schedule/2.1.0/package.json), [moving manifest](https://raw.githubusercontent.com/node-schedule/node-schedule/master/package.json) | Exact published candidate unresolved. Broad Node range admits 26 but does not prove compatibility; advisory/provider/graph/artifact checks remain incomplete. |
| `class-validator`, historical alternative | `0.15.1` | Earlier DTO-validation comparison; [tagged manifest](https://raw.githubusercontent.com/typestack/class-validator/v0.15.1/package.json) | Not selected. Version used by Swagger's development setup; support window and published artifact unverified. |
| `class-transformer`, historical alternative | `0.5.1` | Earlier DTO-conversion comparison; [tagged manifest](https://raw.githubusercontent.com/typestack/class-transformer/v0.5.1/package.json) | Not selected. Support/maintenance commitment unconfirmed. |
| `jose` | `6.2.14` | HS256 signing/verification behind the identity contract; [tagged manifest](https://raw.githubusercontent.com/panva/jose/v6.2.14/package.json) | Current upstream release; ESM and no runtime dependency declaration in this manifest. |
| `bcryptjs` | `3.0.3` | Bcrypt account/Swagger verification; [upstream release](https://github.com/dcodeIO/bcrypt.js/releases/tag/v3.0.3) | Release identity confirmed; tagged source manifest uses `0.0.0`, so published version/content still needs verification. |
| `typescript` | `6.0.3` | Compile decorators/metadata and type-check; [tagged manifest](https://raw.githubusercontent.com/microsoft/TypeScript/v6.0.3/package.json) | Fits observed Swagger/linter peers; security maintenance of the 6.x line remains unconfirmed. |
| `eslint` | `10.13.0` | Linting; [tagged manifest](https://raw.githubusercontent.com/eslint/eslint/v10.13.0/package.json) | Current upstream release; published dependency graph unreviewed. |
| `typescript-eslint` | `8.72.1` | TypeScript lint support; [tagged manifest](https://raw.githubusercontent.com/typescript-eslint/typescript-eslint/v8.72.1/packages/typescript-eslint/package.json) | Peers include ESLint 10 and TypeScript `>=4.8.4 <6.1.0`; workspace dependency substitutions need published metadata. |
| `prettier` | `3.9.10` | Formatting; [tagged manifest](https://raw.githubusercontent.com/prettier/prettier/3.9.10/package.json) | Tagged release; Node `>=22`. Published packaging/bundling still unverified. |

Unresolved roles: a compatible, published `@types/node` version and any required lint-config/type packages. Their exact versions are not established; the inventory is incomplete. There is no project `package.json`, lockfile, or resolved dependency graph.

### Node LTS comparison

**Retrieved:** 2026-10-30 · **Runtime direction:** Latest supported Node 26 patch accepted · **Artifact clearance:** UNKNOWN for both lines.

| Line | Latest verified patch | Bundle | Lifecycle | Review implication |
| --- | --- | --- | --- | --- |
| Node 24 | `24.22.2` | npm `11.19.1` | Maintenance LTS since 2026-10-20; end 2028-04-30 | Supported alternative from the older major line. Do not use an old 24.x patch merely because the major is LTS. |
| Node 26 | `26.13.0` | npm `11.20.0` | Active LTS since 2026-10-28; end 2029-04-30 | Selected runtime line; latest patch target at retrieval. Ecosystem and artifact review remain incomplete. |

Versions/bundles come from the [official release index](https://nodejs.org/dist/index.json); lifecycle dates come from the [official schedule](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json). The index dates Node `24.22.2` at October 27 while its [release article](https://nodejs.org/en/blog/release/v24.22.2) is headed October 28; the exact version agrees. No live-update or automatic-upgrade policy is introduced.

- The [October security advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) addresses Brotli `CVE-2026-111497` and other issues, including TLS hostname-validation defects. Fix baselines are `24.22.1` and `26.12.1`. Both candidates are later patches; this does not prove absence of other vulnerabilities or verify their artifacts.
- Reviewed Nest core (`>=20`), ESLint (`^20.19.0 || ^22.13.0 || >=24`), and Prettier (`>=22`) engine declarations admit both candidates. This is a declaration comparison, not a successful build/test. Recheck every actual dependency and platform before adoption.
- Prisma 7's [requirements table](https://www.prisma.io/docs/orm/v7/reference/system-requirements) lists `^20.19.0`, `^22.12.0`, or `^24.0.0`; the same page states support for all Active/Maintenance LTS releases. Its [7.10.1 CLI manifest](https://raw.githubusercontent.com/prisma/orm/7.10.1/packages/cli/package.json) and [client manifest](https://raw.githubusercontent.com/prisma/orm/7.10.1/packages/client/package.json) use `^20.19 || ^22.12 || >=24.0`, which admits Node 26. Treat the table discrepancy as REVIEW before a future Prisma integration; it is not proof that Node 26 fails. Node 24 meets both declared ranges. Prisma is not part of the initial implementation.
- The [Node 26 LTS release](https://nodejs.org/en/blog/release/v26.13.0) confirms the October 28 transition and notes that official Linux binaries since Node 25 link against `libatomic`. Check target-image availability later; no system package is installed or selected here.
- That release article exposes checksum/signed-message metadata, but no artifact was downloaded or hashed and no signature was verified. Direct checksum endpoints, including [Node 24's](https://nodejs.org/dist/v24.22.2/SHASUMS256.txt), were inaccessible. Full graph advisories, provider signals, and cryptographic verification remain incomplete. Node 26 is the accepted line; no runtime artifact is cleared here.

### Compatibility and alternatives

- Nest 12's reviewed manifests use ESM. ESM/NodeNext is now the accepted compiler direction; exact settings remain unapproved.
- TypeScript `7.0.2` was observed at the registry's latest endpoint. Its platform-specific compiler packages and the reviewed Swagger/linter peer ranges make it a **REVIEW** alternative, not an automatic upgrade. [TypeScript 7 registry metadata](https://registry.npmjs.org/typescript/latest). Prefer evaluating `6.0.3` for this candidate set while confirming its maintenance status.
- Express is proposed for the initial HTTP adapter. Fastify and the newly released native Nest adapter remain alternatives needing their own compatibility/security review. The Express adapter brings transitive `multer` even though this template does not implement uploads; omission of an upload feature does not remove that dependency.
- Bcrypt remains the accepted algorithm. Compare pure-JavaScript `bcryptjs@3.0.3` with [native `bcrypt@6.0.0`](https://github.com/kelektiv/node.bcrypt.js/releases/tag/v6.0.0); artifact/build review and cost calibration are still needed. No benchmark or hashing command was run.
- Native Node tests are now the accepted runner direction. Jest/Vitest were considered alternatives; neither is selected or audited here. Colocated `*.spec.ts` and HTTP `test/*.e2e-spec.ts` locations remain accepted.
- npm is now the accepted package-manager direction; its exact version and bundle still need preflight. Nest CLI scaffolding is unnecessary for a manually prepared template, but exact setup commands remain unapproved.
- Zod and Node Schedule are accepted directions; exact artifacts and integration remain open. Node Schedule's calendar rules do not replace the native cleanup timer. Prisma is selected for future database persistence; the initial template still has placeholders. Earlier Prisma 7 evidence does not select that major/version or clear Node 26 compatibility. [DOC-020 — Persistence Alternatives](DOC-020-persistence-alternatives.md) and [DOC-019 — Drizzle Security and Compatibility Review](DOC-019-drizzle-review.md) retain comparison history.

## 2. Security findings

These are reviewed findings, not an exhaustive clean bill of health. All linked sources were retrieved **2026-10-30**.

| Finding | Affected versions / evidence | Candidate implication |
| --- | --- | --- |
| `CVE-2026-111497`: Brotli memory corruption, potentially RCE | Node's [October security release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) reports affected 26.x/24.x/22.x lines and fixes in `26.12.1`, `24.22.1`, `22.23.4`. CISA's [official KEV mirror](https://raw.githubusercontent.com/cisagov/kev-data/main/known_exploited_vulnerabilities.json), catalog `2026.10.29`, lists this CVE, added 2026-10-27. | Known exploited dependency issue. Candidates `26.13.0` and `24.22.2` are after the documented fixes; this comparison does not verify their artifacts or clear other issues. Vulnerable pre-fix releases are BLOCKED for this candidate profile. |
| `GHSA-36xv-jgw5-4q75` / `CVE-2026-35515`: Nest SSE injection | [GitHub Advisory Database](https://github.com/advisories/GHSA-36xv-jgw5-4q75) and [OSV record](https://osv.dev/vulnerability/GHSA-36xv-jgw5-4q75): `@nestjs/core <=11.1.17`, fixed `11.1.18`. | `12.3.0` is outside this reported range. No SSE endpoint is planned. Other advisories/transitives remain unresolved. |
| `GHSA-4jpv-8r57-pv7j` / `CVE-2023-26108`: StreamableFile exposure | [OSV record](https://osv.dev/vulnerability/GHSA-4jpv-8r57-pv7j): `@nestjs/core <9.0.5`, fixed `9.0.5`. | Candidate is outside this reported range; no assertion about complete framework security. |
| `GHSA-9c5c-9qcx-q35q`: path-scoped middleware bypass | [Maintainer advisory](https://github.com/nestjs/nest/security/advisories/GHSA-9c5c-9qcx-q35q): Fastify adapter `<11.2.4` or `>=12.0.0 <12.0.2`; fixes `11.2.4`/`12.0.2`, recommends later patches. | Relevant to adapter comparison and protection of path-scoped auth gates. Not a reason to declare Express immune to unrelated issues. |
| `GHSA-hhhv-q57g-882q` / `CVE-2024-28176`: JOSE JWE resource exhaustion | [GitHub Advisory Database](https://github.com/advisories/GHSA-hhhv-q57g-882q) and [OSV record](https://osv.dev/vulnerability/GHSA-hhhv-q57g-882q): `jose <2.0.7` or `>=3.0.0 <=4.15.4`; fixes `2.0.7`/`4.15.5`. Separate CJS/ESM runtime packages are affected through `4.15.4`. | Candidate `jose@6.2.14` is outside those reported ranges. The template uses signed JWTs; do not introduce JWE/JWKS networking. Complete package-wide review remains pending. |

The [Nest security policy](https://github.com/nestjs/nest/blob/master/SECURITY.md) provides a reporting contact but no version-support table. Recent releases demonstrate maintenance activity, not a verified support lifetime.

OSV searches also returned similarly named malicious packages, including `@bcryptln/bcryptjs` and `bcryptjs-node`: [bcryptjs search](https://osv.dev/list?ecosystem=npm&q=bcryptjs). These are distinct from `bcryptjs` and are BLOCKED; this search is not proof that the candidate is clean. A [GitHub malware advisory](https://github.com/advisories/GHSA-7qw6-43q5-x2pf) identifies `typescipt-core`, distinct from `typescript`. The linked OpenSSF raw record was inaccessible; independent OpenSSF verification remains pending.

## 3. Scripts, dependencies, and behavior

- Upstream Nest common/core/Express manifests were read. They do not declare install lifecycle hooks in those manifests. Known first-level dependencies include `file-type@22.2.0`, `path-to-regexp@8.4.2`, `tslib@2.8.1`, `express@5.3.0`, `multer@2.5.0`, and `cors@2.8.6`. Their complete published/transitive graph is not reviewed.
- Swagger's upstream manifest includes `prepare: npm run build`. Published-artifact lifecycle fields still need inspection; do not install from Git or execute a build hook on this evidence. Its dependency list includes `swagger-ui-dist@5.34.0` and `js-yaml@5.5.0`; these and other transitives need exact-version review.
- `class-validator` declares ranges for `validator`, `libphonenumber-js`, and type definitions. Those ranges do not identify the versions that would resolve today. No lockfile has been produced.
- The reviewed `jose` manifest has build/test scripts but no install lifecycle hook or runtime dependencies. Runtime feature scope must remain local signing/verification, without remote key fetching.
- Bcryptjs's [tagged manifest](https://raw.githubusercontent.com/dcodeIO/bcrypt.js/v3.0.3/package.json) has no runtime dependency declaration or install hook. The reviewed [randomness source](https://raw.githubusercontent.com/dcodeIO/bcrypt.js/v3.0.3/index.js) uses Web Crypto or Node crypto; this is a targeted source inspection, not full artifact verification. Published version/content binding remains missing.
- npm can read configuration/credentials, access registries, write caches/lockfiles, and spawn lifecycle scripts. Its bundled dependencies require review as well. No npm or npx command was run.
- Compiler/linter/formatter execution reads project files and can load executable configuration/plugins. Only reviewed project configuration and plugins may be used after approval. Upstream developer scripts, Git hooks, and devDependencies are not automatically the installed package's behavior; published manifests and packaging must be inspected separately.
- No software artifact was downloaded into the workspace or executed in this review. Browser-based source/metadata inspection does not establish installed behavior or a sandbox boundary.

## 4. Mandatory preflight coverage and gaps

**Confidence:** High for the specifically cited source facts and affected ranges; limited for maintenance commitments and overall supply-chain clearance. **Overall decision: UNKNOWN.**

| Required check | Evidence obtained / unresolved work |
| --- | --- |
| Exact identity/source/purpose | Candidate inventory above. Published metadata partly inaccessible; Node types, lint support packages, artifact platform, and full graph unresolved. |
| Support and maintenance | Node LTS verified; upstream releases/manifests reviewed. Formal support commitments for several packages, especially TypeScript 6 and class-transformer, remain unverified. |
| Authoritative advisories | Node security release and Nest maintainer advisories reviewed. Component-wide and transitive coverage incomplete. |
| OSV and GitHub Advisory Database | Package search pages and linked exact advisories read. No exact-version batch query/full-graph scan completed; cached search pages are not a current exhaustive API response. |
| CISA KEV | Main CISA feed returned HTTP 403; official `cisagov/kev-data` mirror was accessible. Brotli CVE positively matched. Full graph-to-CVE mapping remains incomplete; absence of a product-name match is not clearance. |
| OpenSSF / Socket / deps.dev | OpenSSF Scorecard API/viewer and deps.dev exact Nest version endpoints were inaccessible. Socket's bcryptjs `3.0.3` page was accessible but cached, with no complete current risk report established; Nest/Jose exact pages were inaccessible. These gaps remain UNKNOWN. |
| Scripts/dependencies/permissions/network | Targeted upstream manifest/source review above. Published artifacts, optional/native packages, all transitives, and all runtime network behavior remain unverified. |
| Integrity/signatures/provenance | Node checksum endpoints below were inaccessible. No candidate artifact checksum, signature, or provenance was cryptographically verified. A GitHub commit signature is not npm artifact provenance. |
| Safer alternatives | Compared in section 1; no alternative is pre-cleared. |

### Retrieval failures

Representative failed endpoints, attempted **2026-10-30**:

| Source | Result |
| --- | --- |
| [Nest core published metadata](https://registry.npmjs.org/%40nestjs%2Fcore/latest), [npm 11.20.0 metadata](https://registry.npmjs.org/npm/11.20.0), [bcryptjs 3.0.3 metadata](https://registry.npmjs.org/bcryptjs/3.0.3), [Node types metadata](https://registry.npmjs.org/%40types%2Fnode/latest) | Inaccessible through the browsing tool; source manifests used only as partial evidence. |
| [OSV advisory API](https://api.osv.dev/v1/vulns/GHSA-36xv-jgw5-4q75) | Inaccessible; corresponding OSV HTML record was accessible. |
| [OpenSSF Scorecard API](https://api.securityscorecards.dev/projects/github.com/nestjs/nest) | Inaccessible; no score or passed-check claim. |
| [deps.dev Nest version API](https://api.deps.dev/v3/systems/npm/packages/%40nestjs%2Fcore/versions/12.3.0) | Inaccessible; dependency/provenance result unavailable. |
| [Socket Nest version](https://socket.dev/npm/package/%40nestjs/core/overview/12.3.0) | Inaccessible; no current malware-clearance claim. |
| [Node release checksums](https://nodejs.org/dist/v26.13.0/SHASUMS256.txt), [alternate official checksum URL](https://nodejs.org/download/release/v26.13.0/SHASUMS256.txt) | Both direct endpoints inaccessible. The release article exposes checksum/signed-message metadata; no artifact hash comparison or signature verification. |

Search results with broad names can include other packages. In particular, the `npm` text search returned general ecosystem results; it did not complete an exact `npm@11.20.0` advisory check. Additional OSV searches for TypeScript/ESLint were accessible, while class-validator, RxJS, and Swagger queries were not. Do not interpret either outcome as a clean security result.

## 5. Review and execution gate

The maintainer accepted Node 26, Zod, Node Schedule, Prisma, and tooling directions, but no exact artifact is cleared here. Preserve the mandatory policy; do not treat an UNKNOWN result or agreement on a preferred stack as execution permission.

Before installation/execution:

1. Establish exact published versions for unresolved roles and the entire direct/transitive/optional/bundled graph using accessible metadata. Review target OS/architecture and provenance binding.
2. Complete support, authoritative advisory, exact-version OSV/GitHub, KEV, and malware/supply-chain checks for that graph. Reconcile inaccessible/stale evidence.
3. Inspect published install hooks, executable files, package configuration, permissions, and network behavior; verify available trusted checksums/signatures/provenance.
4. Report remaining exposure/mitigations and classifications without converting missing evidence into ELIGIBLE.
5. Request explicit maintainer approval for a concrete download/install/execution scope only after the required evidence is reviewable. ELIGIBLE still would not authorize execution by itself.

No package manager, runtime, installer, hashing script, application, or test suite has been executed. No `package.json`, lockfile, secret, application source, or runtime log was created. The accepted AI guide is version **4.23.0**, recording Node 26, Zod, Node Schedule, and future Prisma choices; artifact execution remains unapproved.
