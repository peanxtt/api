# Phase 3: Supabase + Prisma Data Layer - Context

**Gathered:** 2026-04-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the data-layer foundation for personal and coffee domains using Prisma with Cloudflare-safe runtime strategy, user-scoped repository contracts, and migration discipline that supports safe rollout and rollback.

</domain>

<decisions>
## Implementation Decisions

### Prisma Runtime Strategy
- **D-01:** Use Prisma Accelerate/Data Proxy path for Workers runtime compatibility.
- **D-02:** Use a single shared Prisma gateway module (`src/lib/prisma.ts`) so repositories do not handle provider/runtime wiring directly.
- **D-03:** Use two Prisma schemas and two generated clients (personal + coffee), not one shared schema.

### Database Topology
- **D-04:** Keep two domain database configurations from the start:
  - `PERSONAL_DATABASE_URL`, `PERSONAL_DIRECT_URL`
  - `COFFEE_DATABASE_URL`, `COFFEE_DIRECT_URL`
- **D-05:** Runtime queries use pooled/accelerate-style URLs; direct URLs are reserved for migrations and operational workflows.

### Domain Ownership Boundaries
- **D-06:** Enforce hard isolation between personal and coffee repositories/services (no cross-domain imports).
- **D-07:** Shared DB helpers are allowed only in neutral infra layer (`src/lib/db/*`), never via cross-domain repository reuse.

### User-Scoped Repository Contract
- **D-08:** Personal repositories must require `userId` by default for reads/writes.
- **D-09:** Unscoped operations are allowed only via explicitly named admin/system methods (for example `*Admin`, `*System`), never as optional userId behavior.

### Migration and Rollback Discipline
- **D-10:** Keep separate migration streams per domain:
  - `prisma/personal/migrations/*`
  - `prisma/coffee/migrations/*`
- **D-11:** Every migration must include rollback notes: risk level, rollback steps/command, data-loss warning, and verification checklist.

### the agent's Discretion
- Exact file/folder naming under each domain's repository layer as long as boundary and scoping rules remain strict.
- Internal helper naming for gateway, adapters, and repository base utilities.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Scope and Constraints
- `.planning/ROADMAP.md` - Phase 3 goal, success criteria, and dependency notes.
- `.planning/REQUIREMENTS.md` - `DATA-01` through `DATA-04` plus auth-driven scoping expectations carried from Phase 2.
- `.planning/PROJECT.md` - stack constraints, architecture direction, and domain isolation principles.
- `.planning/STATE.md` - current workflow position and prior phase completion context.

### Prior Locked Decisions (Must Carry Forward)
- `.planning/phases/01-api-foundation-and-contracts/01-CONTEXT.md` - namespace ownership, shared response/validation standards.
- `.planning/phases/02-auth-and-identity-guardrails/02-CONTEXT.md` - trusted identity context (`userId`, `email`) and authorization semantics.
- `.planning/phases/02-auth-and-identity-guardrails/02-VERIFICATION.md` - verified behavior baseline for auth/scoping expectations.

### Migration Contract Reference
- `PERSONAL-API.md` - migration behavior baseline and error semantics used by downstream endpoint phases.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/supabase.ts` - existing provider client factory and environment parsing pattern.
- `src/config/env.ts` - central env validation pattern to extend for dual-domain DB configuration.
- `src/types/bindings.ts` - typed runtime binding model for required env vars.
- `src/modules/personal-auth/service.ts` - established service-layer pattern for provider interaction isolation.

### Established Patterns
- Domain route ownership is already strict (`/api/v1/personal/*` and `/api/v1/coffee/*`) and should mirror data-layer boundaries.
- Middleware-driven identity context (`userId`, `email`) is already in place and should be consumed by user-scoped repositories.
- Shared helpers are centralized under `src/lib/*`; domain code is organized under `src/modules/*`.

### Integration Points
- New Prisma gateway in `src/lib/` should be consumed by domain repository layers, not route handlers.
- Personal domain repositories should integrate with auth-derived `userId` context for default scoping.
- Future phases (4-7) will depend on this phase's repository contracts and migration discipline.

</code_context>

<specifics>
## Specific Ideas

- Coffee wiki is planned to use a separate Supabase database from personal management.
- Env strategy should explicitly support both pooled runtime URLs and direct migration URLs per domain from day one.

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 03-supabase-prisma-data-layer*
*Context gathered: 2026-04-27*
