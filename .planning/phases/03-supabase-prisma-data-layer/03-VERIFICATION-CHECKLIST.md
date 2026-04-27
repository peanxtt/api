# Phase 3 Verification Checklist

## Runtime and Client Wiring

- [ ] `src/lib/prisma.ts` exists and provides personal/coffee client accessors.
- [ ] Personal and coffee DB URLs are validated from typed bindings/env parsing.
- [ ] Runtime wiring uses pooled/accelerate path assumptions and keeps direct URLs for migrations only.

## Repository Contract Safety

- [ ] Personal repository base contract enforces user-scoped methods by default.
- [ ] Unscoped operations are explicit admin/system methods only.
- [ ] Coffee repository base does not import personal-domain repository modules.

## Migration Governance

- [ ] `prisma/personal/MIGRATION-POLICY.md` exists and includes rollback-note requirements.
- [ ] `prisma/coffee/MIGRATION-POLICY.md` exists and includes rollback-note requirements.
- [ ] Migration streams remain separate per domain.

## Rollback Note Template (required per migration)

```
Risk Level: <low|medium|high>
Rollback Command(s): <exact commands>
Manual Rollback SQL: <if needed>
Data-Loss Warning: <none or specific warning>
Post-Rollback Verification:
- <check 1>
- <check 2>
```
