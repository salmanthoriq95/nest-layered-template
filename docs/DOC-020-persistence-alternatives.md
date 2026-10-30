# DOC-020 — Persistence Alternatives

**Status:** Historical comparison; Prisma selected for future persistence · **Artifact decision:** UNKNOWN · **Retrieved:** 2026-10-30.
**Records:** [D-068 — Additional persistence alternatives](DOC-003-decisions.md#d-068--additional-persistence-alternatives), [D-069 — Prisma ORM direction](DOC-003-decisions.md#d-069--prisma-orm-direction).

**Current decision:** Prisma is the future ORM direction. The comparison below is history; initial persistence stays placeholders.

**Decision:** Compare Kysely, Knex, and MikroORM beyond the earlier Drizzle/Prisma review. Document Knex's current TypeScript support and distinguish typed queries, runtime DTO validation, and model-style APIs. Add no persistence implementation.

**Reason:** The maintainer requested alternatives and described losing useful TypeScript typing with Knex in 2021, asking whether it now supports access such as `db.users.query()`.

## 1. Design comparison

Versions are exact review targets from upstream releases, not approved artifacts. All examples assume configured clients, hypothetical tables/entities, and string user IDs; no real users/CRUD/database requirement is added.

| Component / version | Abstraction and strengths | Costs | Node declaration |
| --- | --- | --- | --- |
| [Kysely `0.29.7`](https://github.com/kysely-org/kysely/releases/tag/v0.29.7) | Typed SQL query builder. Table/column visibility and selected-result inference suit explicit persistence adapters. | Maintain database types/schema alignment, relations, migrations, and the chosen driver; no automatic entity change tracking. | [Tagged manifest](https://raw.githubusercontent.com/kysely-org/kysely/v0.29.7/package.json): `>=22.0.0`, ESM. |
| [Knex `3.3.0`](https://github.com/knex/knex/releases/tag/3.3.0) | SQL query/schema builder with migration tooling and familiar explicit queries. Typed table registration reduces repeated generics. | TypeScript remains best effort; mutable chains, aliases, and broad overloads can weaken inference. More runtime dependencies and driver review. | [Tagged manifest](https://raw.githubusercontent.com/knex/knex/3.3.0/package.json): `>=16`. |
| [MikroORM core `7.2.5`](https://github.com/mikro-orm/mikro-orm/releases/tag/v7.2.5) | ORM with mapped entities, relationships, identity map, and change tracking through Unit of Work. | More concepts: entity metadata, request contexts, managed state, flush, loading behavior, and provider-to-contract mapping. | [Moving-source manifest](https://raw.githubusercontent.com/mikro-orm/mikro-orm/master/packages/core/package.json): `>=22.17.0`, ESM. Tagged/published manifest binding remains missing. |

All three observed engine ranges admit Node 26. This is not a successful Node 26 integration test or a guarantee for drivers, CLI tools, native artifacts, or the complete graph. Upstream release activity is evidence of maintenance, not a verified formal support lifetime.

### Query syntax

```ts
// Kysely: db's Database type declares users and its columns.
const user = await db
  .selectFrom('users')
  .select(['id', 'name'])
  .where('id', '=', userId)
  .executeTakeFirst();
```

[Kysely select API](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#executeTakeFirst).

```ts
// Knex: users is registered in Tables, as shown below.
const user = await db('users')
  .select('id', 'name')
  .where('id', userId)
  .first();
```

[Knex query API](https://knexjs.org/guide/query-builder.html).

```ts
// MikroORM: a configured ORM and mapped UserEntity are assumed.
const em = orm.em.fork();
const user = await em.findOne(
  UserEntity,
  { id: userId },
  { fields: ['id', 'name'] },
);
```

Use a context/identity map per request or job; do not share managed state across unrelated requests. Unit of Work tracks entity changes and `flush()` writes them. Map entities to plain application-owned contract results inside persistence. [MikroORM request context](https://mikro-orm.io/docs/identity-map), [EntityManager](https://mikro-orm.io/docs/entity-manager).

## 2. Knex TypeScript and model-style access

Current Knex supports row generics, table-interface augmentation, and separate read/insert/update types through `CompositeTableType`. For this project's NodeNext direction, its documentation uses the `.js` suffix in the augmentation module name:

```ts
import type { Knex } from 'knex';

interface UserRow {
  id: string;
  name: string;
}

declare module 'knex/types/tables.js' {
  interface Tables {
    users: Knex.CompositeTableType<
      UserRow,
      Pick<UserRow, 'name'>,
      Partial<Pick<UserRow, 'name'>>
    >;
  }
}

// Assumes a configured Knex client and a matching database schema.
const user = await db('users').where('id', userId).first();
```

This registers query types; it does not create a runtime `db.users` property or synchronize the database schema. The normal entry point remains `db('users')`. A plain string fallback/alias or mutable query continuation can lose inference; passing an explicit result generic does not prove the query selected those fields. The maintainer's exact earlier failure has not been reproduced, so this is current capability evidence, not a claim that every 2021 typing problem was fixed. [Knex TypeScript registration](https://knexjs.org/guide/#typescript), [query inference caveats](https://knexjs.org/guide/query-builder.html#caveat-with-type-inference-and-mutable-fluent-apis).

Database row/insert/update types are separate from HTTP DTOs and Zod runtime validation. Their TypeScript annotations alone do not validate requests or database results. Do not reuse a persistence row as a public DTO solely to avoid writing a boundary mapping.

For model-style access, Objection exposes `UserModel.query()` above Knex. Its [moving-source manifest](https://raw.githubusercontent.com/Vincit/objection.js/master/package.json) declares `objection@3.1.5`; the [query API](https://vincit.github.io/objection.js/guide/query-examples.html) and [Knex relationship](https://vincit.github.io/objection.js/guide/) explain that shape. This is an API illustration only: its support, Node 26 behavior, security, published graph, and provenance have not been reviewed. **Decision: UNKNOWN.** No Objection integration or custom `db.users.query()` wrapper is proposed or approved.

## 3. Security evidence

This is a targeted comparison, not an exhaustive advisory audit. Review or block affected software according to exposure; a candidate being outside these ranges does not establish overall safety.

| Component / finding | Affected versions and fix | Candidate implication |
| --- | --- | --- |
| Kysely `GHSA-fv63-qcqv-fg6m`, MSSQL JSON helper injection | `0.26.0–0.28.17` and `0.29.0–0.29.6`; fixed in `0.28.18`/`0.29.7`. [Maintainer advisory](https://github.com/kysely-org/kysely/security/advisories/GHSA-fv63-qcqv-fg6m). | Review target `0.29.7` contains the documented fix. |
| Kysely `CVE-2026-44635`, JSON-path traversal | `0.26.0–0.28.16`; fixed in `0.28.17`. [Maintainer advisory](https://github.com/kysely-org/kysely/security/advisories/GHSA-pv5w-4p9q-p3v2). | Target is later. Other entries on the [advisory index](https://github.com/kysely-org/kysely/security/advisories) still need full exact-version assessment. |
| Knex `CVE-2016-20018`, limited SQL injection; `CVE-2019-10757`, MSSQL identifier injection | Respectively `<2.4.0`, fixed in `2.4.0`; `<0.19.5`, fixed in `0.19.5`. [GitHub limited-injection record](https://github.com/advisories/GHSA-4jv9-3563-23j3), [GitHub MSSQL record](https://github.com/advisories/GHSA-58v4-qwx5-7f59); matching [OSV limited-injection record](https://osv.dev/vulnerability/GHSA-4jv9-3563-23j3) and [OSV MSSQL record](https://osv.dev/vulnerability/GHSA-58v4-qwx5-7f59). | `3.3.0` is later than both fixes. |
| MikroORM `CVE-2026-34220`, crafted-object SQL injection; `CVE-2026-34221`, merge prototype pollution | `<6.6.10` and `>=7.0.0-dev.0, <7.0.6`; fixed in `6.6.10`/`7.0.6`. [SQL injection OSV](https://osv.dev/vulnerability/GHSA-gwhv-j974-6fxm), [prototype-pollution OSV](https://osv.dev/vulnerability/GHSA-qpfv-44f3-qqx6). | `7.2.5` is later than these fixes. |
| MikroORM `GHSA-jv98-hgvp-xwx7`, populate-option prototype pollution | Advisory lists `<=7.1.11`, fixed in `7.1.12`. [Maintainer advisory](https://github.com/mikro-orm/mikro-orm/security/advisories/GHSA-jv98-hgvp-xwx7). | Target is later. The remaining [advisory index](https://github.com/mikro-orm/mikro-orm/security/advisories) needs complete assessment. |

Keep client-controlled query structure, raw SQL, identifiers, JSON paths, ORM options, and update fields behind explicit mappings and validation. Do not forward request objects directly into provider APIs.

## 4. Preflight limits and next step

- Published registry metadata for all three targets was inaccessible; the MikroORM tagged manifest was also inaccessible. Full direct/transitive/optional graphs, packaging, install hooks, permissions, and credential/file/network behavior remain unverified. Some source scripts/manifests were inspected, but no installer, generator, migration, or test was executed.
- OSV package searches for all three were inaccessible. Specific Knex and MikroORM OSV records above were accessible; Kysely's new MSSQL and MikroORM's new populate OSV/GitHub database records were inaccessible even though maintainer advisories were accessible. No result is treated as an empty database.
- Exact graph KEV checks, OpenSSF/Socket/deps.dev evidence, artifact integrity/signatures/provenance, and formal support are incomplete for these comparison candidates. Driver/platform and Node 26 behavior remain untested.
- **Confidence:** high for cited API/manifest/advisory observations; design fit is a judgment. **Decision:** UNKNOWN for installing/executing Kysely `0.29.7`, Knex `3.3.0`, or MikroORM core `7.2.5`.
- Historical assessment: Kysely suited typed SQL; the maintainer later selected Prisma. Knex is useful for familiar SQL/migration workflows; MikroORM fits a deliberate need for managed entities and relationships. These are conditional design judgments, not artifact clearance.
- Prisma is selected for future database persistence; placeholders remain sufficient initially. Before a real integration, identify exact Prisma/database/driver/tooling scope and complete [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md) before requesting execution approval.
