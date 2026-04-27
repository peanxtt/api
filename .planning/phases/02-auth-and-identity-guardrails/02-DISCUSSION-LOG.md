# Phase 2: Auth and Identity Guardrails - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in `02-CONTEXT.md`; this log preserves alternatives considered.

**Date:** 2026-04-27
**Phase:** 02-auth-and-identity-guardrails
**Areas discussed:** Token Verification Strategy, Auth Context in Request, Unauthorized vs Forbidden Rules, Auth Endpoint Design, Login Rate Limiting

---

## Token Verification Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| A | Verify JWT locally with `SUPABASE_JWT_SECRET` in middleware | X |
| B | Verify by calling Supabase Auth on each request | |
| C | Hybrid (local verify + selective Supabase check) | |

**User's choice:** all recommended (`1A`)
**Notes:** Local verification selected for performance and simpler middleware flow.

---

## Auth Context in Request

| Option | Description | Selected |
|--------|-------------|----------|
| A | Store `userId` only | |
| B | Store `userId + email` | X |
| C | Store `userId + email + role/claims` | |

**User's choice:** all recommended (`2B`)
**Notes:** Keep context minimal but practical for endpoint and authorization checks.

---

## Unauthorized vs Forbidden Rules

| Option | Description | Selected |
|--------|-------------|----------|
| A | Strict split: invalid/missing token -> `401`, cross-user access -> `403` | X |
| B | Return `401` for everything auth-related | |
| C | Return `403` for everything auth-related | |

**User's choice:** all recommended (`3A`)
**Notes:** Clear semantic split selected for predictable client behavior.

---

## Auth Endpoint Design (/personal/auth/*)

| Option | Description | Selected |
|--------|-------------|----------|
| A | Implement login/logout/me as backend endpoints wrapping Supabase flows | X |
| B | Keep login/logout in frontend, backend provides only `/me` | |
| C | Temporary stubs now, full behavior later | |

**User's choice:** all recommended (`4A`)
**Notes:** Backend-owned auth contract preferred for migration consistency.

---

## Login Rate Limiting

| Option | Description | Selected |
|--------|-------------|----------|
| A | Add `5 attempts / 15 min / IP` now | X |
| B | Defer to Phase 9 | |
| C | Cloudflare-only rules, no app-level limiter | |

**User's choice:** all recommended (`5A`)
**Notes:** App-level limit is included in Phase 2 for immediate auth guardrails.

---

## the agent's Discretion

- Exact helper/module naming and internal limiter storage implementation details.

## Deferred Ideas

None.
