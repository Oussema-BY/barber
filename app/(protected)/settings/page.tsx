'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import { Check, Clock, Store, Loader2, Users, Plus, X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { WorkingHours, StaffMember } from '@/lib/types';
import { getSettings, updateSettings } from '@/lib/actions/settings.actions';
import { getStaffMembers, createStaffUser, deleteStaffMember, toggleStaffActive } from '@/lib/actions/staff.actions';

export default function SettingsPage() {
  const router = useRouter();
  const { shopRole, id: currentUserId } = useUser();
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
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // New staff form
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [addingStaff, setAddingStaff] = useState(false);
  const [staffError, setStaffError] = useState('');

  // Toggle loading states
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return;
    setAddingStaff(true);
    setStaffError('');
    try {
      const member = await createStaffUser({
        name: newName.trim(),
        email: newEmail.trim(),
        password: newPassword,
      });
      setStaff([...staff, member]);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setShowAddForm(false);
      setNumberOfChairs(staff.length + 2);
    } catch (err) {
      setStaffError(err instanceof Error ? err.message : 'Failed to add staff member');
    } finally {
      setAddingStaff(false);
    }
  };

  const handleToggleActive = async (id: string) => {
    setTogglingId(id);
    try {
      const updated = await toggleStaffActive(id);
      setStaff(staff.map((s) => (s.id === id ? updated : s)));
    } catch (err) {
      console.error('Failed to toggle staff:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDeleteStaff = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteStaffMember(id);
      const updated = staff.filter((s) => s.id !== id);
      setStaff(updated);
      setNumberOfChairs(Math.max(1, updated.length));
    } catch (err) {
      console.error('Failed to delete staff:', err);
    } finally {
      setDeletingId(null);
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
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground">{t('staff')}</h2>
            <Button
              onClick={() => { setShowAddForm(!showAddForm); setStaffError(''); }}
              size="sm"
              variant={showAddForm ? 'secondary' : 'primary'}
            >
              {showAddForm ? (
                <>
                  <X className="w-4 h-4 mr-1" />
                  {tCommon('cancel')}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-1" />
                  {t('addStaff')}
                </>
              )}
            </Button>
          </div>

          {/* Add Staff Form */}
          {showAddForm && (
            <div className="p-4 rounded-xl border-2 border-primary/30 bg-primary/5 space-y-3">
              <p className="text-sm font-semibold text-foreground">{t('newStaffAccount')}</p>

              {staffError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  {staffError}
                </div>
              )}

              {/* Name */}
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={t('staffName')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={t('staffEmail')}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-secondary" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t('staffPassword')}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground-secondary hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                onClick={handleAddStaff}
                disabled={addingStaff || !newName.trim() || !newEmail.trim() || newPassword.length < 6}
                className="w-full"
              >
                {addingStaff ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-1" />
                    {t('createStaffAccount')}
                  </>
                )}
              </Button>
              <p className="text-xs text-foreground-secondary text-center">{t('staffPasswordHint')}</p>
            </div>
          )}

          {/* Staff list */}
          {staff.length === 0 ? (
            <div className="text-center py-8 text-foreground-secondary">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{t('noStaff')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {staff.map((member) => {
                const isSelf = member.userId === currentUserId;
                return (
                  <div
                    key={member.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      member.isActive
                        ? 'border-border bg-card'
                        : 'border-border bg-secondary/50 opacity-60'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: member.isActive ? member.color : '#9ca3af' }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-foreground truncate">{member.name}</p>
                        {isSelf && (
                          <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                            {t('youOwner')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-foreground-secondary">
                        {member.isActive ? t('active') : t('inactive')}
                      </p>
                    </div>

                    {/* Toggle Active/Inactive — Switch (hidden for owner's own row) */}
                    {!isSelf && (
                      <button
                        onClick={() => handleToggleActive(member.id)}
                        disabled={togglingId === member.id}
                        title={member.isActive ? t('deactivate') : t('activate')}
                        className="relative shrink-0 focus:outline-none"
                        aria-checked={member.isActive}
                        role="switch"
                      >
                        {togglingId === member.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-foreground-secondary" />
                        ) : (
                          <span
                            className={`flex w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
                              member.isActive ? 'bg-primary' : 'bg-border'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ease-in-out ${
                                member.isActive ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </span>
                        )}
                      </button>
                    )}


                    {/* Delete — hidden for self */}
                    {!isSelf && (
                      <button
                        onClick={() => handleDeleteStaff(member.id)}
                        disabled={deletingId === member.id}
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-foreground-secondary hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        {deletingId === member.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
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
