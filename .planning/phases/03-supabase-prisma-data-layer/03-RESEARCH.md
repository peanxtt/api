# Phase 3: Supabase + Prisma Data Layer - Research

**Researched:** 2026-04-27  
**Domain:** Prisma data layer on Cloudflare Workers with dual-domain Supabase databases  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Prisma runtime strategy uses Accelerate/Data Proxy path on Workers.
- Single shared Prisma gateway module (`src/lib/prisma.ts`) for runtime/provider wiring.
- Two domain DB configs from start (`PERSONAL_*` and `COFFEE_*` URLs).
- Two Prisma schemas + two generated clients (personal + coffee).
- Hard personal/coffee isolation in repositories/services.
- User-scoped repository contract by default (`userId` mandatory for personal domain).
- Unscoped operations only via explicit `*Admin` / `*System` methods.
- Separate migration streams per domain with mandatory rollback notes per migration.

### Deferred
- None.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Prisma runtime wiring | Infra (`src/lib/prisma.ts`) | Config/env | Keep repository code provider-agnostic |
| Schema ownership | Domain data layer | Migration tooling | Prevent cross-domain coupling |
| User-scoped access | Repository layer | Auth context | Enforce guardrails close to data access |
| Migration governance | Prisma migration streams | Docs/verification | Reduce rollout and rollback risk |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 3 should ship in two waves:
1. Runtime/data foundation (dual schema, dual client generation, env and gateway wiring).
2. Repository contract layer and migration discipline artifacts.

This order minimizes risk by locking runtime topology first, then layering user-scoped repository behavior for downstream endpoint migration phases.
</research_summary>

<standard_stack>
## Standard Stack

| Tooling | Purpose | Notes |
|---|---|---|
| `prisma` | Schema/migrations/client generation | Needed for dual schema workflows |
| `@prisma/client` | Runtime client | Domain clients generated from each schema |
| Prisma Accelerate/Data Proxy path | Workers-safe query path | Matches locked runtime decision |
| Existing `@supabase/supabase-js` | Auth/provider interactions | Stays for auth and non-Prisma provider calls |
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Gateway-owned Prisma clients
Use a single infra gateway that exposes domain-specific client accessors (personal/coffee) while hiding runtime wiring details.

### Pattern 2: Domain-local repositories
Place repositories per domain and enforce import boundaries so personal and coffee data concerns never cross.

### Pattern 3: Migration stream separation
Keep migration history and rollback notes independent per domain database to avoid coupled deploy risk.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---|---|---|
| Ad-hoc DB access in services | Raw SQL scattered across modules | Domain repositories with explicit contracts |
| Mixed-domain data helpers | Shared domain logic utilities | Neutral infra-only helpers in `src/lib/db/*` |
| Informal migration rollback | Tribal runbook memory | Mandatory rollback section per migration |
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Domain leakage
Cross-importing personal and coffee repositories creates hidden coupling and future migration pain.

### Pitfall 2: Optional user scope
Allowing optional `userId` in standard repository methods leads to accidental unscoped queries.

### Pitfall 3: Migration ambiguity
Using one migration stream across two DBs causes unclear rollback ownership and deployment blast radius.
</common_pitfalls>

<open_questions>
## Open Questions

1. Exact dual-client generation command strategy (script naming and execution order).
2. Minimal repo scaffolding surface in this phase vs. detailed feature repositories in later phases.
</open_questions>

<sources>
## Sources

- `.planning/phases/03-supabase-prisma-data-layer/03-CONTEXT.md`
- `.planning/ROADMAP.md` (Phase 3 section)
- `.planning/REQUIREMENTS.md` (`DATA-01`..`DATA-04`)
- `.planning/PROJECT.md`
- `src/lib/supabase.ts`
- `src/config/env.ts`
- `src/types/bindings.ts`
- `.planning/phases/02-auth-and-identity-guardrails/02-VERIFICATION.md`
</sources>

---

*Phase: 03-supabase-prisma-data-layer*  
*Research completed: 2026-04-27*  
*Ready for planning: yes*
