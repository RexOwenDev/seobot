'use client';

import { useState } from 'react';
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
  onConfigure?: () => void;
}

export function CmsConnectionCard({ connection, onConfigure }: CmsConnectionCardProps) {
  const [testState, setTestState] = useState<'idle' | 'testing' | 'verified'>('idle');

  async function handleTest() {
    if (testState !== 'idle') return;
    setTestState('testing');
    await new Promise(r => setTimeout(r, 1600));
    setTestState('verified');
    setTimeout(() => setTestState('idle'), 3000);
  }

  return (
    <div className="min-w-0 rounded-xl border border-stone-200 bg-surface p-5">
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
            onClick={onConfigure}
            className="rounded-md border border-stone-300 px-3 py-2.5 text-xs text-stone-600 transition-colors hover:border-stone-400 hover:text-stone-800"
          >
            Configure &rarr;
          </button>
        ) : (
          <button
            type="button"
            disabled={testState !== 'idle'}
            onClick={handleTest}
            className={[
              'rounded-md border px-3 py-2.5 text-xs transition-colors disabled:cursor-not-allowed',
              testState === 'verified'
                ? 'border-emerald-300 bg-emerald-50 text-emerald-600'
                : 'border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-800',
            ].join(' ')}
          >
            {testState === 'testing' && (
              <span className="mr-1.5 inline-block h-3 w-3 animate-spin rounded-full border-2 border-stone-300 border-t-stone-600" aria-hidden="true" />
            )}
            {testState === 'idle' && 'Test connection'}
            {testState === 'testing' && 'Testing...'}
            {testState === 'verified' && 'Connection verified ✓'}
          </button>
        )}
      </div>
    </div>
  );
}
