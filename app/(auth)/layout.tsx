'use client';

import React from 'react';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div
      className={cn(
        'relative min-h-screen flex items-center justify-center overflow-hidden transition-colors duration-300',
        isDark ? 'bg-black' : 'bg-white'
      )}
    >
      {/* ── Ambient blobs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className={cn(
            'absolute top-1/4 -left-48 w-[500px] h-[500px] blur-[120px] rounded-full',
            isDark ? 'bg-[#5E84F2]/12' : 'bg-[#5E84F2]/8'
          )}
        />
        <div
          className={cn(
            'absolute bottom-1/4 -right-48 w-[500px] h-[500px] blur-[140px] rounded-full',
            isDark ? 'bg-purple-500/10' : 'bg-purple-400/6'
          )}
        />
        <div
          className={cn(
            'absolute top-3/4 left-1/3 w-72 h-72 blur-[100px] rounded-full',
            isDark ? 'bg-indigo-400/8' : 'bg-indigo-400/5'
          )}
        />
      </div>

      {/* ── Grid overlay ── */}
      <div
        className={cn('absolute inset-0 z-0 pointer-events-none', isDark ? 'opacity-[0.035]' : 'opacity-[0.022]')}
        style={{
          backgroundImage: isDark
            ? 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)'
            : 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
        aria-hidden
      />

      {/* ── Diagonal decorative lines ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
        <div
          className="absolute top-0 left-0 w-full h-full opacity-[0.035]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, #5E84F2 0px, #5E84F2 1px, transparent 1px, transparent 80px)',
          }}
        />
      </div>

      {/* ── Central radial glow ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: isDark
            ? 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(94,132,242,0.15) 0%, transparent 70%)'
            : 'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(94,132,242,0.08) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-md px-4 py-12">
        {children}
      </div>
    </div>
  );
}
