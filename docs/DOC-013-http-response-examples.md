# DOC-013 — HTTP Status and Response Examples

**Status:** Accepted reference and response conventions; endpoint-specific schemas open · **Updated:** 2026-10-29.
**Record:** [D-034 — HTTP status standards and response examples](DOC-003-decisions.md#d-034--http-status-standards-and-response-examples).

**Decision:** Document common API statuses with usage and response examples, preserving standard HTTP semantics.

**Reason:** Make status selection and client behavior consistent without requiring every status or feature in the initial template.

Examples use the accepted envelope in [DOC-012 — HTTP Boundary Conventions: 4. Response envelope](DOC-012-http-conventions.md#4-response-envelope). They are illustrative payloads, not existing endpoints. Sample resource/operation IDs do not add CRUD or jobs to the demo. Envelope fields, machine error codes, and status mappings are accepted; exact endpoint schemas remain open.

JSON responses use `Content-Type: application/json`. Examples below show bodies; real responses must also include the headers noted for their status. Request IDs and timestamps are placeholders. Read only the status section needed.

## Status selection

Semantics follow [RFC 9110: HTTP Semantics, section 15](https://www.rfc-editor.org/rfc/rfc9110.html#section-15); `429` follows [RFC 6585, section 4](https://www.rfc-editor.org/rfc/rfc6585.html#section-4). Retrieved 2026-10-29. The `400` versus `422` validation split is an accepted project choice.

| Status | Use |
| --- | --- |
| [200 OK](#200--ok) | Operation completed with a response body. |
| [201 Created](#201--created) | Resource created. |
| [202 Accepted](#202--accepted) | Processing accepted; completion is pending. |
| [204 No Content](#204--no-content) | Operation succeeded without a body. |
| [400 Bad Request](#400--bad-request) | Malformed request; schema-validation default. |
| [401 Unauthorized](#401--unauthorized) | Authentication is missing or invalid. |
| [403 Forbidden](#403--forbidden) | Authenticated caller lacks permission. |
| [404 Not Found](#404--not-found) | Route or resource not found. |
| [405 Method Not Allowed](#405--method-not-allowed) | Method unsupported for an existing resource. |
| [409 Conflict](#409--conflict) | Request conflicts with current resource state. |
| [413 Content Too Large](#413--content-too-large) | Request content exceeds accepted limits. |
| [415 Unsupported Media Type](#415--unsupported-media-type) | Request content format is unsupported. |
| [422 Unprocessable Content](#422--unprocessable-content) | Validly formed content cannot be processed. |
| [429 Too Many Requests](#429--too-many-requests) | Caller exceeds a request rate limit. |
| [500 Internal Server Error](#500--internal-server-error) | Unexpected server failure. |
| [502 Bad Gateway](#502--bad-gateway) | Gateway receives an invalid upstream response. |
| [503 Service Unavailable](#503--service-unavailable) | Service is temporarily unavailable. |
| [504 Gateway Timeout](#504--gateway-timeout) | Gateway times out awaiting an upstream response. |

## 200 — OK

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Access granted",
  "data": {"access":"granted"},
  "error": null,
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 201 — Created

Identify the new resource with `Location` when available. Resource creation is outside the initial demo.

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Resource created",
  "data": {"id":"example-resource"},
  "error": null,
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 202 — Accepted

Use only for genuinely accepted asynchronous work. No queue/job feature is selected.

```json
{
  "success": true,
  "statusCode": 202,
  "message": "Processing accepted",
  "data": {"id":"example-operation","state":"pending"},
  "error": null,
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 204 — No Content

No envelope or JSON body. Prefer `200` when returning an operation result.

```http
HTTP/1.1 204 No Content
```

The response ends after its headers; there is no body.

## 400 — Bad Request

The `400` policy covers body/query/path validation. Example field rules are illustrative.

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Request validation failed",
  "data": null,
  "error": {"code":"VALIDATION_ERROR","details":[{"field":"query.example","code":"INVALID_TYPE","message":"Must be a string"}]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 401 — Unauthorized

A real response must include `WWW-Authenticate` for the selected authentication scheme; that scheme is not selected yet.

```json
{
  "success": false,
  "statusCode": 401,
  "message": "Authentication required",
  "data": null,
  "error": {"code":"UNAUTHENTICATED","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 403 — Forbidden

```json
{
  "success": false,
  "statusCode": 403,
  "message": "Access denied",
  "data": null,
  "error": {"code":"FORBIDDEN","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 404 — Not Found

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Not found",
  "data": null,
  "error": {"code":"NOT_FOUND","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 405 — Method Not Allowed

Include `Allow` with the supported methods. `Allow: GET` is an illustrative header, not an agreed route contract.

```json
{
  "success": false,
  "statusCode": 405,
  "message": "Method not allowed",
  "data": null,
  "error": {"code":"METHOD_NOT_ALLOWED","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 409 — Conflict

```json
{
  "success": false,
  "statusCode": 409,
  "message": "Request conflicts with current state",
  "data": null,
  "error": {"code":"CONFLICT","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 413 — Content Too Large

```json
{
  "success": false,
  "statusCode": 413,
  "message": "Request content too large",
  "data": null,
  "error": {"code":"CONTENT_TOO_LARGE","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 415 — Unsupported Media Type

```json
{
  "success": false,
  "statusCode": 415,
  "message": "Unsupported request content type",
  "data": null,
  "error": {"code":"UNSUPPORTED_MEDIA_TYPE","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 422 — Unprocessable Content

Reserved for an agreed semantic/domain failure; ordinary request-schema failures use `400`.

```json
{
  "success": false,
  "statusCode": 422,
  "message": "Request violates an operation rule",
  "data": null,
  "error": {"code":"UNPROCESSABLE_CONTENT","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 429 — Too Many Requests

May include `Retry-After`, e.g. `Retry-After: 60`, when a retry delay is known. No limiter is implemented by this reference.

```json
{
  "success": false,
  "statusCode": 429,
  "message": "Too many requests",
  "data": null,
  "error": {"code":"RATE_LIMITED","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 500 — Internal Server Error

```json
{
  "success": false,
  "statusCode": 500,
  "message": "An unexpected error occurred",
  "data": null,
  "error": {"code":"INTERNAL_ERROR","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 502 — Bad Gateway

Not a generic code for provider business rejections. External integrations remain deferred.

```json
{
  "success": false,
  "statusCode": 502,
  "message": "Invalid upstream response",
  "data": null,
  "error": {"code":"BAD_GATEWAY","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 503 — Service Unavailable

May include `Retry-After` when a retry delay is known.

```json
{
  "success": false,
  "statusCode": 503,
  "message": "Service temporarily unavailable",
  "data": null,
  "error": {"code":"SERVICE_UNAVAILABLE","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```

## 504 — Gateway Timeout

Use only when acting as a gateway/proxy to an upstream service.

```json
{
  "success": false,
  "statusCode": 504,
  "message": "Upstream response timed out",
  "data": null,
  "error": {"code":"GATEWAY_TIMEOUT","details":[]},
  "meta": { "requestId": "req_example_001", "timestamp": "2026-10-29T03:00:00.000Z" }
}
```
