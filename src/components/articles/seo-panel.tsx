import type { DemoArticle, DemoSeoVerdict } from '@/lib/demo-data';

const VERDICT_STYLES: Record<DemoSeoVerdict['verdict'], string> = {
  pass: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  warn: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  fail: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const VERDICT_ICONS: Record<DemoSeoVerdict['verdict'], string> = {
  pass: '✓',
  warn: '⚠',
  fail: '✕',
};

interface SeoPanelProps {
  article: DemoArticle;
}

export function SeoPanel({ article }: SeoPanelProps) {
  const passCount = article.seoVerdicts.filter(v => v.verdict === 'pass').length;
  const warnCount = article.seoVerdicts.filter(v => v.verdict === 'warn').length;
  const failCount = article.seoVerdicts.filter(v => v.verdict === 'fail').length;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      {/* Score header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-medium text-zinc-300">SEO score</h2>
        <ScoreBadge score={article.seoScore} />
      </div>

      {/* Summary counts */}
      <div className="mb-5 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-md border border-emerald-400/20 bg-emerald-400/10 py-2">
          <p className="font-semibold text-emerald-400">{passCount}</p>
          <p className="text-emerald-400/70">Pass</p>
        </div>
        <div className="rounded-md border border-yellow-400/20 bg-yellow-400/10 py-2">
          <p className="font-semibold text-yellow-400">{warnCount}</p>
          <p className="text-yellow-400/70">Warn</p>
        </div>
        <div className="rounded-md border border-red-400/20 bg-red-400/10 py-2">
          <p className="font-semibold text-red-400">{failCount}</p>
          <p className="text-red-400/70">Fail</p>
        </div>
      </div>

      {/* Verdict list */}
      <ul className="space-y-2">
        {article.seoVerdicts.map(v => (
          <li key={v.rule} className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <div className="mb-1 flex items-center gap-2">
              <span
                className={[
                  'rounded border px-1.5 py-0.5 font-mono text-xs',
                  VERDICT_STYLES[v.verdict],
                ].join(' ')}
              >
                {VERDICT_ICONS[v.verdict]}
              </span>
              <span className="text-xs font-medium text-zinc-300">{v.label}</span>
            </div>
            <p className="pl-7 text-xs text-zinc-500">{v.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
  return (
    <span className={`text-2xl font-bold tabular-nums ${color}`}>
      {score}
      <span className="text-sm text-zinc-500">/100</span>
    </span>
  );
}
