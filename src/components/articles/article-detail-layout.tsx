'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArticlePreview } from '@/components/articles/article-preview';
import { SeoPanel } from '@/components/articles/seo-panel';
import { InternalLinksPanel } from '@/components/articles/internal-links-panel';
import { useDemoState } from '@/lib/demo-state';
import type { DemoArticle } from '@/lib/demo-data';

interface ArticleDetailLayoutProps {
  article: DemoArticle;
}

export function ArticleDetailLayout({ article }: ArticleDetailLayoutProps) {
  const { articles, publishArticle } = useDemoState();
  const [publishState, setPublishState] = useState<'idle' | 'publishing'>('idle');

  // Use live version from context (picks up publishedOverrides for fixture articles)
  const liveArticle = articles.find(a => a.id === article.id) ?? article;

  async function handlePublish() {
    if (publishState !== 'idle') return;
    setPublishState('publishing');
    await new Promise(r => setTimeout(r, 2000));
    publishArticle(liveArticle.id, liveArticle.h1);
    setPublishState('idle');
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-stone-400">
        <Link href="/keywords" className="hover:text-stone-700">
          Keywords
        </Link>
        <span className="mx-2">›</span>
        <span className="text-stone-500 line-clamp-1">{liveArticle.h1}</span>
      </nav>

      {/* Publish status banner — published */}
      {liveArticle.publishedAt && (
        <div className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-600">
          <span>✓</span>
          <span>
            Saved as WordPress draft ·{' '}
            {new Date(liveArticle.publishedAt).toLocaleDateString('en-AU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          {liveArticle.cmsConnectionId && (
            <Link
              href="/publish"
              className="ml-auto underline-offset-2 hover:underline"
            >
              View publish job →
            </Link>
          )}
        </div>
      )}

      {/* Publish action banner — draft */}
      {!liveArticle.publishedAt && (
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-stone-200 bg-stone-50 px-4 py-2.5">
          <span className="text-xs text-stone-500">
            Draft — not yet sent to WordPress
          </span>
          <button
            type="button"
            disabled={publishState === 'publishing'}
            onClick={handlePublish}
            className="ml-auto flex items-center gap-1.5 rounded-md bg-stone-900 px-4 py-2.5 text-xs font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {publishState === 'publishing' && (
              <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-stone-600 border-t-white" />
            )}
            {publishState === 'publishing' ? 'Sending...' : 'Send to WordPress as Draft'}
          </button>
        </div>
      )}

      {/* Two-column layout */}
      <div className="grid gap-5 md:grid-cols-[1fr_260px] lg:grid-cols-[1fr_280px]">
        {/* Left: article content */}
        <div className="space-y-5">
          <ArticlePreview article={liveArticle} />
          <InternalLinksPanel links={liveArticle.internalLinks} />
        </div>

        {/* Right: SEO panel */}
        <div>
          <SeoPanel article={liveArticle} />
        </div>
      </div>
    </div>
  );
}
