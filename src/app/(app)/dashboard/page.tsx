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
  queued: 'text-stone-500 bg-stone-100 border-stone-200',
  researched: 'text-blue-600 bg-blue-50 border-blue-200',
  outlined: 'text-amber-600 bg-amber-50 border-amber-200',
  drafted: 'text-purple-600 bg-purple-50 border-purple-200',
  published: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

export default function DashboardPage() {
  const recentKeywords = DEMO_KEYWORDS.slice(0, 4);
  const recentArticle = DEMO_ARTICLES[0];

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-stone-500">Wedded Wonderland · demo mode</p>
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
        <section className="rounded-xl border border-stone-200 bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium text-stone-700">Recent keywords</h2>
            <Link href="/keywords" className="text-xs text-stone-500 hover:text-stone-700">
              View all →
            </Link>
          </div>
          <ul className="space-y-3">
            {recentKeywords.map(kw => (
              <li key={kw.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-stone-800">{kw.phrase}</p>
                  <p className="mt-0.5 text-xs text-stone-500">
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
          <section className="rounded-xl border border-stone-200 bg-surface p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-stone-700">Top article</h2>
              <Link
                href={`/articles/${recentArticle.id}`}
                className="text-xs text-stone-500 hover:text-stone-700"
              >
                Open →
              </Link>
            </div>
            <Link href={`/articles/${recentArticle.id}`} className="group block">
              <p className="mb-2 text-sm leading-snug text-stone-800 group-hover:text-stone-900">
                {recentArticle.h1}
              </p>
              <p className="mb-4 text-xs leading-relaxed text-stone-500 line-clamp-2">
                {recentArticle.metaDescription}
              </p>
            </Link>
            <div className="flex items-center gap-4 text-xs text-stone-500">
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
    <div className="rounded-xl border border-stone-200 bg-surface p-5">
      <p className="mb-1 text-xs text-stone-500">{label}</p>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
