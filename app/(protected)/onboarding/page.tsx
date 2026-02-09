'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Scissors, Plus, X, Loader2, User, Store, Clock, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/user-context';
import { useOnboarding } from '@/lib/onboarding-context';
import { completeOnboarding } from '@/lib/actions/settings.actions';
import { joinShopByInviteCode } from '@/lib/actions/shop.actions';
import { DEFAULT_WORKING_HOURS } from '@/lib/constants';

type SalonMode = 'solo' | 'multi';

export default function OnboardingPage() {
  const { hasShop } = useOnboarding();

  // Staff with no shop → join flow; Owner with shop → config flow
  if (!hasShop) {
    return <StaffJoinFlow />;
  }

  return <OwnerConfigFlow />;
}

function StaffJoinFlow() {
  const t = useTranslations('onboarding');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    if (!inviteCode.trim()) return;
    setLoading(true);
    setError('');
    try {
      await joinShopByInviteCode(inviteCode.trim().toUpperCase());
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err instanceof Error ? err.message : t('somethingWentWrong'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-secondary">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('joinShopTitle')}</h1>
          <p className="text-foreground-secondary mt-1">{t('joinShopDescription')}</p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <KeyRound className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {t('inviteCodeLabel')}
                </h2>
                <p className="text-sm text-foreground-secondary">
                  {t('inviteCodeDescription')}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm text-center">
                {error}
              </div>
            )}

            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder={t('inviteCodePlaceholder')}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none text-lg text-center tracking-widest font-mono uppercase"
              maxLength={8}
              autoFocus
            />

            <Button
              onClick={handleJoin}
              disabled={loading || inviteCode.trim().length < 8}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                t('joinShop')
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnerConfigFlow() {
  const t = useTranslations('onboarding');
  const tDays = useTranslations('days');
  const user = useUser();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [shopName, setShopName] = useState(user.shopName || '');
  const [salonMode, setSalonMode] = useState<SalonMode>('solo');
  const [numberOfChairs, setNumberOfChairs] = useState(1);
  const [barberNames, setBarberNames] = useState<string[]>([user.name]);
  const [workingHours, setWorkingHours] = useState(
    DEFAULT_WORKING_HOURS.map((wh) => ({ ...wh }))
  );

  const handleModeChange = (mode: SalonMode) => {
    setSalonMode(mode);
    if (mode === 'solo') {
      setNumberOfChairs(1);
      setBarberNames([user.name]);
    } else {
      setNumberOfChairs(2);
      setBarberNames([user.name, '']);
    }
  };

  const addBarber = () => {
    setBarberNames([...barberNames, '']);
    setNumberOfChairs(barberNames.length + 1);
  };

  const removeBarber = (index: number) => {
    if (barberNames.length <= 1) return;
    const updated = barberNames.filter((_, i) => i !== index);
    setBarberNames(updated);
    setNumberOfChairs(updated.length);
  };

  const updateBarberName = (index: number, name: string) => {
    const updated = [...barberNames];
    updated[index] = name;
    setBarberNames(updated);
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
        numberOfChairs,
        barberNames: salonMode === 'solo' ? [user.name] : barberNames,
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
        if (salonMode === 'solo') return true;
        return barberNames.some((n) => n.trim().length > 0);
      case 4:
        return true;
      default:
        return false;
    }
  };

  const totalSteps = salonMode === 'solo' ? 3 : 4;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-secondary">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{t('welcome')}</h1>
          <p className="text-foreground-secondary mt-1">{t('letsGetStarted')}</p>
        </div>

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

          {step === 3 && salonMode === 'multi' && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {t('addBarbers')}
                  </h2>
                  <p className="text-sm text-foreground-secondary">
                    {t('addBarbersDescription')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {barberNames.map((name, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => updateBarberName(i, e.target.value)}
                      placeholder={`${t('barberName')} ${i + 1}`}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
                    />
                    {barberNames.length > 1 && (
                      <button
                        onClick={() => removeBarber(i)}
                        className="w-11 h-11 rounded-xl border-2 border-border flex items-center justify-center text-foreground-secondary hover:text-destructive hover:border-destructive transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={addBarber}
                className="flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <Plus className="w-4 h-4" />
                {t('addAnotherBarber')}
              </button>
            </div>
          )}

          {((step === 3 && salonMode === 'solo') ||
            (step === 4 && salonMode === 'multi')) && (
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

            {((salonMode === 'solo' && step < 3) ||
              (salonMode === 'multi' && step < 4)) ? (
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
