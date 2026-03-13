'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X, Loader2, User, Store, Clock, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/user-context';
import { completeOnboarding } from '@/lib/actions/settings.actions';
import { DEFAULT_WORKING_HOURS } from '@/lib/constants';
import Link from 'next/link';
import Image from 'next/image';

type SalonMode = 'solo' | 'multi';

export default function OnboardingPage() {
  return <OwnerConfigFlow />;
}

function OwnerConfigFlow() {
  const t = useTranslations('onboarding');
  const tDays = useTranslations('days');
  const user = useUser();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shopName, setShopName] = useState(user.shopName || '');
  const [salonMode, setSalonMode] = useState<SalonMode>('solo');
  const [workingHours, setWorkingHours] = useState(
    DEFAULT_WORKING_HOURS.map((wh) => ({ ...wh }))
  );

  const handleModeChange = (mode: SalonMode) => {
    setSalonMode(mode);
  };

  const updateWorkingHour = (
    index: number,
    field: 'open' | 'close' | 'isClosed',
    value: string | boolean
  ) => {
    const updated = [...workingHours];
    if (field === 'isClosed') {
      updated[index] = { ...updated[index], isClosed: value as boolean };
    } else {
      updated[index] = { ...updated[index], [field]: value as string };
    }
    setWorkingHours(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await completeOnboarding({
        ownerId: user.id,
        businessName: shopName,
        salonMode,
        numberOfChairs: salonMode === 'solo' ? 1 : 2,
        barberNames: [user.name],
        workingHours,
      });
      window.location.href = '/dashboard';
    } catch {
      alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return shopName.trim().length > 0;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const totalSteps = 3;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-secondary">
      <div className="w-full max-w-lg">
        {/* Header with Home button */}
        <div className="text-center mb-8 relative">
          <Link
            href="/"
            className="absolute left-0 top-0 inline-flex items-center gap-1.5 text-sm text-foreground-secondary hover:text-foreground transition-colors group"
          >
            <Home className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {t('backToHome')}
          </Link>

          <div className="w-20 h-20 flex items-center justify-center mx-auto mb-4 mt-8">
            <Image
              src="/logo.png"
              alt="Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('welcome')}</h1>
          <p className="text-foreground-secondary mt-1">{t('letsGetStarted')}</p>
        </div>

        {/* Step progress */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
          {/* Step 1: Shop Name */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Store className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('shopNameLabel')}
                  </h2>
                  <p className="text-sm text-foreground-secondary">
                    {t('shopNameDescription')}
                  </p>
                </div>
              </div>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder={t('shopNamePlaceholder')}
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none text-lg"
                autoFocus
              />
            </div>
          )}

          {/* Step 2: Salon Mode */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('salonModeLabel')}
                  </h2>
                  <p className="text-sm text-foreground-secondary">
                    {t('salonModeDescription')}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleModeChange('solo')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    salonMode === 'solo'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <User className="w-8 h-8 mx-auto mb-2 text-foreground" />
                  <p className="font-semibold text-foreground">{t('solo')}</p>
                  <p className="text-xs text-foreground-secondary mt-1">
                    {t('soloDescription')}
                  </p>
                </button>

                <button
                  onClick={() => handleModeChange('multi')}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    salonMode === 'multi'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex justify-center gap-1 mb-2">
                    <User className="w-6 h-6 text-foreground" />
                    <User className="w-6 h-6 text-foreground" />
                  </div>
                  <p className="font-semibold text-foreground">{t('multi')}</p>
                  <p className="text-xs text-foreground-secondary mt-1">
                    {t('multiDescription')}
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Working Hours */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('workingHoursLabel')}
                  </h2>
                  <p className="text-sm text-foreground-secondary">
                    {t('workingHoursDescription')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {workingHours.map((wh, i) => (
                  <div
                    key={wh.day}
                    className="p-3 rounded-xl border border-border space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={!wh.isClosed}
                          onChange={(e) =>
                            updateWorkingHour(i, 'isClosed', !e.target.checked)
                          }
                          className="w-4 h-4 rounded accent-primary"
                        />
                        <span
                          className={`text-sm font-medium ${
                            wh.isClosed
                              ? 'text-foreground-muted'
                              : 'text-foreground'
                          }`}
                        >
                          {tDays(wh.day)}
                        </span>
                      </label>

                      {wh.isClosed && (
                        <span className="text-sm text-foreground-muted">
                          {t('closed')}
                        </span>
                      )}
                    </div>

                    {!wh.isClosed && (
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={wh.open}
                          onChange={(e) =>
                            updateWorkingHour(i, 'open', e.target.value)
                          }
                          className="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm"
                        />
                        <span className="text-foreground-secondary text-sm shrink-0">-</span>
                        <input
                          type="time"
                          value={wh.close}
                          onChange={(e) =>
                            updateWorkingHour(i, 'close', e.target.value)
                          }
                          className="flex-1 min-w-0 px-2 py-1.5 rounded-lg border border-border bg-background text-foreground text-sm"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="secondary"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                {t('back')}
              </Button>
            )}

            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex-1"
              >
                {t('next')}
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !canProceed()}
                className="flex-1"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  t('finish')
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
