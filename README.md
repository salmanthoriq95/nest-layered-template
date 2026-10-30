# DOC-000 — nest-layered-template

A modular NestJS backend starter with clear boundaries, explicit contracts, and flexible authorization.

**Status:** design and documentation. Application scaffolding, exact versions, and dependencies are pending.

## Scope

- Demonstrate public, permission-protected, and superadmin-only access with allow/deny responses.
- Use per-user in-memory grants. Public routes are anonymous; authenticated superadmins pass permission checks; superadmin-only routes stay restricted.
- Use HS256 access JWTs (15-minute default) and rotating opaque refresh tokens (seven-day refresh window). Logout immediately invalidates the current session's access and refresh tokens through server-side checks.
- Keep two dummy accounts, roles/grants, and sessions in memory. Edit grants manually in storage; no grant-management endpoint is included. Dummy-account credentials stay outside `.env`.
- Configure signing/expiry in `.env`, use UUID v4 public user IDs, and try the API through Swagger first. API contracts are accepted; tooling and remaining runtime settings are pending.
- Use bcrypt for application and Swagger passwords. Application hashes stay in memory fixtures; Swagger Basic Auth uses its separate `.env` credentials.
- Apply environment-configured login/refresh limits per client IP and endpoint, with process-local counters and explicit proxy trust when deployed behind a reverse proxy.
- Keep a modular, N-layered main API with DI and clear boundaries; run logging in an independent process.
- Send logs to the independent worker through background internal HTTP, with UUID correlation and development-only request details. The worker persists unexpected faults to one daily JSON array file; exclude secrets in every mode. Delivery is best effort; failures produce a safe local stderr diagnostic while the API keeps serving. Initial queue, ingestion, file, and lifecycle policies are accepted in [DOC-016 — Logging Conventions](docs/DOC-016-logging-conventions.md).
- Validate request inputs and use uniform JSON envelopes with standard HTTP statuses and safe error details.
- Prepare general persistence and external integration placeholders, alongside the auth module's in-memory access store behind a contract. Add database/provider implementations when a consuming project needs them.
- Initial scope has no real article/category/comment CRUD, database, ORM, upload, or payment integration.
- Expose independent, unauthenticated health endpoints on the API and logging worker. Keep broader monitoring, backup, and recovery guidance as planning material; operational settings follow actual data/hosting needs.


Designed for solo developers and teams of 2–3. Priorities: readable flows, fast delivery, easy debugging and review, and changes with controlled scope and cost.

## Planned demo logins

| Username | Password |
| --- | --- |
| `superadmin` | `dev123` |
| `admin` | `dev123` |

These public example credentials are approved for the planned in-memory fixtures; the application is not implemented yet. Fixtures will store bcrypt hashes. Swagger Basic Auth credentials and the JWT signing key remain separately configured through `.env`. See [DOC-015 — Demo API Contracts](docs/DOC-015-demo-api-contracts.md) for routes and initial grants.

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
| [DOC-010 — Reliability Strategy](docs/DOC-010-reliability.md) | Accepted logging/liveness scope and proposed broader monitoring, backup, and recovery plans. |
| [DOC-011 — Code Conventions](docs/DOC-011-code-conventions.md) | Accepted code layout, contracts, naming, and minimal test strategy. |
| [DOC-012 — HTTP Boundary Conventions](docs/DOC-012-http-conventions.md) | Accepted validation, XSS boundaries, envelopes, and shared HTTP wiring. |
| [DOC-013 — HTTP Status and Response Examples](docs/DOC-013-http-response-examples.md) | Common HTTP statuses, headers, and uniform response examples. |
| [DOC-014 — Authentication Lifecycle](docs/DOC-014-authentication-lifecycle.md) | Tokens, logout, configuration, login/refresh limits, proxy trust, and Swagger protection. |
| [DOC-015 — Demo API Contracts](docs/DOC-015-demo-api-contracts.md) | Accepted routes, process health responses, demo credentials/grants, and access/session defaults. |
| [DOC-016 — Logging Conventions](docs/DOC-016-logging-conventions.md) | Async logs, development diagnostics, unexpected-fault files, and the independent worker boundary. |

## AI collaboration

Design and documentation were developed by the maintainer with **[OpenAI Codex](https://learn.chatgpt.com/docs/models)**, an AI code assistant using the **GPT-6 model family** identified in the contributing session. The exact model variant was unavailable.

## License

[MIT](LICENSE), copyright 2026 salmanthoriq95. Free to use, modify, and redistribute, including commercially or in closed-source projects, provided the required notices are retained. Downstream distributors may charge for their copies or services.

The software is supplied without warranty; LICENSE defines its liability disclaimer, subject to applicable law. Independent forks, modifications, and deployments are not automatically reviewed, endorsed, supported, or maintained by this upstream project.

See the [DOC-009 — Code of Conduct (draft)](CODE_OF_CONDUCT.md) for upstream community participation and GitHub reporting. Community rules do not add conditions to MIT's software permissions.
