# Coffee Prisma Stream

Coffee domain uses a separate schema, generated client, and migration stream.

## Generate Client

```bash
npm run prisma:generate:coffee
```

## Run Migration

```bash
npm run prisma:migrate:coffee
```

## URL Usage

- Runtime/pooled path: `COFFEE_DATABASE_URL`
- Direct migration path: `COFFEE_DIRECT_URL`

## Rollback Notes (required per migration)

Each migration must include:
- Risk level (low/medium/high)
- Rollback steps/command
- Data-loss warning (if any)
- Post-rollback verification checklist
