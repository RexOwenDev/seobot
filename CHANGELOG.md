# Changelog

All notable changes to SEOBot are documented here. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.3.0] — 2026-04-18 — Phase 3: Pipeline Stub Layer

### Added

- `src/lib/ai/client.ts` — AI Gateway config constants (`AI_MODEL`, `TOKEN_BUDGETS`, `TEMPERATURE_PROFILES`), server-only; no live calls in this phase
- `src/lib/pipeline/research.ts` — `researchKeyword(input)` stub returning typed `ResearchReport` fixture
- `src/lib/pipeline/outline.ts` — `generateOutline(research, input)` stub returning typed `Outline` fixture (respects `input.targetLength`)
- `src/lib/pipeline/draft.ts` — `generateDraft(outline, input)` stub returning typed `Draft` fixture with full H2/H3 section hierarchy and body Markdown
- `src/lib/pipeline/refine.ts` — `refineDraft(draft, input)` stub (respects `requiredEntities`, `bannedTerms`, `tone` params; Phase 5 fills in AI call)
- `src/lib/pipeline/internal-links.ts` — `suggestInternalLinks(draft, existingArticles)` stub returning typed `InternalLinkSuggestion[]` fixture
- `src/lib/pipeline/orchestrator.ts` — `runPipeline(input, existingArticles?)` chains all 5 stages with early-return on `PipelineStageError`
- `src/lib/pipeline/index.ts` — clean barrel export for all pipeline functions
- All prompt template strings replaced with `"// TODO: operator-supplied prompt — see internal methodology doc"` — methodology stays private
- `src/types/pipeline.ts` — added `ExistingArticleRef` and `PipelineResult` types
- `tests/fixtures/pipeline/research.json` — typed fixture matching `ResearchReport`
- `tests/fixtures/pipeline/outline.json` — typed fixture matching `Outline` (h1 20-80 chars, meta 120-170 chars, slug regex-valid)
- `tests/fixtures/pipeline/draft.json` — typed fixture matching `Draft` with 11 sections and full body Markdown
- `tests/fixtures/pipeline/refined-draft.json` — typed fixture matching `Draft` (brand-voice refined variant)
- `tests/fixtures/pipeline/internal-links.json` — typed fixture matching `InternalLinkSuggestion[]`
- `tests/pipeline.test.ts` — stage-by-stage and full orchestrator tests with `satisfies` type guards on all fixtures
- `tests/__mocks__/server-only.ts` — empty vitest mock; prevents `server-only` from throwing in Node test environment
- `vitest.config.ts` — vitest config with `@/*` → `src/*` alias and `server-only` mock alias
- `server-only` added to `dependencies`; `vitest` added to `devDependencies`; `test` + `test:watch` scripts added

### Design decisions

- Every pipeline stage returns `PipelineStageOutcome<T>` — the orchestrator short-circuits on the first error, surfaces the failing stage name in the error message
- Fixture data uses ForgeTorque (fictional industrial tools brand from `seed.sql`) so demos stay coherent with the workspace data
- `durationMs: 0` in the orchestrator is intentional for Phase 3; per-stage timing is tracked individually and available to callers who need it

## [0.2.0] — 2026-04-18 — Phase 2: Data Model & Type Layer

### Added

- 9 SQL migrations under `supabase/migrations/`:
  - `001_workspaces.sql` — workspaces + workspace_members with role-scoped RLS
  - `002_keywords.sql` — keyword phrases with search volume, difficulty, intent classification
  - `003_briefs.sql` — content briefs (required entities, banned terms, status lifecycle)
  - `004_articles.sql` — SEO-critical fields (`h1`, `slug`, `meta_description`) enforced as `NOT NULL` with length/shape checks
  - `005_article_sections.sql` — structured heading hierarchy (H2–H4), not a Markdown blob
  - `006_internal_links.sql` — link graph with accept/reject and relevance score
  - `007_cms_connections.sql` — envelope encryption columns (ciphertext/iv/auth_tag/key_version); direct column access revoked from `authenticated`
  - `008_publish_jobs.sql` — job queue with retry counter + idempotency key
  - `009_seo_audits.sql` — per-rule validator results with jsonb details
- Workspace-scoped RLS on every table (owner/editor/viewer role gating)
- `supabase/seed.sql` — one fictional agency workspace, three fictional campaigns (ForgeTorque, LuxDermis, VeloCargo), no real client data
- TypeScript domain types in `src/types/`:
  - `database.ts` — every table + enum mirrored, ciphertext columns excluded from the application type
  - `seo.ts` — `MetaTags`, `SchemaOrgArticle`, `Heading`, `ArticleForRender`, `SEOReport`
  - `cms.ts` — real WP REST v2 + Shopify Admin API shapes, discriminated union for adapter dispatch
  - `pipeline.ts` — `KeywordInput`, `ResearchReport`, `Outline`, `Draft`, `InternalLinkSuggestion`, result/error sum type

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
