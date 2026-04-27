# Environment Setup (Sanitized Template)

Template-only guide for local setup.  
Do not place real secrets, account identifiers, or production values in this file.

## 1) Local Env File Template

Create a local, gitignored environment file and use placeholder keys:

```env
# Auth/provider
SUPABASE_URL=<provider-url>
SUPABASE_ANON_KEY=<public-key-placeholder>
SUPABASE_SERVICE_ROLE_KEY=<secret-key-placeholder>
SUPABASE_JWT_SECRET=<jwt-signing-key-placeholder>

# Domain DB URLs (Phase 3+)
PERSONAL_DATABASE_URL=<personal-runtime-db-url>
PERSONAL_DIRECT_URL=<personal-direct-db-url>
COFFEE_DATABASE_URL=<coffee-runtime-db-url>
COFFEE_DIRECT_URL=<coffee-direct-db-url>

# App
FRONTEND_ORIGINS=<comma-separated-origins>
```

## 2) Secret Handling Rules

- Never commit real values to git.
- Never paste secrets in tickets, PR comments, or shared chat.
- Keep runtime secrets in your local secret store and deployment secret manager.
- Rotate credentials immediately if accidental exposure is suspected.

## 3) Minimal Local Run Flow

1. Add local env values in your private env file.
2. Start dev runtime.
3. Run auth/data smoke tests.

Example commands (choose your package manager/runtime setup):

```bash
# Start app
<your-dev-command>

# Prisma pulls (domain-specific)
npx prisma db pull --config prisma/personal.prisma.config.ts
npx prisma db pull --config prisma/coffee.prisma.config.ts
```

## 4) Verification Checklist (No Sensitive Data)

- Login success path returns success envelope.
- Invalid credentials return unauthorized response.
- Protected endpoint without token is rejected.
- Protected endpoint with token returns identity payload.
- Domain data-layer commands run against correct domain configs.

## 5) Deployment Note

Use deployment secret management for all sensitive values.  
Keep only non-sensitive defaults in source-controlled config files.
