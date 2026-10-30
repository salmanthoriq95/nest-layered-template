# DOC-019 — Drizzle Security and Compatibility Review

**Status:** Historical partial review; Prisma selected for future persistence · **Decision:** UNKNOWN · **Retrieved:** 2026-10-30.
**Records:**

- [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [D-063 — Node 26 runtime direction](DOC-003-decisions.md#d-063--node-26-runtime-direction)
- [D-065 — Drizzle security and compatibility review](DOC-003-decisions.md#d-065--drizzle-security-and-compatibility-review)

**Decision:** Retain the earlier `drizzle-orm@0.45.4` review as evidence; Prisma is now selected under [D-069 — Prisma ORM direction](DOC-003-decisions.md#d-069--prisma-orm-direction). The known advisory below is patched before this version; complete artifact safety and Node 26 compatibility remain unverified. Do not install an ORM, driver, or Drizzle Kit.

**Reason:** The maintainer finds Drizzle comfortable and requested current security and Node 26 evidence. Initial persistence still consists of placeholders.

## Component and alternatives

- Component: npm `drizzle-orm`, exact review version `0.45.4`; purpose: a future SQL persistence adapter. [Upstream release](https://github.com/drizzle-team/drizzle-orm/releases/tag/0.45.4), [tagged manifest](https://raw.githubusercontent.com/drizzle-team/drizzle-orm/0.45.4/drizzle-orm/package.json).
- Maintenance evidence: GitHub's latest release points to `0.45.4`, published October 8; it fixes prepared-query behavior in `postgres-js`. This shows release activity, not a formal support lifetime or Node 26 certification.
- Alternatives: retain placeholders for this template; compare Kysely or Prisma only if future requirements justify them. No database, driver, migration tool, or integration is selected. See [DOC-018 — Integration Alternatives: 2. Persistence alternatives](DOC-018-integration-alternatives.md#2-persistence-alternatives).

## Security finding

| Finding | Affected versions | Fixed versions | Candidate implication |
| --- | --- | --- | --- |
| `CVE-2026-39356` / `GHSA-gpj5-g38j-94v9`, high severity, SQL identifier injection | Stable `<0.45.2`; prereleases `>=1.0.0-beta.2, <1.0.0-beta.20` | `0.45.2` and `1.0.0-beta.20` | `0.45.4` is outside these ranges. This clears this finding's version range only. |

Untrusted runtime names or aliases passed to `sql.identifier()` or `.as()` can trigger the flaw in affected versions. Future adapters should map dynamic field choices to known schema objects and parameterize values. [Maintainer advisory](https://github.com/drizzle-team/drizzle-orm/security/advisories/GHSA-gpj5-g38j-94v9), [GitHub Advisory Database](https://github.com/advisories/GHSA-gpj5-g38j-94v9), [OSV record](https://osv.dev/vulnerability/GHSA-gpj5-g38j-94v9).

The tagged [PostgreSQL dialect](https://raw.githubusercontent.com/drizzle-team/drizzle-orm/0.45.4/drizzle-orm/src/pg-core/dialect.ts) doubles embedded identifier quotes in `escapeName()`. This targeted source check is not proof of the complete published artifact, all dialects, or all vulnerabilities.

## Node 26 compatibility

- The tagged core manifest has no Node `engines` declaration. Its [build script](https://raw.githubusercontent.com/drizzle-team/drizzle-orm/0.45.4/drizzle-orm/scripts/build.ts) defines ESM and CommonJS exports. This is a plausible fit for the accepted ESM direction, not explicit Node 26 support evidence.
- No confirmed Node 26-specific defect was identified in the sources inspected. Formal support, the exact tagged CI matrix, and runtime behavior remain unverified; no compatibility test was run.
- Drizzle lists optional database-driver peers, including `pg`, `postgres`, `mysql2`, and SQLite drivers. Their exact versions, Node 26 support, native binaries where applicable, and dependency graphs need separate checks after a real database requirement exists. A core-package conclusion cannot clear those drivers.
- Drizzle Kit is a separate package/tool. Its schema loading, ESM/TypeScript behavior, migrations, and compatibility must be reviewed separately before use. Core `0.45.4` does not select a Kit version.

## Preflight evidence and gaps

| Check | Evidence and limitation |
| --- | --- |
| Identity, purpose, maintenance | Upstream release/tag reviewed. [Published metadata](https://registry.npmjs.org/drizzle-orm/0.45.4) was inaccessible; formal support lifetime remains unknown. |
| Authoritative advisories, OSV, GitHub | The records above agree on the identifier-injection ranges. [OSV package search](https://osv.dev/list?ecosystem=npm&q=drizzle-orm) was cached; the broader GitHub package query and OSV API were inaccessible. Full current exact-version/graph coverage is incomplete. |
| CISA KEV | The [official mirror](https://raw.githubusercontent.com/cisagov/kev-data/main/known_exploited_vulnerabilities.json), catalog `2026.10.29`, was accessible. The text lookup did not establish a reliable exact-CVE absence result; no claim of KEV clearance is made. |
| Malware and supply-chain signals | [OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/drizzle-team/drizzle-orm), [Socket](https://socket.dev/npm/package/drizzle-orm/overview/0.45.4), and [deps.dev](https://api.deps.dev/v3/systems/npm/packages/drizzle-orm/versions/0.45.4) were inaccessible. No clean-score or malware-clearance claim. |
| Scripts, dependencies, permissions, network | Tagged core manifest/build script inspected. Source build commands include Prisma generation and TypeScript/bundle tooling; no consumer `preinstall`/`install`/`postinstall` hook is declared there. Optional peers and published packaging still need inspection. Complete credential/file/network behavior was not audited. No command was run. |
| Integrity and provenance | GitHub marks the release commit signed; this does not bind the npm tarball to reviewed source. Published integrity, artifact signatures/provenance, and dependency binding remain unverified. |

**Confidence:** High for the cited advisory ranges and tagged source observations; insufficient for end-to-end Node 26 compatibility or artifact safety. **Decision:** UNKNOWN for `drizzle-orm@0.45.4` installation/execution. Review or block affected versions according to exposure; do not use an unpatched version with attacker-controlled identifiers.

If Drizzle is reconsidered later, identify its exact database/driver/Kit scope, resolve published metadata and graph evidence, and complete [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md) before requesting concrete execution approval. No package, schema, migration, driver, or integration was added.
