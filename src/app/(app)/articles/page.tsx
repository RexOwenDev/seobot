import Link from 'next/link';
import { DEMO_ARTICLES } from '@/lib/demo-data';

export default function ArticlesPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Articles</h1>
        <p className="text-sm text-stone-500">Review, refine, and publish your AI-drafted content.</p>
      </div>

      <div className="space-y-3">
        {DEMO_ARTICLES.map(article => (
          <Link
            key={article.id}
            href={`/articles/${article.id}`}
            className="group flex items-start justify-between gap-4 rounded-xl border border-stone-200 bg-surface p-5 transition-colors hover:border-stone-300"
          >
            <div className="min-w-0">
              <p className="mb-1 text-sm font-medium text-stone-800 group-hover:text-stone-900">
                {article.h1}
              </p>
              <p className="text-xs leading-relaxed text-stone-500 line-clamp-2">
                {article.metaDescription}
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-400">
                <span>{article.wordCount.toLocaleString()} words</span>
                <span>SEO {article.seoScore}/100</span>
                <span>/{article.slug}</span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              {article.publishedAt ? (
                <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600">
                  Published
                </span>
              ) : (
                <span className="rounded border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs text-purple-600">
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
