# DOC-006 — AI Working Agreements

**Status:** Accepted · **Guide version:** 3.2.0 · **Updated:** 2026-10-29.
**Records:**

- [D-019 — Lightweight decision documentation](DOC-003-decisions.md#d-019--lightweight-decision-documentation)
- [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading)
- [D-017 — Versioned AI agreements and context recovery](DOC-003-decisions.md#d-017--versioned-ai-agreements-and-context-recovery)
- [D-018 — No improvisation and required clarification](DOC-003-decisions.md#d-018--no-improvisation-and-required-clarification)

**Decision:** Keep AGENTS.md as a compact task router; load detailed agreements only when relevant. Retain version history and explicit clarification gates.

**Reason:** Preserve agreements across context loss while avoiding unnecessary context loading. This replaces the earlier requirement to reread every project document.

## Version history

Versions track AI working agreements, independently of application releases.

- MAJOR: change or replace an accepted rule.
- MINOR: add an approved rule without replacing existing rules.
- PATCH: edit wording or links without changing behavior.
- For an approved guide change, update its version/date, this history, decision records, and affected documentation/tasks together.
- Never reuse a version or erase agreement history; link superseding records.

| Version | Date | Changes | Records |
| --- | --- | --- | --- |
| 3.2.0 | 2026-10-29 | Accept field-specific input policy, expanded JSON envelopes, shared HTTP wiring, and status mappings after explicit maintainer approval. Identity, endpoint schemas, and tooling remain open; software approval gates are unchanged. | [D-032–D-034 — HTTP validation, envelopes, and status conventions](DOC-003-decisions.md#d-032--http-input-validation-and-xss-boundaries) |
| 3.1.0 | 2026-10-29 | Record accepted code/test conventions and add task-based HTTP validation, envelope, and status-reference routes. Detailed HTTP policies and expanded envelope remain proposed. | [D-030–D-034 — Code, testing, and HTTP boundary agreements](DOC-003-decisions.md#d-030--minimal-code-layout-and-conventions) |
| 3.0.0 | 2026-10-29 | Replace real CRUD and initial data-backed integration scope with allow/deny access demos and extension placeholders. Preserve architecture and approval gates. | [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template), [D-029 — Public, admin, and superadmin demo access](DOC-003-decisions.md#d-029--public-admin-and-superadmin-demo-access) |
| 2.4.0 | 2026-10-29 | Record direct master workflow and Conventional Commits; broader branching strategy stays in a separate handbook. Commit/push authority is unchanged. | [D-026 — Direct master workflow for this repository](DOC-003-decisions.md#d-026--direct-master-workflow-for-this-repository), [D-027 — Conventional Commits message format](DOC-003-decisions.md#d-027--conventional-commits-message-format) |
| 2.3.0 | 2026-10-29 | Add task-based reliability routing; strategy scope is approved, while detailed baseline and operational settings remain proposed. | [D-025 — Minimum monitoring, backup, and disaster recovery](DOC-003-decisions.md#d-025--minimum-monitoring-backup-and-disaster-recovery) |
| 2.2.0 | 2026-10-28 | Add stable document IDs, ordered filenames, and titled references; update routes while preserving approval gates. | [D-023 — Document identifiers and descriptive references](DOC-003-decisions.md#d-023--document-identifiers-and-descriptive-references) |
| 2.1.0 | 2026-10-28 | Add task-based licensing/conduct routing. MIT and GitHub reporting are approved; conduct wording remains proposed. | [D-021 — MIT license and downstream scope](DOC-003-decisions.md#d-021--mit-license-and-downstream-scope), [D-022 — Community conduct and reporting](DOC-003-decisions.md#d-022--community-conduct-and-reporting) |
| 2.0.0 | 2026-10-28 | Replace blanket reading with task-based loading; adopt lightweight decision headers and move detailed history here. Clarification and supply chain gates remain mandatory. | [D-019 — Lightweight decision documentation](DOC-003-decisions.md#d-019--lightweight-decision-documentation), [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading) |
| 1.0.0 | 2026-10-28 | Introduce versioning, context recovery, and mandatory clarification before deviations or uncertain work. Its read-all recovery rule is replaced by [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading). | [D-017 — Versioned AI agreements and context recovery](DOC-003-decisions.md#d-017--versioned-ai-agreements-and-context-recovery), [D-018 — No improvisation and required clarification](DOC-003-decisions.md#d-018--no-improvisation-and-required-clarification) |
| Unversioned | 2026-10-28 | Initial guide: architecture, documentation, supply chain, verification, and attribution. Retrospective baseline; no earlier version number existed. | [D-016 — AI collaboration and attribution](DOC-003-decisions.md#d-016--ai-collaboration-and-attribution), [D-001–D-015 — Original project decisions](DOC-003-decisions.md#d-001--nodejs-and-nestjs) |

## Recovering context

1. Read the current [DOC-001 — AI Contributor Guide](../AGENTS.md) header and core rules.
2. Identify the current maintainer request, affected area, and any unfinished-work handoff.
3. Load only relevant task entries, convention sections, and linked decision records. Check their status and follow supersession links.
4. If the guide version changed, inspect the relevant history entry and changed rules.
5. Recover agreed scope, completed work, pending steps, open questions, and approval status. Summaries and memory are navigation aids, not evidence of approval.

Record an explicit maintainer change before relying on it. If scope, authority, or the intended replacement is unclear, ask and wait before dependent work. Continue only clearly independent work already authorized.

## Clarification and handoff

- Do not improvise, invent requirements, or fill gaps with assumptions.
- Ask about unclear requirements, intent, contracts, boundaries, facts, or prior agreements.
- Explain proposed deviations, alternatives, extra features, or scope changes and obtain explicit approval first.
- State known facts, uncertainty, and the decision needed. Never label unanswered questions or proposals as accepted.
- For unfinished work, record a concise task-list handoff: guide version, request, scope, progress, next step, decision IDs, questions, and scoped approvals. A handoff creates no new agreement.

## Verification and attribution

Use relevant authorized checks and report what passed, failed, or remains unverified. Never invent installation, test, audit, or readiness results. Application build/test commands are not yet defined.

Initial collaboration used OpenAI Codex with the GPT-6 family identified in the session; the exact variant was unavailable. Record only evidenced identities for future contributors. Preserve attribution in the [DOC-000 — nest-layered-template](../README.md) and guide.
