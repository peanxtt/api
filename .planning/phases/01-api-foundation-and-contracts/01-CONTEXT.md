# Phase 1: API Foundation and Contracts - Context

**Gathered:** 2026-04-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish the contract foundation for all v1 APIs: route ownership, error envelope, validation error shape, middleware layering, and typed contract strategy. This phase sets standards only; full endpoint migration is handled in later phases.

</domain>

<decisions>
## Implementation Decisions

### Route Ownership
- **D-01:** Enforce strict domain routers with separate ownership for `/api/v1/personal/*` and `/api/v1/coffee/*`.
- **D-02:** Prohibit cross-domain service imports between personal and coffee modules.

### Error Envelope Shape
- **D-03:** Migrate now to the spec error shape: `{ success: false, error: string, code: string, details?: object }`.
- **D-04:** Replace current nested error payload shape instead of delaying through compatibility mapping.

### Validation Error Detail
- **D-05:** Return structured validation details via `details.fieldErrors` for request validation failures.
- **D-06:** Standardize validation code mapping to `BAD_REQUEST` with predictable details payload.

### Middleware Strategy
- **D-07:** Apply middleware primarily at namespace groups (`/personal`, `/coffee`) with explicit route-level exceptions where needed.
- **D-08:** Keep only truly global concerns at app level (for example request logging and global error boundary).

### Type Contract Strategy
- **D-09:** Use one source of truth per endpoint: Zod schema + typed handler + OpenAPI registration from the same contract definitions.
- **D-10:** Avoid manual OpenAPI drift by deriving API docs from typed route contracts.

### the agent's Discretion
- Exact helper naming (`createApiError`, `validationFailure`, etc.) as long as contract shape and semantics remain fixed.
- Internal module folder naming if ownership boundaries remain strict.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope and Requirements
- `.planning/ROADMAP.md` - Phase 1 goal, success criteria, and dependencies.
- `.planning/REQUIREMENTS.md` - PLAT-01 through PLAT-05 requirements and traceability.
- `.planning/PROJECT.md` - project constraints, core value, and fixed architecture direction.

### Migration and API Contract Source
- `personal-apis.md` - response envelope conventions, error mapping targets, and endpoint behavior baseline.

### Current Contract Baseline in Code
- `src/app.ts` - current route mounting and middleware order baseline.
- `src/lib/response.ts` - existing success/error helpers to be evolved.
- `src/lib/validation.ts` - current validator response behavior to be standardized.
- `src/middleware/error-handler.ts` - current error mapping strategy to align with spec.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/response.ts`: reusable JSON response wrappers already centralized.
- `src/lib/validation.ts`: reusable Zod validator wrappers for `json`, `param`, and `query`.
- `src/middleware/error-handler.ts`: global not-found and unhandled error boundary pattern in place.
- `src/middleware/auth.ts`: reusable auth guard scaffold for protected namespaces.

### Established Patterns
- Hono modular route registration with `apiV1.route(...)` is already established.
- Middleware is currently split between app-level and path-level registration.
- Zod schema validation is already in use and can be upgraded to richer error detail output.

### Integration Points
- `src/app.ts` is the integration pivot for enforcing namespace ownership and grouped middleware.
- Route modules under `src/modules/*/routes.ts` are integration points for contract refactor into explicit domain groups.
- Response and validation helpers in `src/lib/*` are integration points for envelope normalization.

</code_context>

<specifics>
## Specific Ideas

- Keep routing easy to reason about: top-level version, second-level domain, then resource path.
- Contract stability is prioritized over short-term convenience to prevent migration regressions.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 01-api-foundation-and-contracts*
*Context gathered: 2026-04-26*
