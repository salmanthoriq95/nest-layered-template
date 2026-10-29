# DOC-007 — Git Conventions

**Status:** Accepted project workflow and message format · **Updated:** 2026-10-29.
**Records:**

- [D-013 — Public GitHub repository](DOC-003-decisions.md#d-013--public-github-repository)
- [D-014 — Descriptive project name](DOC-003-decisions.md#d-014--descriptive-project-name)
- [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading)
- [D-026 — Direct master workflow for this repository](DOC-003-decisions.md#d-026--direct-master-workflow-for-this-repository)
- [D-027 — Conventional Commits message format](DOC-003-decisions.md#d-027--conventional-commits-message-format)

**Decision:** Work directly on `master` until the maintainer requests branch separation. Use Conventional Commits. Leave commits, pushes, publication, and remote changes to the maintainer unless explicitly requested.

**Reason:** Keep this project's workflow simple and its history readable. General branching strategy belongs in the maintainer's separate personal engineering handbook.

## Project workflow

- Use `master` directly for this repository. Create or switch branches only on explicit maintainer instruction.
- Keep broader branching strategies in the separate handbook; do not introduce a feature-branch or pull-request requirement here.
- Branch preference does not itself authorize the assistant to commit or push.
- Preserve unrelated changes and review the requested diff before an authorized Git write.

## Commit messages

Use [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/), retrieved 2026-10-29.

```text
<type>[optional scope][!]: <description>
```

- Use `feat` for a feature and `fix` for a bug fix. Other descriptive types, such as `docs`, `refactor`, `test`, and `chore`, are allowed.
- Keep the description concise. Scope is optional; add a body or footers when extra context is useful.
- Identify breaking changes with `!` before the colon or a `BREAKING CHANGE:` footer.
- Keep unrelated changes in separate commits where practical.

Examples only:

```text
docs(git): document direct master workflow
feat(examples): add admin access demo
fix(auth): reject insufficient role
```

Commit tooling still requires normal supply chain preflight and explicit approval.

## Before an authorized Git write

- Confirm the operation and scope from the maintainer's request; publication intent alone is not an instruction to push.
- Inspect the current branch, status, and diff; include only the requested changes.
- Ask before acting if the instruction or applicable convention is unclear.
