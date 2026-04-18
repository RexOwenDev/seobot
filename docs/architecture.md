# Architecture

SEOBot is a Next.js 16 application with a clearly-separated layer stack. This document describes each layer without including proprietary prompt templates, scoring weights, or methodology details.

## System diagram

![Architecture](architecture.svg)

## Layer overview

### Browser layer

A Next.js 16 App Router application with React 19. Server Components render article previews, SEO panels, and publish dashboards. Client Components are used only where interactivity is required: the keyword input form (controlled inputs), the nav sidebar (active-state detection via `usePathname`), and the internal link accept/reject panel (local toggle state).

### Server layer (Vercel Fluid Compute, Node.js 24)

#### Server Actions and API Routes

Server actions handle form submissions (keyword input, publish triggers). Two REST routes are exposed:

- `POST /api/cms/publish` — validates request body with Zod, queues a publish job, returns 202
- `POST /api/cms/test-connection` — accepts a `cmsConnectionId` UUID and returns verified status

Credentials are never accepted in a request body. The `cmsConnectionId` UUID is the only identifier passed over the wire — decryption happens server-side via a Supabase service-role RPC.

#### Pipeline layer

Five pure async functions, each returning `PipelineStageOutcome<T>`:

```
researchKeyword(input: KeywordInput)        → PipelineStageOutcome<ResearchReport>
generateOutline(research, input)            → PipelineStageOutcome<Outline>
generateDraft(outline, input)               → PipelineStageOutcome<Draft>
refineDraft(draft, input)                   → PipelineStageOutcome<Draft>
suggestInternalLinks(draft, existingRefs)   → PipelineStageOutcome<InternalLinkSuggestion[]>
```

The orchestrator (`runPipeline`) chains all five with early-return on error. In skeleton mode each function returns typed fixture data. In production each wraps a Vercel AI Gateway call — prompt templates are operator-supplied and not in this repository.

#### SEO Validator layer

Ten independent pure synchronous validator functions returning `RuleResult`:

```
validateH1(draft, keyword)              → readonly RuleResult[]  (length + keyword — 2 results)
validateMetaDescription(draft, keyword) → readonly RuleResult[]  (length + keyword — 2 results)
validateHeadingHierarchy(draft)         → RuleResult
validateKeywordDensity(draft, keyword)  → RuleResult
validateReadability(draft)              → RuleResult
validateInternalLinks(draft)            → RuleResult
validateSchemaOrg(draft)                → RuleResult
validateCanonical(draft)                → RuleResult
```

`validateArticle(articleId, draft, keyword)` aggregates all rules and calls `buildSeoReport()` → `SEOReport`. No I/O. No side effects. See [seo-rules.md](seo-rules.md) for per-rule documentation.

#### CMS Adapter layer

Three-function canonical adapter pattern:

```
draftToCanonical(draft, options)                          → CanonicalPublishPayload
canonicalToWordPress(payload, options?)                   → WordPressPostCreate
canonicalToShopify(payload, { blogId, author })           → ShopifyArticleCreate
```

This layer isolates CMS-specific quirks (Shopify `handle` vs `slug`, tag CSV vs array, Yoast meta fields) from the domain model. Adding a new CMS target means adding a new `canonicalTo*` function — the pipeline and domain types are unchanged.

---

## Data model

![Schema](schema.svg)

Nine PostgreSQL tables in Supabase:

| Table | Purpose |
|---|---|
| `workspaces` | Multi-tenant root. All data is workspace-scoped. |
| `workspace_members` | User ↔ workspace membership with `owner / editor / viewer` roles |
| `keywords` | Tracked keyword phrases with volume, difficulty, intent, cluster |
| `briefs` | Content briefs: required entities, banned terms, status lifecycle |
| `articles` | SEO-critical fields enforced as `NOT NULL` with DB-level length checks |
| `article_sections` | Structured H2/H3/H4 sections with ordered positions (not a Markdown blob) |
| `internal_links` | Suggested internal links with relevance score and accept/reject flag |
| `cms_connections` | CMS credentials stored AES-256-GCM encrypted (ciphertext + iv + auth_tag + key_version) |
| `publish_jobs` | Async publish queue with idempotency key, attempt counter, and status lifecycle |
| `seo_audits` | Per-rule validator results with overall score and per-rule details |

### Row-level security

Every table has workspace-scoped RLS policies. Users can only read and write rows that belong to workspaces they are members of. Role checks: `owner` can manage connections and delete content; `editor` can create and edit; `viewer` has read-only access.

### CMS credential security

The `cms_connections` table stores encrypted credentials, never plaintext. Columns:

- `ciphertext bytea` — AES-256-GCM ciphertext
- `iv bytea(12)` — unique 12-byte nonce per encryption operation
- `auth_tag bytea(16)` — GCM authentication tag
- `key_version int` — for key rotation

The `authenticated` Supabase role has `REVOKE SELECT (ciphertext, iv, auth_tag)` applied — raw credential bytes are never readable by client-side code. Decryption is a service-role RPC only.

---

## CMS publish flow

![CMS Publish Sequence](cms-publish-sequence.svg)

See [cms-integrations.md](cms-integrations.md) for WordPress and Shopify endpoint details.

---

## Security decisions

| Decision | Rationale |
|---|---|
| `server-only` on all SEO and CMS modules | Prevents Next.js from bundling scoring weights or CMS logic into the client bundle |
| `execFile` not `exec` in generate scripts | No shell interpolation — args passed as arrays directly to the OS |
| Zod validation on all API route bodies | Unknown fields are stripped; required fields are enforced at the boundary |
| Credentials by UUID reference (not body) | The publish route accepts `cmsConnectionId`, not raw credentials — no credential handling in HTTP request handlers |
| `noUncheckedIndexedAccess` TS flag | Array and object accesses return `T | undefined`, forcing explicit checks — eliminates a whole class of undefined-is-not-a-function runtime errors |
| CSP, HSTS, X-Frame-Options in `next.config.ts` | Applied at the Next.js middleware layer before any route handler — cannot be bypassed by a route |
