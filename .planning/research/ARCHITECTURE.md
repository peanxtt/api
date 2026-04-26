# Architecture Research

## Boundary Model

- **API Layer**: Hono app and route groups (`personal`, `coffee`).
- **Domain Layer**: Module services per bounded context.
- **Data Layer**: Repositories with Prisma client and user-scoping rules.
- **Cross-cutting Layer**: Auth, error mapping, response helpers, logging, OpenAPI registration.

## Route Topology

- `/api/v1/personal/*` for shared personal management + personal website APIs.
- `/api/v1/coffee/*` for coffee wiki-only APIs.
- `/api/v1/health` for platform health.
- `/api/docs` for Swagger UI (or alternative fixed internal docs route).

## Data Flow

1. Request enters middleware chain (logger -> CORS -> auth as needed -> validator).
2. Validated request reaches route handler.
3. Handler delegates to domain service.
4. Service calls repository methods.
5. Repository executes Prisma/Supabase operations.
6. Service returns typed result.
7. Response helper wraps into standard envelope.

## Build Order Implications

1. Contract + middleware base first.
2. Auth identity context second.
3. Data layer abstraction third.
4. Domain migrations next (personal then coffee).
5. Docs, tests, and rollout gates last.
