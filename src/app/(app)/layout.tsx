import Link from 'next/link';
import { NavLinks } from '@/components/layout/nav-links';
import { DemoStateProvider } from '@/lib/demo-state';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoStateProvider>
    <div className="flex min-h-screen">
      {/* ── Desktop sidebar ────────────────────────────────────────────── */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-stone-200 bg-sidebar md:flex">
        <div className="flex h-14 items-center border-b border-stone-200 px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Wedded Wonderland
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks orientation="vertical" />
        </div>
        <div className="border-t border-stone-200 p-3">
          <div className="rounded-md border border-stone-200 bg-surface p-3">
            <p className="mb-1 text-xs font-medium text-stone-700">Wedded Wonderland</p>
            <p className="text-xs text-stone-400">Content Studio</p>
          </div>
        </div>
      </aside>

      {/* ── Mobile top nav ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-stone-200 bg-sidebar px-4 md:hidden">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Wedded Wonderland
          </Link>
          <NavLinks orientation="horizontal" />
        </header>

        {/* ── Page content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
    </DemoStateProvider>
  );
}
