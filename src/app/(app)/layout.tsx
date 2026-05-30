import Link from 'next/link';
import { NavLinks } from '@/components/layout/nav-links';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Desktop sidebar ────────────────────────────────────────────── */}
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 md:flex">
        <div className="flex h-14 items-center border-b border-zinc-800 px-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Wedded Wonderland
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavLinks orientation="vertical" />
        </div>
        <div className="border-t border-zinc-800 p-3">
          <div className="rounded-md border border-zinc-800 bg-zinc-900 p-3">
            <p className="mb-1 text-xs font-medium text-zinc-300">Wedded Wonderland</p>
            <p className="text-xs text-zinc-500">Content engine · demo</p>
          </div>
        </div>
      </aside>

      {/* ── Mobile top nav ─────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 md:hidden">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            Wedded Wonderland
          </Link>
          <NavLinks orientation="horizontal" />
        </header>

        {/* ── Page content ─────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
