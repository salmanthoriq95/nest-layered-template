# DOC-022 — Container Development Workflow

**Status:** Accepted Docker direction; source draft, execution pending · **Updated:** 2026-11-06.
**Record:** [D-089 — Docker development workflow](DOC-003-decisions.md#d-089--docker-development-workflow).

**Decision:** Run Node, npm, compilation, tests, and watch inside Docker, with independent API/worker processes.

**Reason:** The maintainer explicitly chose Docker because the new laptop has no Node/nvm installation.

## Services

| Service | Purpose |
| --- | --- |
| `metadata` | Node/npm-only bootstrap; exports a candidate lockfile with lifecycle scripts disabled. |
| `tooling` | Isolated build, lint, format, fixture generation, and subprocess HTTP tests. |
| `compiler` | One TypeScript watch process; writes the shared compiled volume. |
| `api` | Watches compiled JavaScript and supervises only its API child. |
| `logging-worker` | Independent logging child and persistent error-log volume. |

Compose Watch syncs source/config changes. API and worker mount compiled output read-only, depend only on compiler startup, and wait for compiled entries. The API does not depend on a reachable worker.

The Docker profile binds listeners to `0.0.0.0` inside containers. Only API port 3000 is published, on host loopback. Worker ingestion uses `http://logging-worker:3001/internal/logs` on the private same-host Compose network, with the existing shared credential and no published worker port. Standalone loopback defaults remain.

Containers receive no Docker socket, host credential directory, or host `node_modules` mount. Remote transport/TLS is separate deployment work.

## Bootstrap

Commands below are reviewable procedures, not execution permission. Follow [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md) and [DOC-023 — Container Preflight](DOC-023-container-preflight.md) before affected steps.

The host helper defaults to context `colima`; use shell variable `CONTAINER_CONTEXT` for another reviewed local context. It does not start a VM, change global context, or install host software.

1. Approve/run the read-only runtime diagnostics in DOC-023. Identify/review a VM image before any VM startup. A CLI installation alone does not establish a running engine.
2. After image/bootstrap approval, copy `.docker.env.example` to `.docker.env`. Its digest-pinned image remains a review candidate.
3. Resolve and export the candidate lockfile:

```sh
sh scripts/container-tools.sh metadata
```

This builds only the Node/npm toolchain target and runs `npm install --package-lock-only --ignore-scripts`. Review the resulting full graph and artifacts before dependency download/execution approval.

4. After that approval, prepare tooling and public fixtures:

```sh
sh scripts/container-tools.sh tooling
sh scripts/container-tools.sh fixtures
```

Development installs use `npm ci --ignore-scripts`. Bcrypt must load an approved bundled native prebuild; no install hook, automatic download, or build fallback is added. The fixture script generates exactly two independently salted bcrypt hashes and stable UUID v4 IDs once.

5. Configure private values interactively in your terminal:

```sh
sh scripts/container-tools.sh configure
```

The prompt hides the Swagger password, creates random JWT/logging keys, and exports owner-only `.env`. Existing host files are not overwritten. The setup prompt uses an ASCII documentation username for consistent env-file loading; application usernames keep their accepted contract.

Compose reads `.env` with `format: raw`. Generated values are unquoted, including literal bcrypt dollar signs. Configuration expansion is disabled. Test children ignore `.env` and use controlled test values.

6. Format/export managed source files and run checks:

```sh
sh scripts/container-tools.sh format
sh scripts/container-tools.sh check
```

Tooling uses a separate container copy/output directory. The format helper exports managed source/test/scripts/config files only; it does not copy secrets or dependencies to the host.

## Watch

After approvals and bootstrap:

```sh
docker --context colima compose --env-file .docker.env up --build --watch compiler api logging-worker
docker --context colima compose --env-file .docker.env --profile tools up --watch tooling
```

Run the second command in another terminal when editing/running tests. Use your selected context instead of `colima` when applicable. Source maps are included. Dependency/lockfile changes require another preflight and rebuild approval; Watch does not install updates. Env changes require recreation/restart.

API health: `http://127.0.0.1:3000/health`. Swagger: `http://127.0.0.1:3000/docs`, with its separate Basic Auth. Demo logins remain `admin`/`dev123` and `superadmin`/`dev123`.

The Dockerfile's runtime target copies application `dist/` and production dependencies after the verified build stage. Project test sources/compiled tests stay outside that final artifact. Container behavior, native loading, compilation, formatting, tests, and manual Swagger use remain unverified pending approved execution.
