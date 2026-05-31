import { DEMO_ARTICLES } from '@/lib/demo-data';
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
  // Always delegate to the client component so it reads from DemoStateContext
  // (which applies publishedOverrides). Avoids server/client hydration mismatch
  // when fixture articles are published by the user mid-session.
  return <ArticleDetailClient articleId={id} />;
}
