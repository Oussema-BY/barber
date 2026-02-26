'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth-client';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

export default function SignInPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/dashboard',
      });

      if (authError) {
        setError(authError.message || t('invalidCredentials'));
      } else {
        router.push('/dashboard');
      }
    } catch {
      setError(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* ── Glowing border container ── */}
      <div
        className="absolute -inset-px rounded-3xl z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(94,132,242,0.5) 0%, rgba(167,139,250,0.3) 50%, rgba(94,132,242,0.1) 100%)',
        }}
      />

      {/* ── Card ── */}
      <div
        className={cn(
          'relative z-10 rounded-3xl p-8 sm:p-10',
          isDark
            ? 'bg-white/4 backdrop-blur-2xl border border-white/10'
            : 'bg-white/80 backdrop-blur-2xl border border-black/8 shadow-2xl shadow-black/5'
        )}
      >
        {/* ── Logo ── */}
        <div className="text-center mb-8">
          {/* Logo image */}
          <div className="flex justify-center mb-4">
            <div
              className={cn(
                'relative w-20 h-20 rounded-2xl flex items-center justify-center overflow-hidden',
                isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-black/8 shadow-lg'
              )}
            >
              <Image
                src="/logo.png"
                alt="TakTakBeauty Logo"
                width={64}
                height={64}
                className="object-contain w-14 h-14"
                priority
              />
              {/* Glow behind logo */}
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(94,132,242,0.15) 0%, transparent 70%)',
                }}
              />
            </div>
          </div>

          {/* Brand name */}
          <h1
            className={cn('text-3xl font-black tracking-tight mb-1', isDark ? 'text-white' : 'text-slate-900')}
            style={{ letterSpacing: '-0.02em' }}
          >
            TakTak<span style={{ color: '#5E84F2' }}>Beauty</span>
          </h1>

          {/* Badge */}
          <div
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold mb-3 mt-2',
              isDark ? 'bg-white/5 border-white/10 text-[#5E84F2]' : 'bg-[#5E84F2]/8 border-[#5E84F2]/20 text-[#5E84F2]'
            )}
          >
            <Sparkles className="w-3 h-3" />
            Premium Barber Management
          </div>

          <p className={cn('text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
            {t('signInSubtitle')}
          </p>
        </div>

        {/* ── Gradient divider ── */}
        <div className="flex items-center gap-3 mb-7">
          <div className={cn('h-px flex-1', isDark ? 'bg-linear-to-r from-transparent to-white/15' : 'bg-linear-to-r from-transparent to-black/10')} />
          <span
            className="text-[10px] font-bold uppercase tracking-[0.25em]"
            style={{ background: 'linear-gradient(90deg,#5E84F2,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            Sign In
          </span>
          <div className={cn('h-px flex-1', isDark ? 'bg-linear-to-l from-transparent to-white/15' : 'bg-linear-to-l from-transparent to-black/10')} />
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div className="relative">
            <label
              className={cn(
                'text-xs font-semibold uppercase tracking-wider block mb-2',
                isDark ? 'text-slate-400' : 'text-slate-500'
              )}
            >
              {t('email')}
            </label>
            <div className="relative">
              <Mail
                className={cn(
                  'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200',
                  focusedField === 'email' ? 'text-[#5E84F2]' : isDark ? 'text-slate-500' : 'text-slate-400'
                )}
              />
              <input
                id="signin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder={t('enterEmail')}
                className={cn(
                  'w-full pl-11 pr-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 outline-none placeholder:font-normal',
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600'
                    : 'bg-white/60 border-black/10 text-slate-900 placeholder:text-slate-400',
                  focusedField === 'email'
                    ? 'border-[#5E84F2] shadow-[0_0_0_3px_rgba(94,132,242,0.15)]'
                    : 'hover:border-[#5E84F2]/40'
                )}
              />
            </div>
          </div>

          {/* Password field */}
          <div className="relative">
            <label
              className={cn(
                'text-xs font-semibold uppercase tracking-wider block mb-2',
                isDark ? 'text-slate-400' : 'text-slate-500'
              )}
            >
              {t('password')}
            </label>
            <div className="relative">
              <Lock
                className={cn(
                  'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-200',
                  focusedField === 'password' ? 'text-[#5E84F2]' : isDark ? 'text-slate-500' : 'text-slate-400'
                )}
              />
              <input
                id="signin-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder={t('enterPassword')}
                className={cn(
                  'w-full pl-11 pr-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-200 outline-none placeholder:font-normal',
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600'
                    : 'bg-white/60 border-black/10 text-slate-900 placeholder:text-slate-400',
                  focusedField === 'password'
                    ? 'border-[#5E84F2] shadow-[0_0_0_3px_rgba(94,132,242,0.15)]'
                    : 'hover:border-[#5E84F2]/40'
                )}
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            id="signin-submit"
            type="submit"
            disabled={loading}
            className={cn(
              'relative w-full py-4 rounded-xl text-white font-bold text-base transition-all duration-300 overflow-hidden group',
              'shadow-2xl shadow-[#5E84F2]/30',
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] hover:shadow-[#5E84F2]/50 active:scale-[0.99]'
            )}
            style={{
              background: 'linear-gradient(135deg, #5E84F2 0%, #6d72f6 50%, #a78bfa 100%)',
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/20 to-transparent skew-x-12" />

            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {t('signIn')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </span>
          </button>
        </form>

        {/* ── Footer link ── */}
        <div className={cn('mt-6 text-center text-sm', isDark ? 'text-slate-400' : 'text-slate-500')}>
          {t('noAccount')}{' '}
          <Link
            href="/sign-up"
            className="font-bold text-[#5E84F2] hover:text-[#4a6cd9] transition-colors duration-200 hover:underline underline-offset-2"
          >
            {t('signUp')}
          </Link>
        </div>
      </div>
    </div>
  );
}
