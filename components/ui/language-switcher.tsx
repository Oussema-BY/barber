'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import { locales, localeNames, type Locale } from '@/i18n/config';

interface LanguageSwitcherProps {
  currentLocale: string;
}

export function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: Locale) => {
    // Set the locale cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    setIsOpen(false);
    // Refresh the page to apply the new locale
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-foreground-secondary hover:text-foreground hover:bg-secondary rounded-xl transition-colors flex items-center gap-1.5"
        title="Change language"
      >
        <Globe className="w-5 h-5" />
        <span className="text-xs font-medium uppercase hidden sm:inline">
          {currentLocale}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-card rounded-xl border border-border shadow-lg py-1 z-50 animate-fade-in">
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`w-full px-4 py-2.5 text-left hover:bg-secondary transition-colors flex items-center justify-between ${
                currentLocale === locale ? 'text-primary font-medium' : 'text-foreground'
              }`}
            >
              <span>{localeNames[locale]}</span>
              {currentLocale === locale && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
