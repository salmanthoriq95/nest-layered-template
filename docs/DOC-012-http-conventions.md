# DOC-012 — HTTP Boundary Conventions

**Status:** Accepted; Express/Zod and typed application errors selected, exact artifacts/wiring pending · **Updated:** 2026-10-30.
**Records:**

- [D-032 — HTTP input validation and XSS boundaries](DOC-003-decisions.md#d-032--http-input-validation-and-xss-boundaries)
- [D-033 — Uniform JSON response envelope](DOC-003-decisions.md#d-033--uniform-json-response-envelope)
- [D-034 — HTTP status standards and response examples](DOC-003-decisions.md#d-034--http-status-standards-and-response-examples)
- [D-064 — Zod validation direction](DOC-003-decisions.md#d-064--zod-validation-direction)
- [D-070 — Initial scaffold configuration](DOC-003-decisions.md#d-070--initial-scaffold-configuration)

**Decision:** Validate consumed request bodies, query strings, and path parameters before service logic. Give JSON success and error responses a consistent envelope and meaningful HTTP status.

**Reason:** Keep untrusted input outside application logic and make client handling and debugging predictable.

## 1. Validation requirements

- Validate runtime input, including `POST`/`PUT`/`PATCH` bodies and `GET` query/path parameters. TypeScript annotations alone are insufficient.
- Define field types, required/optional fields, formats, allowed values, lengths/ranges, and nested constraints where relevant. Do not pass raw request objects into services.
- Keep HTTP validation schemas/DTOs in the owning feature's `dto/` location when a route actually accepts input. They are distinct from framework-independent service contracts.
- Validation and normalization apply only to actual route inputs; no unused write endpoints, schemas, or domain models are required for the access demo.

Use Zod through a shared Nest pipe, preserving the accepted field policy and safe validation-error envelope. Use strict object schemas where extra fields must be rejected. Exact artifacts, pipe implementation, and Swagger mapping remain pending. The earlier built-in `ValidationPipe` option is not selected. [DOC-018 — Integration Alternatives: 4. Validator alternatives](DOC-018-integration-alternatives.md#4-validator-alternatives).

## 2. Input policy

**Status:** Accepted.

- Use an explicit field allowlist and reject unexpected body/query fields instead of silently dropping them.
- Parse query/path strings explicitly into their declared types; reject malformed values rather than applying permissive or lossy conversion. Reject repeated values unless the field explicitly accepts an array.
- Normalize only as the field contract allows, before validation: for example, trim surrounding whitespace on a search term. Do not globally trim credentials or alter punctuation, casing, or Unicode.
- Reject invalid input with `400` and safe field errors. Reserve `422` for a separately agreed semantic/domain rejection; see [DOC-013 — HTTP Status and Response Examples](DOC-013-http-response-examples.md).
- Use one shared validation policy at the HTTP boundary, plus field-specific rules. Exact request-size and field limits follow the endpoint contract.

OWASP recommends allowlist validation and warns that indiscriminate character removal can change meaning without preventing injection. [OWASP input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), retrieved 2026-10-29.

## 3. XSS boundary

Validation does not make arbitrary text safe in every rendering context. JSON responses use `application/json`; browser consumers must encode text for its destination context and avoid interpreting untrusted text as HTML. If a future contract deliberately accepts HTML, it needs a reviewed HTML sanitizer and explicit rules. A generic strip-tags regex is insufficient. [OWASP XSS prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html), retrieved 2026-10-29.

The initial demo has no rich-HTML feature. No sanitizer library is selected or needed solely for JSON access messages.

## 4. Response envelope

**Status:** Accepted. The maintainer approved this expanded envelope after declining the minimal `data`/`error` option.

Success example:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Access granted",
  "data": { "access": "granted" },
  "error": null,
  "meta": {
    "requestId": "3f996c7f-5ee1-43eb-9f34-9fc92476a810",
    "timestamp": "2026-10-29T03:00:00.000Z"
  }
}
```

Validation-failure example; the field is illustrative, not an agreed endpoint input:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Request validation failed",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "field": "query.example", "code": "INVALID_TYPE", "message": "Must be a string" }
    ]
  },
  "meta": {
    "requestId": "3f996c7f-5ee1-43eb-9f34-9fc92476a810",
    "timestamp": "2026-10-29T03:00:00.000Z"
  }
}
```

| Field | Meaning |
| --- | --- |
| `success` | `true` for a successful operation; `false` for a client/server error. |
| `statusCode` | Matches the actual HTTP status; errors must not travel as `200`. |
| `message` | Short human-readable summary. Clients branch on status and stable error codes. |
| `data` | Operation result, or `null` for an error. Its schema belongs to the endpoint contract. |
| `error` | `null` on success; otherwise `{ code, details }`. `details` is an array, empty when no safe field details apply. |
| `meta.requestId` | Server-generated UUID v4, shared with logs under [DOC-016 — Logging Conventions](DOC-016-logging-conventions.md). |
| `meta.timestamp` | Response creation time as a UTC ISO 8601 string. |

Do not expose stack traces, vendor payloads, credentials, or rejected input values in errors. Messages and field names in examples are illustrative. Request IDs and timestamps are sample values, not fixed runtime output. Pagination metadata is deferred until a consuming application needs collections.

## 5. HTTP wiring

**Status:** Accepted design; software execution still requires preflight and explicit approval.

- Keep shared HTTP-only validation, envelope types, response mapping, and error handling under `src/http/`. Feature-specific DTOs remain with the feature.
- Wrap successful results once at the HTTP boundary, using an interceptor; map failures through a shared exception filter. Services return contract-defined results without the HTTP envelope.
- Use the selected Express adapter. Translate application-owned typed service errors to the accepted statuses and safe envelopes in the HTTP boundary; keep Nest HTTP exceptions out of service contracts. Unexpected exceptions retain existing fault handling and logging.
- Ensure application-handled parser/validation failures, guard denials, missing routes, and unexpected failures use the same error envelope. Assign request metadata early enough for these paths.
- Preserve relevant protocol headers, including authentication challenges, allowed methods, and retry guidance. Avoid direct response writes that bypass shared response mapping.
- HTTP tests must use the same boundary configuration as the running application. Check actual statuses, envelope shape, field validation, safe error messages, and request metadata.

Nest documents response mapping through interceptors and error handling through exception filters. [NestJS interceptors](https://docs.nestjs.com/interceptors), [NestJS exception filters](https://docs.nestjs.com/exception-filters), retrieved 2026-10-29.

## 6. HTTP status rules

**Status:** Accepted; route and token contracts specified in DOC-015.

Use the actual operation result to choose the status, not the HTTP verb alone. A `POST` is not automatically resource creation. For the demo, use `200` for granted access, `401` for missing/invalid authentication on protected routes, and `403` for authenticated identities without access. JWT identity and current server-side grants follow [DOC-004 — Conventions: 4. Authorization](DOC-004-conventions.md#4-authorization); accepted routes, token results, and session claims are in [DOC-015 — Demo API Contracts](DOC-015-demo-api-contracts.md).

Envelope rules apply to JSON response bodies. `204`, `304`, and responses to `HEAD` must not carry a body; do not append an envelope. If a successful operation needs an enveloped result, choose an appropriate body-bearing status. [RFC 9110: HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-15), retrieved 2026-10-29.

Common codes, required headers, and an example for each are in [DOC-013 — HTTP Status and Response Examples](DOC-013-http-response-examples.md). That reference alone does not add application features. Login/refresh rate limits and required `429` headers are separately accepted in [DOC-014 — Authentication Lifecycle: Rate limiting and proxy trust](DOC-014-authentication-lifecycle.md#rate-limiting-and-proxy-trust).
