# Phase 4 Context - Personal Core Migration I

Date: 2026-04-28
Phase: 4
Status: Discussed, ready for planning

## Scope

Migrate personal core endpoints with compatibility-preserving behavior:

- `/api/v1/personal/users/me`
- `/api/v1/personal/clients`
- `/api/v1/personal/settings`

Requirements mapped:

- PERS-01
- PERS-02
- PERS-03

## Key Decisions

1. `users/me` read and update use authenticated user context only.
2. `users/me` update is partial, with strict allowlist validation.
3. `clients` archive semantics use soft-archive (`isArchived=true`) with re-activate endpoint/flow.
4. `clients` list defaults to active-only records; archived are included via explicit filter.
5. `settings` writes use idempotent upsert keyed by authenticated user id.
6. `settings` delete/reset uses explicit reset-to-default behavior, not hard delete.
7. Compatibility adapter is required for legacy shape transitions (boolean/number and naming drift).
8. Personal domain remains isolated from coffee domain repositories and services.

## Data and Environment Notes

1. Personal and coffee data stay on separate Prisma schema configs.
2. Personal DB URL and Direct URL may exist for legacy personal management system support.
3. Coffee wiki will use a separate Supabase database; no cross-domain model coupling in this phase.

## Quality and Safety Expectations

1. Preserve existing frontend compatibility where payload shapes previously drifted.
2. Enforce request-scoped user ownership for all personal resources.
3. Keep migration reversible at API behavior layer (feature-safe rollout and fallback strategy in plan).

