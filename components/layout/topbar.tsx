'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Search, Calendar, Zap, Package, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { ProfileDropdown } from './profile-dropdown';
import { useUser } from '@/lib/user-context';
import { cn } from '@/lib/utils';
import { globalSearch, type SearchResult } from '@/lib/actions/search.actions';

const TYPE_ICONS = {
  appointment: Calendar,
  service: Zap,
  product: Package,
} as const;

const TYPE_COLORS = {
  appointment: 'text-blue-500',
  service: 'text-purple-500',
  product: 'text-amber-500',
} as const;

export function Topbar() {
  const t = useTranslations('topbar');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const user = useUser();
  const router = useRouter();

  const userName = user.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await globalSearch(q);
      setResults(res);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    setResults([]);
    router.push(result.href);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showDropdown = open && query.trim().length >= 2;

  return (
    <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between h-14 sm:h-16 px-3 sm:px-4 md:px-6">
        {/* Mobile: Page title area */}
        <div className="md:hidden flex-1">
          <h1 className="text-lg font-bold text-foreground">{t('brandName')}</h1>
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md" ref={containerRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted rtl:left-auto rtl:right-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => query.trim().length >= 2 && setOpen(true)}
              placeholder={t('search')}
              className={cn(
                'w-full pl-10 pr-4 py-2 rounded-xl text-sm rtl:pl-4 rtl:pr-10',
                'bg-secondary border border-transparent',
                'text-foreground placeholder-foreground-muted',
                'focus:bg-card focus:border-border focus:outline-none focus:ring-2 focus:ring-ring/20',
                'transition-all duration-200'
              )}
            />

            {/* Search Results Dropdown */}
            {showDropdown && (
              <div className="absolute top-full mt-2 w-full bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50">
                {loading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : results.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto">
                    {results.map((result) => {
                      const Icon = TYPE_ICONS[result.type];
                      const color = TYPE_COLORS[result.type];
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSelect(result)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary transition-colors text-start"
                        >
                          <Icon className={cn('w-4 h-4 shrink-0', color)} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
                            <p className="text-xs text-foreground-secondary truncate">{result.subtitle}</p>
                          </div>
                          <span className="text-[10px] uppercase font-semibold text-foreground-muted shrink-0">
                            {t(result.type)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <p className="text-sm text-foreground-secondary">{tCommon('noResults')}</p>
                  </div>
                )}
              </div>
            )}
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
