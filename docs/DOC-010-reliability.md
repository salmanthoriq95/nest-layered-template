# DOC-010 — Reliability Strategy

**Status:** Requirement accepted; baseline proposed · **Updated:** 2026-10-29.
**Record:** [D-025 — Minimum monitoring, backup, and disaster recovery](DOC-003-decisions.md#d-025--minimum-monitoring-backup-and-disaster-recovery).

**Decision:** Include minimum monitoring, backup, and disaster recovery planning in the template. Keep implementation and operational settings subject to maintainer approval.

**Reason:** Help a solo developer or small team detect failures, protect data, and recover through a short, understandable process.

**Current template scope:** access demos and extension placeholders only, following [D-028 — Placeholder-only access demonstration template](DOC-003-decisions.md#d-028--placeholder-only-access-demonstration-template). Database/file backup and real disaster recovery work are deferred until a consuming project has relevant data and hosting. Do not add fake backup jobs, database health checks, or recovery claims to the initial demo.

The following baseline is proposed, not implemented. No provider, software, schedule, threshold, retention period, recovery target, or deployment topology has been selected. New software still requires the full [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md).

## 1. Monitoring

**Status:** Proposed.

- Expose bounded health/readiness checks for the application and critical dependencies, plus an external availability check.
- Record structured errors with timestamps and request IDs; redact secrets and sensitive data.
- Observe request traffic, latency, errors, and resource saturation.
- Alert on unavailable service, sustained failures, resource exhaustion, and failed or stale backups.
- Assign an alert recipient and link each actionable alert to a short response procedure. Confirm thresholds, intervals, log retention, and delivery channels per project.

The signal selection follows [Google SRE monitoring guidance](https://sre.google/sre-book/monitoring-distributed-systems/), retrieved 2026-10-29.

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
| Monitoring | Checks, intervals, thresholds, recipient, channel, and log retention. |
| Backup | Schedule, retention, storage isolation, encryption/access, and restore-test cadence. |
| Recovery | RPO, RTO, scenarios, recovery owner/target, and cutover procedure. |

After approval and implementation, verify a delivered alert, an isolated restore, and a timed recovery exercise. Record evidence; documentation alone is not proof of reliability.
