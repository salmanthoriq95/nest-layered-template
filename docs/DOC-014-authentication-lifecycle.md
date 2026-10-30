# DOC-014 — Authentication Lifecycle

**Status:** Login, refresh, environment configuration, and Swagger protection accepted; detailed token baseline proposed · **Updated:** 2026-10-30.
**Records:**

- [D-036 — Minimal JWT identity and server-side access state](DOC-003-decisions.md#d-036--minimal-jwt-identity-and-server-side-access-state)
- [D-038 — Minimal login, refresh, and environment configuration](DOC-003-decisions.md#d-038--minimal-login-refresh-and-environment-configuration)
- [D-039 — Swagger Basic Auth with bcrypt](DOC-003-decisions.md#d-039--swagger-basic-auth-with-bcrypt)

**Decision:** Issue tokens through minimal login, support refresh, and configure signing/expiry through `.env`. Use Swagger for initial testing, protected by HTTP Basic Auth with a bcrypt password hash from `.env`.

**Reason:** Provide a usable authentication example while keeping token policy explicit and avoiding a full account-management application.

## 1. Accepted requirements

- Minimal login issues the identity token used by protected endpoints.
- The maintainer clarified that “reset token” means refresh: obtain a new access token without repeating login.
- Signing-key and expiry configuration belongs in `.env`.
- Swagger is the initial manual client. Its packages and exact versions still require supply chain preflight and explicit approval.
- Protect Swagger using HTTP Basic Auth. Store the documentation password as a bcrypt hash in `.env`; verify the submitted password against that hash. This does not select the application users' password-hashing algorithm.
- Existing server-side permissions, UUID user IDs, validation, and JSON envelope conventions remain applicable.

## 2. Proposed baseline

**Status:** Proposed; obtain maintainer approval before implementation.

| Topic | Proposal |
| --- | --- |
| Login | Username/password checked against in-memory example accounts. Store password hashes; choose the hashing algorithm, fixtures, and verifier through a separate decision/preflight. |
| Access token | Signed JWT, 15-minute lifetime; retain minimal identity claims and current server-side permission lookup. |
| Signing profile | HS256 for the single application, using a random secret with at least 256 bits of entropy. Fix the allowed algorithm in verifier configuration. |
| Refresh token | Opaque, cryptographically random token; store only a verifier/hash with its user/session binding and expiry in an in-memory adapter behind a contract. |
| Refresh lifetime | Seven-day refresh window from login. Rotated tokens inherit that deadline rather than extending it indefinitely. This is a refresh deadline, not an immediate access-token revocation mechanism. |
| Rotation | Each successful refresh issues a new access/refresh pair and consumes the previous refresh token. Retain consumed-token relationships until expiry so reuse can revoke the affected refresh family. |
| Swagger transport | Send access JWTs through `Authorization: Bearer ...` using Authorize. Submit refresh tokens in the refresh endpoint's JSON body. Browser cookie/storage policy is a later decision. |
| Logout | Add a current-session logout operation that invalidates its refresh family. Under this minimal proposal, issued access tokens remain valid until expiry; immediate invalidation would require an additional session/revocation check. |
| Login protection | Validate credentials/input, use generic authentication failures, and limit login/refresh attempts. Thresholds and tooling remain open. |

The 15-minute and seven-day values are proposed project defaults, not mandatory standard values. Concurrent refresh consumption must be atomic; the baseline treats reuse as invalid. Client retry and concurrent-session policies still need agreement.

Refresh rotation and reuse detection follow the principles in [RFC 9700: Refresh Token Protection](https://www.rfc-editor.org/rfc/rfc9700.html#section-4.14), retrieved 2026-10-30. This is a local-login design proposal, not a selection of an OAuth server implementation.

HS256 requires a key of at least 256 bits. [RFC 7518: HMAC with SHA-2](https://www.rfc-editor.org/rfc/rfc7518.html#section-3.2), retrieved 2026-10-30.

## 3. Proposed configuration

Names and default values below remain proposed. No `.env` file or real key is created by this document.

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

| Operation | Proposed contract |
| --- | --- |
| Login | `POST /auth/login` with validated credentials; return tokens within the accepted success envelope. |
| Refresh | `POST /auth/refresh` with the current refresh token; return the rotated pair. A still-valid access JWT is not required. |
| Logout | `POST /auth/logout`; exact credential binding and response data remain open. This operation is proposed, not yet part of accepted scope. |

Login and refresh skip the access-JWT requirement but still validate their own credentials. Swagger security metadata must reflect this; documenting a route does not authenticate it. Do not put live credentials or tokens in saved OpenAPI examples.

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

- Approve or revise the baseline: lifetimes, refresh format/rotation, signing profile, transport, logout, and login protection.
- Agree example accounts, password hashing, session-count policy, key encoding/rotation, expiry behavior, and exact input/result schemas.
- Agree the Swagger route set, username/hash configuration validation, bcrypt parameters, and error/startup handling. Bcrypt is selected for the Swagger password only; no bcrypt package or generation script is approved for execution yet.
- Choose runtime, JWT, validation, configuration, Swagger, password-verification, and testing components through the full [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md). No exact software version or artifact audit is completed by this document.
- After approval, verify login success/failure, expiry, token-type separation, rotation/reuse, logout semantics, configuration failures, secret redaction, and Swagger access. Keep test keys and fixtures separate from deployed credentials.
- Verify unauthorized Swagger UI/schema access, valid and invalid Basic credentials, preserved bcrypt hash characters, configuration failures, and independence from API JWT/permission checks.

In-memory refresh state disappears on restart and is process-local. This prevents later refreshes from using cleared state; it does not by itself revoke already-issued access JWTs.
