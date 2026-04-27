# Phase 2: Auth and Identity Guardrails - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Implement authenticated and user-scoped access semantics for protected APIs, including reliable token verification and explicit `401` vs `403` behavior. Add `/personal/auth/login`, `/personal/auth/logout`, and `/personal/auth/me` endpoints aligned with migration requirements.

</domain>

<decisions>
## Implementation Decisions

### Token Verification Strategy
- **D-01:** Verify bearer JWT locally in middleware using `SUPABASE_JWT_SECRET`.
- **D-02:** Do not call Supabase Auth on every request for token verification in this phase.

### Auth Context in Request
- **D-03:** Store `userId` and `email` in request context after token verification.
- **D-04:** Keep claims extensible, but only `userId` and `email` are required outputs in Phase 2.

### Unauthorized vs Forbidden Rules
- **D-05:** Enforce strict split: missing/invalid token returns `401 UNAUTHORIZED`.
- **D-06:** Cross-user access attempts return `403 FORBIDDEN`.

### Auth Endpoint Design
- **D-07:** Implement backend auth endpoints under `/api/v1/personal/auth/*`:
  - `POST /login`
  - `POST /logout`
  - `GET /me`
- **D-08:** Endpoints should wrap Supabase auth flows in backend-owned contract shape.

### Login Rate Limiting
- **D-09:** Add app-level login rate limiting now using `5 attempts / 15 minutes / IP`.
- **D-10:** Keep implementation lightweight and compatible with Workers runtime.

### the agent's Discretion
- Exact token payload parsing helper and context key naming conventions.
- Internal rate-limit store mechanism as long as behavior contract is preserved.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope and Requirements
- `.planning/ROADMAP.md` - Phase 2 goal and success criteria.
- `.planning/REQUIREMENTS.md` - `AUTH-01` through `AUTH-04`.
- `.planning/PROJECT.md` - stack constraints and architecture boundaries.

### Migration Contract
- `personal-apis.md` - auth endpoint behavior expectations and error mapping guidance.

### Existing Auth Baseline
- `src/middleware/auth.ts` - current bearer extraction scaffold.
- `src/lib/supabase.ts` - Supabase client construction and auth options.
- `src/types/bindings.ts` - request context variables model.
- `src/lib/response.ts` - standardized envelope helpers used by auth endpoints.
- `src/middleware/error-handler.ts` - code mapping for `UNAUTHORIZED` and `FORBIDDEN` responses.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/middleware/auth.ts` already parses bearer header and stores token in request context.
- `src/lib/supabase.ts` can create anon/service-role clients and inject access token headers.
- `src/lib/response.ts` already provides standardized success/error helpers.

### Established Patterns
- Domain namespace routing is now explicit (`/api/v1/personal/*`, `/api/v1/coffee/*`).
- Validation and error responses already use standardized `code` + optional `details` shape.
- Middleware-first request guard pattern is already in place and should be extended, not replaced.

### Integration Points
- `src/types/bindings.ts` must evolve to include verified user identity fields.
- Personal domain route modules should host new `/personal/auth/*` endpoints.
- Auth middleware should provide identity context for later repository-level user scoping.

</code_context>

<specifics>
## Specific Ideas

- Keep auth behavior explicit and predictable for frontend migration: token invalidity and authorization failures should never be conflated.
- Prioritize lightweight runtime-safe token verification compatible with Cloudflare Workers.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 02-auth-and-identity-guardrails*
*Context gathered: 2026-04-27*
