# DOC-007 — Git Conventions

**Status:** Accepted ownership rules; workflow details open · **Updated:** 2026-10-28.
**Records:**

- [D-013 — Public GitHub repository](DOC-003-decisions.md#d-013--public-github-repository)
- [D-014 — Descriptive project name](DOC-003-decisions.md#d-014--descriptive-project-name)
- [D-020 — Task-based context loading](DOC-003-decisions.md#d-020--task-based-context-loading)

**Decision:** Leave commits, pushes, publication, and remote changes to the maintainer unless explicitly requested. Preserve unrelated changes.

**Reason:** The maintainer asked the assistant to prepare reviewable changes and will commit and push them.

## Before an authorized Git write

- Confirm the requested operation and scope from the maintainer's instruction; publication intent alone is not an instruction to push.
- Read the current status/diff and include only the requested changes.
- If the required workflow or intended operation is unclear, ask before acting.

## Open decisions

Branch naming, commit-message format, pull-request practices, and review requirements are not agreed. Do not infer a style such as Conventional Commits.
