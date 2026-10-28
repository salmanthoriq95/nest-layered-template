# DOC-000 — nest-layered-template

A modular NestJS backend starter with clear boundaries, explicit contracts, and flexible authorization.

**Status:** design and documentation. Application scaffolding, exact versions, and dependencies are pending.

## Scope

- Authentication and configurable authorization.
- Two or three CRUD examples with access controls.
- One application, organized by feature, with layers inside each module.
- Dependency injection and contracts covering behavior and responsibilities.
- Database and external integration implementations outside the service layer.
- Optional upload or payment examples; deployment follows each project's needs and resources.

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
| [DOC-007 — Git Conventions](docs/DOC-007-git-conventions.md) | Git ownership rules and open workflow decisions. |
| [DOC-008 — Licensing and Community Scope](docs/DOC-008-licensing.md) | MIT selection, alternatives, and downstream responsibility. |
| [DOC-009 — Code of Conduct](CODE_OF_CONDUCT.md) | Draft participation standards and GitHub reporting. |

## AI collaboration

Design and documentation were developed by the maintainer with **[OpenAI Codex](https://learn.chatgpt.com/docs/models)**, an AI code assistant using the **GPT-6 model family** identified in the contributing session. The exact model variant was unavailable.

## License

[MIT](LICENSE), copyright 2026 salmanthoriq95. Free to use, modify, and redistribute, including commercially or in closed-source projects, provided the required notices are retained. Downstream distributors may charge for their copies or services.

The software is supplied without warranty; LICENSE defines its liability disclaimer, subject to applicable law. Independent forks, modifications, and deployments are not automatically reviewed, endorsed, supported, or maintained by this upstream project.

See the [DOC-009 — Code of Conduct (draft)](CODE_OF_CONDUCT.md) for upstream community participation and GitHub reporting. Community rules do not add conditions to MIT's software permissions.
