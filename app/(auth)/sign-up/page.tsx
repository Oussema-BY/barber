'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Scissors, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

export default function SignUpPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: '/onboarding',
      });

      if (authError) {
        setError(authError.message || t('somethingWentWrong'));
      } else {
        router.push('/onboarding');
      }
    } catch {
      setError(t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Scissors className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">BarberPro</h1>
        <p className="text-foreground-secondary mt-1">{t('signUpSubtitle')}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground-secondary block mb-2">
            {t('name')}
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('enterName')}
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground-secondary block mb-2">
            {t('email')}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('enterEmail')}
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground-secondary block mb-2">
            {t('password')}
          </label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t('enterPassword')}
            className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          size="lg"
          className="w-full text-lg font-semibold"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            t('signUp')
          )}
        </Button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-foreground-secondary mt-6">
        {t('haveAccount')}{' '}
        <Link href="/sign-in" className="text-primary font-semibold hover:underline">
          {t('signIn')}
        </Link>
      </p>
    </div>
  );
}
