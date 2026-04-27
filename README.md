# personal-api-hub

Unified API backend for personal systems and coffee wiki, built on Hono + TypeScript for Cloudflare Workers.

## System Summary

This project provides one deployable API platform with strict domain boundaries:
- Personal domain APIs under `/api/v1/personal/*`
- Coffee domain APIs under `/api/v1/coffee/*`

Core design goals:
- Shared platform primitives (validation, response envelope, middleware)
- Strong auth/identity guardrails
- Domain isolation to prevent cross-domain leakage
- Contract-driven implementation for predictable migrations

## Current Architecture

- Runtime: Cloudflare Workers
- Framework: Hono
- Validation: Zod
- Auth/data provider: Supabase
- Data-layer direction: dual-domain Prisma foundation (personal + coffee)

## Repository Layout (High Level)

```txt
src/
  app.ts
  config/
  lib/
  middleware/
  modules/
    personal/
    coffee/
prisma/
  personal/
  coffee/
.planning/
  ROADMAP.md
  REQUIREMENTS.md
  STATE.md
```

## Development Workflow

1. Discuss phase goals and lock decisions.
2. Plan phase tasks/waves.
3. Execute phase plans.
4. Verify and transition to the next phase.

Primary quality checks:
- Type safety (`tsc --noEmit`)
- Linting (`eslint`)
- Phase-level verification artifacts in `.planning/phases/*`

## Security Note

Do not commit secrets, tokens, database URLs, or credential values to git.
Keep sensitive runtime configuration in local/deployment secret stores only.

For local private setup guidance, use project-internal setup docs and local env files that are gitignored.
