import type { DemoArticle } from '@/lib/demo-data';

interface ArticlePreviewProps {
  article: DemoArticle;
}

export function ArticlePreview({ article }: ArticlePreviewProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-surface p-6">
      <div className="mb-6 border-b border-stone-200 pb-4">
        <p className="mb-1 text-xs text-stone-500">H1 — Primary heading</p>
        <h1 className="text-xl font-semibold leading-snug">{article.h1}</h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">{article.metaDescription}</p>
      </div>

      <div className="mb-4 flex flex-wrap gap-4 text-xs text-stone-500">
        <span>{article.wordCount.toLocaleString()} words</span>
        <span>{article.sections.length} sections</span>
        <span>SEO score {article.seoScore}/100</span>
        {article.publishedAt && (
          <span>
            Published{' '}
            {new Date(article.publishedAt).toLocaleDateString('en-CA', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {article.sections.map(section => (
          // Composite key: level+text. DemoSection has no id; text alone could
          // collide for common headings like "Conclusion" at different levels.
          <SectionCard key={`${section.level}-${section.text}`} section={section} />
        ))}
      </div>
    </div>
  );
}

function SectionCard({
  section,
}: {
  section: DemoArticle['sections'][number];
}) {
  const isH2 = section.level === 2;
  return (
    <div
      className={[
        'rounded-lg border bg-surface-nested p-3',
        isH2 ? 'border-stone-200' : 'ml-4 border-stone-200',
      ].join(' ')}
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="font-mono text-xs text-stone-400">H{section.level}</span>
        <span className={isH2 ? 'text-sm font-medium text-stone-800' : 'text-sm text-stone-700'}>
          {section.text}
        </span>
      </div>
      <p className="text-xs text-stone-400">{section.wordCount} words</p>
    </div>
  );
}
