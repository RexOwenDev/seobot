# Changelog

All notable changes to SEOBot are documented here. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.1.0] — 2026-04-18 — Phase 1: Repo Foundation

### Added

- Next.js 16 App Router scaffold with React 19
- TypeScript strict mode with `noUncheckedIndexedAccess`
- Tailwind v4 with `@theme` design tokens
- shadcn/ui configuration (new-york theme, zinc base)
- `next.config.ts` with hardened security headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS)
- `vercel.ts` TypeScript Vercel config with placeholder cron definitions
- `.env.example` documenting all operator-supplied credentials (AI Gateway, Supabase, WordPress, Shopify, Google Search Console, Gemini)
- `src/lib/env.ts` Zod-validated env parsing (server + client split)
- Folder scaffold: `src/app/`, `src/components/ui/`, `src/lib/{seo,cms,ai}`, `src/types/`, `supabase/`, `scripts/`, `docs/`, `.github/`
- ESLint flat config extending `next/core-web-vitals` + `next/typescript`

## [0.0.1] — 2026-04-18 — Phase 0: Discovery

### Added

- Initial README with portfolio-demo disclaimer
- MIT LICENSE
- `.gitignore` hardened to exclude methodology files
