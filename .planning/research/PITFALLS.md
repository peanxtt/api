# Pitfalls Research

## Pitfall 1: Domain Leakage

- Warning signs: coffee routes importing personal services directly; mixed schema files.
- Prevention: enforce module ownership; lint/check import boundaries.
- Phase coverage: 1, 7.

## Pitfall 2: Contract Drift

- Warning signs: endpoint behavior differs from docs; manual Swagger edits.
- Prevention: generate OpenAPI from runtime schemas and CI-check.
- Phase coverage: 1, 8, 9.

## Pitfall 3: Auth Scope Bugs

- Warning signs: handlers accept user id in body; cross-user records visible.
- Prevention: derive user id from token context only; integration tests for forbidden flows.
- Phase coverage: 2, 9.

## Pitfall 4: Workers + Prisma Runtime Misconfiguration

- Warning signs: connection/runtime errors only after deploy.
- Prevention: lock supported driver/adapter path early and test in worker-like environment.
- Phase coverage: 3.

## Pitfall 5: Migration Regressions

- Warning signs: frontend breaks due to subtle shape/enum/date differences.
- Prevention: compatibility adapters and contract tests against migration spec.
- Phase coverage: 4, 5, 6, 9.
