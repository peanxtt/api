# Phase 4 Verification Checklist

## Users

- [ ] `PATCH /api/v1/personal/users/me` requires auth.
- [ ] `PATCH /users/me` rejects missing payload fields and accepts partial allowlisted updates only.
- [ ] Profile update never accepts/uses request payload `userId`.

## Settings

- [ ] `GET /api/v1/personal/settings` returns user-scoped settings or `null`.
- [ ] `PUT /settings` performs idempotent upsert for authenticated user.
- [ ] `DELETE /settings` performs reset-to-default semantics and returns `{ deleted: true }`.

## Clients

- [ ] `GET /api/v1/personal/clients` defaults to active-only records.
- [ ] `GET /clients?includeInactive=true` includes inactive (archived) records.
- [ ] `PATCH /clients/:id/archive` sets `active=false`.
- [ ] `PATCH /clients/:id/activate` sets `active=true`.
- [ ] `DELETE /clients/:id` is user-scoped and returns `{ deleted: true }`.

## Boundaries and Quality

- [ ] Personal clients/settings/users routes are mounted under `/api/v1/personal/*` only.
- [ ] Coffee domain code has no dependency on personal endpoint services.
- [ ] `tsc --noEmit` passes.
- [ ] `eslint . --ext .ts` passes.

