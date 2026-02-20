'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Calendar, Clock, User, Trash2, ChevronLeft, ChevronRight, ChevronDown, Check, Loader2, Package as PackageIcon, CalendarDays, AlertTriangle, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Appointment, Service, StaffMember, Package } from '@/lib/types';
import { formatCurrency, cn, formatDateISO, getTodayDate } from '@/lib/utils';
import { getServices } from '@/lib/actions/service.actions';
import { getAppointmentsByDate, createServiceAppointment, createPackageAppointment, deleteAppointment, getAvailableSlots, getScheduledDatesForMonth, checkStaffPackageAvailability, getPackagesForDate } from '@/lib/actions/appointment.actions';
import { getSettings } from '@/lib/actions/settings.actions';
import { getStaffMembers } from '@/lib/actions/staff.actions';
import { getPackages } from '@/lib/actions/package.actions';
import Link from 'next/link';


export default function AppointmentsPage() {
  const t = useTranslations('appointments');
  const tCommon = useTranslations('common');
  const tPkg = useTranslations('packages');
  const locale = useLocale();

  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [salonMode, setSalonMode] = useState<'solo' | 'multi'>('solo');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [packages, setPackages] = useState<Package[]>([]);
  const [scheduledDates, setScheduledDates] = useState<string[]>([]);
  const [bookingType, setBookingType] = useState<'service' | 'package'>('service');

  // Booking form state
  const [clientName, setClientName] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [advance, setAdvance] = useState('');

  const [selectedTime, setSelectedTime] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [staffPackageStatuses, setStaffPackageStatuses] = useState<Record<string, string | null>>({});
  const [existingPackagesOnDate, setExistingPackagesOnDate] = useState<{ packageName: string; clientName: string; staffMemberName: string }[]>([]);
  const [showDateWarning, setShowDateWarning] = useState(false);

  const loadAppointments = useCallback(async (date: string) => {
    try {
      const data = await getAppointmentsByDate(date);
      setAppointments(data);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    }
  }, []);

  useEffect(() => {
    async function init() {
      try {
        const [servicesData, packagesData, settings, staff] = await Promise.all([
          getServices(),
          getPackages(),
          getSettings(),
          getStaffMembers(),
        ]);
        setServices(servicesData);
        setPackages(packagesData);
        setSalonMode(settings.salonMode || 'solo');
        setStaffMembers(staff);
        await loadAppointments(selectedDate);
      } catch (err) {
        console.error('Failed to initialize:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!loading) {
      loadAppointments(selectedDate);
    }
  }, [selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load available slots when service or staff changes
  useEffect(() => {
    if (!selectedService) {
      setAvailableSlots([]);
      return;
    }

    async function loadSlots() {
      setLoadingSlots(true);
      try {
        const slots = await getAvailableSlots(
          selectedDate,
          selectedService!.duration ?? 30,
          selectedStaff?.id
        );
        setAvailableSlots(slots);
        // Reset selected time if no longer available
        if (selectedTime && !slots.includes(selectedTime)) {
          setSelectedTime('');
        }
      } catch (err) {
        console.error('Failed to load slots:', err);
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [selectedService, selectedStaff, selectedDate]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check staff availability for packages (informational only)
  useEffect(() => {
    if (!selectedDate || staffMembers.length === 0) return;

    async function checkAvailability() {
      const statuses: Record<string, string | null> = {};
      const promises = staffMembers.map(async (member) => {
        const packageName = await checkStaffPackageAvailability(member.id, selectedDate);
        statuses[member.id] = packageName;
      });
      await Promise.all(promises);
      setStaffPackageStatuses(statuses);
    }
    checkAvailability();
  }, [selectedDate, staffMembers, bookingType]); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if date already has packages (for warning dialog)
  useEffect(() => {
    if (!selectedDate) return;
    getPackagesForDate(selectedDate)
      .then(setExistingPackagesOnDate)
      .catch(() => setExistingPackagesOnDate([]));
  }, [selectedDate]);

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dateString === getTodayDate()) {
      return tCommon('today');
    } else if (dateString === tomorrow.toISOString().split('T')[0]) {
      return tCommon('tomorrow');
    } else {
      return date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(selectedDate + 'T00:00:00');
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setViewMonth((prev) => {
      const d = new Date(prev.year, prev.month + (direction === 'next' ? 1 : -1), 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const handleSelectDay = (dateStr: string) => {
    setSelectedDate(dateStr);
    setCalendarOpen(false);
  };

  const calendarDays = useMemo(() => {
    const { year, month } = viewMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    // 0 = Sunday, adjust so Monday = 0
    const startDow = (firstDay.getDay() + 6) % 7;
    const days: { date: string; day: number; currentMonth: boolean }[] = [];

    // Previous month padding
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({
        date: formatDateISO(d),
        day: d.getDate(),
        currentMonth: false,
      });
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push({
        date: formatDateISO(date),
        day: d,
        currentMonth: true,
      });
    }

    // Next month padding to fill last row
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const date = new Date(year, month + 1, d);
        days.push({
          date: formatDateISO(date),
          day: d,
          currentMonth: false,
        });
      }
    }

    return days;
  }, [viewMonth]);

  // Load scheduled package dates for calendar dots
  useEffect(() => {
    getScheduledDatesForMonth(viewMonth.year, viewMonth.month)
      .then(setScheduledDates)
      .catch(() => setScheduledDates([]));
  }, [viewMonth]);

  const monthLabel = new Date(viewMonth.year, viewMonth.month).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric',
  });

  const weekDays = useMemo(() => {
    const base = new Date(2024, 0, 1); // Monday
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base);
      d.setDate(d.getDate() + i);
      return d.toLocaleDateString(locale, { weekday: 'narrow' });
    });
  }, [locale]);

  const handleBook = async () => {
    if (!clientName.trim()) return;

    if (bookingType === 'service') {
      if (!selectedService || !selectedTime) return;
      if (salonMode === 'multi' && !selectedStaff) return;
    } else {
      if (!selectedPackage) return;
      // For packages: show warning dialog if date already has packages
      if (existingPackagesOnDate.length > 0 && !showDateWarning) {
        setShowDateWarning(true);
        return;
      }
    }

    await confirmBook();
  };

  const confirmBook = async () => {
    setShowDateWarning(false);

    try {
      let newAppointment: Appointment;
      if (bookingType === 'service') {
        newAppointment = await createServiceAppointment({
          clientName: clientName.trim(),
          serviceId: selectedService!.id,
          serviceName: selectedService!.name,
          date: selectedDate,
          time: selectedTime,
          duration: selectedService!.duration || 30,
          price: selectedService!.price || 0,
          status: 'confirmed',
          staffMemberId: selectedStaff?.id,
          staffMemberName: selectedStaff?.name,
        });
      } else {
        newAppointment = await createPackageAppointment({
          clientName: clientName.trim(),
          packageId: selectedPackage!.id,
          packageName: selectedPackage!.name,
          advance: advance ? parseFloat(advance) : 0,
          eventDate: selectedDate,
          date: selectedDate,
          price: selectedPackage!.price || 0,
          status: 'confirmed',
          staffMemberId: selectedStaff?.id,
          staffMemberName: selectedStaff?.name,
        });
      }

      setAppointments([...appointments, newAppointment]);
      // Refresh existing packages list for next booking
      getPackagesForDate(selectedDate).then(setExistingPackagesOnDate).catch(() => {});
      setClientName('');
      setSelectedService(null);
      setSelectedPackage(null);
      setAdvance('');
      setSelectedTime('');
      setSelectedStaff(null);
      setIsBooking(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to book appointment';
      alert(message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAppointment(id);
      setAppointments(appointments.filter((apt) => apt.id !== id));
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    }
  };

  const cancelBooking = () => {
    setClientName('');
    setSelectedService(null);
    setSelectedPackage(null);
    setAdvance('');
    setSelectedTime('');
    setSelectedStaff(null);
    setBookingType('service');
    setIsBooking(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h1>
          <p className="text-foreground-secondary mt-1">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/packages">
            <Button variant="secondary" className="gap-2">
              <CalendarDays className="w-4 h-4" />
              <span>{tPkg('title')}</span>
            </Button>
          </Link>
          {!isBooking && (
            <Button onClick={() => setIsBooking(true)} className="w-full sm:w-auto">
              <Plus className="w-5 h-5" />
              <span>{t('newBooking')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-card rounded-xl border border-border">
        {/* Collapsed Header — always visible */}
        <button
          onClick={() => setCalendarOpen(!calendarOpen)}
          className="w-full flex items-center justify-between p-4"
        >
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div className="text-start">
              <p className="font-bold text-foreground">{formatDateDisplay(selectedDate)}</p>
              <p className="text-xs text-foreground-secondary">{selectedDate}</p>
            </div>
          </div>
          <ChevronDown className={`w-5 h-5 text-foreground-secondary transition-transform ${calendarOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Expanded Calendar */}
        {calendarOpen && (
          <div className="px-4 pb-4 border-t border-border pt-3">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-3">
              <button onClick={() => handleMonthChange('prev')} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-foreground-secondary rtl:rotate-180" />
              </button>
              <span className="font-bold text-foreground capitalize">{monthLabel}</span>
              <button onClick={() => handleMonthChange('next')} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5 text-foreground-secondary rtl:rotate-180" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 mb-1">
              {weekDays.map((day, i) => (
                <div key={i} className="text-center text-xs font-semibold text-foreground-muted py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map(({ date, day, currentMonth }) => {
                const isSelected = date === selectedDate;
                const isToday = date === getTodayDate();
                const hasEvent = scheduledDates.includes(date);
                const todayStr = getTodayDate();
                const daysUntil = hasEvent ? Math.floor((new Date(date).getTime() - new Date(todayStr).getTime()) / 86400000) : -1;
                const isUpcoming = hasEvent && daysUntil >= 0 && daysUntil <= 3;
                return (
                  <button
                    key={date}
                    onClick={() => handleSelectDay(date)}
                    className={cn(
                      "relative py-2 text-sm font-medium rounded-lg transition-all active:scale-95",
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : isUpcoming
                          ? 'bg-pink-50 text-pink-600 font-bold ring-1 ring-pink-200'
                          : isToday
                            ? 'bg-primary/10 text-primary font-bold'
                            : currentMonth
                              ? 'text-foreground hover:bg-secondary'
                              : 'text-foreground-muted hover:bg-secondary'
                    )}
                  >
                    {day}
                    {hasEvent && (
                      <span className={cn(
                        "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                        isSelected ? "bg-white" : "bg-pink-500",
                        isUpcoming && !isSelected && "animate-pulse"
                      )} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Booking Form */}
      {isBooking && (
        <div className="bg-card rounded-xl border-2 border-primary p-4 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground">{t('quickBooking')}</h2>
            <button onClick={cancelBooking} className="text-sm text-foreground-secondary hover:text-foreground">
              {tCommon('cancel')}
            </button>
          </div>

          <div className="flex p-1 bg-secondary rounded-lg">
            <button
              onClick={() => {
                setBookingType('service');
                setSelectedPackage(null);
                setAdvance('');
              }}
              className={`flex-1 py-1.5 px-4 rounded-md text-xs font-bold transition-all ${bookingType === 'service' ? 'bg-primary text-white shadow-sm' : 'text-foreground-secondary hover:text-foreground hover:bg-background'
                }`}
            >
              {tCommon('service').toUpperCase()}
            </button>
            <button
              onClick={() => {
                setBookingType('package');
                setSelectedService(null);
                setSelectedTime('');
              }}
              className={`flex-1 py-1.5 px-4 rounded-md text-xs font-bold transition-all ${bookingType === 'package' ? 'bg-primary text-white shadow-sm' : 'text-foreground-secondary hover:text-foreground hover:bg-background'
                }`}
            >
              {tPkg('package').toUpperCase()}
            </button>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">{t('clientName')}</label>
            <input
              type="text"
              placeholder={t('enterClientName')}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none text-lg"
              autoFocus
            />
          </div>

          {/* Barber Selection (multi mode only) */}
          {salonMode === 'multi' && staffMembers.length > 0 && (
            <div>
              <label className="text-sm font-medium text-foreground-secondary block mb-2">{t('selectBarber')}</label>
              <div className="flex flex-wrap gap-2">
                {staffMembers.map((member) => {
                  const hasPackage = !!staffPackageStatuses[member.id];

                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedStaff(selectedStaff?.id === member.id ? null : member)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${selectedStaff?.id === member.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                        }`}
                    >
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: member.color }}
                      >
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col items-start leading-tight">
                        <span className="font-medium text-foreground text-sm">{member.name}</span>
                        {hasPackage && (
                          <span className="text-[9px] font-bold uppercase tracking-tight line-clamp-1 text-amber-600">
                            {staffPackageStatuses[member.id]}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {bookingType === 'service' ? (
            <>
              <div>
                <label className="text-sm font-medium text-foreground-secondary block mb-2">{t('selectService')}</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {services.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    return (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`p-3 rounded-xl border-2 transition-all text-start active:scale-[0.98] ${isSelected ? 'border-primary bg-primary/10' : 'border-border bg-secondary hover:border-primary/50'
                          }`}
                      >
                        <p className="font-semibold text-foreground text-sm line-clamp-1">{service.name}</p>
                        <p className="font-bold text-primary text-sm mt-1">{formatCurrency(service.price)}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground-secondary block mb-2">{t('selectTime')}</label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-sm text-center">
                    {selectedService ? t('noSlotsAvailable') : t('selectServiceFirst')}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((time) => {
                      const isSelected = selectedTime === time;
                      return (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-secondary text-foreground hover:bg-secondary-hover'
                            }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-foreground-secondary block mb-2">{t('selectPackage')}</label>
                <div className="grid grid-cols-1 gap-2">
                  {packages.map((pkg) => {
                    const isSelected = selectedPackage?.id === pkg.id;
                    return (
                      <button
                        key={pkg.id}
                        onClick={() => setSelectedPackage(pkg)}
                        className={`p-4 rounded-xl border-2 transition-all text-start active:scale-[0.98] ${isSelected ? 'border-violet-500 bg-violet-50' : 'border-border bg-secondary hover:border-violet-500/50'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-foreground font-title">{pkg.name}</p>
                          <p className="font-black text-violet-600 font-mono tracking-tighter">{formatCurrency(pkg.price)}</p>
                        </div>
                        {pkg.description && (
                          <p className="text-xs text-foreground-secondary mt-1 line-clamp-1">{pkg.description}</p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground-secondary block mb-2">{tPkg('advance')}</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={advance}
                    onChange={(e) => setAdvance(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="relative group">
                  <label className="text-sm font-medium text-foreground-secondary block mb-2">{tPkg('scheduledDate')}</label>
                  <div className="px-4 py-3 rounded-lg border-2 border-dashed border-pink-200 bg-pink-50 text-pink-600 font-bold text-sm">
                    {selectedDate}
                  </div>
                  <p className="text-[10px] text-pink-400 mt-1 italic tracking-tight">* {tPkg('scheduledDate')} est fixé à la date sélectionnée</p>
                </div>
              </div>
            </>
          )}

          <Button
            onClick={handleBook}
            disabled={
              !clientName.trim() ||
              (bookingType === 'service'
                ? (!selectedService || !selectedTime || (salonMode === 'multi' && !selectedStaff))
                : !selectedPackage)
            }
            size="lg"
            className="w-full text-lg font-semibold"
          >
            <Check className="w-5 h-5" />
            {tCommon('confirm')}
          </Button>
        </div>
      )}

      {/* Warning Dialog — date already has packages */}
      {showDateWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-2xl border border-border shadow-xl w-full max-w-md animate-fade-in">
            <div className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{t('dateHasPackages')}</h3>
                  <p className="text-sm text-foreground-secondary mt-1">{t('existingPackagesWarning')}</p>
                </div>
                <button onClick={() => setShowDateWarning(false)} className="p-1 hover:bg-secondary rounded-lg">
                  <X className="w-4 h-4 text-foreground-secondary" />
                </button>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {existingPackagesOnDate.map((pkg, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <p className="font-semibold text-foreground text-sm">{pkg.packageName}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-foreground-secondary">
                      <span>{pkg.clientName}</span>
                      {pkg.staffMemberName && (
                        <>
                          <span>•</span>
                          <span>{pkg.staffMemberName}</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowDateWarning(false)}
                  className="flex-1"
                >
                  {tCommon('cancel')}
                </Button>
                <Button
                  onClick={confirmBook}
                  className="flex-1"
                >
                  {t('continueAnyway')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div>
        <h2 className="font-bold text-foreground mb-3 font-title">
          {t('appointmentsFor', { day: formatDateDisplay(selectedDate), count: appointments.filter(a => a.serviceId).length })}
        </h2>

        {appointments.filter(a => a.serviceId).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-card rounded-xl border border-border">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-foreground-muted" />
            </div>
            <p className="text-foreground-secondary font-medium">{t('noAppointments')}</p>
            <p className="text-foreground-muted text-sm mt-1">
              {isBooking ? t('fillFormAbove') : t('tapNewBooking')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments
              .filter(a => a.serviceId)
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appointment) => (
                <div key={appointment.id} className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-primary">{appointment.time.split(':')[0]}</span>
                    <span className="text-xs text-primary">{appointment.time.split(':')[1]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-foreground-secondary" />
                      <p className="font-semibold text-foreground truncate">{appointment.clientName}</p>
                    </div>
                    <p className="text-sm text-foreground-secondary truncate">{appointment.serviceName}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-foreground-tertiary">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.duration}{tCommon('minutes')}
                      </span>
                      <span className="font-bold text-foreground">{formatCurrency(appointment.price)}</span>
                      {appointment.staffMemberName && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {appointment.staffMemberName}
                        </span>
                      )}
                    </div>
                  </div>
                  <button onClick={() => handleDelete(appointment.id)} className="p-2 hover:bg-destructive/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5 text-destructive" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
      {/* Scheduled Packages for this date */}
      {appointments.filter(a => a.packageId).length > 0 && (
        <div>
          <h2 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-pink-500" />
            {tPkg('scheduledEvents')} ({appointments.filter(a => a.packageId).length})
          </h2>
          <div className="space-y-3">
            {appointments.filter(a => a.packageId).map((apt) => (
              <div key={apt.id} className="p-4 rounded-xl bg-card border border-pink-200 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-pink-50 flex flex-col items-center justify-center shrink-0">
                  <PackageIcon className="w-6 h-6 text-pink-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">{apt.packageName}</p>
                  {apt.notes && (
                    <p className="text-sm text-foreground-secondary truncate">{apt.notes}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-sm font-medium text-foreground-secondary">
                      {apt.clientName}
                    </span>
                    {(apt.advance != null && apt.advance > 0) && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 text-emerald-600">
                        {tPkg('advance')}: {formatCurrency(apt.advance)}
                      </span>
                    )}
                    {apt.eventDate && (
                      <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-pink-50 text-pink-600">
                        {tPkg('scheduledDate')}: {apt.eventDate}
                      </span>
                    )}
                    {apt.staffMemberName && (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {apt.staffMemberName}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-end">
                    <span className="text-lg font-black text-foreground">
                      {formatCurrency(apt.price)}
                    </span>
                    {(apt.advance != null && apt.advance > 0) && (
                      <p className="text-xs text-foreground-muted">
                        {tPkg('remaining')}: {formatCurrency(apt.price - apt.advance)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
