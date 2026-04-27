# Personal Migration Policy

## Stream Ownership

- Migration folder: `prisma/personal/migrations/`
- Schema source: `prisma/personal/schema.prisma`
- Runtime URL: `PERSONAL_DATABASE_URL`
- Direct URL: `PERSONAL_DIRECT_URL`

## Required Rollback Section (for every migration)

Every migration entry must include:

1. Risk level: `low`, `medium`, or `high`
2. Rollback steps:
- Exact command(s)
- Any manual SQL needed
3. Data-loss warning:
- Explicitly state if rollback may drop or mutate data
4. Verification checklist:
- Read/write smoke checks
- Critical query checks
- Error log checks

## Deployment Rule

- Personal migrations are executed independently from coffee migrations.
- A failed personal migration does not permit auto-running coffee migrations in the same release window.
