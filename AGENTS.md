# DOC-001 — AI Contributor Guide

**Status:** Accepted · **Version:** 4.4.0 · **Updated:** 2026-10-30.
**Records:**

- [D-019 — Lightweight decision documentation](docs/DOC-003-decisions.md#d-019--lightweight-decision-documentation)
- [D-020 — Task-based context loading](docs/DOC-003-decisions.md#d-020--task-based-context-loading)
- [D-023 — Document identifiers and descriptive references](docs/DOC-003-decisions.md#d-023--document-identifiers-and-descriptive-references)
- [DOC-006 — AI Working Agreements: Version history](docs/DOC-006-agent-agreements.md#version-history)

Co-created with OpenAI Codex (GPT-6 family; exact variant unavailable).

## Always apply

- Do not improvise or invent requirements. Ask the maintainer about unclear, missing, or conflicting guidance; wait before affected work. Silence is not approval.
- Propose deviations or additions and obtain explicit maintainer approval before implementation.
- Follow accepted decisions and supersession links. Keep proposals and unknowns distinct from approved facts.
- Initial scope is permission-based demos with in-memory accounts/grants/sessions, minimal JWT login/refresh/logout, and general persistence/integration placeholders. Do not add real CRUD, domain relationships, ORM, database-backed permissions, or live integrations without a new maintainer request.
- Include only two dummy accounts: superadmin and admin. Edit grants manually in storage; do not add grant-management endpoints without a new maintainer request.
- Preserve unrelated changes. Write concise English and report only verified results.
- External software steps require the full supply chain policy, preflight, and explicit approval. ELIGIBLE is not execution permission.
- Leave commits, pushes, publication, and remote changes to the maintainer unless explicitly requested.
- Work directly on `master` in this repository; creating or switching branches requires explicit maintainer instruction.

## Load context by task

At session start or after compaction, read this guide, identify the task, then load only relevant sections below. Do not preload every document.

| Trigger | Read before affected work |
| --- | --- |
| Scope, feature, layer, contract, or integration changes | [DOC-004 — Conventions: 2. Scope and priorities](docs/DOC-004-conventions.md#2-scope-and-priorities), [DOC-004 — Conventions: 3. Architecture](docs/DOC-004-conventions.md#3-architecture), or [DOC-004 — Conventions: 5. External interaction examples](docs/DOC-004-conventions.md#5-external-interaction-examples), as applicable. |
| Code layout, naming, typing, imports, or tests | Relevant sections of [DOC-011 — Code Conventions](docs/DOC-011-code-conventions.md). |
| Request validation, response envelopes, or HTTP statuses | Relevant [DOC-012 — HTTP Boundary Conventions](docs/DOC-012-http-conventions.md); [DOC-013 — HTTP Status and Response Examples](docs/DOC-013-http-response-examples.md) when status examples are needed. Check proposed versus accepted details. |
| Endpoint inputs/results, route policy defaults, or initial demo grants | Relevant [DOC-015 — Demo API Contracts](docs/DOC-015-demo-api-contracts.md). This draft remains Proposed until the maintainer accepts it. |
| Authentication, authorization, public access, or user identifiers | Relevant subsections of [DOC-004 — Conventions: 4. Authorization](docs/DOC-004-conventions.md#4-authorization). |
| Login, refresh, auth environment settings, or Swagger access/token testing | Relevant [DOC-014 — Authentication Lifecycle](docs/DOC-014-authentication-lifecycle.md). Check accepted requirements versus proposed policies. |
| Decision or documentation changes | [DOC-004 — Conventions: 1. Documentation](docs/DOC-004-conventions.md#1-documentation) and affected decision records. |
| New/changed external software, package-manager/installer runs, skills, MCP, or CI actions | Full [DOC-005 — Global Software Supply Chain Security Policy](docs/DOC-005-supply-chain-security.md), before selection, download, installation, update, or execution. |
| Commit, push, publish, or change remotes | [DOC-007 — Git Conventions](docs/DOC-007-git-conventions.md). |
| Resume unfinished work or change agent rules | Relevant [DOC-002 — Project Task List](task-list.md) or [DOC-006 — AI Working Agreements](docs/DOC-006-agent-agreements.md). |
| Project identity, attribution, or overview | [DOC-000 — nest-layered-template](README.md) or [DOC-004 — Conventions: 7. Project identity and attribution](docs/DOC-004-conventions.md#7-project-identity-and-attribution). |
| Licensing, downstream scope, or community conduct | Relevant [DOC-008 — Licensing and Community Scope](docs/DOC-008-licensing.md), [LICENSE](LICENSE), or [DOC-009 — Code of Conduct (draft)](CODE_OF_CONDUCT.md). |
| Monitoring, backups, restore, or disaster recovery | Relevant sections of [DOC-010 — Reliability Strategy](docs/DOC-010-reliability.md). |

Use `rg` to locate headings, then read the relevant range. Check header status/version and linked decision IDs; open history only to resolve changes or conflicts. Reuse unchanged context within the task. If no applicable rule exists, ask the maintainer before proceeding.

On recovery, verify the current guide version and relevant agreements; a summary is not approval. Keep unfinished-work handoffs in the task list with scope, progress, next step, version, decision IDs, questions, and approvals.
