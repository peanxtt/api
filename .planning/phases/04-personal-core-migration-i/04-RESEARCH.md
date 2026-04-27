# Phase 4: Personal Core Migration I - Research

**Researched:** 2026-04-28  
**Domain:** Personal core endpoint migration (`users/me`, `clients`, `settings`)  
**Confidence:** HIGH

<user_constraints>
## User Constraints (from discussion and context)

### Locked Decisions
- `users/me` is strictly authenticated-user scoped.
- `users/me` update behavior is partial update with strict allowlist validation.
- `clients` archive behavior is soft archive/activate (active flag semantics).
- `clients` list defaults to active-only and exposes explicit include-inactive filter.
- `settings` uses per-user upsert semantics.
- `settings` delete action resets to defaults (domain-safe reset) instead of raw hard delete.
- Compatibility adapter is required for legacy payload shape transitions.
- Personal domain remains isolated from coffee domain.

### Data Topology Notes
- Personal and coffee databases remain split with separate schema/configs.
- This phase uses personal-domain data paths only.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|---|---|---|---|
| Identity scoping (`users/me`) | Route + service | Auth middleware context | Prevent cross-user override and payload-forged identity |
| Client lifecycle semantics | Service + repository | Route validation | Keep archive/activate rules centralized |
| Settings defaults/upsert | Service + repository | Compatibility adapter | Preserve existing frontend behavior while normalizing writes |
| Legacy field compatibility | Adapter layer | Schemas/serializers | Isolate migration drift from domain logic |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 4 should execute in two waves:
1. Ship user-profile and settings flows first to lock authenticated identity and default-reset behavior.
2. Implement clients CRUD/archive/activate and apply compatibility normalization for response/request shapes.

This ordering reduces risk because identity and settings behavior are foundational for personal app UX, while client flows can be layered after shared compatibility primitives are in place.
</research_summary>

<standard_stack>
## Standard Stack

| Tooling | Purpose | Notes |
|---|---|---|
| Hono routes + middleware | Endpoint composition | Reuse existing auth guard and response envelope |
| Zod validation | Request safety | Enforce partial/full payload constraints |
| Prisma personal client | Persistence layer | User-scoped queries required for all personal entities |
| Shared response helpers | Contract stability | Maintain API envelope compatibility |
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### Pattern 1: Authenticated identity as source of truth
Do not accept `userId` from request payload for profile/settings/clients ownership.

### Pattern 2: Service-owned business transitions
Archive/activate/reset semantics live in service/repository methods, not ad-hoc route logic.

### Pattern 3: Compatibility adapter boundary
Normalize shape differences (boolean/number/naming drift) in a dedicated adapter to avoid scattered conditional mapping.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead |
|---|---|---|
| Endpoint-level DB access | Querying Prisma in routes | Repository/service abstraction with user scope |
| Ad-hoc compatibility fixes | Per-endpoint custom transforms | Shared compatibility adapter helpers |
| Destructive settings deletion | Direct row deletion in route | Reset-to-default operation in service |
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: Inconsistent active/archive semantics
Mixing `active` and `archived` semantics without a clear adapter can regress frontend filtering behavior.

### Pitfall 2: Partial update overreach
Unrestricted patch payloads can accidentally modify non-migration-safe fields.

### Pitfall 3: Settings reset data loss
Hard delete without deterministic default reconstruction can break app assumptions.
</common_pitfalls>

<open_questions>
## Open Questions

1. For `users/me`, whether profile fields are persisted in auth metadata only or mirrored in personal DB (resolve during execute against current model availability).
2. Exact compatibility map keys required by current frontend payload contracts (confirm while wiring validators/adapters).
</open_questions>

<sources>
## Sources

- `.planning/phases/04-personal-core-migration-i/04-CONTEXT.md`
- `.planning/phases/04-personal-core-migration-i/04-DISCUSSION-LOG.md`
- `.planning/ROADMAP.md` (Phase 4 section)
- `.planning/REQUIREMENTS.md` (`PERS-01..PERS-03`)
- `PERSONAL-API.md` (users/clients/settings endpoint semantics)
- `src/app.ts`
- `src/modules/personal/routes.ts`
- `src/middleware/auth.ts`
- `src/lib/response.ts`
- `prisma/personal/schema.prisma` (`clients`, `settings` models)
</sources>

---

*Phase: 04-personal-core-migration-i*  
*Research completed: 2026-04-28*  
*Ready for planning: yes*

