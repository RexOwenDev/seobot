'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '⬡' },
  { href: '/keywords', label: 'Keywords', icon: '⌖' },
  { href: '/articles', label: 'Articles', icon: '≡' },
  { href: '/publish', label: 'Publish', icon: '↑' },
] as const;

export function NavLinks({ orientation = 'vertical' }: { orientation?: 'vertical' | 'horizontal' }) {
  const pathname = usePathname();

  return (
    <nav
      className={
        orientation === 'horizontal'
          ? 'flex items-center gap-1'
          : 'flex flex-col gap-1'
      }
    >
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={[
              'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
              active
                ? 'bg-zinc-800 text-zinc-100'
                : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200',
            ].join(' ')}
            aria-current={active ? 'page' : undefined}
          >
            <span className="w-4 text-center font-mono text-xs" aria-hidden>
              {icon}
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
