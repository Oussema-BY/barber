'use client';

import React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'dropdown';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme();

  // Render a placeholder during SSR to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className={cn('p-2 rounded-lg', className)}>
        <div className="w-5 h-5" />
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn('relative inline-block', className)}>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
          className="appearance-none bg-card border border-border rounded-lg px-3 py-2 pr-8 text-foreground text-sm font-medium cursor-pointer hover:bg-card-hover transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-foreground-tertiary">
          {theme === 'light' && <Sun className="w-4 h-4" />}
          {theme === 'dark' && <Moon className="w-4 h-4" />}
          {theme === 'system' && <Monitor className="w-4 h-4" />}
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <div className={cn('flex items-center gap-1 p-1 bg-secondary rounded-lg', className)}>
        <button
          onClick={() => setTheme('light')}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md transition-all',
            theme === 'light'
              ? 'bg-card text-primary shadow-sm'
              : 'text-foreground-tertiary hover:text-foreground'
          )}
          title="Light mode"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('dark')}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md transition-all',
            theme === 'dark'
              ? 'bg-card text-primary shadow-sm'
              : 'text-foreground-tertiary hover:text-foreground'
          )}
          title="Dark mode"
        >
          <Moon className="w-4 h-4" />
        </button>
        <button
          onClick={() => setTheme('system')}
          className={cn(
            'flex items-center justify-center w-8 h-8 rounded-md transition-all',
            theme === 'system'
              ? 'bg-card text-primary shadow-sm'
              : 'text-foreground-tertiary hover:text-foreground'
          )}
          title="System preference"
        >
          <Monitor className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Default: icon variant - cycles through themes
  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        'relative p-2 rounded-lg text-foreground-secondary hover:text-foreground hover:bg-secondary transition-colors',
        className
      )}
      title={`Current: ${theme} mode (click to cycle)`}
    >
      <Sun className={cn(
        'w-5 h-5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300',
        resolvedTheme === 'dark' ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
      )} />
      <Moon className={cn(
        'w-5 h-5 transition-all duration-300',
        resolvedTheme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
      )} />
    </button>
  );
}
