# DOC-003 — Decision Records

**Status:** Current register · **Updated:** 2026-10-28.
**Format record:** [D-019 — Lightweight decision documentation](DOC-003-decisions.md#d-019--lightweight-decision-documentation).

**Decision:** Keep stable decision IDs and explicit status. Every decision document states the decision and its reason; other sections are optional.

**Reason:** Make current agreements and their rationale easy to scan without boilerplate.

## Reading and writing records

- Read only records linked by the current task or needed to resolve a conflict.
- Use a short header with ID/title and status: Accepted, Proposed, or Superseded. Add dates, scope, and replacement links when useful.
- Require **Decision** and **Reason** in decision documents. Context, consequences, alternatives, pros/cons, and review triggers are optional; omit empty or unnecessary sections.
- A maintainer-confirmed change can replace an earlier rule. Mark the affected scope and link the replacement; preserve history and stable IDs.
- [D-001–D-003 — Original project decisions](DOC-003-decisions.md#d-001--nodejs-and-nestjs) retain their original 2026-10-27 dates. Historical extra sections remain for their useful context.

Active rules: [DOC-004 — Conventions](DOC-004-conventions.md). Progress: relevant [DOC-002 — Project Task List](../task-list.md).

## D-001 — Node.js and NestJS

**Status:** Accepted · **Date:** 2026-10-27.

- Reason: the maintainer requested a Node.js and NestJS backend template.
- Decision: use these as the technology direction.
- Consequences: exact runtime, package manager, framework, and dependency versions still require preflight and explicit approval.
- Review when: application needs, support status, or component security findings change.

## D-002 — Software supply chain policy

**Status:** Accepted · **Date:** 2026-10-27.

- Reason: the maintainer supplied a mandatory software supply chain policy.
- Decision: apply the [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md) to external software, including transitive dependencies, tools, AI skills, MCP servers, containers, and CI actions.
- Consequences: record evidence, findings, uncertainty, and a decision; obtain explicit approval before proceeding. UNKNOWN never means safe.
- Review when: the maintainer changes the policy.

## D-003 — Root task list

**Status:** Accepted · **Date:** 2026-10-27.

- Reason: discussions and work need a living repository checklist.
- Decision: keep `task-list.md` at the project root.
- Consequences: update progress and link decisions or results when discussions or tasks finish.
- Review when: the agreed workflow changes.

## D-004 — Decision records and conventions

**Status:** Accepted; record format updated by [D-019 — Lightweight decision documentation](DOC-003-decisions.md#d-019--lightweight-decision-documentation) · **Date:** 2026-10-28.

- Reason: tasks alone do not explain conventions or their rationale.
- Decision: document every agreed decision and reflect active rules in `docs/DOC-004-conventions.md`.
- Consequences: synchronize decisions, conventions, and affected tasks. Proposals remain explicitly provisional.
- Review when: more decisions or convention areas require splitting documents.

## D-005 — Scope and priorities

**Status:** Accepted · **Date:** 2026-10-28.

- Reason: a solo developer or team of 2–3 needs a CRUD backend with access control.
- Decision: cover authentication, flexible authorization, and 2–3 CRUD examples. Prioritize comprehension, delivery, code evolution, cleanliness, debugging, review, and coding speed.
- Consequences: assess abstraction costs against a small team's needs. Example domains, measurable success criteria, traffic, and first-release boundaries remain open.
- Review when: team size, domains, priorities, or operational load change.

## D-006 — N-layered architecture, DI, and contracts

**Status:** Accepted · **Date:** 2026-10-28. Initially proposed, then confirmed by the maintainer on the same date.

- Reason: fast initial delivery must leave understandable boundaries for future domain, ORM, and architecture changes.
- Decision: use N-layered architecture, DI, and contracts between layers. Deployment follows each project's needs and resources.
- Consequences: specify contract behavior and wiring. Contracts contain migration impact, without guaranteeing a one-class replacement. [D-009 — One modular application with layers per feature](DOC-003-decisions.md#d-009--one-modular-application-with-layers-per-feature) defines module organization; [D-010 — Behavioral contracts and integration boundaries](DOC-003-decisions.md#d-010--behavioral-contracts-and-integration-boundaries) clarifies external implementation boundaries.
- Review when: contracts obstruct real needs, dependencies cross agreed boundaries, or dependency direction needs to change.
- Details: [DOC-004 — Conventions: 3. Architecture](DOC-004-conventions.md#3-architecture).

## D-007 — Configurable authorization

**Status:** Accepted requirements · **Date:** 2026-10-28. Permission and delegation models remain open.

- Reason: superadmin must control admin/user access; CRUD examples need restrictions.
- Decision: make configurable authorization part of the template's foundation.
- Consequences: define permission managers, actions, resources, data scopes, and revocation behavior. Access levels do not imply automatic inheritance.
- Review when: user structure, delegation, scopes, or tenant isolation needs change.
- Open questions: [DOC-004 — Conventions: 4. Authorization](DOC-004-conventions.md#4-authorization).

## D-008 — Upload and payment isolation

**Status:** Superseded by [D-011 — External interaction examples](DOC-003-decisions.md#d-011--external-interaction-examples) · **Date:** 2026-10-28.

- Reason: upload and payment logic should be separate from business modules.
- Original decision: isolate these integrations behind provider-independent contracts.
- Consequences: specify behavior, required capabilities, business consistency, and migration impact; separate code does not require separate deployments.
- Clarification: the maintainer later confirmed upload and payment are examples, not mandatory first-release features.
- Review when: provider capabilities or operational needs change; current scope follows [D-011 — External interaction examples](DOC-003-decisions.md#d-011--external-interaction-examples).

## D-009 — One modular application with layers per feature

**Status:** Accepted · **Date:** 2026-10-28.

- Reason: the maintainer approved one application, organized by feature, with layers inside each module.
- Decision: use this modular organization as the foundation.
- Consequences: keep feature flows together for tracing and localized changes. Exact modules, folders, and intermodule communication remain open.
- Review when: feature boundaries no longer fit the domain, cross-dependencies obstruct change, or deployment needs evolve.

## D-010 — Behavioral contracts and integration boundaries

**Status:** Accepted principles · **Date:** 2026-10-28. Contract specifications remain open.

- Reason: contracts must cover behavior and boundaries; services should not contain ORM, gateway, or external I/O implementations.
- Decision: define operations, behavior, and responsibilities through contracts; keep external implementations outside the service layer.
- Consequences: services coordinate application logic through contracts. Assess abstractions by traceability and controlled change cost. Inputs, outputs, errors, and transaction details remain open.
- Review when: contracts expose provider details, technology changes spread into services, or abstraction costs outweigh benefits.

## D-011 — External interaction examples

**Status:** Accepted · **Date:** 2026-10-28. Replaces the scope in [D-008 — Upload and payment isolation](DOC-003-decisions.md#d-008--upload-and-payment-isolation).

- Reason: database access, upload, and payment illustrate external interactions.
- Decision: demonstrate this pattern through contracts and separate implementations; choose concrete examples according to release scope.
- Consequences: upload and payment are optional first-release examples. Selected examples still need transaction and cross-operation consistency design.
- Review when: representative examples or release scope change.
- Details: [DOC-004 — Conventions: 5. External interaction examples](DOC-004-conventions.md#5-external-interaction-examples).

## D-012 — Resource identity and access policies

**Status:** Accepted direction · **Date:** 2026-10-28. Schema, public-access granularity, and policy evaluation remain open.

- Reason: uniquely named resource types live in a database; superadmin manages access, admin delegation is adaptable, and some access is public.
- Decision: register resource identities in the database, support configurable admin delegation, and accommodate unauthenticated access. `@Public()` remains a candidate.
- Consequences: names identify resources but do not define actions, scopes, delegation, or authentication/authorization interaction. Schema and authorization technology remain unselected.
- Review when: resource domains, access policies, or organizational models change.
- Open questions: [DOC-004 — Conventions: 4. Authorization](DOC-004-conventions.md#4-authorization).

## D-013 — Public GitHub repository

**Status:** Accepted publication intent · **Date:** 2026-10-28.

- Reason: the maintainer plans a public GitHub repository with a distinctive, memorable English name.
- Decision: prepare documentation for public use; [D-014 — Descriptive project name](DOC-003-decisions.md#d-014--descriptive-project-name) selects the name. The license was initially open and is now selected in [D-021 — MIT license and downstream scope](DOC-003-decisions.md#d-021--mit-license-and-downstream-scope).
- Consequences: the maintainer controls repository publication, commits, and pushes.
- History: English naming was confirmed before the final name was selected.
- Review when: naming or publication plans change.

## D-014 — Descriptive project name

**Status:** Accepted · **Date:** 2026-10-28.

- Reason: the maintainer prefers descriptive, memorable wording over branding.
- Decision: use `nest-layered-template` and the description: “A modular NestJS backend starter with clear boundaries, explicit contracts, and flexible authorization.”
- Consequences: apply the identity consistently. The maintainer added a remote and will commit and push after reviewing the prepared changes.
- Review when: project scope makes the name misleading or the maintainer requests a rename.

## D-015 — Concise English documentation

**Status:** Accepted · **Date:** 2026-10-28.

- Reason: repository documentation should be quick for developers to scan.
- Decision: write all documentation and agent instructions in concise, clear English.
- Consequences: retain technical meaning, context, statuses, history, and open questions. Keep the full supply chain policy in one canonical document.
- Review when: content becomes ambiguous, loses context, or repeats unnecessarily.

## D-016 — AI collaboration and attribution

**Status:** Accepted attribution requirement · **Date:** 2026-10-28.

- Reason: the maintainer requested visible AI collaboration, an agent guide, and the Codex model used.
- Decision: add `AGENTS.md` and credit OpenAI Codex in the README. Record GPT-6 as the model family identified in this session; the exact variant was unavailable.
- Consequences: the maintainer and AI assistant collaborate on design and documentation. Future attribution must reflect available session evidence, not an inferred product default.
- Review when: another assistant/model contributes or verified model metadata becomes available.

## D-017 — Versioned AI agreements and context recovery

**Status:** Accepted versioning; blanket context loading superseded by [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading) · **Date:** 2026-10-28.

- Reason: AI assistants must recover earlier agreements after context compaction and track changes without relying on memory.
- Decision: version AGENTS.md independently of application releases and retain a dated changelog linked to decision IDs. The original recovery rule required rereading all referenced documents; [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading) replaces that scope with task-based reading.
- Consequences: the first version is 1.0.0; the earlier guide is recorded as an unversioned baseline. Approved rule changes update the version, baseline, history, decisions, and affected documentation together. Unfinished work requires a concise task-list handoff covering scope, progress, next steps, questions, and approvals.
- Review when: version history or handoffs fail to reconstruct an agreement or current work accurately.

## D-018 — No improvisation and required clarification

**Status:** Accepted · **Date:** 2026-10-28.

- Reason: the maintainer requires explicit clarification to prevent invented requirements, assumed agreements, and unsupported LLM claims.
- Decision: AI assistants must not improvise. Ask the maintainer whenever a relevant point is unclear or a deviation is proposed, and obtain an answer or explicit approval before affected work.
- Consequences: distinguish facts, proposals, and unknowns; pause dependent work while continuing only clearly independent, authorized work. Silence is not approval. Record confirmed changes before relying on them.
- Review when: ambiguity remains unreported, assumptions appear as facts, or implementation exceeds approved scope.

## D-019 — Lightweight decision documentation

**Status:** Accepted · **Date:** 2026-10-28.

- Decision: use compact ADR-style headers to show status and related records. Decision documents require only the decision and its reason; context, consequences, alternatives, pros/cons, and review triggers are optional.
- Reason: make relevance and rationale visible while keeping documentation concise and useful.
- Replaces: the earlier mandatory context/consequences/review-trigger format associated with [D-004 — Decision records and conventions](DOC-003-decisions.md#d-004--decision-records-and-conventions). Its requirement to document agreed decisions remains active.

## D-020 — Task-based context loading

**Status:** Accepted · **Date:** 2026-10-28.

- Decision: keep AGENTS.md as a compact router. Load relevant documentation only when a task requires it, including the full supply chain policy before external software steps and Git conventions before Git writes. Retain version/history recovery and mandatory maintainer clarification.
- Reason: reduce unnecessary context loading while preserving approval gates and preventing unapproved improvisation.
- Replaces: [D-017 — Versioned AI agreements and context recovery](DOC-003-decisions.md#d-017--versioned-ai-agreements-and-context-recovery)'s blanket read-all recovery rule. Guide version 2.0.0 records this behavior change; earlier history remains in [DOC-006 — AI Working Agreements: Version history](DOC-006-agent-agreements.md#version-history).

## D-021 — MIT license and downstream scope

**Status:** Accepted · **Date:** 2026-10-28.

- Decision: adopt the unchanged MIT License, copyright 2026 salmanthoriq95. Permit commercial and closed-source forks, retain required notices, and explain upstream support/endorsement boundaries separately.
- Reason: the maintainer selected permissive reuse without license fees or warranty promises, and does not want independent forks or deployments treated as upstream responsibilities.
- Confirmation: MIT and GitHub-username attribution were explicitly selected. The username was read from the origin remote owner.
- Limits: MIT's disclaimers remain subject to applicable law and do not guarantee immunity from every claim. Third-party components keep their licenses.
- Details: [DOC-008 — Licensing and Community Scope](DOC-008-licensing.md).

## D-022 — Community conduct and reporting

**Status:** Reporting accepted; conduct wording proposed · **Date:** 2026-10-28.

- Decision: prepare an original, concise Code of Conduct draft for upstream spaces. Use GitHub reporting without publishing a project email, as selected by the maintainer.
- Reason: establish constructive participation standards and a usable reporting route without assuming control over independent communities or changing MIT permissions.
- Review needed: the maintainer must review the proposed behavior and moderation wording before adoption. GitHub Support reports are not automatically sent to the repository maintainer; admin reporting depends on availability.
- Draft: [DOC-009 — Code of Conduct](../CODE_OF_CONDUCT.md).

## D-023 — Document identifiers and descriptive references

**Status:** Accepted · **Date:** 2026-10-28.

- Decision: assign stable, ordered DOC-XXX identifiers to documentation filenames and titles. Keep existing D-XXX decision IDs and show the title beside each reference. Preserve standard root filenames and the unchanged MIT license text.
- Reason: make document order, purpose, and referenced decisions recognizable at a glance without opening each link.
- Scope: document IDs identify files; decision IDs identify agreements within them. Numeric order supports navigation, not mandatory sequential reading.
