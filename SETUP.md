# Setup Guide

> This project makes **no live API calls** in skeleton mode. You can run `npm run type-check` and `npm test` without configuring any credentials.

## Prerequisites

- Node.js ≥ 24 (`node --version`)
- npm ≥ 10

## 1 — Clone and install

```bash
git clone https://github.com/RexOwenDev/seobot.git
cd seobot
npm install
```

## 2 — Environment variables

```bash
cp .env.example .env
```

All values in `.env.example` are marked `operator-supplied` — they are intentionally **not** committed to this repo. The table below documents each variable.

### AI Gateway

| Variable | Description |
|---|---|
| `AI_GATEWAY_API_KEY` | Vercel AI Gateway API key (operator-supplied) |

### Supabase

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL from Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (safe for client bundle) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key — **server-only, never expose to client** |

### WordPress (per CMS connection — stored encrypted in DB for production)

| Variable | Description |
|---|---|
| `WORDPRESS_SITE_URL` | Full site URL, e.g. `https://example.com` |
| `WORDPRESS_USERNAME` | WordPress admin username |
| `WORDPRESS_APP_PASSWORD` | Application Password (WP 5.6+) — spaces in the generated password are stripped at client creation |

> In production, CMS credentials are stored AES-256-GCM encrypted in `cms_connections` — not in environment variables. The env vars above are for single-site bootstrap reference only.

### Shopify (per CMS connection)

| Variable | Description |
|---|---|
| `SHOPIFY_SHOP` | Shop subdomain, e.g. `your-store.myshopify.com` |
| `SHOPIFY_ADMIN_ACCESS_TOKEN` | Custom App Admin API access token — requires `write_content` scope |

> Same note: in production these live in the encrypted `cms_connections` table.

### Google Search Console (optional — research phase)

| Variable | Description |
|---|---|
| `GSC_SERVICE_ACCOUNT_EMAIL` | Service account email from GCP |
| `GSC_PRIVATE_KEY` | Private key from service account JSON (newlines as `\n`) |

### App

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_APP_URL` | Full public URL, e.g. `http://localhost:3000` |

---

## 3 — Development server

```bash
npm run dev        # http://localhost:3000
```

No credentials required — the app uses fixture data in skeleton mode.

## 4 — Type checking and tests

```bash
npm run type-check   # tsc --noEmit — should produce no errors
npm test             # vitest run — 115 tests
```

## 5 — Database (optional)

If you want a real Supabase database:

1. Create a new Supabase project
2. Run migrations in order: `supabase/migrations/001_workspaces.sql` → … → `009_seo_audits.sql`
3. Run `supabase/seed.sql` to load the fictional demonstration workspace (ForgeTorque / LuxDermis / VeloCargo)
4. Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` in `.env`

---

## Asset Generation Scripts

These scripts generate committed assets (hero image, diagrams, mockup screenshots). They are **not required** for type-checking or tests.

### Hero image

```bash
# Requires: personal Gemini API key (see note below)
GEMINI_API_KEY=your-personal-key node scripts/generate-hero.mjs
```

> **Key source:** Personal Gemini API key — NOT a shared team key. The key is never logged and must be set in the environment before running the script. See `scripts/generate-hero.mjs` for the exact guard.

Output: `docs/hero.png`

### Architecture diagrams

```bash
# Requires: @mermaid-js/mermaid-cli (already in devDeps — installed by npm install)
npx tsx scripts/generate-diagrams.ts
```

Output: `docs/pipeline-flow.svg`, `docs/cms-publish-sequence.svg`, `docs/schema.svg`, `docs/architecture.svg`

### UI mockup screenshots

```bash
# Requires: Playwright Chromium browser
npx playwright install chromium
npx tsx scripts/generate-mockups.ts
```

Output: `docs/mockups/keyword-input.png`, `docs/mockups/article-preview.png`, `docs/mockups/publish-dashboard.png`

### Run all at once

```bash
GEMINI_API_KEY=your-personal-key npm run generate:all
```

---

## Deployment (Vercel)

1. Import the repo in Vercel
2. Set **all** operator-supplied environment variables in the Vercel project settings
3. Deploy — the project builds as a standard Next.js 16 app

The `vercel.ts` config includes two placeholder cron jobs (token refresh, scheduled publish). These will error until operator-supplied handlers are wired up.

---

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` bypasses RLS — **server-only**. It is imported only via `src/lib/env.ts` which is marked `server-only`. Never import it in a `'use client'` component.
- CMS credentials (WordPress App Passwords, Shopify access tokens) are stored with AES-256-GCM envelope encryption in the `cms_connections` table. The `ciphertext`, `iv`, and `auth_tag` columns have `REVOKE SELECT` applied to the `authenticated` role — only the service role can read them.
- The `GEMINI_API_KEY` used by `generate-hero.mjs` is a **personal** key used only in script mode. It is never imported by the Next.js application and is excluded from the Vercel deployment environment.
- All child process invocations in the generate scripts use `execFile` (not `exec`) — arguments are passed as arrays, never shell-interpolated.
