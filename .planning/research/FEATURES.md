# Feature Research

## Personal Domain (Shared by Management + Website)

### Table Stakes

- Auth/session endpoints
- Profile management
- Clients CRUD with active/archive toggles
- Invoices/receipts workflows
- Projects/tasks with filtering and status updates
- Settings upsert and retrieval

### Migration-Critical Behaviors

- Standardized response envelope compatibility
- User-scoped data access from auth token only
- Receipt status/mode constraints
- Legacy checklist compatibility during transition

## Coffee Domain

### Table Stakes

- Coffee wiki list/create endpoints
- Domain-specific schema separation
- Independent docs tags and contract section

### Future Extensions

- Taxonomy support (origin/bean/brew method)
- Draft/publish flow

## Platform Features

- Versioned route base `/api/v1`
- Structured error mapping
- OpenAPI + Swagger exposure
- Observability and CI quality gates
