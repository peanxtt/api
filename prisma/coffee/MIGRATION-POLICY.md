# Coffee Migration Policy

## Stream Ownership

- Migration folder: `prisma/coffee/migrations/`
- Schema source: `prisma/coffee/schema.prisma`
- Runtime URL: `COFFEE_DATABASE_URL`
- Direct URL: `COFFEE_DIRECT_URL`

## Required Rollback Section (for every migration)

Every migration entry must include:

1. Risk level: `low`, `medium`, or `high`
2. Rollback steps:
- Exact command(s)
- Any manual SQL needed
3. Data-loss warning:
- Explicitly state if rollback may drop or mutate data
4. Verification checklist:
- Core coffee endpoint smoke checks
- Schema/index checks
- Error log checks

## Deployment Rule

- Coffee migrations are executed independently from personal migrations.
- A failed coffee migration does not permit auto-running personal migrations in the same release window.
