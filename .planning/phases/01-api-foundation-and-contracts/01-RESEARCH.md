# Phase 1: API Foundation and Contracts - Research

**Researched:** 2026-04-26
**Domain:** Hono API contract foundation on Cloudflare Workers
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Enforce strict domain routers with separate ownership for `/api/v1/personal/*` and `/api/v1/coffee/*`.
- Prohibit cross-domain service imports between personal and coffee modules.
- Migrate now to the spec error shape: `{ success: false, error: string, code: string, details?: object }`.
- Replace current nested error payload shape instead of delaying through compatibility mapping.
- Return structured validation details via `details.fieldErrors` for request validation failures.
- Standardize validation code mapping to `BAD_REQUEST` with predictable details payload.
- Apply middleware primarily at namespace groups (`/personal`, `/coffee`) with explicit route-level exceptions where needed.
- Keep only truly global concerns at app level (request logging and global error boundary).
- Use one source of truth per endpoint: Zod schema + typed handler + OpenAPI registration from the same contract definitions.
- Avoid manual OpenAPI drift by deriving API docs from typed route contracts.

### the agent's Discretion
- Internal helper naming.
- Internal folder naming as long as domain boundaries are strict.

### Deferred Ideas (OUT OF SCOPE)
- None.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Route namespace ownership and mounting | API/Backend | -- | Route composition is backend framework responsibility |
| Error/validation envelope normalization | API/Backend | -- | Contract serialization is backend response-layer concern |
| Middleware policy and ordering | API/Backend | -- | Cross-cutting request handling belongs in API runtime |
| OpenAPI contract generation | API/Backend | Frontend Server | Backend defines source-of-truth contracts consumed by clients |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 1 should harden the contract surface before endpoint migration work begins. The current code already uses Hono modular routers and shared response helpers, which is a solid base, but envelope shape and validation detail currently diverge from `personal-apis.md`.

The strongest approach is a two-step implementation sequence: first route/middleware boundary hardening, then shared contract helper standardization (response, error handling, validation format) with a lightweight OpenAPI registration scaffold.

**Primary recommendation:** Execute Phase 1 as two plans: topology first, contract primitives second.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| hono | 4.10.x | API routing and middleware | Native fit for Workers runtime |
| zod | 3.25.x | Runtime schema validation + inference | Single source for runtime + TypeScript types |
| @hono/zod-validator | 0.7.x | Request validation integration | Canonical Zod validator integration for Hono |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @hono/swagger-ui | latest | Serve Swagger UI route | Use when publishing API docs route |
| @hono/zod-openapi | latest | OpenAPI generation from schemas | Use when wiring docs from runtime contracts |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod-driven contracts | Manual OpenAPI JSON | Faster initial setup but high drift risk |
| Namespace middleware groups | Route-by-route middleware | More verbose and easier to miss protections |

**Installation:**
```bash
pnpm add @hono/swagger-ui @hono/zod-openapi
```
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### System Architecture Diagram

`Request` -> `App Global Middleware` -> `Version Router (/api/v1)` -> `Domain Router (/personal|/coffee)` -> `Route Validator` -> `Domain Handler` -> `Response/Error Helpers` -> `Client`

### Recommended Project Structure
```txt
src/
  app.ts                    # route ownership + middleware composition
  lib/
    response.ts             # success/error envelope primitives
    validation.ts           # validator wrappers with fieldErrors mapping
  middleware/
    error-handler.ts        # centralized status/code mapping
  modules/
    personal/
      routes.ts             # personal namespace root routes
    coffee/
      routes.ts             # coffee namespace root routes
```

### Pattern 1: Namespace-First Router Composition
**What:** Mount domain routers by namespace prefix, not mixed root registration.
**When to use:** Shared multi-domain API services.

### Pattern 2: Contract Primitive Layer
**What:** One response/error helper layer consumed by every route.
**When to use:** Any migration requiring strict shape compatibility.

### Anti-Patterns to Avoid
- Maintaining two competing error envelope formats.
- Allowing modules to register routes directly on `/api/v1` without namespace grouping.
- Returning flattened validation message strings only.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Request schema checking | Custom request parsing logic | Zod + `@hono/zod-validator` | Prevents type/runtime divergence |
| API docs synchronization | Manual YAML maintenance | Zod/OpenAPI generation pipeline | Reduces contract drift |
| Route boundary enforcement | Team convention only | Explicit router/module boundaries | Prevents accidental cross-domain leakage |

**Key insight:** Phase 1 quality is mostly about removing ambiguity; explicit boundaries and shared helpers outperform implicit conventions.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Envelope Drift During Migration
**What goes wrong:** Different routes return different error/success shapes.
**Why it happens:** Gradual migration without a shared helper contract.
**How to avoid:** Normalize `response.ts` and `error-handler.ts` first, then apply to routes.
**Warning signs:** Frontend adapters begin branching on route-specific response shapes.

### Pitfall 2: Namespace Leakage
**What goes wrong:** Coffee or personal routes import each other directly.
**Why it happens:** Shared utility growth without import boundaries.
**How to avoid:** Keep domain services isolated and share only neutral libraries (`lib/*`, middleware).
**Warning signs:** Cross-domain imports appear in route/service files.

### Pitfall 3: Weak Validation Detail
**What goes wrong:** Clients get generic "validation failed" messages only.
**Why it happens:** Flattened string errors replace field-level data.
**How to avoid:** Emit `details.fieldErrors` payload from validator wrappers.
**Warning signs:** UI cannot map server validation errors back to specific fields.
</common_pitfalls>

<open_questions>
## Open Questions

1. **OpenAPI tooling package selection**
   - What we know: project wants OpenAPI derived from runtime contracts.
   - What's unclear: whether to adopt `@hono/zod-openapi` in Phase 1 or Phase 8.
   - Recommendation: add foundational OpenAPI scaffold in Phase 1, full coverage in Phase 8.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/phases/01-api-foundation-and-contracts/01-CONTEXT.md` - locked decisions and scope.
- `personal-apis.md` - target response and validation semantics.
- `src/app.ts`, `src/lib/response.ts`, `src/lib/validation.ts`, `src/middleware/error-handler.ts` - current implementation baseline.
- `package.json` - installed stack constraints.

### Secondary (MEDIUM confidence)
- `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md` - phase success criteria and requirement IDs.
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Hono route/middleware composition
- Ecosystem: Zod contract handling and OpenAPI bridge tooling
- Patterns: namespace boundaries, shared envelope primitives
- Pitfalls: drift, leakage, weak validation detail

**Confidence breakdown:**
- Standard stack: HIGH - already present in project dependency tree
- Architecture: HIGH - directly derived from current code and locked decisions
- Pitfalls: HIGH - visible gaps from current contract shape vs migration spec
- Code examples: MEDIUM - implementation pattern level, not copy/paste library docs

**Research date:** 2026-04-26
**Valid until:** 2026-05-26
</metadata>

---

*Phase: 01-api-foundation-and-contracts*
*Research completed: 2026-04-26*
*Ready for planning: yes*
