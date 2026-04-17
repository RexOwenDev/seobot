import type { DemoCmsConnection } from '@/lib/demo-data';

const STATUS_STYLES: Record<DemoCmsConnection['status'], string> = {
  verified: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  invalid: 'text-red-400 bg-red-400/10 border-red-400/20',
  unreachable: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  unconfigured: 'text-zinc-500 bg-zinc-800 border-zinc-700',
};

const STATUS_LABELS: Record<DemoCmsConnection['status'], string> = {
  verified: 'Connected',
  invalid: 'Auth failed',
  unreachable: 'Unreachable',
  unconfigured: 'Not configured',
};

const PROVIDER_ICONS: Record<DemoCmsConnection['provider'], string> = {
  wordpress: 'W',
  shopify: 'S',
};

interface CmsConnectionCardProps {
  connection: DemoCmsConnection;
}

export function CmsConnectionCard({ connection }: CmsConnectionCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 font-semibold text-zinc-300">
          {PROVIDER_ICONS[connection.provider]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-zinc-200">{connection.label}</p>
          <p className="truncate text-xs text-zinc-500">{connection.siteUrl}</p>
        </div>
        <span
          className={[
            'shrink-0 rounded border px-2 py-0.5 text-xs',
            STATUS_STYLES[connection.status],
          ].join(' ')}
        >
          {STATUS_LABELS[connection.status]}
        </span>
      </div>

      {connection.lastChecked && (
        <p className="mb-3 text-xs text-zinc-600">
          Last verified{' '}
          {new Date(connection.lastChecked).toLocaleDateString('en-CA', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      )}

      <div className="flex gap-2">
        {connection.status === 'unconfigured' ? (
          <button
            type="button"
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-200"
          >
            Configure →
          </button>
        ) : (
          <button
            type="button"
            className="rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-zinc-200"
          >
            Test connection
          </button>
        )}
      </div>
    </div>
  );
}
