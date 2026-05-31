'use client';

import { useRouter } from 'next/navigation';
import { useDemoState } from '@/lib/demo-state';

export function ResetDemoButton() {
  const { resetDemo } = useDemoState();
  const router = useRouter();

  function handleReset() {
    if (!window.confirm('Clear all generated keywords and articles? Fixture data will remain.')) return;
    resetDemo();
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleReset}
      className="mt-2 w-full text-left text-xs text-stone-400 transition-colors hover:text-red-500"
    >
      Reset demo data
    </button>
  );
}
