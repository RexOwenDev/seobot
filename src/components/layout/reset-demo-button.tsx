'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDemoState } from '@/lib/demo-state';

export function ResetDemoButton() {
  const { resetDemo } = useDemoState();
  const router = useRouter();
  const [state, setState] = useState<'idle' | 'resetting'>('idle');

  function handleReset() {
    if (
      !window.confirm(
        'Clear all keywords and articles you have added?\n\nBaseline data (6 keywords, 3 articles) will remain so the demo still shows example content.',
      )
    )
      return;
    setState('resetting');
    resetDemo();
    setTimeout(() => {
      setState('idle');
      router.push('/dashboard');
      router.refresh();
    }, 400);
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      disabled={state === 'resetting'}
      className="mt-2 w-full text-left text-xs text-stone-400 transition-colors hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {state === 'resetting' ? 'Resetting...' : 'Reset demo data'}
    </button>
  );
}
