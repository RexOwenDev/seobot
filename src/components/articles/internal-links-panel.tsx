'use client';

import { useDemoState } from '@/lib/demo-state';
import type { DemoInternalLink } from '@/lib/demo-data';

interface InternalLinksPanelProps {
  links: readonly DemoInternalLink[];
}

export function InternalLinksPanel({ links }: InternalLinksPanelProps) {
  const { linkDecisions, setLinkDecision } = useDemoState();

  function decide(id: string, accepted: boolean, current: boolean | null | undefined) {
    setLinkDecision(id, current === accepted ? null : accepted);
  }

  if (links.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-surface p-5">
        <h2 className="mb-3 text-sm font-medium text-stone-700">Internal links</h2>
        <p className="text-xs text-stone-500">
          No link suggestions. Run the pipeline to generate them.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-surface p-5">
      <h2 className="mb-4 text-sm font-medium text-stone-700">Internal link suggestions</h2>
      <ul className="space-y-3">
        {links.map(link => {
          const decision = link.id in linkDecisions ? linkDecisions[link.id] : link.accepted;
          return (
            <li key={link.id} className="rounded-lg border border-stone-200 bg-surface-nested p-3">
              <div className="mb-1 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-stone-800">
                    &ldquo;{link.anchorText}&rdquo;
                  </p>
                  <p className="mt-0.5 truncate text-xs text-stone-500">{link.targetH1}</p>
                </div>
                <span className="shrink-0 text-xs text-stone-400 tabular-nums">
                  {Math.round(link.relevanceScore * 100)}%
                </span>
              </div>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => decide(link.id, true, decision)}
                  className={[
                    'rounded border px-2.5 py-2 text-xs transition-colors',
                    decision === true
                      ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-600'
                      : 'border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-700',
                  ].join(' ')}
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => decide(link.id, false, decision)}
                  className={[
                    'rounded border px-2.5 py-2 text-xs transition-colors',
                    decision === false
                      ? 'border-red-400/40 bg-red-400/10 text-red-600'
                      : 'border-stone-300 text-stone-500 hover:border-stone-400 hover:text-stone-700',
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
