# Phase 2: Auth and Identity Guardrails - Research

**Researched:** 2026-04-27
**Domain:** Hono + Supabase JWT auth on Cloudflare Workers
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Verify bearer JWT locally in middleware using `SUPABASE_JWT_SECRET`.
- Store `userId` and `email` in request context after token verification.
- Enforce strict split: invalid/missing token -> `401`, cross-user access -> `403`.
- Implement `/api/v1/personal/auth/login`, `/logout`, `/me`.
- Add app-level login rate limit: `5 attempts / 15 minutes / IP`.

### the agent's Discretion
- Helper naming, claim parsing internals, and rate limiter storage mechanics.

### Deferred Ideas (OUT OF SCOPE)
- None.
</user_constraints>

<architectural_responsibility_map>
## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| JWT extraction and verification | API/Backend | -- | Trust boundary belongs in backend middleware |
| Auth endpoint orchestration (`login/logout/me`) | API/Backend | -- | Contract is backend-owned for migration stability |
| Login attempt throttling | API/Backend | CDN/Edge | Runtime should enforce app-level safety before later Cloudflare-only tuning |
| User-scoped identity propagation | API/Backend | Data layer | Verified identity must flow to repositories in next phases |
</architectural_responsibility_map>

<research_summary>
## Summary

Phase 2 should establish auth guardrails in two layers: middleware identity verification first, then auth endpoint behavior and rate limiting. Current code already has bearer token extraction and standardized error helpers, so implementation should extend these without redesigning architecture.

Most risk comes from ambiguous claim parsing and mixed `401/403` behavior. The plan should centralize JWT verification into a small `auth` library and keep middleware thin, then use shared helpers for endpoint-level responses.

**Primary recommendation:** Two-plan sequence with wave dependency: auth core primitives first, auth endpoint and rate limiting second.
</research_summary>

<standard_stack>
## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| hono | 4.x | Middleware and route composition | Current framework baseline |
| @supabase/supabase-js | 2.x | Auth session operations for login/logout/me | Current provider SDK |
| zod + @hono/zod-validator | 3.x / 0.7.x | Typed request validation for auth payloads | Existing validation standard |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Workers Crypto (`crypto.subtle`) | runtime | HMAC/JWT verification primitives | Use for local JWT verification without roundtrip |
| In-memory or edge KV-style limiter abstraction | runtime/local | Login attempt throttling | Use lightweight implementation in this phase |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Local JWT verify in middleware | Call Supabase Auth each request | Simpler to reason about but slower and less resilient |
| App-level limiter now | Cloudflare-only limiter later | Faster now vs delayed guardrail coverage |
</standard_stack>

<architecture_patterns>
## Architecture Patterns

### System Architecture Diagram

`Incoming Request` -> `authGuard middleware` -> `JWT verify + claims parse` -> `request context (userId,email)` -> `route handler` -> `jsonSuccess/jsonError`

For login endpoint:

`POST /personal/auth/login` -> `rate-limit check` -> `Supabase signIn flow` -> `normalized auth payload` -> `jsonSuccess`

### Recommended Project Structure
```txt
src/
  lib/
    auth/
      jwt.ts              # local JWT verification + claim extraction
      rate-limit.ts       # login attempt limiter
  middleware/
    auth.ts               # consumes jwt.ts and writes verified identity
  modules/
    personal-auth/
      routes.ts
      schema.ts
      service.ts
```

### Pattern 1: Thin Middleware, Rich Auth Library
**What:** Keep `authGuard` small, push verification and claim decoding into testable helper functions.
**When to use:** Any phase that introduces identity context consumed by many routes.

### Pattern 2: Contract-First Auth Endpoints
**What:** Auth routes must use existing response and validation helpers.
**When to use:** Migration phases with frontend compatibility constraints.

### Anti-Patterns to Avoid
- Verifying token format but not signature/expiry.
- Writing auth endpoint responses with ad-hoc payload shapes.
- Mixing rate-limit logic directly into every handler.
</architecture_patterns>

<dont_hand_roll>
## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Full auth provider implementation | Custom user/password system | Supabase auth operations | Avoids credential and session security pitfalls |
| Route-local auth checks everywhere | Repeated manual header checks | Central middleware + context | Prevents inconsistency and bypass risks |
| Ad-hoc limiter checks per endpoint | Scattered counters | Shared limiter helper | Keeps behavior consistent and testable |

**Key insight:** Phase 2 success is consistency under strict contracts, not auth feature breadth.
</dont_hand_roll>

<common_pitfalls>
## Common Pitfalls

### Pitfall 1: 401/403 Confusion
**What goes wrong:** Clients cannot distinguish invalid token from unauthorized ownership access.
**Why it happens:** Auth and authorization checks are blended.
**How to avoid:** Enforce explicit middleware vs resource-ownership branches.
**Warning signs:** Endpoint handlers returning generic auth errors for all failures.

### Pitfall 2: Weak Claim Validation
**What goes wrong:** Middleware accepts token but fails to guarantee required identity fields.
**Why it happens:** Claims are cast unsafely without validation.
**How to avoid:** Validate required claims (`sub`, `email`) and reject malformed tokens.
**Warning signs:** Request context has optional/undefined user identifiers in protected handlers.

### Pitfall 3: Missing Login Throttle Integration
**What goes wrong:** Brute-force attempts are not throttled despite policy.
**Why it happens:** Rate limiter added but not wired before auth attempts.
**How to avoid:** Run limiter check before sign-in call and record failures consistently.
**Warning signs:** Login failures never increment limiter state.
</common_pitfalls>

<open_questions>
## Open Questions

1. **Rate limiter storage strategy in Workers runtime**
   - What we know: app-level limiter required this phase.
   - What's unclear: best long-lived storage in current runtime configuration.
   - Recommendation: implement pluggable in-memory abstraction now, prepare for KV swap in later ops phase.
</open_questions>

<sources>
## Sources

### Primary (HIGH confidence)
- `.planning/phases/02-auth-and-identity-guardrails/02-CONTEXT.md`
- `.planning/ROADMAP.md` (Phase 2 section)
- `.planning/REQUIREMENTS.md` (`AUTH-01`..`AUTH-04`)
- `src/middleware/auth.ts`
- `src/lib/supabase.ts`
- `src/types/bindings.ts`
- `src/lib/response.ts`
- `src/middleware/error-handler.ts`

### Secondary (MEDIUM confidence)
- `.planning/PROJECT.md` (stack constraints)
</sources>

<metadata>
## Metadata

**Research scope:**
- Core technology: Hono auth middleware and Supabase integration
- Patterns: JWT verification, identity propagation, rate limiting
- Pitfalls: status semantics, claims safety, throttling gaps

**Confidence breakdown:**
- Standard stack: HIGH
- Architecture: HIGH
- Pitfalls: HIGH
- Runtime limiter persistence details: MEDIUM

**Research date:** 2026-04-27
**Valid until:** 2026-05-27
</metadata>

---

*Phase: 02-auth-and-identity-guardrails*
*Research completed: 2026-04-27*
*Ready for planning: yes*
