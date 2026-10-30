# DOC-000 — nest-layered-template

A modular NestJS backend starter with clear boundaries, explicit contracts, and flexible authorization.

**Status:** design and documentation. Application scaffolding, exact versions, and dependencies are pending.

## Scope

- Demonstrate public, permission-protected, and superadmin-only access with allow/deny responses.
- Use per-user in-memory grants. Public routes are anonymous; authenticated superadmins pass permission checks; superadmin-only routes stay restricted.
- Use minimal signed JWT login/refresh and current server-side role/grant lookup, with UUID v4 public user IDs. Configure signing/expiry in `.env`; try the API through Swagger first. Detailed token policies and exact tooling remain open.
- Protect Swagger with HTTP Basic Auth and a bcrypt password hash configured in `.env`.
- Keep one modular, N-layered application with DI and clear boundaries.
- Validate request inputs and use uniform JSON envelopes with standard HTTP statuses and safe error details.
- Prepare general persistence and external integration placeholders, alongside the auth module's in-memory access store behind a contract. Add database/provider implementations when a consuming project needs them.
- Initial scope has no real article/category/comment CRUD, database, ORM, upload, or payment integration.
- Keep minimum monitoring, backup, and recovery guidance as planning material; real operational settings require a deployment and relevant data.


Designed for solo developers and teams of 2–3. Priorities: readable flows, fast delivery, easy debugging and review, and changes with controlled scope and cost.

## Project guide

| Document | Purpose |
| --- | --- |
| [DOC-001 — AI Contributor Guide](AGENTS.md) | Compact task router and mandatory AI rules. |
| [DOC-002 — Project Task List](task-list.md) | Discussion checklist and implementation backlog. |
| [DOC-003 — Decision Records](docs/DOC-003-decisions.md) | Decision status and reasons; supporting details where useful. |
| [DOC-004 — Conventions](docs/DOC-004-conventions.md) | Accepted rules, proposals, and open questions. |
| [DOC-005 — Global Software Supply Chain Security Policy](docs/DOC-005-supply-chain-security.md) | Required checks and explicit approval before external software use. |
| [DOC-006 — AI Working Agreements](docs/DOC-006-agent-agreements.md) | Version history and context recovery details. |
| [DOC-007 — Git Conventions](docs/DOC-007-git-conventions.md) | Direct master workflow, Conventional Commits, and Git write authorization. |
| [DOC-008 — Licensing and Community Scope](docs/DOC-008-licensing.md) | MIT selection, alternatives, and downstream responsibility. |
| [DOC-009 — Code of Conduct](CODE_OF_CONDUCT.md) | Draft participation standards and GitHub reporting. |
| [DOC-010 — Reliability Strategy](docs/DOC-010-reliability.md) | Proposed monitoring, backup, and disaster recovery baseline. |
| [DOC-011 — Code Conventions](docs/DOC-011-code-conventions.md) | Accepted code layout, contracts, naming, and minimal test strategy. |
| [DOC-012 — HTTP Boundary Conventions](docs/DOC-012-http-conventions.md) | Accepted validation, XSS boundaries, envelopes, and shared HTTP wiring. |
| [DOC-013 — HTTP Status and Response Examples](docs/DOC-013-http-response-examples.md) | Common HTTP statuses, headers, and uniform response examples. |
| [DOC-014 — Authentication Lifecycle](docs/DOC-014-authentication-lifecycle.md) | Accepted login/refresh requirements and proposed token policies. |

## AI collaboration

Design and documentation were developed by the maintainer with **[OpenAI Codex](https://learn.chatgpt.com/docs/models)**, an AI code assistant using the **GPT-6 model family** identified in the contributing session. The exact model variant was unavailable.

## License

[MIT](LICENSE), copyright 2026 salmanthoriq95. Free to use, modify, and redistribute, including commercially or in closed-source projects, provided the required notices are retained. Downstream distributors may charge for their copies or services.

The software is supplied without warranty; LICENSE defines its liability disclaimer, subject to applicable law. Independent forks, modifications, and deployments are not automatically reviewed, endorsed, supported, or maintained by this upstream project.

See the [DOC-009 — Code of Conduct (draft)](CODE_OF_CONDUCT.md) for upstream community participation and GitHub reporting. Community rules do not add conditions to MIT's software permissions.
