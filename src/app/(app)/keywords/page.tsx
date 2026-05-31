'use client';

import { useDemoState } from '@/lib/demo-state';
import { KeywordInputForm } from '@/components/keywords/keyword-input-form';
import { KeywordTable } from '@/components/keywords/keyword-table';

export default function KeywordsPage() {
  const { keywords } = useDemoState();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Keywords</h1>
        <p className="text-sm text-stone-500">
          Track keywords, generate outlines, and publish to your CMS from one place.
        </p>
      </div>

      <div className="mb-6">
        <KeywordInputForm />
      </div>

      <KeywordTable keywords={keywords} />
    </div>
  );
}
