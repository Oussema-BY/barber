'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import { Check, Clock, Store, Loader2, Users, Plus, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { WorkingHours, StaffMember } from '@/lib/types';
import { getSettings, updateSettings } from '@/lib/actions/settings.actions';
import { getStaffMembers, createStaffMember, deleteStaffMember } from '@/lib/actions/staff.actions';
import { STAFF_COLORS } from '@/lib/constants';

export default function SettingsPage() {
  const router = useRouter();
  const { shopRole } = useUser();
  const t = useTranslations('settings');
  const tDays = useTranslations('days');
  const tCommon = useTranslations('common');

  useEffect(() => {
    if (shopRole && shopRole !== 'owner') {
      router.replace('/dashboard');
    }
  }, [shopRole, router]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'hours' | 'business' | 'staff'>('hours');
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);
  const [businessName, setBusinessName] = useState('');
  const [businessPhone, setBusinessPhone] = useState('');
  const [salonMode, setSalonMode] = useState<'solo' | 'multi'>('solo');
  const [numberOfChairs, setNumberOfChairs] = useState(1);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [newBarberName, setNewBarberName] = useState('');
  const [addingStaff, setAddingStaff] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [settings, staffMembers] = await Promise.all([
          getSettings(),
          getStaffMembers(),
        ]);
        setWorkingHours(settings.workingHours || []);
        setBusinessName(settings.businessName || '');
        setBusinessPhone(settings.businessPhone || '');
        setSalonMode(settings.salonMode || 'solo');
        setNumberOfChairs(settings.numberOfChairs || 1);
        setStaff(staffMembers);
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleWorkingHoursChange = (day: string, field: 'open' | 'close' | 'isClosed', value: string | boolean) => {
    setWorkingHours((prev) =>
      prev.map((wh) =>
        wh.day === day ? { ...wh, [field]: value } : wh
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({
        businessName,
        businessPhone,
        workingHours,
        salonMode,
        numberOfChairs,
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddStaff = async () => {
    if (!newBarberName.trim()) return;
    setAddingStaff(true);
    try {
      const colorIndex = staff.length % STAFF_COLORS.length;
      const member = await createStaffMember({
        name: newBarberName.trim(),
        color: STAFF_COLORS[colorIndex],
      });
      setStaff([...staff, member]);
      setNewBarberName('');
      setNumberOfChairs(staff.length + 1);
    } catch (err) {
      console.error('Failed to add staff:', err);
    } finally {
      setAddingStaff(false);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    try {
      await deleteStaffMember(id);
      const updated = staff.filter((s) => s.id !== id);
      setStaff(updated);
      setNumberOfChairs(Math.max(1, updated.length));
    } catch (err) {
      console.error('Failed to delete staff:', err);
    }
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
        {salonMode === 'multi' && (
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'staff'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-foreground-secondary hover:text-foreground'
            }`}
          >
            <Users className="w-4 h-4" />
            {t('staff')}
          </button>
        )}
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

          {/* Salon Mode Toggle */}
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">
              {t('salonMode')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setSalonMode('solo');
                  setActiveTab('business');
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  salonMode === 'solo'
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-foreground-secondary hover:border-primary/50'
                }`}
              >
                <span className="font-medium">{t('soloMode')}</span>
              </button>
              <button
                onClick={() => {
                  setSalonMode('multi');
                }}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  salonMode === 'multi'
                    ? 'border-primary bg-primary/5 text-foreground'
                    : 'border-border text-foreground-secondary hover:border-primary/50'
                }`}
              >
                <span className="font-medium">{t('multiMode')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && salonMode === 'multi' && (
        <div className="bg-card rounded-xl border border-border p-4 space-y-4">
          <h2 className="font-bold text-foreground">{t('staff')}</h2>

          {/* Add new barber */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newBarberName}
              onChange={(e) => setNewBarberName(e.target.value)}
              placeholder={t('barberName')}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleAddStaff()}
            />
            <Button
              onClick={handleAddStaff}
              disabled={addingStaff || !newBarberName.trim()}
            >
              {addingStaff ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {t('addBarber')}
            </Button>
          </div>

          {/* Staff list */}
          {staff.length === 0 ? (
            <div className="text-center py-8 text-foreground-secondary">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{t('noStaff')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="flex-1 font-medium text-foreground">
                    {member.name}
                  </span>
                  <button
                    onClick={() => handleDeleteStaff(member.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-foreground-secondary hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={saving}
        size="lg"
        className="w-full text-lg font-semibold"
      >
        {isSaved ? (
          <>
            <Check className="w-5 h-5" />
            {tCommon('saved')}
          </>
        ) : saving ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {tCommon('saving')}
          </>
        ) : (
          t('saveSettings')
        )}
      </Button>
    </div>
  );
}
