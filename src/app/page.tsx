import Link from 'next/link';

const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'Destination Research',
    description:
      'Enter a destination keyword. The engine researches search intent, competitor landscape, and wedding-specific entity coverage automatically.',
    badge: 'AI-powered',
  },
  {
    step: '02',
    title: 'Article Generation',
    description:
      'Outlines, drafts, and brand-voice refinement run sequentially. Internal link suggestions are ranked by relevance to your venue and vendor pages.',
    badge: 'Multi-stage pipeline',
  },
  {
    step: '03',
    title: 'WordPress Publish',
    description:
      'Pushes to your WordPress staging site via the REST API. Meta fields, canonical URLs, and schema.org data are set automatically. Review as draft before going live.',
    badge: 'WordPress REST API',
  },
] as const;

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-10 border-b border-[--color-border] bg-[--color-background]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <span className="text-sm font-semibold tracking-tight text-[--color-foreground]">
            Wedded Wonderland
          </span>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-md bg-[--color-foreground] px-3 py-2.5 text-sm font-medium text-[--color-primary-foreground] transition-colors hover:opacity-90"
            >
              Open Engine
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-4xl px-6 pb-16 pt-16 text-center sm:pt-24">
          <span className="mb-6 inline-block rounded-full border border-[--color-border] bg-[--color-muted] px-3 py-1 text-xs text-[--color-muted-foreground]">
            AI-powered · 2026
          </span>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-[--color-foreground] sm:text-5xl lg:text-6xl">
            Destination keyword in.{' '}
            <span className="text-[--color-accent]">Published article out.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-[--color-muted-foreground]">
            Enter a destination wedding keyword like Bali, Santorini, or Tuscany, and the engine
            generates a fully structured, SEO-optimised article ready to publish to your WordPress
            staging site as a draft.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-md bg-[--color-foreground] px-5 py-2.5 text-sm font-medium text-[--color-primary-foreground] transition-colors hover:opacity-90"
            >
              Try the Engine →
            </Link>
          </div>
        </section>

        {/* ── Workflow steps ────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6 py-20">
          <h2 className="mb-3 text-center text-2xl font-semibold tracking-tight text-[--color-foreground]">
            Three-stage content pipeline
          </h2>
          <p className="mb-12 text-center text-[--color-muted-foreground]">
            Each stage returns a typed result. The pipeline short-circuits on any error so nothing
            partial ever reaches publishing.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {WORKFLOW_STEPS.map(({ step, title, description, badge }) => (
              <div
                key={step}
                className="rounded-xl border border-[--color-border] bg-[--color-muted] p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-3xl font-bold text-[--color-border]">{step}</span>
                  <span className="rounded-full border border-[--color-border] px-2 py-0.5 text-xs text-[--color-muted-foreground]">
                    {badge}
                  </span>
                </div>
                <h3 className="mb-2 font-semibold text-[--color-foreground]">{title}</h3>
                <p className="text-sm leading-relaxed text-[--color-muted-foreground]">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Value callout ──────────────────────────────────────────────────── */}
        <section className="border-y border-[--color-border] bg-[--color-muted] py-16">
          <div className="mx-auto max-w-4xl px-6">
            <div className="grid gap-8 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="mb-3 text-xl font-semibold text-[--color-foreground]">
                  Built for destination SEO
                </h2>
                <p className="text-sm leading-relaxed text-[--color-muted-foreground]">
                  Articles target destination-specific search intent, capturing phrases like &ldquo;destination weddings
                  Bali&rdquo; and &ldquo;luxury wedding venues Santorini,&rdquo; feeding organic
                  demand signals directly into your CRM pipeline.
                </p>
              </div>
              <div>
                <h2 className="mb-3 text-xl font-semibold text-[--color-foreground]">
                  Draft-first publishing
                </h2>
                <p className="text-sm leading-relaxed text-[--color-muted-foreground]">
                  Every article lands in WordPress as a draft. Nothing goes live without your
                  review. Meta fields, canonical URLs, and structured data are pre-filled so your
                  team only needs to approve.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-[--color-border] py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-xs text-[--color-muted-foreground]">
          Wedded Wonderland Content Engine · 2026
        </div>
      </footer>
    </div>
  );
}
