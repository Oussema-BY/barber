'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { MAIN_NAV } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { useUser } from '@/lib/user-context';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tTopbar = useTranslations('topbar');
  const { shopRole } = useUser();

  const getNavLabel = (href: string) => {
    const keyMap: Record<string, string> = {
      '/dashboard': 'dashboard',
      '/appointments': 'appointments',
      '/services': 'services',
      '/packages': 'packages',
      '/pos': 'pos',
      '/inventory': 'inventory',
      '/finance': 'finance',
      '/settings': 'settings',
    };
    return t(keyMap[href] || 'dashboard');
  };

  const filteredNav = MAIN_NAV.filter(
    (item) => shopRole && (item.roles as readonly string[]).includes(shopRole)
  );
  

  return (
    <aside className="hidden md:fixed md:left-0 rtl:md:left-auto rtl:md:right-0 md:top-0 md:h-screen md:w-64 md:flex md:flex-col bg-sidebar-background border-r rtl:border-r-0 rtl:border-l border-sidebar-border shadow-[0_0_20px_rgba(0,0,0,0.02)] transition-all duration-300">
      {/* Logo Section */}
      <div className="px-3 py-3 border-b border-sidebar-border/50">
        <Link
              href="/"
              className="flex items-center gap-0 group shrink-0"
              
            >
              <div className="w-16 h-16 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="TaktakBeauty Logo"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className={cn("text-xl font-black tracking-tighter transition-colors")}>
                TAKTAKBEAUTY<span className="text-[#5E84F2]">.</span>
              </span>
            </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredNav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-active-bg text-sidebar-active-foreground shadow-sm'
                  : 'text-sidebar-foreground hover:bg-sidebar-hover-bg hover:text-foreground'
              )}
            >
              <Icon className={cn(
                'w-5 h-5 transition-colors',
                isActive ? 'text-sidebar-active-foreground' : 'text-foreground-tertiary'
              )} />
              <span>{getNavLabel(item.href)}</span>
              {isActive && (
                <div className="ltr:ml-auto rtl:mr-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer/Version */}
      <div className="px-6 py-4 border-t border-sidebar-border">
        <p className="text-xs text-foreground-muted">{tTopbar('brandName')} v1.0</p>
      </div>
    </aside>
  );
}
