# API Hub: Personal + Coffee Domains

## What This Is

This project is a unified Hono backend running on Cloudflare Workers for three products: personal management system, personal website, and coffee wiki. Personal management and personal website share the same domain APIs under `personal`, while coffee wiki stays isolated under `coffee`. The backend uses strict TypeScript, Supabase auth/data, Prisma ORM, and OpenAPI/Swagger-first contracts.

## Core Value

One deployable API platform that keeps shared personal APIs reusable while preserving hard domain boundaries for coffee wiki.

## Requirements

### Validated

- [x] Namespaced API shape already exists with `/api/v1/personal/*` and `/api/v1/coffee/*` in current routes.
- [x] Phase 1 contract foundation completed (route ownership, envelope normalization, validation details) - Phase 1 (2026-04-27).
- [x] Phase 2 auth guardrails completed (`AUTH-01`..`AUTH-04`) including local JWT verification, identity context, auth endpoints, and login throttling - Phase 2 (2026-04-27).
- [x] Phase 3 data-layer foundation completed (`DATA-01`..`DATA-04`) with dual-domain Prisma schemas, shared gateway contract, scoped repository rules, and migration rollback governance - Phase 3 (2026-04-27).

### Active

- [ ] Migrate personal management APIs from legacy/backend spec into this Hono codebase with compatibility guarantees.
- [ ] Keep coffee wiki endpoints isolated (routing, schema, service boundaries, and docs).
- [ ] Establish strict TypeScript + schema validation + typed responses for every endpoint.
- [ ] Deliver complete OpenAPI spec and Swagger UI for all versioned endpoints.
- [ ] Add rollout guardrails (tests, observability, feature flags, and migration fallback).

### Out of Scope

- Building a separate standalone service for coffee wiki right now - unnecessary operational overhead for current scale.
- Introducing GraphQL in v1 - REST + OpenAPI matches existing clients and migration goals.
- Breaking response envelope conventions during migration - would cause frontend regressions.

## Context

- Existing API app is Hono + TypeScript on Cloudflare Workers.
- Current modules: `personal-site`, `invoice-generator`, `coffee-wiki`.
- Migration source-of-truth is `personal-apis.md` with endpoint inventory, DTOs, and behavior rules.
- Supabase is used for auth and database access across products.
- Target architecture should support shared personal domain (`personal management` + `personal site`) and isolated coffee domain.

## Constraints

- **Runtime**: Cloudflare Workers - edge-safe libraries only.
- **Stack**: Strict TypeScript only - no `any` in domain/service/request contracts.
- **Data**: Supabase for auth/data and Prisma ORM for DB layer consistency.
- **Compatibility**: Existing personal app behavior and envelope must not regress during migration.
- **Versioning**: Route version locked to `/api/v1/*`; breaking changes require `/api/v2`.
- **Documentation**: OpenAPI and Swagger UI must ship with code changes, not as a later phase.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use route namespaces `/api/v1/personal/*` and `/api/v1/coffee/*` | Shared personal APIs need one stable surface; coffee needs separation | GOOD |
| Keep one codebase, enforce domain isolation by module boundaries | Faster delivery and lower ops overhead while preserving separation in code | GOOD |
| Contract-first via Zod + OpenAPI | Prevent drift between implementation and docs | PENDING |
| Keep standardized response envelope | Simplifies frontend adapters and migration safety | GOOD |
| Add migration compatibility layer where needed | Avoid frontend breakage during endpoint cutover | PENDING |
| Verify Supabase access tokens locally and inject trusted request identity | Enforce auth at middleware layer and prevent payload-based identity spoofing | GOOD |
| Use separate personal and coffee Prisma schema/client/migration streams | Preserve hard domain boundaries while sharing one deployable API runtime | GOOD |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone**:
1. Full review of all sections
2. Core Value check - still the right priority?
3. Audit Out of Scope - reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-27 after Phase 3 completion*
