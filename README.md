# personal-api-hub

Centralized API hub built with Hono + TypeScript for Cloudflare Workers.

## Tech stack

- Runtime: Cloudflare Workers (Edge)
- Framework: Hono
- Language: TypeScript (strict mode)
- Validation: Zod
- Database/Auth provider: Supabase
- Package manager: pnpm

## Project structure

```txt
personal-api-hub/
  src/
    index.ts
    app.ts
    config/
      env.ts
    lib/
      supabase.ts
      response.ts
      validation.ts
    middleware/
      cors.ts
      error-handler.ts
      logger.ts
      auth.ts
    modules/
      personal-site/
        routes.ts
        service.ts
        schema.ts
      invoice-generator/
        routes.ts
        service.ts
        schema.ts
      coffee-wiki/
        routes.ts
        service.ts
        schema.ts
    types/
      bindings.ts
```

## API routes (v1)

- `GET /api/v1/health`
- `GET /api/v1/personal/profile`
- `GET /api/v1/personal/projects`
- `GET /api/v1/invoices`
- `POST /api/v1/invoices`
- `GET /api/v1/invoices/:id`
- `PATCH /api/v1/invoices/:id`
- `DELETE /api/v1/invoices/:id`
- `POST /api/v1/invoices/:id/generate-receipt`
- `GET /api/v1/blogposts`
- `POST /api/v1/blogposts`
- `GET /api/v1/coffee/wiki`
- `POST /api/v1/coffee/wiki`

## Local setup

1. Install dependencies:

```bash
pnpm install
```

2. Create local env file for Wrangler:

```bash
cp .env.example .dev.vars
```

3. Fill in `.dev.vars` values.

4. Generate worker type definitions:

```bash
pnpm cf-typegen
```

5. Start local dev server:

```bash
pnpm dev
```

## Environment variables

Use `.dev.vars` for local development and Cloudflare secrets/vars for deployed environments:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_JWT_SECRET`
- `FRONTEND_ORIGINS` (comma-separated origins)

## Cloudflare secrets setup

Set sensitive values as Worker secrets:

```bash
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put SUPABASE_JWT_SECRET
```

Set non-sensitive vars in `wrangler.jsonc` or by dashboard/environment config.

## Deployment

Manual deploy:

```bash
pnpm deploy
```

## GitHub Actions setup

This project includes `.github/workflows/ci-cd.yml`:

- On pull request: install dependencies, lint, typecheck.
- On push to `main`: install dependencies, lint, typecheck, deploy.

Required repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Custom domain: `api.huashengtan.com`

Recommended approach:

1. Deploy the worker at least once (`pnpm deploy`).
2. In Cloudflare dashboard, add a custom domain for this Worker: `api.huashengtan.com`.
3. Ensure DNS has proxied record in Cloudflare.

### Recommended DNS setup

- Type: `CNAME`
- Name: `api`
- Target: `<worker-subdomain>.workers.dev`
- Proxy status: `Proxied` (orange cloud)

Cloudflare will manage TLS automatically for the custom domain once attached.

## Husky + Commitlint

Commit messages are validated via Husky `commit-msg` hook using Conventional Commits.

Examples:

- `feat(invoices): add receipt generation endpoint`
- `fix(auth): validate bearer token format`
