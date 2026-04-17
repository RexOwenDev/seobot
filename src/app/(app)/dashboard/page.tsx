import Link from 'next/link';
import { DEMO_STATS, DEMO_KEYWORDS, DEMO_ARTICLES } from '@/lib/demo-data';

const STATUS_LABELS: Record<string, string> = {
  queued: 'Queued',
  researched: 'Researched',
  outlined: 'Outlined',
  drafted: 'Drafted',
  published: 'Published',
};

const STATUS_COLORS: Record<string, string> = {
  queued: 'text-zinc-500 bg-zinc-800 border-zinc-700',
  researched: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  outlined: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  drafted: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  published: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

export default function DashboardPage() {
  const recentKeywords = DEMO_KEYWORDS.slice(0, 4);
  const recentArticle = DEMO_ARTICLES[0];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-zinc-400">ForgeTorque workspace · demo mode</p>
      </div>

      {/* ── Stats cards ────────────────────────────────────────────────── */}
      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Keywords tracked" value={DEMO_STATS.keywordsTracked} />
        <StatCard label="Articles generated" value={DEMO_STATS.articlesGenerated} />
        <StatCard label="Articles published" value={DEMO_STATS.articlesPublished} />
        <StatCard label="Avg SEO score" value={`${DEMO_STATS.avgSeoScore}/100`} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* ── Recent keywords ──────────────────────────────────────────── */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-300">Recent keywords</h2>
            <Link href="/keywords" className="text-xs text-zinc-500 hover:text-zinc-300">
              View all →
            </Link>
          </div>
          <ul className="space-y-3">
            {recentKeywords.map(kw => (
              <li key={kw.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-zinc-200">{kw.phrase}</p>
                  <p className="mt-0.5 text-xs text-zinc-500">
                    {kw.searchVolume.toLocaleString()} vol · {kw.brand}
                  </p>
                </div>
                <span
                  className={[
                    'shrink-0 rounded border px-2 py-0.5 text-xs',
                    STATUS_COLORS[kw.status] ?? '',
                  ].join(' ')}
                >
                  {STATUS_LABELS[kw.status]}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Top article ──────────────────────────────────────────────── */}
        {recentArticle && (
          <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-zinc-300">Top article</h2>
              <Link
                href={`/articles/${recentArticle.id}`}
                className="text-xs text-zinc-500 hover:text-zinc-300"
              >
                Open →
              </Link>
            </div>
            <Link href={`/articles/${recentArticle.id}`} className="group block">
              <p className="mb-2 text-sm leading-snug text-zinc-200 group-hover:text-white">
                {recentArticle.h1}
              </p>
              <p className="mb-4 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                {recentArticle.metaDescription}
              </p>
            </Link>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>{recentArticle.wordCount.toLocaleString()} words</span>
              <span>SEO {recentArticle.seoScore}/100</span>
              <span
                className={[
                  'rounded border px-2 py-0.5',
                  recentArticle.publishedAt
                    ? STATUS_COLORS.published
                    : STATUS_COLORS.drafted,
                ].join(' ')}
              >
                {recentArticle.publishedAt ? 'Published' : 'Draft'}
              </span>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="mb-1 text-xs text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
