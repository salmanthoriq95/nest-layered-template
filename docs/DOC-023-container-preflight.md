# DOC-023 — Container Preflight

**Status:** Runtime reachable; security review required before application tests · **Decision:** REVIEW · **Retrieved:** 2026-11-06.
**Records:** [D-002 — Software supply chain policy](DOC-003-decisions.md#d-002--software-supply-chain-policy), [D-089 — Docker development workflow](DOC-003-decisions.md#d-089--docker-development-workflow).

**Decision:** Require maintainer review of confirmed runtime advisory matches and the Node security preannouncement. Keep unverified package/image artifacts UNKNOWN.

**Reason:** The running VM contains older components with published affected-version matches. Empty direct-npm queries do not clear the container runtime, image, or transitive graph.

## Candidates

| Component | Exact identity/source | Purpose and remaining evidence |
| --- | --- | --- |
| Docker CLI | `29.9.3`, installed Homebrew formula links [docker/cli v29.9.3](https://github.com/docker/cli/tree/v29.9.3), revision `5457199aa57c45e990c59c89cab5f02b817238d7` | Container control. Formula/receipt inspected; local binary provenance/hash binding unverified. |
| Compose | `5.7.0`, [upstream release](https://github.com/docker/compose/releases/tag/v5.7.0) | Plugin discovered; project Compose configuration validates. Watch/runtime behavior unverified. |
| Colima | `0.10.3`, [upstream release](https://github.com/abiosoft/colima/releases/tag/v0.10.3), revision `00f6c297e92a82c04a4ab507db0a61435650d7e8` | Initially stopped; after startup approval, the command returned already running. Existing Docker engine is reachable. |
| Docker Engine / guest | `29.5.2` on Ubuntu `24.04.4 LTS`, arm64 | Different from host CLI `29.9.3`. Runtime advisory review required. |
| BuildKit / containerd / runc | `0.30.0` / `2.2.4` / `1.3.5` | Reported by the running engine/builder; published affected-version matches are documented below. |
| Lima | `2.2.1`, observed installed directory; [upstream](https://github.com/lima-vm/lima) | Colima dependency; full binary/guest image and transitive review pending. |
| Node image | `docker.io/library/node:26.13.0-bookworm`; [official inventory](https://raw.githubusercontent.com/docker-library/official-images/master/library/node) | Runtime/compiler candidate with arm64/amd64 support. OS inventory and artifact verification pending. |
| Bundled Node/npm | `26.13.0` / `11.20.0`; [release index](https://nodejs.org/dist/index.json) | Release metadata, not a successful local runtime check. |
| Direct npm packages | 18 baseline versions in [component evidence](preflight/2026-11-06-direct-components.json) | Candidate manifest exists; resolved graph/lockfile and execution remain pending. |

Image index digest:

```text
sha256:a546d3f8acd2af4382668a7e6acd3bc4418e6a27478373e3246f8162f5181509
```

[Docker Hub tag metadata](https://hub.docker.com/v2/repositories/library/node/tags/26.13.0-bookworm) reports arm64 manifest `sha256:a0b93c08df51926b62df52fb9f7bba8a9b52e42541e1532407b3cb366470c893`. No downloaded artifact comparison or signature verification was performed.

## Mandatory checks

| Check | Evidence and gaps |
| --- | --- |
| Identity/purpose | npm manifests, installed host formulas/receipt, and official image metadata/source inspected. Actual daemon/VM identity unknown. |
| Support/maintenance | Node release direction and package engine/peer ranges reviewed. TypeScript `6.0.3` fits the selected Swagger/linter peers. Formal package support windows and native Node 26 behavior remain incomplete. |
| Authoritative advisories | Node security release and Docker/Compose/Colima maintainer indexes consulted. Embedded/OS package coverage incomplete. |
| OSV | Exact-version batch queries for the 18 npm baselines returned no matches. Separate npm `11.20.0` and observed Docker/Compose/Colima Go module queries also returned no matches. These are not full graph/binary scans. |
| GitHub Advisory Database | Exact baseline queries for all 18 npm packages returned empty results. Transitives and later caret resolutions remain unchecked. |
| CISA KEV | Official [CISA mirror](https://raw.githubusercontent.com/cisagov/kev-data/main/known_exploited_vulnerabilities.json), catalog `2026.11.04`, retrieved/searched. Brotli `CVE-2026-111497` is listed. Node's [October security release](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) addresses it before the chosen target; full image/guest CVE mapping is missing. |
| OpenSSF | [Bcrypt Scorecard API](https://api.securityscorecards.dev/projects/github.com/kelektiv/node.bcrypt.js), dated 2026-10-26, reports 3.6 overall, with maintenance, signing, and workflow-token concerns. Repository evidence does not prove malware or a package exploit. Broader coverage pending. |
| Socket | [Bcrypt 6.0.0 overview](https://socket.dev/npm/package/bcrypt/overview/6.0.0) accessible; complete current alert/file analysis not established. |
| deps.dev | [Bcrypt version API](https://api.deps.dev/v3/systems/npm/packages/bcrypt/versions/6.0.0) reports no advisory keys, SLSA provenance, or attestations for that entry. Full graph/artifact coverage missing. |
| Scripts/permissions/network | Bcrypt declares `install: node-gyp-build`; drafted installs use `--ignore-scripts`. Project scripts, Dockerfile, and Compose reviewed. Docker can read host context/credential configuration; containers receive no such host mounts. Metadata uses public registries. |
| Integrity/provenance | npm integrity/signature metadata and registry signing keys retrieved; no cryptographic verification. The [official Node Dockerfile](https://raw.githubusercontent.com/nodejs/docker-node/34e1b0030b415bdea959ccb15afda976a0761346/26/bookworm/Dockerfile) describes upstream signature/checksum checks, which do not verify a local artifact. |
| Alternatives | Slim Debian images reduce bundled OS packages but still need native-bcrypt validation. Bcryptjs remains an earlier portability alternative; it has neither replaced the native choice nor gained clearance. No extra scanner/installer selected. |

Bcrypt's maintenance/provenance signals require review before native execution. They do not establish that `6.0.0` is malicious. Unverified artifacts remain **UNKNOWN**; confirmed runtime advisory matches now additionally require **REVIEW**.

## Runtime security findings — 2026-11-06

The startup command was explicitly approved. It returned `already running, ignoring` with exit 0; the subsequent engine query succeeded. No package upgrade or project image pull/build has run.

| Component | Finding and affected versions | Decision |
| --- | --- | --- |
| BuildKit `0.30.0` | [CVE-2026-61711](https://github.com/advisories/GHSA-7236-3392-c5c6): custom frontend can bypass Seccomp/AppArmor; published range `<=0.31.0`, first fix `0.31.1`. [CVE-2026-61712](https://github.com/advisories/GHSA-72x6-4j93-7w86) also matches. | REVIEW |
| containerd `2.2.4` | Nine GitHub exact-version matches, including [CVE-2026-53488](https://github.com/advisories/GHSA-xhf5-7wjv-pqxp), a high-severity CRI image-label issue affecting `>=2.2.0,<2.2.5`, and [CVE-2026-53493](https://github.com/advisories/GHSA-pg57-6jwg-q645), an image-pull denial of service affecting `>=2.1.0,<2.2.9`. | REVIEW |
| runc `1.3.5` | [CVE-2026-41579](https://github.com/advisories/GHSA-xjvp-4fhw-gc47): a crafted image with a `/dev` symlink can affect host filesystem integrity. Published range `<=1.3.5`, first fix `1.3.6` on that branch. | REVIEW |
| Node `26.13.0` candidate | The official [3 November preannouncement](https://raw.githubusercontent.com/nodejs/nodejs.org/main/apps/site/pages/en/blog/vulnerability/november-2026-security-releases.md) schedules HIGH-severity security releases for 26.x, 24.x, and 22.x on or shortly after `2026-11-11`. Specific CVEs and fixed patch versions are not disclosed in the retrieved announcement. | REVIEW |

OSV and GitHub were queried for the exact BuildKit/containerd/runc versions. [Structured evidence](preflight/2026-11-06-runtime-components.json) records all matches and ranges. An additional Docker Go-module query has incomplete module/binary mapping and does not clear the engine.

None of these twelve queried runtime CVE IDs appears in the retrieved CISA KEV catalog `2026.11.04`. Absence does not establish safety. Broader OS/native dependencies, runtime malware/provenance signals, and full image/package inventory remain incomplete.

Confidence is high for observed versions and advisory-range matches. Exploitability in this VM is not established: CRI-specific findings require CRI exposure, and Docker usage alone does not establish that exposure. No active containers were reported. Project containers avoid home/socket mounts, but the existing VM itself mounts the host home directory writable.

### Update and testing options

- Recommended runtime direction: review an in-VM update to Docker Engine `29.9.3` and its patched runtime components before pulling/building project images. [Docker's release notes](https://docs.docker.com/engine/release-notes/29/) document additional security fixes and a BuildKit `0.34.2` update. Review replacement artifacts rather than assuming the host CLI upgrade updated the daemon.
- Official [Docker Ubuntu arm64 package metadata](https://download.docker.com/linux/ubuntu/dists/noble/stable/binary-arm64/Packages) contains Docker CE/CLI `5:29.9.3-1~ubuntu.24.04~noble` and containerd.io `2.4.2` candidates. Repository signature binding, exact package revision/resolution, dependencies, maintainer scripts, and bundled runc still require review before installation.
- Current Docker CE/CLI and containerd packages are held in the guest. No holds were changed. An upgrade needs explicit approval for that existing VM and a review of Colima compatibility.
- For Node, choose between reviewed local-only tests with `26.13.0` while retaining REVIEW status, or waiting for the announced patched release and reviewing its exact image. Changing to 24.x/22.x does not avoid this preannouncement.

The digest-pinned Node image index resolves remotely and contains the expected arm64 descriptor. This was manifest metadata inspection; no image layers were pulled, and no image signature/provenance verification was completed.

## Static draft checks

Read-only checks passed for JSON syntax, local relative imports, documentation links/anchors, ordered D-001–D-089 records, tracked diff whitespace, and shell syntax. Project JavaScript bodies were parsed without invoking them; this does not validate their imports or runtime behavior.

Compose configuration validation subsequently passed. TypeScript compilation, default formatting, lint, tests, native-bcrypt loading, image builds, watch, and manual Swagger checks remain unverified. These checks do not establish artifact clearance.

## Execution verification — 2026-11-06

The maintainer requested testing. Existing host tools were exercised without starting a VM, pulling an image, or installing dependencies.

| Command/check | Observed result |
| --- | --- |
| `docker --version` | PASS: `29.9.3`, build `5457199aa5`. |
| `docker compose version --short` | PASS: `5.7.0`; plugin available. |
| `docker context ls --format '{{.Name}}'` | PASS: `colima` and `default` exist. |
| `docker --context colima compose --env-file .docker.env.example config --quiet` | PASS: configuration validates using the review-candidate environment file. No image build or container startup. |
| `colima status` | STOPPED: exit 1, `colima is not running`. |
| `docker --context colima info --format '{{.ServerVersion}}'` | BLOCKED: `~/.colima/default/docker.sock` is absent. |
| `docker --context default info --format '{{.ServerVersion}}'` | BLOCKED: `/var/run/docker.sock` is absent. |
| `git diff --check`; `/bin/sh -n scripts/container-tools.sh` | PASS. |
| Approved Colima start and subsequent engine query | PASS: startup command returned already running; engine `29.5.2` is reachable. The earlier stopped/socket failures above are historical observations. |
| Application build, lint/format, unit/HTTP tests, Swagger, and Watch | NOT RUN: runtime security review and image/package/fixture/lockfile steps remain pending. |

No permission-denied error occurred. Superuser privileges are not established as necessary.

The existing VM uses VZ/aarch64, two CPUs, and 2 GiB RAM. It reports Ubuntu `24.04.4 LTS`. Its cached image provenance and complete OS inventory remain UNKNOWN; a populated VM directory does not clear those artifacts.

Approved command, executed:

```sh
colima start --activate=false --ssh-config=false --save-config=false
```

The command returned already running, so no boot was initiated by this invocation.

## Execution boundary

Docker/Compose/Colima diagnostics, the approved startup command, guest OS/package reads, and remote image-manifest inspection have run. No runtime package upgrade, project image pull/build, Node/npm binary, compiler, test runner, hash generator, or application was executed. No host Node/nvm, lockfile, fixture hashes/UUIDs, or actual `.env` was created.

After runtime/image review, propose the digest-pinned metadata bootstrap from [DOC-022 — Container Development Workflow](DOC-022-container-workflow.md), review its exported lockfile, and obtain approval for dependency/tool/native/application execution. Keep download, verification, and execution scopes explicit.
