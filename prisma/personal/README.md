# Personal Prisma Stream

Personal domain uses its own schema, generated client, and migration stream.

## Generate Client

```bash
npm run prisma:generate:personal
```

## Run Migration

```bash
npm run prisma:migrate:personal
```

## URL Usage

- Runtime/pooled path: `PERSONAL_DATABASE_URL`
- Direct migration path: `PERSONAL_DIRECT_URL`

## Rollback Notes (required per migration)

Each migration must include:
- Risk level (low/medium/high)
- Rollback steps/command
- Data-loss warning (if any)
- Post-rollback verification checklist
