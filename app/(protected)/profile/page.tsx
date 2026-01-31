'use client';

import { useState } from 'react';
import { User, Mail, Phone, Camera, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function ProfilePage() {
  const t = useTranslations('profile');
  const tCommon = useTranslations('common');

  const [profile, setProfile] = useState({
    name: 'Admin',
    email: 'admin@barberpro.com',
    phone: '+1 (555) 123-4567',
  });

  const [isSaved, setIsSaved] = useState(false);

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

      {/* Profile Card */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-3xl shadow-lg">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 rtl:right-auto rtl:left-0 w-8 h-8 bg-secondary border border-border rounded-full flex items-center justify-center hover:bg-secondary-hover transition-colors">
              <Camera className="w-4 h-4 text-foreground-secondary" />
            </button>
          </div>

          <div className="text-center sm:text-start">
            <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
            <p className="text-foreground-secondary">{t('shopOwner')}</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">
              {t('fullName')}
            </label>
            <div className="relative">
              <User className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none text-lg"
                placeholder={t('enterName')}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">
              {t('email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none text-lg"
                placeholder={t('enterEmail')}
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">
              {t('phone')}
            </label>
            <div className="relative">
              <Phone className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground-muted" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none text-lg"
                placeholder={t('enterPhone')}
              />
            </div>
          </div>
        </div>

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
            t('saveChanges')
          )}
        </Button>
      </div>
    </div>
  );
}
