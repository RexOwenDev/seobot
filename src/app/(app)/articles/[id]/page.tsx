import { notFound } from 'next/navigation';
import Link from 'next/link';
import { DEMO_ARTICLES } from '@/lib/demo-data';
import { ArticlePreview } from '@/components/articles/article-preview';
import { SeoPanel } from '@/components/articles/seo-panel';
import { InternalLinksPanel } from '@/components/articles/internal-links-panel';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return DEMO_ARTICLES.map(a => ({ id: a.id }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = DEMO_ARTICLES.find(a => a.id === id);

  if (!article) notFound();

  return (
    <div className="mx-auto max-w-5xl">
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-zinc-500">
        <Link href="/keywords" className="hover:text-zinc-300">
          Keywords
        </Link>
        <span className="mx-2">›</span>
        <span className="text-zinc-400 line-clamp-1">{article.h1}</span>
      </nav>

      {/* Publish status banner */}
      {article.publishedAt && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-xs text-emerald-400">
          <span>✓</span>
          <span>
            Published on{' '}
            {new Date(article.publishedAt).toLocaleDateString('en-CA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {article.cmsConnectionId && (
            <Link
              href="/publish"
              className="ml-auto underline-offset-2 hover:underline"
            >
              View publish job →
            </Link>
          )}
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        {/* Left: article content */}
        <div className="space-y-5">
          <ArticlePreview article={article} />
          <InternalLinksPanel links={article.internalLinks} />
        </div>

        {/* Right: SEO panel */}
        <div>
          <SeoPanel article={article} />
        </div>
      </div>
    </div>
  );
}
