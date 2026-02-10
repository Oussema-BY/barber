'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Calendar, Clock, User, Trash2, ChevronLeft, ChevronRight, ChevronDown, Check, Loader2 } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { CATEGORY_COLORS } from '@/lib/constants';
import { Appointment, Service, StaffMember } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { getServices } from '@/lib/actions/service.actions';
import { getAppointmentsByDate, createAppointment, deleteAppointment, getAvailableSlots } from '@/lib/actions/appointment.actions';
import { getSettings } from '@/lib/actions/settings.actions';
import { getStaffMembers } from '@/lib/actions/staff.actions';

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function AppointmentsPage() {
  const t = useTranslations('appointments');
  const tCommon = useTranslations('common');
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

  // Booking form state
  const [clientName, setClientName] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

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
        const [servicesData, settings, staff] = await Promise.all([
          getServices(),
          getSettings(),
          getStaffMembers(),
        ]);
        setServices(servicesData);
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
          selectedService!.duration,
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

  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
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
    const d = new Date(selectedDate);
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
        date: d.toISOString().split('T')[0],
        day: d.getDate(),
        currentMonth: false,
      });
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      days.push({
        date: date.toISOString().split('T')[0],
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
          date: date.toISOString().split('T')[0],
          day: d,
          currentMonth: false,
        });
      }
    }

    return days;
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
    if (!clientName.trim() || !selectedService || !selectedTime) return;
    if (salonMode === 'multi' && !selectedStaff) return;

    try {
      const newAppointment = await createAppointment({
        clientName: clientName.trim(),
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        date: selectedDate,
        time: selectedTime,
        duration: selectedService.duration,
        price: selectedService.price,
        status: 'confirmed',
        staffMemberId: selectedStaff?.id,
        staffMemberName: selectedStaff?.name,
      });

      setAppointments([...appointments, newAppointment]);
      setClientName('');
      setSelectedService(null);
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
    setSelectedTime('');
    setSelectedStaff(null);
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

        {!isBooking && (
          <Button onClick={() => setIsBooking(true)} className="w-full sm:w-auto">
            <Plus className="w-5 h-5" />
            <span>{t('newBooking')}</span>
          </Button>
        )}
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
                return (
                  <button
                    key={date}
                    onClick={() => handleSelectDay(date)}
                    className={`relative py-2 text-sm font-medium rounded-lg transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : isToday
                          ? 'bg-primary/10 text-primary font-bold'
                          : currentMonth
                            ? 'text-foreground hover:bg-secondary'
                            : 'text-foreground-muted hover:bg-secondary'
                    }`}
                  >
                    {day}
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
                {staffMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedStaff(selectedStaff?.id === member.id ? null : member)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all ${
                      selectedStaff?.id === member.id
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
                    <span className="font-medium text-foreground text-sm">{member.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">{t('selectService')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {services.map((service) => {
                const isSelected = selectedService?.id === service.id;
                const categoryColor = CATEGORY_COLORS[service.category] || CATEGORY_COLORS.other;
                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-3 rounded-xl border-2 transition-all text-start active:scale-[0.98] ${
                      isSelected ? 'border-primary bg-primary/10' : 'border-border bg-secondary hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold text-foreground text-sm line-clamp-1">{service.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${categoryColor.text}`}>{service.duration}{tCommon('minutes')}</span>
                      <span className="font-bold text-primary text-sm">{formatCurrency(service.price)}</span>
                    </div>
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
              <p className="text-sm text-foreground-muted py-2">
                {selectedService ? t('noSlotsAvailable') : t('selectServiceFirst')}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {availableSlots.map((time) => {
                  const isSelected = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        isSelected
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

          <Button
            onClick={handleBook}
            disabled={!clientName.trim() || !selectedService || !selectedTime || (salonMode === 'multi' && !selectedStaff)}
            size="lg"
            className="w-full text-lg font-semibold"
          >
            <Check className="w-5 h-5" />
            {t('bookAppointment')}
          </Button>
        </div>
      )}

      {/* Appointments List */}
      <div>
        <h2 className="font-bold text-foreground mb-3">
          {t('appointmentsFor', { day: formatDateDisplay(selectedDate), count: appointments.length })}
        </h2>

        {appointments.length === 0 ? (
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
    </div>
  );
}
