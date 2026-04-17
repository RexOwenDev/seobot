# SEOBot — AI Content & SEO Pipeline

> **Portfolio showcase — skeleton only.** Production-quality architecture for a keyword-driven SEO article pipeline with WordPress & Shopify publishing. Demonstrates TypeScript discipline, typed CMS adapters, SEO validation, and agency-grade pipeline design. No live API calls. No proprietary prompts. Operator methodology required for production use.

**Stack:** Next.js 16 · React 19 · TypeScript strict · Tailwind v4 · shadcn/ui · Supabase · AI SDK v6 (Vercel AI Gateway) · WordPress REST API v2 · Shopify Admin API · Vercel Fluid Compute

---

## What it does

1. **Input** a target keyword (+ optional topic, intent, length target)
2. **Research** the SERP (stub — wired to real search data in production)
3. **Outline** with proper H1/H2/H3 hierarchy
4. **Draft** an SEO-optimized article
5. **Validate** against a weighted SEO rubric (headings, meta, readability, internal links, schema.org)
6. **Publish** one-click to WordPress or Shopify via typed REST adapters

## Build status

Phase 0 / 8 — Discovery in progress.

## Why this exists

Digital marketing agencies (2X, Regen Digital, WPH Digital, etc.) all build in-house SEO content pipelines. This repo is a phase-by-phase, persona-gated walkthrough of the architecture — what typed data shapes, what validators, what CMS adapter boundaries a production-ready pipeline requires.

## What's in this repo

- ✅ Typed TypeScript domain model for keywords, articles, publish jobs
- ✅ WordPress REST API v2 + Shopify Admin API adapters (payload shapes match real contracts)
- ✅ SEO validator layer (H1, meta description, heading hierarchy, readability, schema.org)
- ✅ Pipeline orchestration skeleton (research → outline → draft → validate → publish)
- ✅ Supabase schema with workspace-level RLS
- ✅ Architecture diagrams & component mockups

## What's **not** in this repo (and never will be)

- ❌ Live AI prompts or prompt templates
- ❌ Proprietary SEO rubric weights
- ❌ Brand voice scoring logic
- ❌ Any customer or agency data

These are part of the operator methodology and live outside the open-source surface.

## License

MIT — see `LICENSE`.
