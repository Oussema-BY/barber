'use client';

import { Bell, Search } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ProfileDropdown } from './profile-dropdown';
import { useUser } from '@/lib/user-context';
import { cn } from '@/lib/utils';

export function Topbar() {
  const t = useTranslations('topbar');
  const locale = useLocale();
  const user = useUser();

  const userName = user.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
        {/* Mobile: Page title area */}
        <div className="md:hidden flex-1">
          <h1 className="text-lg font-bold text-foreground">{t('brandName')}</h1>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted rtl:left-auto rtl:right-3" />
            <input
              type="text"
              placeholder={t('search')}
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-xl text-sm rtl:pl-4 rtl:pr-10',
                'bg-secondary border border-transparent',
                'text-foreground placeholder-foreground-muted',
                'focus:bg-card focus:border-border focus:outline-none focus:ring-2 focus:ring-ring/20',
                'transition-all duration-200'
              )}
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitcher currentLocale={locale} />
          <ThemeToggle />
          <button className="relative p-2 text-foreground-secondary hover:text-foreground hover:bg-secondary rounded-xl transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-card rtl:right-auto rtl:left-1.5" />
          </button>
          <ProfileDropdown userName={userName} userInitial={userInitial} />
        </div>
      </div>
    </header>
  );
}
