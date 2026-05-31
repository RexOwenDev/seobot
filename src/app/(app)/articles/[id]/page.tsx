import { DEMO_ARTICLES } from '@/lib/demo-data';
import { ArticleDetailLayout } from '@/components/articles/article-detail-layout';
import { ArticleDetailClient } from '@/components/articles/article-detail-client';

interface ArticlePageProps {
  params: Promise<{ id: string }>;
}

// Allow routes beyond the fixture set (for user-generated articles)
export const dynamicParams = true;

export function generateStaticParams() {
  return DEMO_ARTICLES.map(a => ({ id: a.id }));
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params;
  const article = DEMO_ARTICLES.find(a => a.id === id);

  if (article) {
    return <ArticleDetailLayout article={article} />;
  }

  // Not a fixture article — could be a dynamically generated one.
  // Delegate to client component which reads from DemoStateContext/localStorage.
  return <ArticleDetailClient articleId={id} />;
}
