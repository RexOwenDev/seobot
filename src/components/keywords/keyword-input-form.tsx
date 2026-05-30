'use client';

import { useState } from 'react';

type Intent = 'informational' | 'commercial' | 'transactional' | 'navigational';

interface KeywordFormState {
  phrase: string;
  targetLength: number;
  intent: Intent | '';
}

export function KeywordInputForm() {
  const [form, setForm] = useState<KeywordFormState>({
    phrase: '',
    targetLength: 2000,
    intent: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.phrase.trim()) return;
    // Phase 5 stub — no live pipeline call; shows confirmation
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ phrase: '', targetLength: 2000, intent: '' });
    }, 2500);
  }

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
          disabled={submitted}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitted ? 'Queued ✓' : 'Run pipeline →'}
        </button>
        {submitted && (
          <span className="text-xs text-emerald-600">
            Keyword queued — research pipeline will begin shortly
          </span>
        )}
      </div>
    </form>
  );
}
