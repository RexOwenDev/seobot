import Link from 'next/link';
import { DEMO_ARTICLES } from '@/lib/demo-data';

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Articles</h1>
        <p className="text-sm text-zinc-400">Generated articles across all workspaces.</p>
      </div>

      <div className="space-y-3">
        {DEMO_ARTICLES.map(article => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="group flex items-start justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-zinc-700"
          >
            <div className="min-w-0">
              <p className="mb-1 text-sm font-medium text-zinc-200 group-hover:text-white">
                {article.h1}
              </p>
              <p className="text-xs leading-relaxed text-zinc-500 line-clamp-2">
                {article.metaDescription}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-zinc-600">
                <span>{article.wordCount.toLocaleString()} words</span>
                <span>SEO {article.seoScore}/100</span>
                <span>/{article.slug}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              {article.publishedAt ? (
                <span className="rounded border border-emerald-400/20 bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-400">
                  Published
                </span>
              ) : (
                <span className="rounded border border-zinc-700 bg-zinc-800 px-2 py-0.5 text-xs text-zinc-500">
                  Draft
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
