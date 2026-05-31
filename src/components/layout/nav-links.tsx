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
  const isHorizontal = orientation === 'horizontal';

  return (
    <nav className={isHorizontal ? 'flex items-center gap-1' : 'flex flex-col gap-1'}>
      {NAV_ITEMS.map(({ href, label, icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            title={isHorizontal ? label : undefined}
            aria-label={isHorizontal ? label : undefined}
            className={[
              'flex items-center rounded-md transition-colors',
              isHorizontal
                ? 'min-h-[44px] min-w-[44px] justify-center px-2'
                : 'gap-2.5 px-3 py-2 text-sm',
              active
                ? [
                    'bg-stone-100 text-stone-900',
                    isHorizontal ? 'border-b-2 border-accent' : 'border-l-2 border-accent',
                  ].join(' ')
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800',
            ].join(' ')}
            aria-current={active ? 'page' : undefined}
          >
            <span className="text-center font-mono text-sm" aria-hidden>
              {icon}
            </span>
            {!isHorizontal && <span>{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
