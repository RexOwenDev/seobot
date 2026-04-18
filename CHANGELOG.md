# Changelog

All notable changes to SEOBot are documented here. Follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.8.0] — 2026-04-19 — Phase 8: OSS Launch Prep

### Added

- `CONTRIBUTING.md` — Developer guide: prerequisites, setup, development workflow, coding standards (strict TS, `server-only` boundary, `execFile` requirement, Zod validation), testing expectations, PR process, architecture overview
- `SECURITY.md` — Security policy: vulnerability reporting procedure, full security decisions table, operator deployment checklist, out-of-scope items
- `.github/ISSUE_TEMPLATE/bug_report.yml` — GitHub issue form: environment info, reproduction steps, expected vs actual, OS dropdown
- `.github/ISSUE_TEMPLATE/feature_request.yml` — GitHub issue form: problem statement, proposed solution, feature area dropdown, scope guard checkbox
- `.github/PULL_REQUEST_TEMPLATE.md` — PR checklist: type-check / lint / test gates, security checklist (no secrets, Zod validation, `server-only` boundary, `execFile` usage, secrecy model guard)
- `.github/workflows/ci.yml` — GitHub Actions CI: three parallel jobs (type-check, lint, test) on push/PR to `main`, Node.js 24, npm cache, `concurrency` group with `cancel-in-progress`
- `.github/dependabot.yml` — Weekly Dependabot updates for npm + GitHub Actions; groups `@typescript-eslint/*`, `@supabase/*`, React packages; ignores Next.js + Tailwind major bumps

### Changed

- `eslint.config.mjs` — Migrated from `FlatCompat` bridge to native ESLint v9 flat config; removes circular-reference crash with Next.js 16's legacy plugin structure; adds `varsIgnorePattern: '^_'` to `no-unused-vars` rule
- `package.json` — `lint` script changed from `next lint` → `eslint src` (Next.js 16 removed the `next lint` CLI command in v16.2.4)
- `src/app/api/cms/publish/route.ts` — Split `NextRequest` to `import type` (consistent-type-imports compliance)
- `src/app/api/cms/test-connection/route.ts` — Same `import type` split
- `src/lib/seo/validators/internal-links.ts` — Removed stale `// eslint-disable-next-line no-cond-assign` directive (rule not enabled in new flat config)

### Security

- Final `git grep` scan across all source files confirms zero hardcoded credentials — all references are `process.env.*` reads or empty `.env.example` placeholders
- CI enforces type-check + lint + test on every push and PR — drift from passing baseline is immediately surfaced

## [0.7.0] — 2026-04-19 — Phase 7: Docs, Diagrams & Showcase Polish

### Added

- `scripts/generate-hero.mjs` — Gemini Imagen 4.0 hero image generator; guards missing API key with `process.exit(1)` before any API call; writes binary PNG via `fs.writeFile` (no shell commands)
- `scripts/generate-diagrams.ts` — Mermaid CLI diagram renderer; uses `execFile` (not `exec`) — all arguments passed as an array, never shell-interpolated; breaks on ENOENT to surface missing `mmdc` binary early
- `scripts/generate-mockups.ts` — Playwright headless Chromium screenshots; validates source HTML existence before launching browser; loads pages via `file://` protocol (zero network access)
- `docs/diagrams/pipeline-flow.mmd` — Keyword → Research → Outline → Draft → SEO Audit → Publish flowchart
- `docs/diagrams/cms-publish-sequence.mmd` — Full sequence diagram: credential decrypt RPC → publish job → CMS adapter → WP/Shopify REST → DB update; includes retry/idempotency note
- `docs/diagrams/schema.mmd` — ER diagram for all 9 tables with field types, constraints, and relationship cardinality
- `docs/diagrams/architecture.mmd` — System architecture: browser → server actions → pipeline/SEO/CMS layers → Supabase + external APIs
- `docs/mockups/keyword-input.html` — Fully self-contained dark-themed keyword input page mockup (no CDN, no external scripts)
- `docs/mockups/article-preview.html` — Article preview + SEO panel mockup (10-rule verdict list, score badge, internal links toggle)
- `docs/mockups/publish-dashboard.html` — CMS connections grid + publish jobs table mockup
- `README.md` — Full rewrite: badges, ASCII pipeline diagram, architecture table, feature tiers, quick-start, FAQ; no proprietary weights or methodology
- `SETUP.md` — Environment variable reference (all values `operator-supplied`), database migration steps, asset generation prerequisites, security notes
- `docs/architecture.md` — High-level design doc: layer overview, data model, RLS, CMS credential security, security decisions table
- `docs/seo-rules.md` — Per-rule documentation (10 rules): verdict conditions, SEO rationale, formula reference; scoring weights deliberately omitted (operator config)
- `docs/cms-integrations.md` — WordPress REST API v2 + Shopify Admin API 2025-01 reference: endpoints, auth patterns, payload shapes, taxonomy resolution, critical quirks (tags as CSV, WP POST-for-update)
- `package.json` — Added `@google/genai`, `@mermaid-js/mermaid-cli`, `@playwright/test` to devDependencies (asset generation scripts only — not bundled with Next.js app)

### Security

- All child-process invocations use `execFile` (not `exec`) — shell injection surface eliminated
- `generate-hero.mjs` guards `GEMINI_API_KEY` absence with an actionable error and `process.exit(1)` before constructing the API client — key is never logged
- Mockup HTML files contain no external resource fetches — screenshots are produced from local static HTML only
- `SETUP.md` explicitly documents which secrets are server-only and why the `GEMINI_API_KEY` must not be set in the Vercel deployment environment

---

## [0.6.0] — 2026-04-18 — Phase 6: SEO Validation Layer

### Added

- `src/lib/seo/constants.ts` — `SEO_RULES` registry (10 keys), `WEIGHTS` (runtime guard: must sum to 100), `THRESHOLDS` (ready/needs_work/reject tiers), and per-rule limit constants (`H1_LIMITS`, `META_LIMITS`, `DENSITY_LIMITS`, `READABILITY_LIMITS`, `INTERNAL_LINK_LIMITS`)
- `src/lib/seo/scoring.ts` — `computeScore(results)` → weighted 0–100 integer; `scoreToVerdict(score)` → `'ready' | 'needs_work' | 'reject'`; `buildSeoReport(articleId, results)` → `SEOReport`
- `src/lib/seo/validators/h1.ts` — `validateH1Length()` (30–70 pass, 71–100 warn, else fail) + `validateH1Keyword()` (exact match → pass, ≥ 75% word coverage → warn)
- `src/lib/seo/validators/meta-description.ts` — `validateMetaLength()` (150–160 pass, 120–149 or 161–175 warn) + `validateMetaKeyword()`
- `src/lib/seo/validators/heading-hierarchy.ts` — walks consecutive section levels; skip > 1 is a violation; level drops allowed (closing a subsection)
- `src/lib/seo/validators/keyword-density.ts` — phrase-level density via `indexOf` loop (ReDoS-safe — no regex on untrusted input); 0.8–2.5% pass, 0.5–0.79% or 2.6–3.5% warn
- `src/lib/seo/validators/readability.ts` — Flesch Reading Ease (206.835 − 1.015 × ASL − 84.6 × ASW); vowel-group syllable approximation; ≥ 60 pass, 45–59 warn
- `src/lib/seo/validators/internal-links.ts` — Markdown link extraction; deduplicates by href; filters external/anchor-only; ≥ 2 unique internal links pass, 1 warn, 0 fail
- `src/lib/seo/validators/schema-org.ts` — `Set` of 5 valid types: `Article`, `BlogPosting`, `NewsArticle`, `HowTo`, `FAQPage`; missing or unrecognised → fail
- `src/lib/seo/validators/canonical.ts` — `new URL()` validation; `null` → warn, valid `https:` absolute URL → pass, malformed/relative/http → fail
- `src/lib/seo/validators/index.ts` — barrel + `validateArticle(articleId, draft, keyword): SEOReport` — pure, synchronous, no I/O
- `tests/seo-validators.test.ts` — 68 tests: constants sanity (weight sum), all 8 validators, edge cases, `computeScore`, `scoreToVerdict`, full `validateArticle` integration with `GOOD_DRAFT` (score ≥ 80) and `BAD_DRAFT` (several fails)

### Security

- `server-only` on all SEO library files — prevents scoring weights from being bundled into the client
- Keyword density validator uses `indexOf` loop, not regex — no ReDoS exposure on operator-supplied keyword phrases
- `noUncheckedIndexedAccess` guard pattern: `sections[i-1]` and `sections[i]` checked for `undefined` before use in the heading hierarchy validator

---

## [0.5.0] — 2026-04-18 — Phase 5: UI Layer

### Added

- `src/app/page.tsx` — Public landing page: hero with ASCII pipeline diagram, 3-step workflow, architecture callout cards, pricing tiers (Starter $49 / Agency $199 / Enterprise)
- `src/app/(app)/layout.tsx` — App shell: sidebar (desktop, w-56) + top-nav (mobile); both built from `NAV_LINKS` constant
- `src/app/(app)/dashboard/page.tsx` — 4 stats cards (keywords tracked, articles generated, published, avg SEO score) + recent keywords table + top article card
- `src/app/(app)/keywords/page.tsx` — Keyword input form + tracked keywords table with difficulty bar and intent badges
- `src/app/(app)/articles/page.tsx` — Articles index list with SEO score, status, word count
- `src/app/(app)/articles/[id]/page.tsx` — Two-column layout: article preview (H2/H3 section cards) + SEO panel (score badge + rule list); `generateStaticParams()` for demo IDs
- `src/app/(app)/publish/page.tsx` — CMS connections grid + publish job table
- `src/components/layout/nav-links.tsx` — Active-state nav via `usePathname()` (`'use client'`)
- `src/components/keywords/keyword-input-form.tsx` — Controlled form with intent select (`'use client'`)
- `src/components/keywords/keyword-table.tsx` — Difficulty bar (green/yellow/red threshold), intent badge, link to article
- `src/components/articles/article-preview.tsx` — H2/H3 section cards with word counts (server component)
- `src/components/articles/seo-panel.tsx` — Score badge + pass/warn/fail verdict list (server component)
- `src/components/articles/internal-links-panel.tsx` — Accept/reject toggle with local state (`'use client'`)
- `src/components/publish/cms-connection-card.tsx` — Provider, status badge, siteUrl, last-checked timestamp
- `src/components/publish/publish-job-table.tsx` — Status badges, external URL link
- `src/components/pricing/pricing-tiers.tsx` — Starter / Agency (highlighted) / Enterprise tier cards
- `src/lib/demo-data.ts` — All fixture data: keywords, articles, SEO verdicts, internal links, CMS connections, publish jobs, stats (all fictional: ForgeTorque, LuxDermis, VeloCargo)
- `vitest.config.ts` — Added `css: false`; `@tailwindcss/postcss` added to devDeps

### Design decisions

- `'use client'` only where required: `nav-links` (usePathname), `keyword-input-form` (useState), `internal-links-panel` (toggle state)
- SEO verdict colors: pass=emerald-400, warn=yellow-400, fail=red-400 (consistent with article preview panel)
- JSON fixture imports use `as unknown as T` not `satisfies T` — TypeScript widens JSON string literals to `string`, which fails literal union type checks
- Landing page at `app/page.tsx` (not a route group) — overwriting Phase 1 placeholder avoids route-group root conflicts

---

## [0.4.0] — 2026-04-18 — Phase 4: CMS Integration Skeleton ★

### Added

- `src/types/cms.ts` — added `CmsErrorCode`, `CmsOperationResult<T>`, `CmsOperationError`, `CmsOperationOutcome<T>` (Result/Either for CMS API calls)
- `src/lib/cms/wordpress/client.ts` — `WordPressClient` shape + `createWordPressClient()` factory; Basic auth from App Password with space-stripping; SSRF note (siteUrl must come from env, not user input)
- `src/lib/cms/wordpress/posts.ts` — `createPost()`, `updatePost()`, `getPost()` stubs with exact WP REST v2 payload types and documented endpoint paths
- `src/lib/cms/wordpress/media.ts` — `uploadFeaturedImage()` stub; multipart binary upload pattern documented (NOT JSON, requires raw blob + Content-Disposition header)
- `src/lib/cms/wordpress/taxonomy.ts` — `getOrCreateCategory()`, `getOrCreateTag()` stubs; `resolveCategoryIds()` / `resolveTagIds()` batch helpers
- `src/lib/cms/shopify/client.ts` — `ShopifyClient` shape + `createShopifyClient()` factory; `X-Shopify-Access-Token` auth; API version pinned to `2025-01`
- `src/lib/cms/shopify/articles.ts` — `createArticle()`, `updateArticle()`, `getArticle()` stubs with exact Shopify Admin API v2025-01 payload types
- `src/lib/cms/shopify/blogs.ts` — `listBlogs()` stub; `getOrCreateBlog()` with list-then-create pattern documented
- `src/lib/cms/adapters.ts` — three-function canonical adapter layer:
  - `draftToCanonical(draft, options)` — assembles `CanonicalPublishPayload` incl. Markdown→HTML conversion stub (TODOed for Unified.js in Phase 5)
  - `canonicalToWordPress(payload, options?)` — maps to `WordPressPostCreate`; Yoast meta fields; pre-resolved category/tag IDs; `date` field set for `status='future'`
  - `canonicalToShopify(payload, options)` — maps to `ShopifyArticleCreate`; tags array → CSV string (Shopify API requirement); SEO metafields in `seo.*` namespace
- `src/lib/cms/publish.ts` — `publishArticle(articleId, cmsConnectionId)` stub; production flow documented in JSDoc (decrypt RPC → adapter → CMS create → publish_jobs row)
- `src/lib/cms/index.ts` — barrel export for all CMS functions and types
- `src/app/api/cms/publish/route.ts` — `POST /api/cms/publish` skeleton; Zod body validation; returns 202 with fake job ID; auth middleware absent (Phase 5)
- `src/app/api/cms/test-connection/route.ts` — `POST /api/cms/test-connection` skeleton; accepts `cmsConnectionId` UUID (credentials looked up from DB — never in request body); returns fixture verified status
- `tests/cms-adapters.test.ts` — 24 tests covering the full adapter chain:
  - `draftToCanonical`: title/slug/meta/canonicalUrl/bodyHtml/tags/featuredImage mapping
  - `canonicalToWordPress`: all field mappings including Yoast meta, status, future date, category/tag IDs
  - `canonicalToShopify`: handle vs slug, CSV tags, published bool, seo.description/canonical_url metafields
  - Round-trip: WP + Shopify outputs share same title and meta description

### Design decisions

- `canonicalToShopify` converts `tags: string[]` → CSV string explicitly with a comment explaining the bug it prevents — Shopify will store `"[object Object]"` if passed an array
- CMS credentials never enter the API route body — `cmsConnectionId` (UUID) is the only credential reference; Phase 5 decrypts via service-role Supabase RPC
- WP App Password spaces are stripped at client creation, not at call time — documented in `createWordPressClient()` comments
- Auth middleware absent from route handlers in Phase 4 — noted explicitly in each route to prevent P04 false veto; Phase 5 adds Supabase session verification

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
