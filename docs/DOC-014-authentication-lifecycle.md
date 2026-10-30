# DOC-014 — Authentication Lifecycle

**Status:** Auth, Swagger protection/throttling, and limiter/cleanup policy accepted; implementation and tooling pending · **Updated:** 2026-10-30.
**Records:**

- [D-036 — Minimal JWT identity and server-side access state](DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state)
- [D-038 — Minimal login, refresh, and environment configuration](DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration)
- [D-039 — Swagger Basic Auth with bcrypt](DOC-003-decisions.md#d-039--swagger-basic-auth-with-bcrypt)
- [D-040 — HS256 tokens, refresh rotation, and immediate logout](DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout)
- [D-041 — In-memory demo accounts and manual grants](DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants)
- [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants)
- [D-043 — Bcrypt application password hashing](DOC-003-decisions.md#d-043--bcrypt-application-password-hashing)
- [D-044 — Public dummy login credentials](DOC-003-decisions.md#d-044--public-dummy-login-credentials)
- [D-045 — JWT configuration, validation, and key rotation](DOC-003-decisions.md#d-045--jwt-configuration-validation-and-key-rotation)
- [D-050 — Login and refresh rate limits and proxy trust](DOC-003-decisions.md#d-050--login-and-refresh-rate-limits-and-proxy-trust)
- [D-051 — Periodic in-memory state cleanup](DOC-003-decisions.md#d-051--periodic-in-memory-state-cleanup)
- [D-059 — In-memory limiter and cleanup parameters](DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters)

**Decision:** Issue HS256 access JWTs through minimal login, rotate opaque refresh tokens, and revoke both token classes on logout through server-side session state. Keep two dummy accounts and manual grants in memory. Configure JWT signing/expiry and Swagger Basic Auth through `.env`.

**Reason:** Provide a usable authentication example while keeping token policy explicit and avoiding a full account-management application.

## 1. Accepted requirements

- Minimal login issues the identity token used by protected endpoints.
- The maintainer clarified that “reset token” means refresh: obtain a new access token without repeating login.
- Signing-key and expiry configuration belongs in `.env`.
- Swagger is the initial manual client. Its packages and exact versions still require supply chain preflight and explicit approval.
- Protect Swagger using HTTP Basic Auth and a bcrypt hash in `.env`. Bcrypt is also selected for application passwords; their hashes remain in the in-memory account fixture, with separate credentials and access boundaries.
- Existing server-side permissions, UUID user IDs, validation, and JSON envelope conventions remain applicable.
- Use exactly two dummy usernames, `superadmin` and `admin`, both with public demo password `dev123`. Account data and bcrypt hashes belong to in-memory fixtures/storage, not `.env`. Start at bcrypt cost 12; actual hashes still require generation after software approval.
- Grants are edited manually in storage. No grant-management endpoint is required.

## 2. Token and account baseline

**Status:** Behavior, API schemas, dummy credentials, and bcrypt defaults accepted; implementation/tooling open.

| Topic | Agreement |
| --- | --- |
| Login | Use the two in-memory dummy accounts and bcrypt verification. Both passwords are `dev123`; only their hashes belong in the adapter/fixture. No application-account credentials come from `.env`. |
| Access token | Signed JWT with a default 15-minute TTL; retain minimal identity claims, active-session validation, and current server-side permission lookup. |
| Signing profile | HS256 for the single application, using a random secret with at least 256 bits of entropy. Fix the allowed algorithm in verifier configuration. |
| Refresh token | Opaque, cryptographically random token; store only a verifier/hash with its user/session binding and expiry in an in-memory adapter behind a contract. |
| Refresh lifetime | Seven-day session deadline from login. Rotation keeps that deadline, and newly issued access JWTs cannot outlive it. |
| Rotation | Each successful refresh issues a new access/refresh pair and consumes the previous refresh token. Retain consumed-token relationships until expiry; replay revokes the entire session, including access JWTs. No retry/grace window is provided. |
| Logout | Revoke the current login session and its refresh family. All access JWTs bound to that session fail subsequent protected checks immediately, even before `exp`. Independent login sessions remain active; all-device logout is excluded. |
| Grant updates | Edit the configured in-memory grant data directly. No management route or automatic source-file reload is added. |

The 15-minute and seven-day values are accepted project defaults, configurable through `.env`, not mandatory standard values. Refresh consumption/revocation must be atomic. Clients serialize refresh calls; replaying a consumed token can require a fresh login.

### Immediate logout and session checks

- Link tokens from one login to a server-issued session reference. Refresh rotates credentials within that same session rather than creating an unrelated active session.
- Every protected request verifies the JWT and its subject/session binding, then checks active server-side session state before authorization. Missing or revoked sessions return `401`; superadmin does not bypass this authentication check.
- Logout revokes the session and its refresh credentials. All access tokens issued for that session become unusable at the next check. Already-authorized requests cannot be retroactively cancelled.
- Coordinate logout and refresh atomically so a revoked session cannot create a fresh active branch. Use the accepted `sub`/`sid` binding in [DOC-015 — Demo API Contracts: 4. JWT/session details](DOC-015-demo-api-contracts.md#4-jwtsession-details). Cleanup follows the policy below; internal method signatures and implementation remain open.

Server-side invalidation is needed to enforce logout before a token's cryptographic expiry. [OWASP session invalidation](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#manual-session-expiration), retrieved 2026-10-30.

Refresh rotation and reuse detection follow the principles in [RFC 9700: Refresh Token Protection](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14), retrieved 2026-10-30. This local-login design does not select an OAuth server implementation.

HS256 requires a key of at least 256 bits. [RFC 7518: HMAC with SHA-2](https://www.rfc-editor.org/rfc/rfc7518.html#section-3.2), retrieved 2026-10-30.

### In-memory cleanup

**Status:** Policy, configuration, timer lifecycle, and pruning accepted; implementation pending.

- Periodically remove expired session/refresh state and rate-limit counters from API-process memory. The default interval is 60 seconds, configurable through `.env`.
- Check validity on every relevant request. Expired or revoked credentials remain unusable between cleanup runs; cleanup never grants an expiry grace period or delays logout.
- Retain consumed refresh-token relationships until the session deadline so reuse detection remains possible. Do not delete replay evidence early merely because a token was rotated.
- Remove rate-limit counters only once they can no longer affect their configured limit/window. The selected limiter algorithm must preserve this boundary.
- Keep dummy accounts and grants available; this cleanup concerns expiring runtime state. Restart behavior remains unchanged.
- Use the accepted setting, validation, timer lifecycle, and scheduling mechanism in [DOC-014 — Authentication Lifecycle: Limiter and cleanup parameters](#limiter-and-cleanup-parameters). No scheduler package, command, or runtime execution is selected by this policy.

## 3. JWT configuration

**Status:** Accepted; loader/library implementation pending.

Use these environment names and startup rules. `TTL` means **Time To Live**: the configured lifetime. `_SECONDS` makes its unit explicit. Dummy-account credentials remain in memory; Swagger settings are separate in section 5. No real key or `.env` file is created here.

```dotenv
JWT_SIGNING_KEY=<64-hex-characters-from-32-random-bytes>
JWT_ACCESS_TTL_SECONDS=900
AUTH_REFRESH_TTL_SECONDS=604800
```

- Require `JWT_SIGNING_KEY`: exactly 64 hexadecimal characters encoding 32 cryptographically random bytes. Validate its format before decoding; use the decoded bytes as the HS256 key. No fallback key is allowed.
- If a duration variable is absent, use its documented default: `JWT_ACCESS_TTL_SECONDS=900` (15 minutes), `AUTH_REFRESH_TTL_SECONDS=604800` (seven days). A supplied value must be a positive integer in seconds; empty or invalid values must not silently use a default.
- Validate configuration at startup. Missing/invalid key or invalid duration must stop startup with an error that names the setting without exposing its value.
- Access TTL applies to newly issued access JWTs, capped by the session deadline. Refresh TTL sets the session deadline from login; refresh rotation does not restart that window. Revocation can reject either token before its expiry.
- Keep the accepted `JWT_ISSUER` and `JWT_AUDIENCE` defaults in [DOC-015 — Demo API Contracts: 4. JWT/session details](DOC-015-demo-api-contracts.md#4-jwtsession-details).
- Keep `.env` and real secrets outside Git. Commit `.env.example` with placeholders and documented units.
- Rotate the signing key manually by updating configuration and restarting the application. Restart clears in-memory sessions, so users must log in again. Automatic rotation and simultaneous old/new signing keys are outside the initial implementation.
- Do not log signing keys, passwords, or tokens. Key generation and software execution still require preflight and explicit approval.

HS256 requires at least 256-bit keys; hex represents each byte with two characters. Validate hex strictly before decoding because malformed hex can be truncated. [RFC 7518: HMAC with SHA-2](https://www.rfc-editor.org/rfc/rfc7518.html#section-3.2), [Node.js Buffer encodings](https://nodejs.org/api/buffer.html#buffers-and-character-encodings), retrieved 2026-10-30. No configuration/JWT library is selected here.

## 4. HTTP and Swagger flow

Follow accepted [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md) for API routes, inputs/results, initial admin grant, access metadata, and session/Swagger defaults. The API and worker each expose an unauthenticated health endpoint under that contract.

Login and refresh skip the access-JWT requirement but still validate their own credentials. Swagger security metadata must reflect this; documenting a route does not authenticate it. Do not put live credentials or tokens in saved OpenAPI examples.

Use Swagger's Authorize control for access JWTs via `Authorization: Bearer ...`, and submit refresh tokens in the refresh endpoint's JSON body. Browser cookie/storage policy remains a later decision.

Bearer documentation is supported by [NestJS OpenAPI security](https://docs.nestjs.com/openapi/security#bearer-authentication), retrieved 2026-10-30.

Use `400` for schema failures, generic `401` for invalid credentials/tokens, and `429` for configured limits, within the existing error envelope. Generic login errors reduce account enumeration. [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages), retrieved 2026-10-30.

### Rate limiting and proxy trust

**Status:** Quotas, sliding-window mechanism, configuration, and trust policy accepted; implementation/tooling pending.

| Scope | Default limit | Period |
| --- | --- | --- |
| `POST /auth/login` | 5 requests | 60 seconds |
| `POST /auth/refresh` | 30 requests | 60 seconds |

- Count successful and failed requests in separate counters for each resolved client IP and endpoint. One endpoint's counter does not consume the other's quota.
- Configure limits and periods through `.env`, using these defaults when settings are absent. Supplied invalid values stop startup. Names, exact sliding-window counting, and validation follow [DOC-014 — Authentication Lifecycle: Limiter and cleanup parameters](#limiter-and-cleanup-parameters).
- Keep counters in the API process's memory; restart resets them. Shared counters across API instances are outside this initial policy.
- Reject requests over the limit with HTTP `429`, the standard envelope and `RATE_LIMITED` code, `Retry-After` reflecting the remaining wait in seconds, and `Cache-Control: no-store`.
- Default to no trusted proxy: derive client IP from the direct connection. Do not accept a client-supplied forwarding header as authoritative.
- When deployed behind a reverse proxy, configure the actual trusted proxies explicitly. The selected HTTP adapter must resolve forwarded client IP through that trust configuration; do not enable blanket trust or manually take an arbitrary header entry.

A reverse proxy receives client requests and forwards them to the API. For example, `client -> reverse proxy -> API`: the API's direct peer is the proxy. Without the correct trust configuration, clients behind it can share the proxy's IP-based quota. Forwarding headers such as `X-Forwarded-For` can carry the original IP, but client-supplied values are not inherently trustworthy.

Proxy behavior follows [NestJS rate limiting: Proxies](https://docs.nestjs.com/security/rate-limiting#proxies) and [Express behind proxies](https://expressjs.com/en/guide/behind-proxies/), retrieved 2026-10-30. These references do not select an HTTP adapter or proxy product. `429` and retry guidance follow [RFC 6585, section 4](https://www.rfc-editor.org/rfc/rfc6585.html#section-4), retrieved 2026-10-30; the limits and required response headers are project choices.

## 5. Swagger access protection

**Status:** Basic Auth, routes, bcrypt defaults, startup validation, and throttling accepted; implementation pending.

```dotenv
SWAGGER_USERNAME=<configured-username>
SWAGGER_PASSWORD_HASH='<bcrypt-hash>'
```

- The maintainer supplies the username and hash per environment. Examples are placeholders; no real credential, hash, or `.env` file is generated here. Never store the plaintext documentation password in configuration or Git.
- Protect `/docs`, `/docs/openapi.json`, `/docs/openapi.yaml`, and documentation-specific local bootstrap/assets routes. Cover configured aliases and prefixes; hiding the UI alone leaves schema endpoints available. [NestJS OpenAPI setup](https://docs.nestjs.com/openapi/introduction#setup-options), retrieved 2026-10-30.
- Keep this gate separate from API login, JWT validation, and permissions. Swagger credentials do not grant API access; an API token does not replace Swagger Basic Auth credentials.
- A documentation authentication failure returns `401` with the appropriate `WWW-Authenticate: Basic` challenge. Protect deployed documentation with HTTPS: Basic Auth encodes credentials using Base64, without encrypting them. A bcrypt hash at rest does not protect credentials in transit. [RFC 7617: Basic authentication](https://www.rfc-editor.org/rfc/rfc7617.html), retrieved 2026-10-30.
- Preserve the configured hash literally, including every `$`. Avoid variable expansion for this value and verify that the chosen environment parser loads it unchanged; quoting alone must not be assumed sufficient for every expander. [NestJS configuration](https://docs.nestjs.com/techniques/configuration#expandable-variables), retrieved 2026-10-30.
- Do not expose or log credentials, authorization headers, or the hash. When Swagger is enabled, missing or invalid credentials/hash must fail startup. The application demo password `dev123` does not configure this gate.
- Before Basic Auth, apply the accepted separate sliding-window quota of 60 requests per IP per 60 seconds across protected UI/schema/assets routes together. Settings and counting follow [DOC-014 — Authentication Lifecycle: Limiter and cleanup parameters](#limiter-and-cleanup-parameters); Swagger requests do not consume login/refresh quotas.

Bcrypt defaults are accepted in [DOC-015 — Demo API Contracts: 5. Swagger and credential parameters](DOC-015-demo-api-contracts.md#5-swagger-and-credential-parameters): start at cost 12, with at least 10 after deployment calibration. Reject passwords beyond 72 UTF-8 bytes rather than silently truncating. Deployment calibration and exact library/version remain open. [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#bcrypt), retrieved 2026-10-30.

## 6. Remaining decisions and verification

### Limiter and cleanup parameters

**Status:** Accepted in full; implementation pending.

**Record:** [D-059 — In-memory limiter and cleanup parameters](DOC-003-decisions.md#d-059--in-memory-limiter-and-cleanup-parameters).

**Decision:** Adopt all six parameter groups below, explicitly approved together by the maintainer. Existing login/refresh quotas, process-local state, proxy-trust baseline, immediate validity checks, and 60-second cleanup default retain their earlier approvals.

**Reason:** Resolve the remaining limiter and cleanup choices in one review, using small in-memory state and a process-owned timer. This policy defines behavior without selecting a new package or runtime version.

| Group | Accepted behavior |
| --- | --- |
| 1. Window and counting | Use an exact sliding window: track admitted-request timestamps per canonical client IP and policy scope. Prune timestamps at or before `now - window`; atomically check and reserve a slot before awaiting credential work or request validation. Count successful and failed admitted requests. Reject excess requests without adding a timestamp or extending the window. Login and refresh keep separate scopes. |
| 2. Configuration | Use the names/defaults below. Defaults apply only when absent; supplied numeric values must be positive safe integers and convertible to safe milliseconds. Reject invalid/blank values at startup without printing supplied values. Require the cleanup timer delay to fit the runtime timer range; do not clamp or silently substitute a duration. No zero-value disable switch or automatic development bypass. Configuration changes require restart. |
| 3. Timer lifecycle | Use one native, self-scheduling timer per API process. Schedule the first cleanup after bootstrap plus the configured interval; schedule the next only after the current pass finishes. Keep the timer from holding the process open by itself. On shutdown, mark it stopped and cancel the pending timer; a running synchronous in-memory pass completes without rescheduling. No cron package, scheduler service, logging-worker job, or separate cleanup process. |
| 4. Cleanup boundary | At each pass, remove expired sessions and their refresh state at the original session deadline, including retained replay evidence. Keep consumed-token relationships until that deadline, including for revoked sessions. Prune expired limiter timestamps and delete a key only when no active timestamps remain. Request-time pruning and expiry/revocation checks remain authoritative between passes. Preserve accounts and grants. |
| 5. Proxy configuration | Use optional `TRUSTED_PROXY_ADDRESSES`, defaulting to an empty list/no trust. Accept comma-separated literal IP addresses or CIDRs; reject malformed entries, boolean/hop-count shortcuts, and blanket `/0` trust. Resolve client identity through the selected HTTP adapter's trust handling, with equivalent IP forms normalized to one key. Actual proxy addresses are deployment inputs, not template guesses. |
| 6. Swagger throttling | Apply the same sliding-window mechanism before Basic Auth, using a separate shared Swagger scope of 60 admitted requests per 60 seconds per IP. Count successes/failures across all protected UI/schema/assets routes together; these requests do not consume login/refresh quotas. |

```dotenv
AUTH_LOGIN_RATE_LIMIT_MAX_REQUESTS=5
AUTH_LOGIN_RATE_LIMIT_WINDOW_SECONDS=60
AUTH_REFRESH_RATE_LIMIT_MAX_REQUESTS=30
AUTH_REFRESH_RATE_LIMIT_WINDOW_SECONDS=60
AUTH_CLEANUP_INTERVAL_SECONDS=60
SWAGGER_RATE_LIMIT_MAX_REQUESTS=60
SWAGGER_RATE_LIMIT_WINDOW_SECONDS=60
TRUSTED_PROXY_ADDRESSES=
```

- Sliding windows use a process-local monotonic time source. Session/token expiry retains its UTC deadline checks. Keep time controllable in tests without real waits.
- At admission, remove expired timestamps before checking capacity. Keep only admitted timestamps still in the window; do not retain a history of rejected attempts. Admission must not race across concurrent credential checks.
- Apply counting early enough to include matched endpoint requests that fail body validation/parsing, unsupported content type, or credentials. Main API and Swagger gates use their own scopes; public metadata does not bypass these quotas.
- For a rejected request, compute `Retry-After = max(1, ceil((oldest active timestamp + window - now) / 1000))`. Retain the accepted `429` envelope with `RATE_LIMITED` and `Cache-Control: no-store`. A rejected request does not postpone the next available slot.
- The empty proxy list is valid configuration; blank numeric settings are invalid. If no proxies are trusted, ignore forwarding headers for client identity. Configure the actual proxy path before deployment; an HTTP adapter is still unselected.
- Timer scheduling is best effort, not an expiry clock or an exact wall-clock job. Session validity and rate windows never depend on a cleanup callback firing on time. For the native timer, reject a converted cleanup delay above `2147483647` milliseconds rather than allowing the runtime to shorten it.
- Unexpected faults during the synchronous cleanup pass follow the accepted fatal-process handling; do not swallow a programming fault and claim that cleanup succeeded.

The sliding-window algorithm and Swagger quota are accepted project choices. HTTP `429` semantics do not prescribe a counting algorithm. [RFC 6585: 429 Too Many Requests](https://www.rfc-editor.org/rfc/rfc6585.txt), retrieved 2026-10-30. Native scheduling, cancellation, delay limits, and process-lifetime behavior are documented in [Node.js timers](https://nodejs.org/api/timers.html#scheduling-timers) and [Node.js timeout.unref](https://nodejs.org/api/timers.html#timeoutunref), retrieved 2026-10-30; exact runtime selection/preflight remains separate. Adapter-based proxy trust is illustrated by [Express behind proxies](https://expressjs.com/en/guide/behind-proxies/), retrieved 2026-10-30; this reference does not select Express or a proxy dependency.

During implementation, verify boundary timestamps and `Retry-After`, concurrent admissions, failed-request counting, scope/IP isolation, IPv4-mapped address normalization, Swagger UI/schema/assets grouping, startup validation, fake-clock cleanup, replay retention, timer shutdown, and ignored untrusted forwarding headers. No source, `.env`, software execution, or actual proxy configuration is created by this documentation approval.

### Remaining implementation and verification

- Implement the accepted limiter and cleanup parameters after software preflight and explicit execution approval. Actual trusted proxy addresses are deployment inputs. JWT configuration, route, transport, session/replay, Swagger protection/throttling, and the initial logging policy in [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md) are accepted; tooling and exact internal method signatures remain separate.
- Generate bcrypt fixture hashes for the approved `dev123` passwords only after software preflight and explicit execution approval. Calibrate cost before deployment. No bcrypt package or generation script is approved for execution yet.
- Choose runtime, JWT, validation, configuration, Swagger, password-verification, and testing components through the full [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md). No exact software version or artifact audit is completed by this document.
- After approval, verify login success/failure, expiry, token-type separation, rotation/reuse, logout semantics, configuration failures, secret redaction, and Swagger access. Keep test keys and fixtures separate from deployed credentials.
- Verify unauthorized Swagger UI/schema access, valid and invalid Basic credentials, preserved bcrypt hash characters, configuration failures, and independence from API JWT/permission checks.

Account, grant, and session storage are process-local. Restart clears active sessions, so both old access and refresh tokens fail the required server-state checks even when the signing key is unchanged. Reinitializing account/grant fixtures does not restore prior sessions. Swagger Basic Auth is separate from API session logout.
