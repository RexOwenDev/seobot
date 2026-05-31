'use client';

import { useState, useCallback } from 'react';
import { useDemoState } from '@/lib/demo-state';
import { KeywordInputForm } from '@/components/keywords/keyword-input-form';
import { KeywordTable } from '@/components/keywords/keyword-table';

export default function KeywordsPage() {
  const { keywords } = useDemoState();
  const [prefill, setPrefill] = useState('');

  const handleRunKeyword = useCallback((phrase: string) => {
    setPrefill(phrase);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Keywords</h1>
        <p className="text-sm text-stone-500">
          Track keywords, generate outlines, and publish to your CMS from one place.
        </p>
      </div>

      <div className="mb-6">
        <KeywordInputForm prefill={prefill} />
      </div>

      <KeywordTable keywords={keywords} onRunKeyword={handleRunKeyword} />
    </div>
  );
}
