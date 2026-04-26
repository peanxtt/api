# Personal Invoice Generator Backend API Spec
Version: v1
Base URL: /api/v1
Auth: Bearer JWT (Supabase access token)
Content-Type: application/json
Timezone: store timestamps in UTC ISO-8601

## 1) Global Conventions

### 1.1 Authentication
- Protected endpoints require `Authorization: Bearer <supabase_access_token>`.
- Backend resolves `userId` from token and scopes all records to that user.
- Never accept `userId` from client payload.

### 1.2 Response Envelope
Use one consistent envelope for all endpoints.

Success:
{
  "success": true,
  "data": <payload>,
  "meta": { ...optional }
}

Error:
{
  "success": false,
  "error": "Human readable message",
  "code": "BAD_REQUEST|UNAUTHORIZED|FORBIDDEN|NOT_FOUND|CONFLICT|INTERNAL_ERROR",
  "details": { ...optional validation details }
}

### 1.3 Date/Time Rules
- `createdAt`, `updatedAt`, and DB timestamps: ISO string.
- Business date fields (`issueDate`, `dueDate`, task dueDate) are currently string values (YYYY-MM-DD recommended).
- Receipt special mapping:
  - Receipt “paid date” should come from receipt created timestamp.
  - Receipt “issued date” may map from linked invoice issue date.

### 1.4 Pagination/Filtering (recommended standard)
- `page` (default 1), `limit` (default 20, max 100)
- `sortBy`, `sortOrder=asc|desc`
- Resource-specific filters via query params.

---

## 2) Shared DTOs

## 2.1 Client
Client:
- id: string
- name: string (required)
- email?: string
- company?: string
- phone?: string
- address?: string
- notes?: string
- active: boolean (backend canonical)

Compatibility note:
- Frontend currently used `active` as 1/0 in parts of server actions.
- Backend should return boolean; frontend adapter can convert during migration.

## 2.2 Invoice Line
InvoiceLine:
- description: string (required)
- quantity?: number >= 0
- unitPrice?: number >= 0

## 2.3 Invoice
Invoice:
- id: string
- clientId?: string
- clientName?: string
- clientCompanyName: string (required)
- clientEmail?: string
- clientPhone?: string
- clientAddress?: string
- project?: string
- invoiceNumber?: string
- issueDate?: string
- dueDate?: string
- currency: string (default MYR)
- mode: "invoice" | "receipt"
- status: "draft" | "sent" | "paid" | "done"
- taxRate: number 0..100
- lines: InvoiceLine[] (min 1)
- notes?: string
- total: number >= 0
- createdAt: string
- updatedAt: string

## 2.4 Receipt
Receipt:
- id: string
- all client/contact fields like Invoice
- receiptNumber?: string
- invoiceNumber?: string
- issueDate?: string (derived/display mapping)
- dueDate?: string (derived/display mapping)
- currency: string
- mode: "receipt"
- status: "done"
- taxRate: number
- lines: InvoiceLine[]
- notes?: string
- total: number
- createdAt: string
- updatedAt: string

## 2.5 Task
Task:
- id: string
- title: string (1..200)
- description?: string
- status: "todo" | "in_progress" | "ready_for_testing" | "blocked" | "done"
- priority: "low" | "medium" | "high" | "urgent"
- projectId?: string
- clientId?: string
- invoiceId?: string
- dueDate?: string
- estimatedHours?: number >= 0
- actualHours?: number >= 0
- tags: string[]
- position: number
- archived: boolean
- blockerTaskIds?: string[] (input helper)
- blockerCount?: number
- blockers?: Task[] (expanded)
- blocking?: Task[] (expanded)
- createdAt: string
- updatedAt: string

## 2.6 Project
Project:
- id: string
- title: string (1..200)
- description?: string
- goal?: string
- type: "project" | "area" | "resource"
- startDate?: string
- deadline?: string
- status: "active" | "on_hold" | "completed" | "archived"
- archived: boolean
- color?: string
- icon?: string
- position: number
- clientId?: string
- completionPercentage: number 0..100
- taskCount: number
- completedTaskCount: number
- createdAt: string
- updatedAt: string

Validation:
- if both startDate and deadline exist, deadline >= startDate.

## 2.7 Checklist (legacy, removable)
Checklist:
- id: string
- title: string (1..200)
- description?: string
- clientId?: string
- items: ChecklistItem[] (min 1)
- status: "not_started" | "in_progress" | "completed" | "archived"
- completionPercentage: number 0..100
- createdAt: string
- updatedAt: string

ChecklistItem:
- id: string
- text: string
- completed: boolean

## 2.8 Settings
Settings:
- id: string
- companyName: string (required)
- addressLine1?: string
- addressLine2?: string
- addressLine3?: string
- addressLine4?: string
- email?: string
- phone?: string
- sstRegistrationNumber?: string
- companyRegistrationNumber?: string
- bankName?: string
- bankAccountName?: string
- bankAccountNumber?: string
- defaultCurrency: string (default MYR)
- defaultTaxRate: number 0..100
- defaultPaymentTerms?: string
- pomodoroWorkDuration: number 1..120
- pomodoroBreakDuration: number 1..60
- createdAt: string
- updatedAt: string

## 2.9 User Profile
User:
- id: string
- email: string
- username?: string
- name?: string

---

## 3) Endpoint List

## 3.1 Auth
POST /auth/login
- Public: yes
- Body:
  - email: string (required, valid email)
  - password: string (required)
- Response data: User + token/session payload (recommended)
- Notes:
  - Current app has rate limit intent: 5 attempts / 15 min per IP.
  - Return 401 for invalid credentials.

POST /auth/logout
- Public: no
- Body: none
- Response data: { message: "Logged out successfully" }

GET /auth/me
- Public: no
- Body: none
- Response data: User

## 3.2 Users
PATCH /users/me
- Body:
  - name?: string
  - username?: string
- Response data: User

## 3.3 Clients
GET /clients
- Query:
  - includeInactive?: boolean (default false)
- Response data: Client[]

GET /clients/:id
- Response data: Client

POST /clients
- Body:
  - name: string
  - email?: string
  - company?: string
  - phone?: string
  - address?: string
  - notes?: string
  - active?: boolean (default true)
- Response data: Client

PATCH /clients/:id
- Body: partial client fields
- Response data: Client

PATCH /clients/:id/archive
- Body: none
- Response data: Client (active=false)

PATCH /clients/:id/activate
- Body: none
- Response data: Client (active=true)

DELETE /clients/:id
- Response data: { deleted: true }

## 3.4 Invoices
GET /invoices
- Query:
  - status?: draft|sent|paid|done
  - clientId?: string
  - fromDate?: string
  - toDate?: string
- Response data: Invoice[]

GET /invoices/:id
- Response data: Invoice

POST /invoices
- Body:
  - clientId?: string
  - clientName?: string
  - clientCompanyName: string
  - clientEmail?: string
  - clientPhone?: string
  - clientAddress?: string
  - project?: string
  - invoiceNumber?: string
  - issueDate?: string
  - dueDate?: string
  - currency?: string
  - status?: draft|sent|paid|done
  - taxRate?: number
  - lines: InvoiceLine[] (min 1)
  - notes?: string
  - total: number
- Server sets mode = "invoice"
- Response data: Invoice

PATCH /invoices/:id
- Body: partial invoice fields
- Server enforces mode = "invoice"
- Response data: Invoice

PATCH /invoices/:id/status
- Body:
  - status: draft|sent|paid|done
- Response data: Invoice

POST /invoices/:id/advance-status
- Body:
  - currentStatus: draft|sent|paid|done
- Logic:
  - draft -> sent -> paid
  - paid/done -> no-op
- Response data: Invoice | null

DELETE /invoices/:id
- Response data: { deleted: true }

## 3.5 Receipts
GET /receipts
- Query:
  - clientId?: string
  - invoiceNumber?: string
- Response data: Receipt[]

GET /receipts/:id
- Response data: Receipt
- Notes:
  - include linked invoice date mapping for receipt display where available.

POST /receipts
- Body:
  - same financial/contact fields as invoice payload
  - invoiceNumber?: string
- Server behavior:
  - generate receiptNumber
  - force mode="receipt"
  - force status="done"
- Response data: Receipt

PATCH /receipts/:id
- Body: partial receipt-compatible fields
- Server behavior:
  - keep status="done"
- Response data: Receipt

DELETE /receipts/:id
- Response data: { deleted: true }

## 3.6 Settings
GET /settings
- Response data: Settings | null

PUT /settings
- Body: full Settings payload
- Response data: Settings
- Notes:
  - Upsert behavior (create if not exists).

DELETE /settings
- Response data: { deleted: true }

## 3.7 Projects
GET /projects
- Query:
  - type?: project|area|resource
  - includeArchived?: boolean (default false)
  - status?: active|on_hold|completed|archived
  - clientId?: string
- Response data: Project[]

GET /projects/:id
- Response data: Project

POST /projects
- Body:
  - title: string
  - description?: string
  - goal?: string
  - type?: project|area|resource
  - startDate?: string
  - deadline?: string
  - status?: active|on_hold|completed|archived
  - archived?: boolean
  - color?: string
  - icon?: string
  - position?: number
  - clientId?: string
- Response data: Project

PATCH /projects/:id
- Body: partial project fields
- Response data: Project

PATCH /projects/:id/archive
- Response data: { archived: true }

PATCH /projects/:id/unarchive
- Response data: { archived: false }

POST /projects/:id/recalculate-progress
- Response data:
  - completionPercentage: number
  - taskCount: number
  - completedTaskCount: number

DELETE /projects/:id
- Response data: { deleted: true }

## 3.8 Tasks
GET /tasks
- Query:
  - includeArchived?: boolean (default false)
  - projectId?: string
  - status?: todo|in_progress|ready_for_testing|blocked|done
  - clientId?: string
- Response data: Task[]

GET /tasks/:id
- Response data: Task (with blockers + blocking optional expansions)

POST /tasks
- Body:
  - title: string
  - description?: string
  - status?: enum
  - priority?: enum
  - projectId?: string
  - clientId?: string
  - invoiceId?: string
  - dueDate?: string
  - estimatedHours?: number
  - actualHours?: number
  - tags?: string[]
  - position?: number
  - archived?: boolean
  - blockerTaskIds?: string[]
- Response data: Task
- Notes:
  - after create/update/delete, project metrics should be recalculated if linked.

PATCH /tasks/:id
- Body: partial task fields
- Response data: Task
- Rule:
  - if setting status=done and incomplete blockers exist -> 400.

DELETE /tasks/:id
- Response data: { deleted: true }

PATCH /tasks/:id/status
- Body:
  - status: enum
- Response data: Task

PATCH /tasks/:id/position
- Body:
  - position: number
- Response data: Task

POST /tasks/reorder
- Body:
  - tasks: [{ id: string, position: number }]
- Response data: { updated: true }

PATCH /tasks/:id/archive
- Response data: { archived: true }

PATCH /tasks/:id/unarchive
- Response data: { archived: false }

## 3.9 Task Blockers
POST /tasks/blockers
- Body:
  - blockedTaskId: string
  - blockerTaskId: string
- Response data:
  - id: string
  - blockedTaskId: string
  - blockerTaskId: string
  - createdAt: string
- Rules:
  - blockedTaskId != blockerTaskId
  - no direct circular dependency
  - both tasks must belong to current user

DELETE /tasks/:taskId/blockers/:blockerTaskId
- Response data: { deleted: true }

GET /tasks/:id/blockers
- Response data: Task[] (tasks blocking current task)

GET /tasks/:id/blocking
- Response data: Task[] (tasks current task blocks)

GET /tasks/:id/can-complete
- Response data:
  - canComplete: boolean

GET /tasks/:id/blocker-relations
- Response data:
  - blockers: Task[]
  - blocking: Task[]

## 3.10 Checklists (Legacy Surface; safe to sunset later)
GET /checklists
- Query:
  - includeArchived?: boolean
  - status?: not_started|in_progress|completed|archived
- Response data: Checklist[]

GET /checklists/:id
- Response data: Checklist

POST /checklists
- Body:
  - title: string
  - description?: string
  - clientId?: string
  - items: ChecklistItem[] (min 1)
  - status?: enum
- Response data: Checklist
- Server computes:
  - completionPercentage
  - derived status from items

PATCH /checklists/:id
- Body: partial checklist fields
- Response data: Checklist

PATCH /checklists/:id/status
- Body:
  - status: enum
- Response data: Checklist

PATCH /checklists/:id/archive
- Response data: Checklist

PATCH /checklists/:id/unarchive
- Response data: Checklist

DELETE /checklists/:id
- Response data: { deleted: true }

## 3.11 Placeholder Content (optional to keep)
GET /posts
- Response data:
  - [{ id, title, tag, status: live|draft, readMinutes, dateLabel }]

GET /photos
- Response data:
  - [{ id, title, location, capturedDate, status: published|draft, aspectRatio, color }]

---

## 4) Error Mapping (recommended)

- 400 BAD_REQUEST
  - Validation errors
  - Business rule violations (e.g., cannot complete blocked task)
- 401 UNAUTHORIZED
  - Missing/invalid token
- 403 FORBIDDEN
  - Cross-user access
- 404 NOT_FOUND
  - Missing record
- 409 CONFLICT
  - Unique conflicts / duplicate references
- 500 INTERNAL_ERROR
  - Unexpected backend failures

Validation error shape:
{
  "success": false,
  "error": "Validation failed",
  "code": "BAD_REQUEST",
  "details": {
    "fieldErrors": {
      "fieldName": ["message"]
    }
  }
}

---

## 5) Hono Project Bootstrap Layout (recommended)

src/
- app.ts
- middlewares/
  - auth.ts
  - error-handler.ts
- modules/
  - auth/
  - users/
  - clients/
  - invoices/
  - receipts/
  - settings/
  - projects/
  - tasks/
  - task-blockers/
  - checklists/
  - posts/
  - photos/
- lib/
  - prisma.ts
  - validators.ts
  - response.ts
  - pagination.ts

---

## 6) Migration Notes (frontend -> backend)

- Keep endpoint responses compatible with current frontend schema first, then normalize.
- For `Client.active`, choose canonical boolean in backend and adapt at frontend boundary if needed.
- Keep receipt date mapping behavior during transition so UI doesn’t regress.
- Keep checklists API temporarily if frontend still imports it, even if feature is planned for removal.
