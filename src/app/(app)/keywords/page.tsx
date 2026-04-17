import { DEMO_KEYWORDS } from '@/lib/demo-data';
import { KeywordInputForm } from '@/components/keywords/keyword-input-form';
import { KeywordTable } from '@/components/keywords/keyword-table';

export default function KeywordsPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-semibold tracking-tight">Keywords</h1>
        <p className="text-sm text-zinc-400">
          Add a keyword phrase to run the full research → draft → refine pipeline.
        </p>
      </div>

      <div className="mb-6">
        <KeywordInputForm />
      </div>

      <KeywordTable keywords={DEMO_KEYWORDS} />
    </div>
  );
}
