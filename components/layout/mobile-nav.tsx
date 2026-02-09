'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MAIN_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/user-context';

export function MobileNav() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const { shopRole } = useUser();

  const getNavLabel = (href: string) => {
    const keyMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/appointments': 'appointments',
      '/services': 'services',
      '/pos': 'pos',
      '/inventory': 'inventory',
    };
    return t(keyMap[href] || 'dashboard');
  };

  const filteredNav = MAIN_NAV.filter(
    (item) => shopRole && (item.roles as readonly string[]).includes(shopRole)
  ).slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-card/95 backdrop-blur-xl border-t border-border z-50 safe-area-bottom">
      <div className="flex justify-around items-stretch h-16">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-150 no-select',
                'active:scale-95 active:opacity-70',
                isActive ? 'text-primary' : 'text-foreground-muted'
              )}
            >
              <div className={cn(
                'w-10 h-10 flex items-center justify-center rounded-xl transition-all',
                isActive && 'bg-primary-light'
              )}>
                <Icon className={cn('w-5 h-5', isActive && 'text-primary')} />
              </div>
              <span className={cn(
                'text-[10px] font-medium leading-none',
                isActive ? 'text-primary' : 'text-foreground-muted'
              )}>
                {getNavLabel(item.href)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
