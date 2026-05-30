import type { DemoCmsConnection } from '@/lib/demo-data';

const STATUS_STYLES: Record<DemoCmsConnection['status'], string> = {
  verified: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  invalid: 'text-red-600 bg-red-50 border-red-200',
  unreachable: 'text-amber-600 bg-amber-50 border-amber-200',
  unconfigured: 'text-stone-500 bg-stone-100 border-stone-200',
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
    <div className="rounded-xl border border-stone-200 bg-surface p-5">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-stone-300 bg-stone-100 font-semibold text-stone-600">
          {PROVIDER_ICONS[connection.provider]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-stone-800">{connection.label}</p>
          <p className="truncate text-xs text-stone-500">{connection.siteUrl}</p>
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
        <p className="mb-3 text-xs text-stone-400">
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
            className="rounded-md border border-stone-300 px-3 py-1.5 text-xs text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-800"
          >
            Configure →
          </button>
        ) : (
          <button
            type="button"
            className="rounded-md border border-stone-300 px-3 py-1.5 text-xs text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-800"
          >
            Test connection
          </button>
        )}
      </div>
    </div>
  );
}
