import Link from 'next/link';
import type { DemoKeyword } from '@/lib/demo-data';

const STATUS_COLORS: Record<DemoKeyword['status'], string> = {
  queued: 'text-stone-500 bg-stone-100 border-stone-200',
  researched: 'text-blue-600 bg-blue-50 border-blue-200',
  outlined: 'text-amber-600 bg-amber-50 border-amber-200',
  drafted: 'text-purple-600 bg-purple-50 border-purple-200',
  published: 'text-emerald-600 bg-emerald-50 border-emerald-200',
};

const STATUS_LABELS: Record<DemoKeyword['status'], string> = {
  queued: 'Queued',
  researched: 'Researched',
  outlined: 'Outlined',
  drafted: 'Draft',
  published: 'Published',
};

const INTENT_LABELS: Record<NonNullable<DemoKeyword['intent']>, string> = {
  informational: 'Informational',
  commercial: 'Commercial',
  transactional: 'Transactional',
  navigational: 'Navigational',
};

interface KeywordTableProps {
  keywords: readonly DemoKeyword[];
  onRunKeyword?: (phrase: string) => void;
}

export function KeywordTable({ keywords, onRunKeyword }: KeywordTableProps) {
  if (keywords.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-surface py-12 text-center">
        <p className="text-sm text-stone-500">No keywords yet. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200 bg-stone-50">
            <th className="px-4 py-3 text-left text-xs font-medium text-stone-500">Keyword</th>
            <th className="hidden px-4 py-3 text-right text-xs font-medium text-stone-500 sm:table-cell">
              Volume
            </th>
            <th className="hidden px-4 py-3 text-right text-xs font-medium text-stone-500 md:table-cell">
              Difficulty
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-medium text-stone-500 lg:table-cell">
              Intent
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-stone-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-200 bg-surface">
          {keywords.map(kw => (
            <tr key={kw.id} className="transition-colors hover:bg-stone-50">
              <td className="px-4 py-3">
                <div>
                  {kw.articleId ? (
                    <Link
                      href={`/articles/${kw.articleId}`}
                      className="text-stone-800 hover:text-stone-900"
                    >
                      {kw.phrase}
                    </Link>
                  ) : (
                    <span className="text-stone-800">{kw.phrase}</span>
                  )}
                  {!kw.articleId && onRunKeyword && (
                    <button
                      type="button"
                      onClick={() => { onRunKeyword(kw.phrase); }}
                      className="mt-0.5 block text-xs text-stone-400 hover:text-accent transition-colors"
                    >
                      Generate →
                    </button>
                  )}
                </div>
              </td>
              <td className="hidden px-4 py-3 text-right tabular-nums text-stone-500 sm:table-cell">
                {kw.searchVolume.toLocaleString()}
              </td>
              <td className="hidden px-4 py-3 text-right md:table-cell">
                <DifficultyBar value={kw.difficulty} />
              </td>
              <td className="hidden px-4 py-3 text-xs text-stone-500 lg:table-cell">
                {kw.intent != null ? (INTENT_LABELS[kw.intent] ?? kw.intent) : '-'}
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={[
                    'rounded border px-2 py-0.5 text-xs',
                    STATUS_COLORS[kw.status],
                  ].join(' ')}
                >
                  {STATUS_LABELS[kw.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DifficultyBar({ value }: { value: number }) {
  const color = value < 30 ? 'bg-emerald-500' : value < 55 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center justify-end gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-stone-200">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-6 text-right text-xs text-stone-500">{value}</span>
    </div>
  );
}
