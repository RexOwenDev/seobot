import Link from 'next/link';
import { PricingTiers } from '@/components/pricing/pricing-tiers';

// Three workflow steps shown in the landing page diagram
const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Keyword Research',
    description:
      'Enter a keyword phrase. SEOBot researches search intent, competitor landscape, and entity coverage automatically.',
    badge: 'AI-powered',
  },
  {
    step: '02',
    title: 'Article Generation',
    description:
      'Outlines, drafts, and brand-voice refinement run sequentially. Internal link suggestions are ranked by relevance score.',
    badge: 'Multi-stage pipeline',
  },
  {
    step: '03',
    title: 'One-Click Publish',
    description:
      'Pushes to WordPress or Shopify via the REST API. Yoast meta fields, canonical URLs, and schema.org data are set automatically.',
    badge: 'WordPress + Shopify',
  },
] as const;

const STACK_BADGES = [
  'Next.js 16',
  'React 19',
  'TypeScript strict',
  'Tailwind v4',
  'Supabase',
  'AI SDK v6',
  'WordPress REST',
  'Shopify Admin API',
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="text-sm font-semibold tracking-tight">SEOBot</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/RexOwenDev/seobot"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 transition-colors hover:text-zinc-200"
            >
              GitHub
            </a>
            <Link
              href="/dashboard"
              className="rounded-md bg-zinc-100 px-3 py-1.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
            >
              View Demo
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-4xl px-6 pb-16 pt-24 text-center">
          <span className="mb-6 inline-block rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
            Portfolio showcase · skeleton architecture · no live API calls
          </span>
          <h1 className="mb-4 text-5xl font-semibold tracking-tight sm:text-6xl">
            Keyword in.{' '}
            <span className="text-zinc-400">Published article out.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400">
            SEOBot is a typed, multi-stage AI pipeline that takes a keyword phrase and produces a
            publish-ready SEO article — then pushes it directly to WordPress or Shopify.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-md bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
            >
              Explore Demo →
            </Link>
            <a
              href="https://github.com/RexOwenDev/seobot"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-200"
            >
              View Source
            </a>
          </div>
        </section>

        {/* ── Stack badges ─────────────────────────────────────────────────── */}
        <section className="border-y border-zinc-800 bg-zinc-900/40 py-5">
          <div className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2 px-6">
            {STACK_BADGES.map(badge => (
              <span
                key={badge}
                className="rounded border border-zinc-800 px-2.5 py-1 text-xs text-zinc-500"
              >
                {badge}
              </span>
            ))}
          </div>
        </section>

        {/* ── Workflow steps ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight">
            Three-stage pipeline
          </h2>
          <p className="mb-12 text-center text-zinc-400">
            Each stage returns a typed result. The orchestrator short-circuits on the first error.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {WORKFLOW_STEPS.map(({ step, title, description, badge }) => (
              <div
                key={step}
                className="rounded-xl border border-zinc-800 bg-zinc-900 p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-zinc-700">{step}</span>
                  <span className="rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-500">
                    {badge}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Architecture callout ──────────────────────────────────────────── */}
        <section className="border-y border-zinc-800 bg-zinc-900/30 py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-8 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="mb-3 text-xl font-semibold">Typed from edge to CMS</h2>
                <p className="text-sm leading-relaxed text-zinc-400">
                  A canonical adapter layer normalises WordPress and Shopify into a single
                  publish payload. Yoast meta fields, handle vs slug, CSV tag format — all handled
                  by the adapter. Your pipeline code never touches CMS specifics.
                </p>
              </div>
              <div>
                <h2 className="mb-3 text-xl font-semibold">Credential security by design</h2>
                <p className="text-sm leading-relaxed text-zinc-400">
                  CMS credentials are envelope-encrypted at rest in Supabase. API routes accept
                  only a UUID connection reference — credentials never traverse the request body.
                  RLS policies enforce workspace isolation at the row level.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight">
            Simple, agency-friendly pricing
          </h2>
          <p className="mb-12 text-center text-zinc-400">
            All tiers include unlimited keywords and full pipeline access.
          </p>
          <PricingTiers />
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-zinc-600">
          SEOBot is a portfolio project by{' '}
          <a
            href="https://github.com/RexOwenDev"
            className="text-zinc-500 hover:text-zinc-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            RexOwenDev
          </a>
          . Fictional brands (ForgeTorque, LuxDermis, VeloCargo) — no real client data.
        </div>
      </footer>
    </div>
  );
}
