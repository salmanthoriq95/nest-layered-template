# DOC-004 — Conventions

**Status:** Accepted rules; proposals labeled · **Updated:** 2026-10-29.
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
- [D-005 — Scope and priorities](DOC-003-decisions.md#d-005--scope-and-priorities)
- [D-025 — Minimum monitoring, backup, and disaster recovery](DOC-003-decisions.md#d-025--minimum-monitoring-backup-and-disaster-recovery)

**Decision:** Build an access-demonstration template for solo developers or teams of 2–3. Return allow/deny messages for public, admin, and superadmin examples.

**Reason:** Demonstrate structure, DI, and access boundaries without implementing a real application.

- Use Node.js and NestJS; exact versions and supporting tools still require preflight and explicit approval.
- Real articles, categories, comments, relationships, lifecycle, and CRUD are outside the initial scope. Their earlier selection is historical.
- Keep persistence and third-party integration extension points as placeholders. Do not select an ORM/database/SDK or perform real external I/O for these examples.
- Add provider-specific contracts, libraries, mappings, and implementations later when requested; do not design speculative provider APIs now.
- Preserve simple flows, readable code, fast debugging/review, and controlled changes.
- Minimum reliability guidance remains documented in [DOC-010 — Reliability Strategy](DOC-010-reliability.md). Real data backup and recovery work is deferred until relevant data and deployment exist.

## 3. Architecture

**Status:** Accepted principles; implementation details open

**Records:**

- [D-006 — N-layered architecture, DI, and contracts](DOC-003-decisions.md#d-006--n-layered-architecture-di-and-contracts)
- [D-009 — One modular application with layers per feature](DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature)
- [D-010 — Behavioral contracts and integration boundaries](DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries)

**Decision:** Use N-layered architecture in one application organized by feature, with DI and behavioral contracts; keep external implementations outside services.

**Reason:** Localize changes and make feature flows easy to trace.

- Contracts define available operations, behavior, and responsibility boundaries.
- Design boundaries to contain the impact of domain, ORM, and provider changes.
- Layer names, folders, contract forms, DI wiring, and import rules remain open.
- Deployment follows each project's needs and resources; logical layers do not prescribe physical tiers. Reference: [Microsoft N-tier guide](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/n-tier), retrieved 2026-10-28.
- Exported Nest providers form a module's public API. Reference: [NestJS modules](https://docs.nestjs.com/modules), retrieved 2026-10-28.

### Proposed implementation

**Status:** Proposed; exact code conventions remain open.

- Use a small example module whose handlers return access-result messages.
- Demonstrate controller/service separation and DI without routing responses through unused persistence code.
- Define only contracts needed by the demo's layer boundaries. Leave future persistence/provider contracts to their actual integration work.
- Reserve documented persistence/integration extension locations without real clients, queries, transactions, uploads, payments, or simulated claims of external success.
- Choose contract forms, runtime DI tokens, and minimum folder/naming rules before coding.
- Agree how demo identities are supplied. Do not infer real authentication or trust a caller-provided role as verified identity.

### Change limits

Placeholders show where future dependencies connect. Adding a real provider still requires its contract, library, wiring, and implementation; no effortless migration or production authentication guarantee is implied.

## 4. Authorization

**Status:** Demo access accepted; identity mechanism and route details open

**Records:**

- [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [D-029 — Public, admin, and superadmin demo access](DOC-003-decisions.md#d-029--public-admin-and-superadmin-demo-access)
- [D-007 — Configurable authorization](DOC-003-decisions.md#d-007--configurable-authorization)
- [D-012 — Resource identity and access policies](DOC-003-decisions.md#d-012--resource-identity-and-access-policies)

**Decision:** Demonstrate public, admin, and superadmin access. Superadmin may access the admin example; the superadmin example remains exclusive to superadmin.

**Reason:** Show allowed and denied access without real entities or a permissions-management application.

| Caller | Public example | Admin example | Superadmin example |
| --- | --- | --- | --- |
| Guest | Allow | Deny | Deny |
| Admin | Allow | Allow | Deny |
| Superadmin | Allow | Allow | Allow |

Other identities gain no privileged access by default. These are demo access rules, not a selected authentication implementation.

### Open for the demo

- Exact endpoint paths, methods, response bodies, and HTTP success/denial behavior.
- How identities are supplied and verified for demonstration/testing.
- Minimal policy/DI boundaries and whether public metadata such as `@Public()` is used.

### Deferred extension

Persistent resource catalogs, dynamic roles/permissions, delegation management, account CRUD, data ownership, and login/token/session workflows are not prerequisites for this initial demo. Revisit them only under a later agreed scope.

## 5. External interaction examples

**Status:** Placeholder-only initial scope; real implementations deferred

**Records:**

- [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template)
- [D-010 — Behavioral contracts and integration boundaries](DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries)
- [D-011 — External interaction examples](DOC-003-decisions.md#d-011--external-interaction-examples)

**Decision:** Prepare extension placeholders for persistence and external integrations, without implementing or selecting their technologies.

**Reason:** Let a consuming project add the required contract, library, and adapter later while keeping external details outside service logic.

- Document where contracts and implementations would be added and how DI would connect them.
- Keep the access demo independent of persistence and external services.
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
