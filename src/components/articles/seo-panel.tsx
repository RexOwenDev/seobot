import type { DemoArticle, DemoSeoVerdict } from '@/lib/demo-data';

const VERDICT_STYLES: Record<DemoSeoVerdict['verdict'], string> = {
  pass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  warn: 'text-amber-600 bg-amber-50 border-amber-200',
  fail: 'text-red-600 bg-red-50 border-red-200',
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
    <div className="rounded-xl border border-stone-200 bg-surface p-5">
      {/* Score header */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-sm font-medium text-stone-700">SEO score</h2>
        <ScoreBadge score={article.seoScore} />
      </div>

      {/* Summary counts */}
      <div className="mb-5 grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-md border border-emerald-200 bg-emerald-50 py-2">
          <p className="font-semibold text-emerald-600">{passCount}</p>
          <p className="text-emerald-600/70">Pass</p>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 py-2">
          <p className="font-semibold text-amber-600">{warnCount}</p>
          <p className="text-amber-600/70">Warn</p>
        </div>
        <div className="rounded-md border border-red-200 bg-red-50 py-2">
          <p className="font-semibold text-red-600">{failCount}</p>
          <p className="text-red-600/70">Fail</p>
        </div>
      </div>

      {/* Verdict list */}
      <ul className="space-y-2">
        {article.seoVerdicts.map(v => (
          <li key={v.rule} className="rounded-lg border border-stone-200 bg-surface-nested p-3">
            <div className="mb-1 flex items-center gap-2">
              <span
                className={[
                  'rounded border px-1.5 py-0.5 font-mono text-xs',
                  VERDICT_STYLES[v.verdict],
                ].join(' ')}
              >
                {VERDICT_ICONS[v.verdict]}
              </span>
              <span className="text-xs font-medium text-stone-700">{v.label}</span>
            </div>
            <p className="pl-7 text-xs text-stone-500">{v.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600';
  return (
    <span className={`text-2xl font-bold tabular-nums ${color}`}>
      {score}
      <span className="text-sm text-stone-500">/100</span>
    </span>
  );
}
