# Stack Research

## Recommended Core

- Runtime: Cloudflare Workers
- Framework: Hono
- Language: TypeScript (`strict: true`)
- Validation: Zod (+ `@hono/zod-validator`)
- API Contract: OpenAPI + Swagger UI
- Data/Auth: Supabase
- ORM: Prisma (Workers-compatible strategy)
- Testing: Vitest + integration test harness for Hono app

## Why This Stack Fits

- Hono keeps route-level composition clean for domain separation.
- Zod provides runtime validation and static type inference.
- OpenAPI generation prevents contract drift between frontend/backend.
- Supabase auth integrates naturally with bearer-token verification.
- Prisma gives consistent model/query patterns across personal and coffee domains.

## Key Stack Rules

1. No untyped request payloads.
2. No raw SQL in handlers; use repository/data layer.
3. No endpoint without OpenAPI metadata.
4. No mixed domain modules (`personal` and `coffee` logic in same service).
