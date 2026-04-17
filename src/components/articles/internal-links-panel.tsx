'use client';

import { useState } from 'react';
import type { DemoInternalLink } from '@/lib/demo-data';

interface InternalLinksPanelProps {
  links: readonly DemoInternalLink[];
}

export function InternalLinksPanel({ links }: InternalLinksPanelProps) {
  // Local UI state — production would persist to Supabase via /api/internal-links/accept
  const [decisions, setDecisions] = useState<Record<string, boolean | null>>(() => {
    const initial: Record<string, boolean | null> = {};
    for (const link of links) {
      initial[link.id] = link.accepted;
    }
    return initial;
  });

  function decide(id: string, accepted: boolean) {
    setDecisions(prev => ({
      ...prev,
      [id]: prev[id] === accepted ? null : accepted,
    }));
  }

  if (links.length === 0) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
        <h2 className="mb-3 text-sm font-medium text-zinc-300">Internal links</h2>
        <p className="text-xs text-zinc-500">
          No link suggestions — run the pipeline to generate them.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <h2 className="mb-4 text-sm font-medium text-zinc-300">Internal link suggestions</h2>
      <ul className="space-y-3">
        {links.map(link => {
          const decision = decisions[link.id];
          return (
            <li key={link.id} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
              <div className="mb-1 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-zinc-200">
                    &ldquo;{link.anchorText}&rdquo;
                  </p>
                  <p className="mt-0.5 truncate text-xs text-zinc-500">{link.targetH1}</p>
                </div>
                <span className="shrink-0 text-xs text-zinc-600 tabular-nums">
                  {Math.round(link.relevanceScore * 100)}%
                </span>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => decide(link.id, true)}
                  className={[
                    'rounded border px-2.5 py-1 text-xs transition-colors',
                    decision === true
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-400'
                      : 'border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300',
                  ].join(' ')}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => decide(link.id, false)}
                  className={[
                    'rounded border px-2.5 py-1 text-xs transition-colors',
                    decision === false
                      ? 'border-red-400/40 bg-red-400/10 text-red-400'
                      : 'border-zinc-700 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300',
                  ].join(' ')}
                >
                  Reject
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
