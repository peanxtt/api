# Phase 1: API Foundation and Contracts - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `01-CONTEXT.md`; this log preserves alternatives considered.

**Date:** 2026-04-26
**Phase:** 01-api-foundation-and-contracts
**Areas discussed:** Route Ownership, Error Envelope Shape, Validation Error Detail, Middleware Strategy, Type Contract Strategy

---

## Route Ownership

| Option | Description | Selected |
|--------|-------------|----------|
| A | Strict domain routers: `personal` and `coffee` mounted separately, no cross-imports | X |
| B | Keep current mixed route registration and clean later | |

**User's choice:** 1A
**Notes:** Domain boundaries should be enforced from the start.

---

## Error Envelope Shape

| Option | Description | Selected |
|--------|-------------|----------|
| A | Migrate now to spec shape: `{ success:false, error:string, code:string, details? }` | X |
| B | Keep current nested shape and add compatibility mapper later | |
| C | Keep nested shape permanently | |

**User's choice:** 2A
**Notes:** Immediate convergence to spec envelope to avoid drift.

---

## Validation Error Detail

| Option | Description | Selected |
|--------|-------------|----------|
| A | Structured `details.fieldErrors` from Zod | X |
| B | Single joined message only | |
| C | Both (`fieldErrors` + readable summary) | |

**User's choice:** 3A
**Notes:** Machine-friendly validation payload is preferred.

---

## Middleware Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| A | Namespace-level middleware groups (`/personal`, `/coffee`) + route-level exceptions | X |
| B | Route-level middleware only | |
| C | Global middleware for almost everything | |

**User's choice:** 4A
**Notes:** Middleware ownership should follow namespace boundaries.

---

## Type Contract Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| A | Zod schemas + typed handlers + OpenAPI registration from same source | X |
| B | Zod for validation only, OpenAPI manually maintained | |
| C | Types first, weaker runtime validation | |

**User's choice:** 5A
**Notes:** Contract generation and runtime validation should share one source of truth.

---

## the agent's Discretion

- Internal helper naming and file organization details as long as selected contract decisions remain intact.

## Deferred Ideas

None.
