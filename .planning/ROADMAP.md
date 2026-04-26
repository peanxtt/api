# Roadmap: API Hub (Personal + Coffee)

**Generated:** 2026-04-26
**Granularity:** Fine
**Execution preference:** Parallel where safe

## Summary

- Total phases: 9
- v1 requirements mapped: 36 / 36
- Unmapped requirements: 0
- Critical path: Platform foundation -> Auth boundary -> Data layer -> Personal migration -> Coffee isolation -> Docs -> Quality gates

## Phases

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 1 | API Foundation and Contracts | Establish clean route architecture and typed response/error conventions | PLAT-01..PLAT-05 | 5 |
| 2 | Auth and Identity Guardrails | Implement secure auth flow and request-scoped authorization | AUTH-01..AUTH-04 | 4 |
| 3 | Supabase + Prisma Data Layer | Introduce robust, runtime-safe repository layer and migration discipline | DATA-01..DATA-04 | 4 |
| 4 | Personal Core Migration I | Migrate users/clients/settings endpoints with compatibility behavior | PERS-01..PERS-03 | 4 |
| 5 | Personal Financial Migration | Migrate invoices/receipts and status/business rules | FIN-01..FIN-04 | 5 |
| 6 | Personal Core Migration II | Migrate projects/tasks/blockers/checklists with rule enforcement | PERS-04..PERS-07 | 5 |
| 7 | Coffee Domain Isolation | Implement coffee wiki endpoints with strict boundary rules | COFF-01..COFF-03 | 4 |
| 8 | OpenAPI + Swagger Publication | Ship complete API contract and docs experience | DOC-01..DOC-04 | 4 |
| 9 | Testing, Observability, and Cutover | Add reliability gates and rollout/cutover strategy | QUAL-01..QUAL-05 | 6 |

## Detailed Plan

### Phase 1: API Foundation and Contracts
Goal: Normalize route tree and contract primitives for all modules.
Requirements: PLAT-01, PLAT-02, PLAT-03, PLAT-04, PLAT-05
Status: Complete (2026-04-27)
Success criteria:
1. Route mounting enforces `/api/v1/personal/*` and `/api/v1/coffee/*` ownership.
2. Shared response/error helpers are used by all modules.
3. Validation failures consistently return `BAD_REQUEST` with field-level details.
4. Base middleware stack order is fixed and tested (logger, CORS, auth-by-route, error handling).
5. TypeScript build fails on missing endpoint type contracts.
UI hint: no

### Phase 2: Auth and Identity Guardrails
Goal: Protect resources with authenticated and user-scoped access semantics.
Requirements: AUTH-01, AUTH-02, AUTH-03, AUTH-04
Success criteria:
1. Bearer token parsing and Supabase verification is centralized.
2. Request context carries trusted user identity for all protected handlers.
3. Unauthorized and forbidden flows are differentiated and documented.
4. `/personal/auth/login`, `/personal/auth/logout`, `/personal/auth/me` behavior matches migration needs.
UI hint: no

### Phase 3: Supabase + Prisma Data Layer
Goal: Create stable repository boundary and schema migration path.
Requirements: DATA-01, DATA-02, DATA-03, DATA-04
Success criteria:
1. Prisma models cover personal + coffee entities used in v1.
2. Worker-compatible Prisma strategy is selected and documented.
3. Repository functions enforce user-scoped queries for personal data.
4. Migration scripts include rollback guidance for each risky schema change.
UI hint: no

### Phase 4: Personal Core Migration I
Goal: Migrate user profile, clients, and settings APIs.
Requirements: PERS-01, PERS-02, PERS-03
Success criteria:
1. `/personal/users/me` supports current frontend update flow.
2. `/personal/clients` CRUD + archive/activate follows spec semantics.
3. `/personal/settings` uses safe upsert and preserves defaults.
4. Compatibility adapter for legacy field shape (for example boolean/number transitions) is implemented where needed.
UI hint: no

### Phase 5: Personal Financial Migration
Goal: Migrate invoice and receipt domain without business regressions.
Requirements: FIN-01, FIN-02, FIN-03, FIN-04
Success criteria:
1. Invoice list/detail/create/update/delete and status flows match spec.
2. Receipt creation enforces immutable receipt mode/status rules.
3. Receipt number generation strategy is deterministic and test-covered.
4. Date mapping behavior for receipt display compatibility is preserved.
5. Validation prevents invalid tax/currency/line/total payloads.
UI hint: no

### Phase 6: Personal Core Migration II
Goal: Migrate project/task/task-blocker/checklist APIs with dependency rules.
Requirements: PERS-04, PERS-05, PERS-06, PERS-07
Success criteria:
1. Project CRUD and progress recalculation endpoints are live.
2. Task CRUD/status/reorder/archive flows work with scoped filters.
3. Blocker APIs reject self-reference and circular direct dependencies.
4. Completing blocked tasks returns business-rule `BAD_REQUEST`.
5. Legacy checklist APIs are available and explicitly marked deprecated.
UI hint: no

### Phase 7: Coffee Domain Isolation
Goal: Expand coffee wiki APIs while preserving hard separation from personal domain.
Requirements: COFF-01, COFF-02, COFF-03
Success criteria:
1. Coffee endpoints are mounted under `/api/v1/coffee/*` only.
2. Coffee module has dedicated schemas/services/repositories.
3. No direct imports from personal services into coffee module.
4. Coffee routes and schemas are independently tagged in OpenAPI.
UI hint: no

### Phase 8: OpenAPI + Swagger Publication
Goal: Provide trustworthy and complete API docs for development and migration.
Requirements: DOC-01, DOC-02, DOC-03, DOC-04
Success criteria:
1. OpenAPI document generation is part of build/test workflow.
2. Swagger UI is served from a stable route (for example `/api/docs`).
3. All endpoints have tags, operationIds, schemas, and auth metadata.
4. Deprecated/compatibility notes are visible for migration-related endpoints.
UI hint: no

### Phase 9: Testing, Observability, and Cutover
Goal: Ensure safe production rollout and measurable reliability.
Requirements: QUAL-01, QUAL-02, QUAL-03, QUAL-04, QUAL-05
Success criteria:
1. Domain service unit tests cover critical business rules.
2. Integration tests verify envelope/auth/scoping across personal and coffee routes.
3. Structured logs include request id, domain, latency, and outcome code.
4. Health endpoint includes release metadata for diagnostics.
5. CI blocks merge if lint/typecheck/tests/openapi checks fail.
6. Cutover checklist includes traffic switch, rollback trigger, and post-release verification.
UI hint: no

## Dependency Notes

- Phase 1 must complete before all other phases.
- Phase 2 can proceed in parallel with early Phase 3 scaffolding.
- Phase 4 and Phase 5 can overlap once Phase 3 repository contracts stabilize.
- Phase 6 depends on Phase 4 (shared project/task client relationships).
- Phase 8 depends on endpoint stabilization from Phases 4-7.
- Phase 9 runs partially in parallel but final cutover is last.

## Risk Register

| Risk | Phase | Mitigation |
|------|-------|------------|
| Prisma runtime mismatch on Workers | 3 | Lock supported driver/runtime path and add startup assertion |
| Migration breaks frontend assumptions | 4-6 | Add compatibility adapters and contract tests against existing payloads |
| Domain leakage from personal into coffee | 7 | Enforce module boundaries and import lint checks |
| Docs drift from implementation | 8 | Generate OpenAPI from source schemas + CI check |

---
*Last updated: 2026-04-26 after roadmap creation*
