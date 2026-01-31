'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { User, Settings, Clock, LogOut } from 'lucide-react';

interface ProfileDropdownProps {
  userName: string;
  userInitial: string;
}

export function ProfileDropdown({ userName, userInitial }: ProfileDropdownProps) {
  const t = useTranslations('profile');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm shadow-sm hover:shadow transition-shadow ltr:ml-1 rtl:mr-1"
      >
        {userInitial}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 w-56 bg-card rounded-xl border border-border shadow-lg py-2 z-50 animate-fade-in">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border">
            <p className="font-semibold text-foreground">{userName}</p>
            <p className="text-sm text-foreground-secondary">{t('shopOwner')}</p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-secondary transition-colors"
            >
              <User className="w-4 h-4 text-foreground-secondary" />
              <span>{t('myProfile')}</span>
            </Link>

            <Link
              href="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-secondary transition-colors"
            >
              <Settings className="w-4 h-4 text-foreground-secondary" />
              <span>{t('businessSettings')}</span>
            </Link>

            <Link
              href="/settings#working-hours"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-foreground hover:bg-secondary transition-colors"
            >
              <Clock className="w-4 h-4 text-foreground-secondary" />
              <span>{t('workingHours')}</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-border pt-1">
            <button
              onClick={() => {
                setIsOpen(false);
                alert('Logged out');
              }}
              className="flex items-center gap-3 px-4 py-2.5 text-destructive hover:bg-destructive/10 transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
