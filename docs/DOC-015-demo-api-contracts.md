# DOC-015 — Demo API Contracts

**Status:** Proposed; maintainer review required · **Updated:** 2026-10-30.
**Record:** [D-042 — Minimal API contracts and initial demo grants](DOC-003-decisions.md#d-042--minimal-api-contracts-and-initial-demo-grants).

**Decision (proposed):** Expose three authentication operations and three access demonstrations, using explicit access metadata, one example permission, and the accepted JSON envelope.

**Reason:** Make the agreed authentication/authorization behavior directly testable without real domain CRUD or a grant-management API.

All names, schemas, metadata defaults, and additional session rules below are proposals. Accepted token and storage requirements remain in [DOC-014 — Authentication Lifecycle](DOC-014-authentication-lifecycle.md).

## 1. Routes and initial grants

| Method/path | Access policy | Input | Success |
| --- | --- | --- | --- |
| `POST /auth/login` | `@Public()`; handler verifies credentials | JSON `{ username, password }` | `200`, token pair |
| `POST /auth/refresh` | `@Public()`; handler verifies refresh credential | JSON `{ refreshToken }` | `200`, rotated token pair |
| `POST /auth/logout` | `@Authenticated()` | Valid access JWT; no body | `200`, `{ "loggedOut": true }` |
| `GET /examples/public` | `@Public()` | None | `200`, `{ "access": "granted" }` |
| `GET /examples/admin` | `@RequirePermissions('examples:read')` | Valid access JWT | `200`, `{ "access": "granted" }` |
| `GET /examples/superadmin` | `@SuperadminOnly()` | Valid access JWT | `200`, `{ "access": "granted" }` |

The Success column shows `data` only; every API JSON response uses [DOC-012 — HTTP Boundary Conventions: 4. Response envelope](DOC-012-http-conventions.md#4-response-envelope). Proposed messages are `Signed in`, `Token refreshed`, `Logged out`, and `Access granted`.

These are local decorator proposals, not claims that Nest provides each decorator. Protected requests require valid JWT/session authentication before permission or privileged-role decisions. Refresh does not require an unexpired access JWT, but still requires its own valid credential.

| Dummy account label | Role | Initial explicit grants |
| --- | --- | --- |
| `superadmin` | `superadmin` | `[]`; permission checks use the accepted privileged-role bypass. |
| `admin` | `admin` | `["examples:read"]`. |

Define the single example key in `examples.permissions.ts`. Public access needs no grant. To demonstrate denial, manually remove the admin grant in storage; no update endpoint or additional runtime account is needed. Permission keys like `article:update` remain examples of the naming pattern, not required CRUD features.

The account labels are proposed usernames. Exact passwords/hashes and fixture IDs remain open; no credential is invented or generated here. Application credentials stay in memory, while Swagger credentials stay in `.env`.

## 2. Input and token result schemas

| Field | Proposed validation |
| --- | --- |
| `username` | Required non-empty string, at most 64 UTF-8 bytes; preserve case and whitespace rather than silently normalizing credentials. |
| `password` | Required non-empty string, at most 72 UTF-8 bytes for the chosen bcrypt profile; do not trim or transform. |
| `refreshToken` | Required non-empty string, at most 512 ASCII characters; exact opaque encoding follows the generator contract. |

Accept JSON for login/refresh and reject extra body/query fields with `400`. No route above accepts query fields or path parameters. Bodyless routes allow an absent body or `{}` only; reject other values or supplied fields. Unsupported content types for request bodies use `415`; no sensitive input value is echoed in an error.

Login and refresh return the following proposed `data` shape. Tokens are placeholders, not generated credentials:

```json
{
  "accessToken": "<access-jwt>",
  "refreshToken": "<opaque-refresh-token>",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

`expiresIn` is the actual access-token lifetime in seconds, reflecting configured TTL and any session-deadline cap. Token responses use `Cache-Control: no-store`. Do not return password hashes, signing keys, or a grant snapshot. API requests use `Authorization: Bearer ...`; refresh credentials are submitted in the JSON body.

Use generic `401`/`UNAUTHENTICATED` responses for invalid credentials, JWTs, refresh tokens, or session state; use `403`/`FORBIDDEN` for authenticated callers without access. Validation uses `400`/`VALIDATION_ERROR`; unexpected failures use a safe `500`/`INTERNAL_ERROR`. Rate-limit thresholds and implementation remain open.

Bcrypt commonly limits input to 72 bytes. The selected implementation must preserve this proposed contract without silently truncating input. [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#bcrypt), retrieved 2026-10-30.

## 3. Access metadata defaults

Propose exactly one access policy on each API handler:

- `@Public()` permits anonymous calls while preserving input validation and handler-specific credential checks.
- `@Authenticated()` requires a valid JWT and active session, without a resource permission. Logout revokes only that authenticated session; callers cannot supply an arbitrary user/session target.
- `@RequirePermissions(...)` requires a non-empty list and every listed permission. An empty list is invalid policy. Superadmin bypass applies to valid declared permission checks after authentication.
- `@SuperadminOnly()` checks the current server-side role; adding an ordinary grant cannot open it to admin.

Missing or conflicting metadata fails closed, including for superadmin. Missing/invalid authentication returns `401`; an authenticated caller facing an unclassified/conflicting policy receives `403`. Public access is recognized only when it is the single valid declared policy. Avoid controller-wide public defaults in this initial template. OR matching, wildcards, and role hierarchies are not introduced.

## 4. JWT/session details to approve

| Claim/header | Proposed value/meaning |
| --- | --- |
| Header `alg`, `typ` | `HS256`, `JWT`; verifier allows the configured signing profile only. |
| `sub` | User UUID v4 from the account store. |
| `sid` | Fresh server-issued session UUID v4; checked against stored session ownership/status. |
| `iss` | Expected issuer from proposed `JWT_ISSUER`, default `nest-layered-template`. |
| `aud` | Expected audience from proposed `JWT_AUDIENCE`, default `nest-layered-template-api`. |
| `iat`, `exp` | NumericDate seconds; `exp` is no later than configured access TTL or the session deadline. |

JWT time claims use NumericDate seconds. `sid` is this template's proposed session-reference claim; it does not declare an OpenID Connect implementation. [RFC 7519: JWT claims](https://www.rfc-editor.org/rfc/rfc7519.html#section-4), retrieved 2026-10-30.

Further proposals to close remaining lifecycle choices:

- Allow independent login sessions. Logout of one session does not terminate another; all-device logout remains excluded.
- Give each session the original seven-day refresh deadline. Cap newly issued access-token expiry at that deadline; rotation extends neither deadline nor session identity.
- On refresh-token replay, revoke the entire affected session, immediately rejecting both its refresh credentials and already-issued access JWTs. This extends the accepted refresh-family invalidation rule and still requires approval.
- Use strict single-use refresh rotation without a retry/grace window. Clients serialize refresh calls; retrying a consumed token can require a fresh login. Server-side consumption/revocation is atomic.
- Logout requires a currently valid access JWT. If it has expired, a client can refresh first and then logout. Repeating logout with a revoked JWT returns `401`.

## 5. Swagger and credential parameters

Propose `/docs` for Swagger UI and `/docs/openapi.json` / `/docs/openapi.yaml` for definitions, all behind the accepted Basic Auth gate. Do not expose unprotected default schema aliases. Keep API JWT authorization separate from the documentation gate.

Bcrypt is selected for application and Swagger passwords. Propose cost 12 for both as a starting point, with at least 10 and a performance check before fixing deployment parameters. No hash generation or package execution is authorized by this proposal. Keep application hashes in memory fixtures and the Swagger hash in `.env`.

When Swagger is enabled, propose failing startup on missing or invalid documentation credentials/hash rather than opening documentation anonymously. Verify exact bcrypt hash loading, including `$` characters.

Still open: actual dummy passwords/hashes, final hashing/configuration parameters, request-ID format, rate-limit thresholds/proxy policy, exact service/store method signatures, and software versions. After contract review, complete the full [DOC-005 — Global Software Supply Chain Security Policy](DOC-005-supply-chain-security.md) before selecting/installing/executing supporting software.
