import Link from 'next/link';
import type { DemoKeyword } from '@/lib/demo-data';

const STATUS_COLORS: Record<DemoKeyword['status'], string> = {
  queued: 'text-zinc-500 bg-zinc-800 border-zinc-700',
  researched: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  outlined: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  drafted: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  published: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
};

const INTENT_LABELS: Record<NonNullable<DemoKeyword['intent']>, string> = {
  informational: 'Info',
  commercial: 'Commercial',
  transactional: 'Transactional',
  navigational: 'Nav',
};

interface KeywordTableProps {
  keywords: readonly DemoKeyword[];
}

export function KeywordTable({ keywords }: KeywordTableProps) {
  if (keywords.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 py-12 text-center">
        <p className="text-sm text-zinc-500">No keywords yet. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800 bg-zinc-900">
            <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500">Keyword</th>
            <th className="hidden px-4 py-3 text-right text-xs font-medium text-zinc-500 sm:table-cell">
              Volume
            </th>
            <th className="hidden px-4 py-3 text-right text-xs font-medium text-zinc-500 md:table-cell">
              Difficulty
            </th>
            <th className="hidden px-4 py-3 text-left text-xs font-medium text-zinc-500 lg:table-cell">
              Intent
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-zinc-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 bg-zinc-950">
          {keywords.map(kw => (
            <tr key={kw.id} className="transition-colors hover:bg-zinc-900/50">
              <td className="px-4 py-3">
                <div>
                  {kw.articleId ? (
                    <Link
                      href={`/articles/${kw.articleId}`}
                      className="text-zinc-200 hover:text-white"
                    >
                      {kw.phrase}
                    </Link>
                  ) : (
                    <span className="text-zinc-200">{kw.phrase}</span>
                  )}
                  <p className="mt-0.5 text-xs text-zinc-600">{kw.brand}</p>
                </div>
              </td>
              <td className="hidden px-4 py-3 text-right tabular-nums text-zinc-400 sm:table-cell">
                {kw.searchVolume.toLocaleString()}
              </td>
              <td className="hidden px-4 py-3 text-right md:table-cell">
                <DifficultyBar value={kw.difficulty} />
              </td>
              <td className="hidden px-4 py-3 text-xs text-zinc-500 lg:table-cell">
                {kw.intent != null ? (INTENT_LABELS[kw.intent] ?? kw.intent) : '—'}
              </td>
              <td className="px-4 py-3 text-right">
                <span
                  className={[
                    'rounded border px-2 py-0.5 text-xs',
                    STATUS_COLORS[kw.status],
                  ].join(' ')}
                >
                  {kw.status.charAt(0).toUpperCase() + kw.status.slice(1)}
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
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-zinc-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-6 text-right text-xs text-zinc-400">{value}</span>
    </div>
  );
}
