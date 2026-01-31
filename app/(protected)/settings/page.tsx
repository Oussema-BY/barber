'use client';

import { useState } from 'react';
import { Check, Clock, Store } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { DEFAULT_WORKING_HOURS } from '@/lib/constants';
import { WorkingHours } from '@/lib/types';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const tDays = useTranslations('days');
  const tCommon = useTranslations('common');

  const [activeTab, setActiveTab] = useState<'hours' | 'business'>('hours');
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(DEFAULT_WORKING_HOURS);
  const [businessName, setBusinessName] = useState('BarberPro Shop');
  const [businessPhone, setBusinessPhone] = useState('+1 (555) 123-4567');
  const [isSaved, setIsSaved] = useState(false);

  const handleWorkingHoursChange = (day: string, field: 'open' | 'close' | 'isClosed', value: string | boolean) => {
    setWorkingHours((prev) =>
      prev.map((wh) =>
        wh.day === day ? { ...wh, [field]: value } : wh
      )
    );
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-foreground-secondary mt-1">{t('subtitle')}</p>
      </div>

      {/* Tab Selector */}
      <div className="flex gap-2 bg-secondary p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('hours')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'hours'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-foreground-secondary hover:text-foreground'
          }`}
        >
          <Clock className="w-4 h-4" />
          {t('workingHours')}
        </button>
        <button
          onClick={() => setActiveTab('business')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
            activeTab === 'business'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-foreground-secondary hover:text-foreground'
          }`}
        >
          <Store className="w-4 h-4" />
          {t('businessInfo')}
        </button>
      </div>

      {/* Working Hours Tab */}
      {activeTab === 'hours' && (
        <div id="working-hours" className="bg-card rounded-xl border border-border p-4 space-y-4">
          <h2 className="font-bold text-foreground">{t('setWorkingHours')}</h2>

          <div className="space-y-3">
            {workingHours.map((wh) => (
              <div
                key={wh.day}
                className={`p-4 rounded-xl border-2 transition-all ${
                  wh.isClosed ? 'border-border bg-secondary/50' : 'border-primary/20 bg-primary/5'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-foreground">{tDays(wh.day)}</span>
                  <button
                    onClick={() => handleWorkingHoursChange(wh.day, 'isClosed', !wh.isClosed)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      wh.isClosed
                        ? 'bg-secondary text-foreground-secondary'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {wh.isClosed ? t('closed') : t('open')}
                  </button>
                </div>

                {!wh.isClosed && (
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-xs text-foreground-secondary block mb-1">{t('opens')}</label>
                      <input
                        type="time"
                        value={wh.open}
                        onChange={(e) => handleWorkingHoursChange(wh.day, 'open', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-foreground-secondary block mb-1">{t('closes')}</label>
                      <input
                        type="time"
                        value={wh.close}
                        onChange={(e) => handleWorkingHoursChange(wh.day, 'close', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Info Tab */}
      {activeTab === 'business' && (
        <div className="bg-card rounded-xl border border-border p-4 space-y-4">
          <h2 className="font-bold text-foreground">{t('businessInformation')}</h2>

          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">
              {t('shopName')}
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none text-lg"
              placeholder={t('enterShopName')}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">
              {t('phoneNumber')}
            </label>
            <input
              type="tel"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none text-lg"
              placeholder={t('enterPhone')}
            />
          </div>
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        size="lg"
        className="w-full text-lg font-semibold"
      >
        {isSaved ? (
          <>
            <Check className="w-5 h-5" />
            {tCommon('saved')}
          </>
        ) : (
          t('saveSettings')
        )}
      </Button>
    </div>
  );
}
