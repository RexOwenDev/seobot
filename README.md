# SEOBot — AI Content & SEO Pipeline

> **Portfolio showcase · skeleton only.** Production-quality architecture for a keyword-driven SEO article pipeline with WordPress & Shopify publishing. Demonstrates TypeScript discipline, typed CMS adapters, a weighted SEO validation layer, and agency-grade pipeline design. No live API calls. No proprietary prompts. Operator methodology required for production use.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Tests](https://img.shields.io/badge/tests-115%20passing-22c55e)
![License](https://img.shields.io/badge/license-MIT-green)

---

## What it does

```
keyword phrase
      │
      ▼
  Research ──► Outline ──► Draft ──► SEO Audit ──► Publish
                                         │
                               ┌─────────┴──────────┐
                            WordPress           Shopify
                           REST API v2       Admin API
```

1. **Input** a target keyword phrase (plus intent, target length, locale)
2. **Research** the SERP — competitor headings, search intent, entities to cover
3. **Outline** with a proper H1/H2/H3 hierarchy and meta description
4. **Draft** the article body with suggested internal links
5. **Validate** against a 10-rule weighted SEO rubric — 0–100 score, pass/warn/fail per rule
6. **Publish** one-click to WordPress or Shopify via typed REST adapters

---

## Architecture

![Pipeline Flow](docs/pipeline-flow.svg)

| Layer | What it does |
|---|---|
| **Pipeline** | Research → Outline → Draft → Refine → Internal Links. Pure functions returning a typed `PipelineStageOutcome<T>`. |
| **SEO Validator** | 10 independent rules (H1 length, meta description, keyword density, Flesch readability, heading hierarchy, internal links, schema.org type, canonical URL). Weighted 0–100 score. |
| **CMS Adapters** | `draftToCanonical()` → `canonicalToWordPress()` / `canonicalToShopify()`. All three typed against real API contracts. |
| **API Routes** | Next.js server actions + two REST endpoints (`/api/cms/publish`, `/api/cms/test-connection`). Auth via Supabase session (not request body). |
| **Database** | Supabase PostgreSQL. RLS on every table. CMS credentials stored with envelope encryption (AES-256-GCM) — no plaintext column. |

---

## What's in this repo

- ✅ **TypeScript strict throughout** — `noUncheckedIndexedAccess`, `noImplicitOverride`
- ✅ **Typed pipeline** — `PipelineStageOutcome<T>` result type propagates through all 5 stages
- ✅ **WordPress REST v2 adapter** — exact payload shapes, Yoast SEO meta fields, App Password auth, `draft`/`publish`/`future` lifecycle
- ✅ **Shopify Admin API v2025-01 adapter** — `article.handle` (not `slug`), CSV tags (Shopify rejects arrays), SEO metafields in `seo.*` namespace
- ✅ **10-rule SEO validator** — H1, meta description, heading hierarchy, keyword density (ReDoS-safe), Flesch Reading Ease, internal links, schema.org type guard, canonical URL
- ✅ **Supabase schema** — 9 tables, workspace RLS, envelope-encrypted CMS credentials, idempotency-keyed publish jobs
- ✅ **Security headers** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options in `next.config.ts`
- ✅ **115 tests** — Vitest, typed fixtures, CMS adapter round-trips, SEO validator edge cases
- ✅ **Architecture diagrams** — Mermaid (pipeline flow, sequence, ER, system architecture)
- ✅ **UI mockups** — keyword input, article preview with SEO panel, publish dashboard

## What's **not** in this repo

- ❌ Live AI prompts or prompt templates
- ❌ Proprietary SEO scoring weights or rubric details
- ❌ Brand voice scoring logic
- ❌ Internal link graph algorithm
- ❌ Any customer or agency data

These belong to the operator methodology and live outside the open-source surface. The skeleton compiles and all types check — but producing a publishable article requires the operator layer on top.

---

## Database Schema

![Schema](docs/schema.svg)

---

## Quick Start (local type-checking only)

This project makes **no live API calls** in skeleton mode. You can run the type-checker and tests without any credentials.

```bash
git clone https://github.com/RexOwenDev/seobot.git
cd seobot
npm install
cp .env.example .env          # all values are operator-supplied placeholders
npm run type-check            # tsc --noEmit — should be clean
npm test                      # 115 tests, ~2s
```

For full setup including asset generation scripts, see [SETUP.md](SETUP.md).

---

## Feature Tiers

| | Starter | **Agency** | Enterprise |
|---|---|---|---|
| Keywords tracked | 25 | **Unlimited** | Unlimited |
| Articles / month | 50 | **500** | Unlimited |
| CMS connections | 1 | **10** | Unlimited |
| SEO validator | ✓ | **✓** | ✓ |
| Internal link graph | — | **✓** | ✓ |
| Custom brand voice | — | **✓** | ✓ |
| White-label dashboard | — | — | ✓ |
| SLA | — | — | 99.9% |
| **Price** | $49/mo | **$199/mo** | Custom |

> Pricing is indicative. This repo demonstrates the architecture — contact for operator methodology and deployment.

---

## Stack

| | |
|---|---|
| Framework | Next.js 16 App Router + React 19 |
| Language | TypeScript 5.7 strict (`noUncheckedIndexedAccess`) |
| Styling | Tailwind v4 + shadcn/ui (new-york theme, zinc) |
| Database | Supabase PostgreSQL (RLS + envelope-encrypted secrets) |
| AI | Vercel AI Gateway → Claude Sonnet 4.6 (stubbed) |
| CMS | WordPress REST API v2 · Shopify Admin API 2025-01 |
| Deployment | Vercel Fluid Compute (Node.js 24) |
| Tests | Vitest |

---

## FAQ

**Why is everything stubbed?**
The value of this project is the architecture and type discipline, not the prompts. Prompts are the operator methodology — they're what you pay for. The skeleton shows exactly what contracts to fulfill.

**Can I run this in production?**
Not from this repo alone. You need to wire up the AI Gateway, supply prompt templates, configure CMS credentials, and add authentication middleware. See [SETUP.md](SETUP.md).

**Does the SEO validator use real scoring?**
The 10 rules are all industry-standard (Flesch Reading Ease, Google's meta description length guidance, schema.org vocabulary). The scoring weights used to compute the 0–100 score are operator configuration — not shipped in this repo.

**Which WordPress version is supported?**
WordPress 5.0+ (REST API v2). Tested shapes against WP 6.x. Auth uses Application Passwords (WP 5.6+).

**Which Shopify plan is required?**
Any plan with the Admin API (Shopify Basic and above). Uses `2025-01` API version. Requires `write_content` scope on the access token.

---

## License

MIT — see [LICENSE](LICENSE).

---

*Built by [RexOwenDev](https://github.com/RexOwenDev) · Portfolio showcase — not a SaaS product*
