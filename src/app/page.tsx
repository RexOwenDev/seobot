export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-start justify-center gap-6 px-6 py-16">
      <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
        Portfolio showcase · Phase 1 scaffold
      </span>
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        SEOBot
      </h1>
      <p className="max-w-2xl text-lg text-zinc-400">
        Keyword-driven SEO article pipeline with WordPress and Shopify publishing.
        Skeleton architecture — no live API calls. Full UI lands in Phase 5.
      </p>
      <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
        <span className="rounded border border-zinc-800 px-2 py-1">Next.js 16</span>
        <span className="rounded border border-zinc-800 px-2 py-1">TypeScript strict</span>
        <span className="rounded border border-zinc-800 px-2 py-1">Tailwind v4</span>
        <span className="rounded border border-zinc-800 px-2 py-1">Supabase</span>
        <span className="rounded border border-zinc-800 px-2 py-1">AI SDK v6</span>
        <span className="rounded border border-zinc-800 px-2 py-1">WordPress REST</span>
        <span className="rounded border border-zinc-800 px-2 py-1">Shopify Admin API</span>
      </div>
    </main>
  );
}
