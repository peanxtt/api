# Phase 3: Supabase + Prisma Data Layer - Discussion Log

> Audit trail only. Do not use as input to planning/research/execution agents.
> Canonical decisions are captured in `03-CONTEXT.md`.

**Date:** 2026-04-27  
**Phase:** 03-supabase-prisma-data-layer  
**Mode:** discuss (interactive)  
**Areas discussed:** Prisma runtime strategy, data ownership boundary design, user-scoped repository contract, migration and rollback discipline

## Decision Trail

### 1) Prisma Runtime Strategy
- Chosen: Prisma Accelerate/Data Proxy path.
- Chosen: Single shared Prisma gateway module (`src/lib/prisma.ts`).
- Chosen: Two domain DB env groups from start (`personal` and `coffee`).
- Chosen: Two Prisma schemas + two generated clients.

### 2) Data Ownership Boundary Design
- Chosen: Hard isolation between personal and coffee repositories/services.
- Chosen: Shared cross-cutting DB utilities only in neutral infra (`src/lib/db/*`).

### 3) User-Scoped Repository Contract
- Chosen: `userId` required by default for personal repository methods.
- Chosen: Unscoped behavior allowed only via explicit `*Admin`/`*System` methods.

### 4) Migration + Rollback Discipline
- Chosen: Separate migration streams for personal and coffee domains.
- Chosen: Mandatory rollback note per migration (risk, rollback, data-loss warning, verification).

## User Clarifications

- User already provisioned personal DB URLs (`DATABASE_URL` + `DIRECT_URL` style) and asked how to support a second coffee DB.
- Decision was to formalize dual-domain env and dual Prisma client architecture now, not defer.

## Deferred Ideas

None.
