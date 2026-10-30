# DOC-010 — Reliability Strategy

**Status:** Logging and minimal liveness accepted; broader reliability baseline proposed · **Updated:** 2026-10-30.
**Records:**

- [D-025 — Minimum monitoring, backup, and disaster recovery](DOC-003-decisions.md#d-025--minimum-monitoring-backup-and-disaster-recovery)
- [D-046 — Asynchronous logging and development diagnostics](DOC-003-decisions.md#d-046--asynchronous-logging-and-development-diagnostics)
- [D-047 — Independent logging worker](DOC-003-decisions.md#d-047--independent-logging-worker)
- [D-052 — Minimal process health endpoints](DOC-003-decisions.md#d-052--minimal-process-health-endpoints)
- [D-058 — Minimal logging operating policy](DOC-003-decisions.md#d-058--minimal-logging-operating-policy)

**Decision:** Include minimum monitoring, backup, and disaster recovery planning in the template. Keep implementation and operational settings subject to maintainer approval.

**Reason:** Help a solo developer or small team detect failures, protect data, and recover through a short, understandable process.

**Current template scope:** access demos, auth in-memory state, general integration placeholders, an independent logging process with local unexpected-error files, and minimal liveness endpoints for both processes. Database/upload backups and deployment recovery work remain deferred until relevant application data and hosting exist. Daily error-file limits and retention are accepted in [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md). Do not add fake backup jobs, database health checks, or recovery claims to the demo.

Accepted async logging, development diagnostics, unexpected-error JSON persistence, and the worker operating policy are specified in [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md), including seven-day daily-file retention. Minimal health checks below are accepted; broader monitoring, backup, and recovery plans remain proposals. No reliability provider, exact software, alert schedule/threshold, console-log retention period, or recovery target is selected. New software still requires the full [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md).

## 1. Monitoring

**Status:** Logging and minimal process liveness accepted; readiness, alerts, and broader monitoring details proposed.

- Expose the accepted minimal liveness endpoints below. Dependency readiness checks and external availability monitoring remain proposed.
- Follow accepted [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md) for structured logs, UUID request IDs, background internal HTTP, safe stderr fallback, secret exclusion, development-only context, bounded queues, and UTC daily JSON arrays with retention/size limits. Implementation and deployment supervision remain pending.
- Observe request traffic, latency, errors, and resource saturation.
- Alert on unavailable service, sustained failures, resource exhaustion, and failed or stale backups.
- Assign an alert recipient and link each actionable alert to a short response procedure. Confirm thresholds, intervals, console-log retention, and delivery channels per project.

The signal selection follows [Google SRE monitoring guidance](https://sre.google/sre-book/monitoring-distributed-systems/), retrieved 2026-10-29.

### Minimal health checks

**Status:** Accepted; implementation pending.
**Record:** [D-052 — Minimal process health endpoints](DOC-003-decisions.md#d-052--minimal-process-health-endpoints).

**Decision:** Expose `GET /health` on both the main API and the independent logging worker, using each process's own address. Allow calls without authentication (`@Public()` on the API). Return HTTP `200`, message `Service is running`, and `data: { "status": "ok" }` inside the standard envelope, with `Cache-Control: no-store`.

**Reason:** Give each process a small, independently observable liveness endpoint that confirms it can respond to requests.

Check the responding process only. API health remains independent of logging-worker availability, consistent with best-effort logging. Broader dependency readiness, monitoring schedules, alerts, and deployment tooling remain separate proposals. This does not select a health library or authorize software execution.

See [DOC-015 — Demo API Contracts: Health responses](DOC-015-demo-api-contracts.md#health-responses) for the shared response example. Health reachability alone does not verify file persistence or log delivery.

Liveness and readiness are distinct health-check purposes. [NestJS health checks](https://docs.nestjs.com/recipes/terminus), [Kubernetes probe concepts](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/), retrieved 2026-10-30. These references do not select a package or deployment platform.

## 2. Backup

**Status:** Proposed.

- Inventory application and authorization data, required configuration, and uploaded files if used. Document a secure way to recover credentials without placing secrets in the public repository.
- Automate backups on an agreed schedule; retain an access-controlled, encrypted recovery copy separate from production storage. Application credentials should not delete recovery copies; keep recovery keys available securely.
- Track backup completion, freshness, and integrity; make failures visible.
- Restore into an isolated environment on an agreed cadence and after relevant storage/schema changes. Check data consistency, application startup, and access rules; record the result.
- Choose schedule, retention, storage location, and access controls after setting recovery objectives.

Reference: [NIST SP 800-209, data protection and restoration assurance](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-209.pdf), retrieved 2026-10-29.

## 3. Disaster recovery

**Status:** Proposed.

Set project-specific objectives before choosing recovery infrastructure:

- **RPO:** maximum acceptable period of data loss.
- **RTO:** maximum acceptable time to restore service.

Proposed recovery checklist:

1. Detect and classify the incident; contain ongoing damage and identify the recovery owner.
2. Choose rollback for a faulty release or restore/rebuild for data or host loss. Record the recovery point and expected data loss.
3. Recover a compatible application/schema version, verified data, and required configuration in an isolated target.
4. Validate health, data relationships, authentication, and authorization before an approved cutover or resuming writes.
5. Record actual downtime/data loss against RTO/RPO, then update the short runbook with lessons from the incident or drill.

RTO/RPO definitions and recovery exercises follow the [Google Cloud DR planning guide](https://docs.cloud.google.com/architecture/dr-scenarios-planning-guide), retrieved 2026-10-29. This reference does not select Google Cloud as a provider.

## Open decisions

| Area | To agree |
| --- | --- |
| Monitoring | Checks, intervals, thresholds, recipient, channel, and console-log retention. Daily error-file retention is already accepted. |
| Backup | Schedule, retention, storage isolation, encryption/access, and restore-test cadence. |
| Recovery | RPO, RTO, scenarios, recovery owner/target, and cutover procedure. |

After approval and implementation, verify a delivered alert, an isolated restore, and a timed recovery exercise. Record evidence; documentation alone is not proof of reliability.
