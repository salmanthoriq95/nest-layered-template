# DOC-014 — Authentication Lifecycle

**Status:** Token profile, refresh rotation, immediate logout, demo accounts, and Swagger protection accepted; remaining proposals labeled · **Updated:** 2026-10-30.
**Records:**

- [D-036 — Minimal JWT identity and server-side access state](DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state)
- [D-038 — Minimal login, refresh, and environment configuration](DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration)
- [D-039 — Swagger Basic Auth with bcrypt](DOC-003-decisions.md#d-039--swagger-basic-auth-with-bcrypt)
- [D-040 — HS256 tokens, refresh rotation, and immediate logout](DOC-003-decisions.md#d-040--hs256-tokens-refresh-rotation-and-immediate-logout)
- [D-041 — In-memory demo accounts and manual grants](DOC-003-decisions.md#d-041--in-memory-demo-accounts-and-manual-grants)
- [D-043 — Bcrypt application password hashing](DOC-003-decisions.md#d-043--bcrypt-application-password-hashing)

**Decision:** Issue HS256 access JWTs through minimal login, rotate opaque refresh tokens, and revoke both token classes on logout through server-side session state. Keep two dummy accounts and manual grants in memory. Configure JWT signing/expiry and Swagger Basic Auth through `.env`.

**Reason:** Provide a usable authentication example while keeping token policy explicit and avoiding a full account-management application.

## 1. Accepted requirements

- Minimal login issues the identity token used by protected endpoints.
- The maintainer clarified that “reset token” means refresh: obtain a new access token without repeating login.
- Signing-key and expiry configuration belongs in `.env`.
- Swagger is the initial manual client. Its packages and exact versions still require supply chain preflight and explicit approval.
- Protect Swagger using HTTP Basic Auth and a bcrypt hash in `.env`. Bcrypt is also selected for application passwords; their hashes remain in the in-memory account fixture, with separate credentials and access boundaries.
- Existing server-side permissions, UUID user IDs, validation, and JSON envelope conventions remain applicable.
- Exactly two dummy accounts are required: one superadmin and one admin. Account data and bcrypt password hashes belong to in-memory fixtures/storage, not `.env`; credential values and hashing parameters remain open.
- Grants are edited manually in storage. No grant-management endpoint is required.

## 2. Token and account baseline

**Status:** Behavior accepted; exact schemas, credentials, and tooling remain open.

| Topic | Agreement |
| --- | --- |
| Login | Use the two in-memory dummy accounts and bcrypt verification. Hashes remain in that adapter/fixture; no account credentials come from `.env`. Hash parameters and credential values still need agreement. |
| Access token | Signed JWT with a default 15-minute TTL; retain minimal identity claims, active-session validation, and current server-side permission lookup. |
| Signing profile | HS256 for the single application, using a random secret with at least 256 bits of entropy. Fix the allowed algorithm in verifier configuration. |
| Refresh token | Opaque, cryptographically random token; store only a verifier/hash with its user/session binding and expiry in an in-memory adapter behind a contract. |
| Refresh lifetime | Seven-day refresh window from login. Rotated tokens inherit that deadline rather than extending it indefinitely. This is a refresh deadline, not an immediate access-token revocation mechanism. |
| Rotation | Each successful refresh issues a new access/refresh pair and consumes the previous refresh token. Retain consumed-token relationships until expiry so reuse can revoke the affected refresh family. |
| Logout | Revoke the current login session and its refresh family. All access JWTs bound to that session fail subsequent protected checks immediately, even before `exp`. Other-session/all-device behavior is not selected. |
| Grant updates | Edit the configured in-memory grant data directly. No management route or automatic source-file reload is added. |

The 15-minute and seven-day values are accepted project defaults, configurable through `.env`, not mandatory standard values. Concurrent refresh consumption must be atomic. Client retry/concurrent-session policy and additional effects on existing access tokens after refresh-token replay still need agreement.

### Immediate logout and session checks

- Link tokens from one login to a server-issued session reference. Refresh rotates credentials within that same session rather than creating an unrelated active session.
- Every protected request verifies the JWT and its subject/session binding, then checks active server-side session state before authorization. Missing or revoked sessions return `401`; superadmin does not bypass this authentication check.
- Logout revokes the session and its refresh credentials. All access tokens issued for that session become unusable at the next check. Already-authorized requests cannot be retroactively cancelled.
- Coordinate logout and refresh atomically so a revoked session cannot create a fresh active branch. Exact claim names, contract methods, and state-retention rules remain open.

Server-side invalidation is needed to enforce logout before a token's cryptographic expiry. [OWASP session invalidation](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#manual-session-expiration), retrieved 2026-10-30.

Refresh rotation and reuse detection follow the principles in [RFC 9700: Refresh Token Protection](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14), retrieved 2026-10-30. This is a local-login design proposal, not a selection of an OAuth server implementation.

HS256 requires a key of at least 256 bits. [RFC 7518: HMAC with SHA-2](https://www.rfc-editor.org/rfc/rfc7518.html#section-3.2), retrieved 2026-10-30.

## 3. Proposed configuration

The setting names and loader policy below remain proposed; default durations and `.env` as their source are accepted. No real key or `.env` file is created here. Dummy-account credentials remain in memory; the Swagger gate has separate environment settings in section 5.

```dotenv
JWT_SIGNING_KEY=<required-random-secret>
JWT_ACCESS_TTL_SECONDS=900
AUTH_REFRESH_TTL_SECONDS=604800
```

- Use explicit seconds for durations; parse and validate environment strings at startup. Fail on missing/invalid signing configuration or non-positive durations.
- Keep `.env` and real secrets outside Git. Commit `.env.example` with placeholders and documented units.
- Define key encoding, expected issuer/audience, and rotation behavior before implementing signing. Do not provide a fallback signing key or log keys, passwords, or tokens.

Nest documents environment-based authentication configuration and startup validation. [NestJS authentication](https://docs.nestjs.com/security/authentication), retrieved 2026-10-30. No configuration library is selected here.

## 4. Proposed HTTP and Swagger flow

Review [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md) for the six proposed routes, inputs/results, initial admin grant, access metadata, and remaining session/configuration defaults. These details are not accepted yet; the lifecycle requirements above remain approved.

Login and refresh skip the access-JWT requirement but still validate their own credentials. Swagger security metadata must reflect this; documenting a route does not authenticate it. Do not put live credentials or tokens in saved OpenAPI examples.

Transport proposal: use Swagger's Authorize control for access JWTs via `Authorization: Bearer ...`, and submit refresh tokens in the refresh endpoint's JSON body. This transport detail still requires approval; browser cookie/storage policy remains a later decision.

Bearer documentation is supported by [NestJS OpenAPI security](https://docs.nestjs.com/openapi/security#bearer-authentication), retrieved 2026-10-30.

Use `400` for schema failures, generic `401` for invalid credentials/tokens, and `429` for configured limits, within the existing error envelope. Generic login errors reduce account enumeration. [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#authentication-and-error-messages), retrieved 2026-10-30.

## 5. Swagger access protection

**Status:** HTTP Basic Auth and bcrypt hash configuration accepted; implementation parameters open.

```dotenv
SWAGGER_USERNAME=<configured-username>
SWAGGER_PASSWORD_HASH='<bcrypt-hash>'
```

- The maintainer supplies the username and hash per environment. Examples are placeholders; no real credential, hash, or `.env` file is generated here. Never store the plaintext documentation password in configuration or Git.
- Protect the enabled Swagger UI, OpenAPI JSON/YAML definitions, and documentation-specific local bootstrap/assets routes. Cover configured aliases and prefixes; hiding the UI alone leaves schema endpoints available. [NestJS OpenAPI setup](https://docs.nestjs.com/openapi/introduction#setup-options), retrieved 2026-10-30.
- Keep this gate separate from API login, JWT validation, and permissions. Swagger credentials do not grant API access; an API token does not replace Swagger Basic Auth credentials.
- A documentation authentication failure returns `401` with the appropriate `WWW-Authenticate: Basic` challenge. Protect deployed documentation with HTTPS: Basic Auth encodes credentials using Base64, without encrypting them. A bcrypt hash at rest does not protect credentials in transit. [RFC 7617: Basic authentication](https://www.rfc-editor.org/rfc/rfc7617.html), retrieved 2026-10-30.
- Preserve the configured hash literally, including every `$`. Avoid variable expansion for this value and verify that the chosen environment parser loads it unchanged; quoting alone must not be assumed sufficient for every expander. [NestJS configuration](https://docs.nestjs.com/techniques/configuration#expandable-variables), retrieved 2026-10-30.
- Do not expose or log credentials, authorization headers, or the hash. Missing or invalid Swagger credentials must not leave enabled documentation accessible anonymously; exact startup handling remains to be agreed.

Proposed bcrypt parameters: reject inputs beyond the chosen implementation's byte limit rather than silently truncating, and use a work factor of at least 10, calibrated on the target environment. Bcrypt commonly limits input to 72 bytes. Exact cost, accepted encoding/input bounds, throttling, and library/version remain open. [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#bcrypt), retrieved 2026-10-30.

## 6. Remaining decisions and verification

- Agree the remaining transport and login/refresh-throttling proposal; durations, HS256, opaque refresh rotation, immediate logout, and the two memory-only accounts are already accepted.
- Review [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md) for proposed routes, grants, metadata rules, transport, JWT/session claims, replay behavior, and Swagger defaults. Actual fixture passwords/hashes still need approval and generation after preflight.
- Agree bcrypt parameters, configuration validation, and startup/error handling for application and Swagger credentials. No bcrypt package or generation script is approved for execution yet.
- Choose runtime, JWT, validation, configuration, Swagger, password-verification, and testing components through the full [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md). No exact software version or artifact audit is completed by this document.
- After approval, verify login success/failure, expiry, token-type separation, rotation/reuse, logout semantics, configuration failures, secret redaction, and Swagger access. Keep test keys and fixtures separate from deployed credentials.
- Verify unauthorized Swagger UI/schema access, valid and invalid Basic credentials, preserved bcrypt hash characters, configuration failures, and independence from API JWT/permission checks.

Account, grant, and session storage are process-local. Restart clears active sessions, so both old access and refresh tokens fail the required server-state checks even when the signing key is unchanged. Reinitializing account/grant fixtures does not restore prior sessions. Swagger Basic Auth is separate from API session logout.
