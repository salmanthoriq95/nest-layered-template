# DOC-018 — Integration Alternatives

**Status:** Zod, Node Schedule, and future Prisma directions accepted · **Artifact clearance:** UNKNOWN · **Retrieved:** 2026-10-30.
**Records:**

- [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [D-059 — In-memory limiter and cleanup parameters](DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters)
- [D-060 — Initial tooling candidate review](DOC-003-decisions.md#d-060--initial-tooling-candidate-review)
- [D-061 — LTS-first runtime review](DOC-003-decisions.md#d-061--lts-first-runtime-review)
- [D-062 — ORM, scheduler, and validator comparison](DOC-003-decisions.md#d-062--orm-scheduler-and-validator-comparison)
- [D-064 — Zod validation direction](DOC-003-decisions.md#d-064--zod-validation-direction)
- [D-065 — Drizzle security and compatibility review](DOC-003-decisions.md#d-065--drizzle-security-and-compatibility-review)
- [D-066 — Readable scheduling preference](DOC-003-decisions.md#d-066--readable-scheduling-preference)
- [D-067 — Node Schedule direction](DOC-003-decisions.md#d-067--node-schedule-direction)
- [D-068 — Additional persistence alternatives](DOC-003-decisions.md#d-068--additional-persistence-alternatives)
- [D-069 — Prisma ORM direction](DOC-003-decisions.md#d-069--prisma-orm-direction)

**Decision:** Use Zod, Node Schedule, and Prisma as design directions. Keep initial persistence as placeholders; Preserve earlier comparisons and readable scheduling examples. Examples are isolated API illustrations, not application source or executable setup.

**Reason:** The maintainer selected Zod for readability, Node Schedule for explicit schedules, and Prisma for its perceived ecosystem maturity. “Worker” in this discussion means scheduler.

## 1. What Nest provides

Nest is database-agnostic; it integrates external drivers, ORMs, and query builders through providers. TypeORM is an integration, not an inseparable built-in ORM. [Nest database overview](https://docs.nestjs.com/data/overview).

`@nestjs/schedule` is an optional integration using the separate `cron` package for cron jobs and native timers for intervals/timeouts. `cron` and `node-cron` are different npm packages. A scheduler decides when work starts; it does not inherently provide an independent worker process, durable job storage, or cross-instance coordination. [Nest task scheduling](https://docs.nestjs.com/techniques/task-scheduling).

Nest's `ValidationPipe` uses external `class-validator`/`class-transformer`. Other validators can run behind a Nest pipe or application-owned adapter. [Nest validation](https://docs.nestjs.com/techniques/validation), [Nest pipes](https://docs.nestjs.com/pipes).

The initial project still uses general persistence placeholders, an accepted native 60-second cleanup timer, and an independent logging process. The comparisons below do not change those decisions.

## 2. Persistence alternatives

Each snippet assumes a configured client and hypothetical user model/table with string IDs and a `name` field. The examples are independent and do not add real users/CRUD/database requirements. All exact versions are review targets from upstream releases/manifests, retrieved 2026-10-30; installation clearance remains UNKNOWN.

**Current decision:** Prisma is the future ORM under [D-069 — Prisma ORM direction](DOC-003-decisions.md#d-069--prisma-orm-direction). The alternatives here and in [DOC-020 — Persistence Alternatives](DOC-020-persistence-alternatives.md) remain history. Exact Prisma versions, compatibility, artifact clearance, and actual integration remain pending.

| Option / review version | Strengths for this project | Costs and limitations |
| --- | --- | --- |
| [Drizzle ORM `0.45.4`](https://github.com/drizzle-team/drizzle-orm/releases/tag/0.45.4) | TypeScript table definitions and explicit SQL-like queries make data access easy to trace. Core queries do not require a generated client. | Requires SQL knowledge and deliberate schema/migration management. Database driver and any Drizzle Kit use require separate version review. APIs in unversioned docs may describe 1.x rather than this 0.x target. |
| [Prisma `7.10.1`](https://github.com/prisma/orm/releases/tag/7.10.1) | Concise model-oriented queries, generated types, and schema/migration tooling can speed routine application work. | Generation and schema tooling add a build/setup step. Review CLI/install hooks and driver/adapter packages. Major-version APIs and raw SQL escape hatches need care. |
| [Kysely `0.29.7`](https://github.com/kysely-org/kysely/releases/tag/v0.29.7) | Typed SQL query builder with explicit joins/selects; fits a thin persistence adapter. | It is not an ORM with automatic entity relationships/tracking. Runtime schema/migration alignment and database drivers remain your responsibility; optional type generation adds another tool to review. |

These are design trade-offs for a small team, not measured performance rankings.

### Drizzle

```ts
import { eq } from 'drizzle-orm';

const [row] = await db
  .select({ id: users.id, name: users.name })
  .from(users)
  .where(eq(users.id, userId))
  .limit(1);
```

The client and table definitions are assumed. Values passed through the documented operators are parameterized; avoid building SQL by string concatenation. [Drizzle select documentation](https://orm.drizzle.team/docs/select).

Drizzle is not the selected ORM; its earlier review remains historical. Known advisory ranges, Node 26 limitations, and incomplete artifact evidence are recorded in [DOC-019 — Drizzle Security and Compatibility Review](DOC-019-drizzle-review.md).

### Prisma 7

Prisma is the selected future ORM. This earlier version-specific example does not select Prisma 7 or approve `7.10.1`; recheck the actual major/version and its API before integration.

```ts
const row = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, name: true },
});
```

This assumes a generated Prisma 7 client. Use [versioned Prisma 7 CRUD documentation](https://www.prisma.io/docs/orm/v7/prisma-client/queries/crud) and [client reference](https://www.prisma.io/docs/orm/v7/reference/prisma-client-reference#findunique); the unversioned documentation currently describes a different query API.

Prisma's v7 requirements table lists Node `^20.19.0`, `^22.12.0`, or `^24.0.0`, while the same page states support for all Active/Maintenance LTS releases and its tagged CLI/client manifests allow `>=24.0`. Node 24 meets both ranges; the Node 26 table discrepancy needs reconciliation, not an assumption of failure. See [DOC-017 — Tooling Preflight: Node LTS comparison](DOC-017-tooling-preflight.md#node-lts-comparison).

### Kysely

```ts
const row = await db
  .selectFrom('users')
  .select(['id', 'name'])
  .where('id', '=', userId)
  .executeTakeFirst();
```

This assumes declared database types and a configured dialect/driver. `executeTakeFirst` returns `undefined` when no row matches. [Kysely query API](https://kysely-org.github.io/kysely-apidoc/interfaces/SelectQueryBuilder.html#executeTakeFirst).

For future adapters, normalize provider results and failures to application-owned contracts. For example, Prisma's missing-row `null` and query-builder `undefined` should not force different service behavior. Do not expose ORM entities, transaction clients, or generated types through service contracts. Contracts localize changes; migrations, transactions, query semantics, and data conversion still make replacements real work.

## 3. Calendar scheduling alternatives

**Current preference:** The maintainer declined the node-cron/Croner examples because cron expressions are difficult to read. These remain comparison history; use [6. Readable scheduling options](#6-readable-scheduling-options) for the current discussion.

The native cleanup timer is already accepted for periodic in-memory expiry. Calendar scheduling such as “02:00 UTC every day” is a different requirement; no such new job is added here.

| Option / review version | Strengths | Costs and limitations |
| --- | --- | --- |
| Existing native timer | No extra package; easy lifecycle and interval behavior for current cleanup. | Calendar rules, timezones, and missed-run policy need explicit implementation if later required. It runs in its owning process. |
| [node-cron `4.6.0`](https://github.com/node-cron/node-cron/releases/tag/v4.6.0) | Plain functions, cron syntax, timezone control, overlap protection, and lifecycle API. No Nest decorators required. | The basic inline example shares the owning process's lifecycle. Local overlap protection alone does not prevent duplicate execution across replicas. Newer distributed/background features require separate design and configuration. |
| [Croner `11.0.0`](https://github.com/Hexagon/croner/releases/tag/11.0.0) | Small direct API with timezone, next-run inspection, and overrun protection. No Nest decorators required. | Need explicit startup/shutdown/error handling. Local protection is not durable delivery or a distributed lock; cron field/day semantics need review when migrating. |

The callbacks below stand for a separately defined job operation. Neither snippet is production startup code or an approved new job.

### node-cron

```ts
import cron from 'node-cron';

const task = cron.schedule('0 2 * * *', async () => {
  await scheduledOperation();
}, { timezone: 'UTC', noOverlap: true });

// In a separate shutdown hook: task.destroy();
```

The pattern means daily at 02:00 UTC. `noOverlap` skips a trigger while the previous run is still active. Node-cron 4.6 also has coordinator-based distributed options; the basic example does not configure them. [node-cron scheduling options](https://www.nodecron.com/scheduling-options.html), [API/lifecycle](https://www.nodecron.com/api-reference.html).

### Croner

```ts
import { Cron } from 'croner';

const task = new Cron('0 2 * * *', {
  timezone: 'UTC',
  protect: true,
}, async () => {
  await scheduledOperation();
});

// In a separate shutdown hook: task.stop();
```

`protect` prevents overlapping triggers in the scheduler instance. Croner also exposes a `catch` option: do not use silent error suppression as a reliability strategy. [Croner configuration](https://croner.56k.guru/usage/configuration/).

For either choice, define error reporting, shutdown/drain, timezone/DST, ownership across replicas, idempotency, and missed-run policy when a real job exists. Stopping a schedule does not cancel or roll back work already running. An inline callback is not CPU isolation; expensive synchronous computation still needs an appropriate separate execution boundary. Neither basic example promises execution during an owning-process outage or automatic replay after restart.

## 4. Validator alternatives

**Current decision:** Zod is accepted for readability. Exact artifact approval and Nest/Swagger wiring remain pending; Valibot and Ajv remain comparison alternatives.

All examples validate the same hypothetical `{ title: string }` input and reject extra fields. They illustrate syntax, not a new endpoint or a complete login schema. None changes the accepted HTTP envelope, field-specific normalization, or password-byte rules.

| Option / review version | Strengths | Costs and limitations |
| --- | --- | --- |
| [Zod `4.6.7`](https://github.com/colinhacks/zod/releases/tag/v4.6.7) | Accepted validation direction: readable chained schemas, inferred TypeScript types, refinements, and structured issues. | Exact artifact approval, a Nest boundary adapter, and Swagger mapping are still needed. Ordinary `object` strips extra fields; use an explicit strict schema for this project's rejection policy. Avoid accidental coercion. |
| [Valibot `1.5.0`](https://github.com/open-circle/valibot/releases/tag/v1.5.0) | Modular functional schemas, inferred types, and explicit validation pipelines. Tree-shaking can matter when sharing schemas with a frontend. | More imports/composition can be less concise. A smaller browser bundle is not proof of faster backend validation. Nest/Swagger mapping and strict-object handling still need integration work. |
| [Ajv `8.20.0`](https://github.com/ajv-validator/ajv/releases/tag/v8.20.0) | JSON Schema is portable and useful when an external schema is the source of truth. Compiles schemas to reusable validator functions. | Schemas are more verbose; TypeScript alignment and OpenAPI dialect compatibility need care. Compile trusted schemas once, not on every request or from arbitrary client-provided schemas. Additional formats may need another reviewed package. |

### Zod

```ts
import * as z from 'zod';

const InputSchema = z.strictObject({
  title: z.string().min(1),
});
type Input = z.infer<typeof InputSchema>;
const result = InputSchema.safeParse(payload);
```

Use `result.data` after success; translate safe field issues after failure. Unknown-key rejection is deliberate. [Zod API](https://zod.dev/api#zstrictobject).

### Valibot

```ts
import * as v from 'valibot';

const InputSchema = v.strictObject({
  title: v.pipe(v.string(), v.minLength(1)),
});
type Input = v.InferOutput<typeof InputSchema>;
const result = v.safeParse(InputSchema, payload);
```

Use `result.output` after success. Valibot distinguishes ordinary, loose, and strict object schemas. [Valibot objects](https://valibot.dev/guides/objects/), [safeParse](https://valibot.dev/api/safeParse/).

### Ajv

```ts
import Ajv from 'ajv';

const ajv = new Ajv({
  coerceTypes: false,
  removeAdditional: false,
  useDefaults: false,
});
const validate = ajv.compile({
  type: 'object',
  properties: { title: { type: 'string', minLength: 1 } },
  required: ['title'],
  additionalProperties: false,
});
const valid = validate(payload);
```

Create/reuse the compiled validator during setup. Capture safe error information when validation fails; do not return raw rejected data. [Ajv getting started](https://ajv.js.org/guide/getting-started.html).

A reusable Nest pipe should receive `unknown`, validate body/query/path inputs, and map failures to the accepted `400`/`VALIDATION_ERROR` envelope. Swagger mapping is a separate integration task; a TypeScript type alone does not validate runtime input. Keep implicit conversion, trimming, defaults, and unknown-field removal disabled unless explicitly required. String length checks do not replace the accepted UTF-8 byte limits for passwords. Validation does not automatically provide XSS protection or authorize HTML stripping.

## 5. Evidence and decision boundary

**Confidence:** High for specifically cited release versions, APIs, and manifest declarations; design trade-offs are judgments for this template. **Installation/execution decision:** UNKNOWN for every comparison candidate.

- Upstream release pages and tagged manifests were inspected for Drizzle, Prisma, Kysely, node-cron, Croner, Zod, Valibot, and Ajv. This confirms review targets and some compatibility/scripts, not a full artifact/dependency audit or formal support lifetime.
- Reviewed manifests include Node `>=22` for Kysely, `>=20` for node-cron, and `>=18` for Croner. Zod/Valibot did not declare runtime dependencies in the reviewed package manifests; this does not establish their published artifacts or package-wide safety. Ajv declares dependency ranges, so its full graph remains unresolved.
- Prisma's tagged CLI declares a `preinstall` script and workspace dependencies; client/CLI source versions use publishing placeholders. No script or generator was run. Review the actual published package, driver/adapter, and generator before future adoption.
- OSV name searches for Zod, Valibot, and node-cron were accessible but cached/non-exhaustive; Ajv/Croner queries were inaccessible. Valibot search results included malicious similarly named adapters, which are distinct packages. [Zod OSV search](https://osv.dev/list?ecosystem=npm&q=zod), [Valibot OSV search](https://osv.dev/list?ecosystem=npm&q=valibot), [node-cron OSV search](https://osv.dev/list?ecosystem=npm&q=node-cron).
- Maintainer advisory pages for Zod/Ajv and Prisma were inspected. An empty maintainer page does not clear GitHub Advisory Database, OSV, transitives, or malware risk. A full exact-version advisory/provider/KEV check has not been completed for these new candidates.
- OpenSSF/Socket/deps.dev coverage, complete published/optional dependency graphs, signatures/checksums/provenance, database drivers, and integration compatibility remain incomplete. Follow [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md) before selection/install/execution; [DOC-017 — Tooling Preflight](DOC-017-tooling-preflight.md) retains the existing evidence gaps.
- No snippets were executed or compiled. No package, database, ORM, scheduler, validator, driver, schema, migration, or application source was installed or added. Node 26, Zod, Node Schedule, and Prisma are accepted design choices; artifact clearance and future integrations remain separate.

## 6. Readable scheduling options

**Status:** Node Schedule direction accepted; exact artifacts/jobs pending · **Retrieved:** 2026-10-30.

**Decision:** Use Node Schedule for calendar scheduling with explicit recurrence fields. Retain other syntax examples as comparison history and preserve the accepted native cleanup timer.

**Reason:** The maintainer selected Node Schedule after requesting readable alternatives to cron expressions.

An interval of one hour is elapsed time relative to scheduling; it does not inherently mean the start of each clock hour. Similarly, 24 hours is not a daily 14:00 schedule. A calendar time needs a timezone and explicit recurrence; no new timezone default is adopted here.

### Native calculated interval

```ts
const everyDaySeconds = 60 * 60 * 24;
const everyDayMs = everyDaySeconds * 1_000;
const timer = setInterval(runJob, everyDayMs);
// In a separate shutdown hook: clearInterval(timer);
```

Node timers use milliseconds. This is a syntax illustration with an assumed callback, not the approved cleanup implementation: plain `setInterval` does not await async work or prevent overlap. Handle errors, stop/drain, and overlap in the owning adapter. Timers are not exact clocks and reset with their process. [Node timers](https://nodejs.org/api/timers.html).

### Bree: readable durations and daily time

Review target: [`bree@9.2.9`](https://github.com/breejs/bree/releases/tag/v9.2.9). Configuration illustration; job files are assumed and were not created:

```ts
import Bree from 'bree';

const scheduler = new Bree({
  timeout: false,
  timezone: 'Asia/Jakarta',
  jobs: [
    { name: 'hourly-example', interval: '1h' },
    { name: 'daily-example', interval: 'at 2:00 pm' },
  ],
});
// Start in the lifecycle hook after job files/configuration exist.
```

`timeout: false` disables the default immediate timeout. Bree accepts duration strings, natural-language times, and numeric milliseconds. Its readable configuration fits the requested syntax, but jobs use worker threads and separate job files/functions. Threads share their process's lifetime; this does not replace the independent logging process. TypeScript/compiled-job paths and application DI need explicit integration. [Bree API](https://github.com/breejs/bree#job-interval-and-timeout-values), [tagged implementation](https://raw.githubusercontent.com/breejs/bree/v9.2.9/src/index.js).

The [tagged manifest](https://raw.githubusercontent.com/breejs/bree/v9.2.9/package.json) admits Node 26 by its engine range, declares runtime dependency ranges, and includes a `prepare` hook. Formal Node 26 testing/support and published script behavior remain unverified. **Installation decision: UNKNOWN.**

### Node Schedule: explicit calendar fields

Review target: [`node-schedule@2.1.0`](https://github.com/node-schedule/node-schedule/releases/tag/2.1.0), the release/tag inspected; the latest published npm version was not established.

**Selected direction, version unresolved:** The current [moving-source manifest](https://raw.githubusercontent.com/node-schedule/node-schedule/master/package.json) declares `2.1.2`, Node `>=6`, and runtime dependencies `cron-parser`, `long-timeout`, and `sorted-array-functions`. This differs from the earlier release/tag. [Registry metadata](https://registry.npmjs.org/node-schedule/latest) and the requested `2.1.2` tag were inaccessible, so do not pin an artifact from the branch observation.

```ts
import schedule from 'node-schedule';

const rule = new schedule.RecurrenceRule();
rule.hour = 14;
rule.minute = 0;
rule.second = 0;
rule.tz = 'Asia/Jakarta';
const job = schedule.scheduleJob(rule, runJob);
// Handle job errors and shutdown in the owning lifecycle hooks.
```

This runs daily at 14:00 Jakarta time without a cron string. Explicit minute/second fields avoid broader unintended recurrence. It supports direct callbacks, but is process-local and adds transitive packages. Maintenance status, current published version, and Node 26 tests need review; the manifest's broad Node range is insufficient proof. [Recurrence API](https://github.com/node-schedule/node-schedule#recurrence-rule-scheduling), [tagged manifest](https://raw.githubusercontent.com/node-schedule/node-schedule/2.1.0/package.json). **Installation decision: UNKNOWN.**

Node Schedule's [maintainer advisory page](https://github.com/node-schedule/node-schedule/security/advisories) displays no published advisories; that does not clear GitHub Advisory Database or its dependencies. The exact-package GitHub query, OSV search, [OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/node-schedule/node-schedule), [Socket](https://socket.dev/npm/package/node-schedule/overview/2.1.2), and [deps.dev](https://api.deps.dev/v3/systems/npm/packages/node-schedule/versions/2.1.2) were inaccessible on retrieval. Full graph, KEV, provenance, support, and Node 26 tests remain incomplete. No clean security or compatibility result is claimed.

The package direction is accepted; no wrapper API, parser, real job, timezone default, installation, or execution is approved. Calendar-job error, overlap, timezone, shutdown, and missed-run policies need agreement when a job exists. The existing 60-second cleanup remains native, and the independent logging process retains its boundary. **Installation/execution decision: UNKNOWN.**
