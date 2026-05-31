'use client';

import { useState } from 'react';

type Intent = 'informational' | 'commercial' | 'transactional' | 'navigational';
type PipelineStage = 'idle' | 'researching' | 'outlining' | 'drafting' | 'complete';

interface KeywordFormState {
  phrase: string;
  targetLength: number;
  intent: Intent | '';
}

const STAGE_LABEL: Record<PipelineStage, string> = {
  idle: 'Run pipeline →',
  researching: 'Researching...',
  outlining: 'Outlining...',
  drafting: 'Drafting article...',
  complete: 'Done',
};

const ACTIVE_STAGES = ['researching', 'outlining', 'drafting'] as const;

export function KeywordInputForm() {
  const [form, setForm] = useState<KeywordFormState>({
    phrase: '',
    targetLength: 2000,
    intent: '',
  });
  const [stage, setStage] = useState<PipelineStage>('idle');
  const [submittedPhrase, setSubmittedPhrase] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phrase.trim() || stage !== 'idle') return;

    setSubmittedPhrase(form.phrase);

    setStage('researching');
    await new Promise(r => setTimeout(r, 1200));
    setStage('outlining');
    await new Promise(r => setTimeout(r, 1100));
    setStage('drafting');
    await new Promise(r => setTimeout(r, 1300));
    setStage('complete');

    setTimeout(() => {
      setStage('idle');
      setForm({ phrase: '', targetLength: 2000, intent: '' });
    }, 4000);
  }

  const isRunning = stage !== 'idle' && stage !== 'complete';
  const currentIdx = ACTIVE_STAGES.indexOf(stage as (typeof ACTIVE_STAGES)[number]);

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-stone-200 bg-surface p-5"
    >
      <h2 className="mb-4 text-sm font-medium text-stone-700">Add keyword</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="kw-phrase" className="mb-1.5 block text-xs text-stone-500">
            Keyword phrase <span className="text-red-400">*</span>
          </label>
          <input
            id="kw-phrase"
            type="text"
            required
            placeholder="e.g. destination weddings Santorini"
            value={form.phrase}
            onChange={e => setForm(f => ({ ...f, phrase: e.target.value }))}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 placeholder:text-stone-300 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>

        <div>
          <label htmlFor="kw-length" className="mb-1.5 block text-xs text-stone-500">
            Target word count
          </label>
          <select
            id="kw-length"
            value={form.targetLength}
            onChange={e => setForm(f => ({ ...f, targetLength: Number(e.target.value) }))}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value={1000}>~1,000 words</option>
            <option value={1500}>~1,500 words</option>
            <option value={2000}>~2,000 words</option>
            <option value={3000}>~3,000 words</option>
            <option value={4000}>~4,000 words</option>
          </select>
        </div>

        <div>
          <label htmlFor="kw-intent" className="mb-1.5 block text-xs text-stone-500">
            Search intent
          </label>
          <select
            id="kw-intent"
            value={form.intent}
            onChange={e => setForm(f => ({ ...f, intent: e.target.value as Intent | '' }))}
            className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-800 outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          >
            <option value="">Auto-detect</option>
            <option value="informational">Informational</option>
            <option value="commercial">Commercial</option>
            <option value="transactional">Transactional</option>
            <option value="navigational">Navigational</option>
          </select>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={stage !== 'idle'}
          className={[
            'rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60',
            stage === 'complete'
              ? 'bg-emerald-600 text-white'
              : 'bg-stone-900 text-white hover:bg-stone-800',
          ].join(' ')}
        >
          {STAGE_LABEL[stage]}
        </button>
      </div>

      {isRunning && (
        <div className="mt-3 flex items-center gap-2">
          {ACTIVE_STAGES.map((s, i) => (
            <div
              key={s}
              className={[
                'h-1.5 flex-1 rounded-full transition-colors duration-500',
                i < currentIdx
                  ? 'bg-stone-500'
                  : i === currentIdx
                  ? 'bg-stone-800'
                  : 'bg-stone-200',
              ].join(' ')}
            />
          ))}
        </div>
      )}

      {stage === 'complete' && (
        <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-medium text-emerald-800">Article added to your queue</p>
          <p className="mt-1 text-xs text-emerald-700">
            The draft for{' '}
            <span className="font-medium">&ldquo;{submittedPhrase}&rdquo;</span> is being
            prepared. Check the Articles tab in a few minutes.
          </p>
        </div>
      )}
    </form>
  );
}
