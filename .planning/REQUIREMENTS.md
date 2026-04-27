# Requirements: API Hub (Personal + Coffee)

**Defined:** 2026-04-26
**Core Value:** One deployable API platform that keeps shared personal APIs reusable while preserving hard domain boundaries for coffee wiki.

## v1 Requirements

### Platform

- [ ] **PLAT-01**: API exposes versioned base path `/api/v1`.
- [ ] **PLAT-02**: Domain route groups are isolated as `/api/v1/personal/*` and `/api/v1/coffee/*`.
- [ ] **PLAT-03**: All responses follow a standard envelope (`success`, `data|error`, `code`, `details`, `meta`).
- [ ] **PLAT-04**: Global error handling maps validation/business/system errors to documented codes.
- [ ] **PLAT-05**: Request/response contracts are schema-validated and strongly typed.

### Authentication and Authorization

- [x] **AUTH-01**: Protected endpoints require `Authorization: Bearer <supabase_access_token>`.
- [x] **AUTH-02**: Server resolves user identity from token and never accepts `userId` from request payload.
- [x] **AUTH-03**: Cross-user resource access is blocked and returns `FORBIDDEN`.
- [x] **AUTH-04**: Auth endpoints support login/logout/me semantics required by current frontend.

### Personal Domain - Core Records

- [x] **PERS-01**: Users can update their own profile (`PATCH /personal/users/me`).
- [x] **PERS-02**: Clients CRUD and archive/activate behaviors match migration spec.
- [x] **PERS-03**: Settings supports upsert (`GET/PUT/DELETE /personal/settings`).
- [ ] **PERS-04**: Projects CRUD plus archive/unarchive and progress recalculation are implemented.
- [ ] **PERS-05**: Tasks CRUD with status/position/reorder/archive endpoints are implemented.
- [ ] **PERS-06**: Task blocker relations enforce no self-reference and no direct circular links.
- [ ] **PERS-07**: Legacy checklist endpoints are available with explicit sunset marker.

### Personal Domain - Financial

- [ ] **FIN-01**: Invoices CRUD supports filters and status transitions from spec.
- [ ] **FIN-02**: Receipts CRUD is separated and enforces `mode=receipt`, `status=done`.
- [ ] **FIN-03**: Receipt number generation and invoice-to-receipt mapping behavior are deterministic.
- [ ] **FIN-04**: Currency/tax/total validation is enforced server-side.

### Coffee Domain

- [ ] **COFF-01**: Coffee wiki endpoints exist only under `/api/v1/coffee/*`.
- [ ] **COFF-02**: Coffee module does not import personal domain services or repositories directly.
- [ ] **COFF-03**: Coffee schemas, DB models, and docs are separated from personal domain artifacts.

### API Documentation

- [ ] **DOC-01**: OpenAPI spec is generated from source and published in the app.
- [ ] **DOC-02**: Swagger UI is exposed at a stable docs route for internal usage.
- [ ] **DOC-03**: Every endpoint includes tags, auth requirements, params, request body, and response schemas.
- [ ] **DOC-04**: Migration differences and deprecated endpoints are annotated in OpenAPI descriptions.

### Data and ORM

- [x] **DATA-01**: Prisma schema models all personal and coffee tables with domain-focused organization.
- [x] **DATA-02**: Prisma client usage is safe for Cloudflare runtime strategy selected by the project.
- [x] **DATA-03**: All repository operations are user-scoped where required.
- [x] **DATA-04**: Migrations are versioned and include rollback notes for risky changes.

### Quality and Operations

- [ ] **QUAL-01**: Unit tests cover validators, services, and business rules for each domain.
- [ ] **QUAL-02**: Integration tests verify auth, envelope shape, and core CRUD flows.
- [ ] **QUAL-03**: Request logging includes request id, latency, route, and result code.
- [ ] **QUAL-04**: Health endpoint includes service version and environment-safe status details.
- [ ] **QUAL-05**: CI enforces lint + typecheck + tests + OpenAPI generation check.

## v2 Requirements

### Personal Domain Expansion

- **PERS2-01**: Advanced search/filter APIs with cursor pagination for large datasets.
- **PERS2-02**: Domain events/webhooks for task and invoice lifecycle changes.
- **PERS2-03**: Public read-only personal-site endpoints with cache-aware responses.

### Coffee Domain Expansion

- **COFF2-01**: Coffee taxonomy management endpoints (beans, origins, brew methods).
- **COFF2-02**: Draft/publish workflow for coffee wiki articles.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Splitting into multiple deployables in v1 | Adds operational complexity before domain fit is proven |
| GraphQL gateway | Not required for current clients or migration plan |
| Non-TypeScript implementation paths | Violates strict typing requirement |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| PLAT-01 | Phase 1 | Complete |
| PLAT-02 | Phase 1 | Complete |
| PLAT-03 | Phase 1 | Complete |
| PLAT-04 | Phase 1 | Complete |
| PLAT-05 | Phase 1 | Complete |
| AUTH-01 | Phase 2 | Complete |
| AUTH-02 | Phase 2 | Complete |
| AUTH-03 | Phase 2 | Complete |
| AUTH-04 | Phase 2 | Complete |
| DATA-01 | Phase 3 | Complete |
| DATA-02 | Phase 3 | Complete |
| DATA-03 | Phase 3 | Complete |
| DATA-04 | Phase 3 | Complete |
| PERS-01 | Phase 4 | Complete |
| PERS-02 | Phase 4 | Complete |
| PERS-03 | Phase 4 | Complete |
| FIN-01 | Phase 5 | Pending |
| FIN-02 | Phase 5 | Pending |
| FIN-03 | Phase 5 | Pending |
| FIN-04 | Phase 5 | Pending |
| PERS-04 | Phase 6 | Pending |
| PERS-05 | Phase 6 | Pending |
| PERS-06 | Phase 6 | Pending |
| PERS-07 | Phase 6 | Pending |
| COFF-01 | Phase 7 | Pending |
| COFF-02 | Phase 7 | Pending |
| COFF-03 | Phase 7 | Pending |
| DOC-01 | Phase 8 | Pending |
| DOC-02 | Phase 8 | Pending |
| DOC-03 | Phase 8 | Pending |
| DOC-04 | Phase 8 | Pending |
| QUAL-01 | Phase 9 | Pending |
| QUAL-02 | Phase 9 | Pending |
| QUAL-03 | Phase 9 | Pending |
| QUAL-04 | Phase 9 | Pending |
| QUAL-05 | Phase 9 | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 36
- Unmapped: 0 

---
*Requirements defined: 2026-04-26*
*Last updated: 2026-04-27 after Phase 3 verification*

