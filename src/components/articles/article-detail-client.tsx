'use client';

import { useDemoState } from '@/lib/demo-state';
import { ArticleDetailLayout } from '@/components/articles/article-detail-layout';

interface ArticleDetailClientProps {
  articleId: string;
}

export function ArticleDetailClient({ articleId }: ArticleDetailClientProps) {
  const { articles } = useDemoState();
  const article = articles.find(a => a.id === articleId);

  if (!article) {
    return (
      <div className="mx-auto max-w-5xl py-20 text-center">
        <p className="text-sm text-stone-500">Article not found.</p>
        <p className="mt-1 text-xs text-stone-400">
          This article may still be processing. Check the Articles tab in a moment.
        </p>
      </div>
    );
  }

  return <ArticleDetailLayout article={article} />;
}
