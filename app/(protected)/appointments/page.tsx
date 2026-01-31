'use client';

import { useState } from 'react';
import { Plus, Calendar, Clock, User, Trash2, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { MOCK_SERVICES, MOCK_APPOINTMENTS, CATEGORY_COLORS } from '@/lib/constants';
import { Appointment, Service } from '@/lib/types';
import { formatCurrency, generateId } from '@/lib/utils';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30',
];

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

export default function AppointmentsPage() {
  const t = useTranslations('appointments');
  const tCommon = useTranslations('common');
  const locale = useLocale();

  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedDate, setSelectedDate] = useState(getTodayDate());
  const [isBooking, setIsBooking] = useState(false);

  // Booking form state
  const [clientName, setClientName] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  // Filter appointments for selected date
  const dayAppointments = appointments.filter((apt) => apt.date === selectedDate);

  // Get booked times for the selected date
  const bookedTimes = dayAppointments.map((apt) => apt.time);

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

  const handleDateChange = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + (direction === 'next' ? 1 : -1));
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const handleBook = () => {
    if (!clientName.trim() || !selectedService || !selectedTime) return;

    const newAppointment: Appointment = {
      id: generateId(),
      clientName: clientName.trim(),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      date: selectedDate,
      time: selectedTime,
      duration: selectedService.duration,
      price: selectedService.price,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppointments([...appointments, newAppointment]);

    // Reset form
    setClientName('');
    setSelectedService(null);
    setSelectedTime('');
    setIsBooking(false);
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  const cancelBooking = () => {
    setClientName('');
    setSelectedService(null);
    setSelectedTime('');
    setIsBooking(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Header with Date Navigation */}
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
      <div className="flex items-center justify-between bg-card rounded-xl border border-border p-3">
        <button
          onClick={() => handleDateChange('prev')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-foreground-secondary rtl:rotate-180" />
        </button>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-primary" />
          <div className="text-center">
            <p className="font-bold text-foreground">{formatDateDisplay(selectedDate)}</p>
            <p className="text-xs text-foreground-secondary">{selectedDate}</p>
          </div>
        </div>

        <button
          onClick={() => handleDateChange('next')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-foreground-secondary rtl:rotate-180" />
        </button>
      </div>

      {/* Quick Booking Form */}
      {isBooking && (
        <div className="bg-card rounded-xl border-2 border-primary p-4 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground">{t('quickBooking')}</h2>
            <button
              onClick={cancelBooking}
              className="text-sm text-foreground-secondary hover:text-foreground"
            >
              {tCommon('cancel')}
            </button>
          </div>

          {/* Step 1: Client Name */}
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">
              {t('clientName')}
            </label>
            <input
              type="text"
              placeholder={t('enterClientName')}
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-background text-foreground placeholder-foreground-muted focus:border-primary focus:outline-none text-lg"
              autoFocus
            />
          </div>

          {/* Step 2: Select Service */}
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">
              {t('selectService')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MOCK_SERVICES.map((service) => {
                const isSelected = selectedService?.id === service.id;
                const categoryColor = CATEGORY_COLORS[service.category] || CATEGORY_COLORS.other;

                return (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`p-3 rounded-xl border-2 transition-all text-start active:scale-[0.98] ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-secondary hover:border-primary/50'
                    }`}
                  >
                    <p className="font-semibold text-foreground text-sm line-clamp-1">
                      {service.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${categoryColor.text}`}>{service.duration}{tCommon('minutes')}</span>
                      <span className="font-bold text-primary text-sm">{formatCurrency(service.price)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Select Time */}
          <div>
            <label className="text-sm font-medium text-foreground-secondary block mb-2">
              {t('selectTime')}
            </label>
            <div className="flex flex-wrap gap-2">
              {TIME_SLOTS.map((time) => {
                const isBooked = bookedTimes.includes(time);
                const isSelected = selectedTime === time;

                return (
                  <button
                    key={time}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    disabled={isBooked}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isBooked
                        ? 'bg-secondary text-foreground-muted line-through cursor-not-allowed'
                        : isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary-hover'
                    }`}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Book Button */}
          <Button
            onClick={handleBook}
            disabled={!clientName.trim() || !selectedService || !selectedTime}
            size="lg"
            className="w-full text-lg font-semibold"
          >
            <Check className="w-5 h-5" />
            {t('bookAppointment')}
          </Button>
        </div>
      )}

      {/* Today's Appointments */}
      <div>
        <h2 className="font-bold text-foreground mb-3">
          {t('appointmentsFor', { day: formatDateDisplay(selectedDate), count: dayAppointments.length })}
        </h2>

        {dayAppointments.length === 0 ? (
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
            {dayAppointments
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 rounded-xl bg-card border border-border flex items-center gap-4"
                >
                  {/* Time */}
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xl font-bold text-primary">{appointment.time.split(':')[0]}</span>
                    <span className="text-xs text-primary">{appointment.time.split(':')[1]}</span>
                  </div>

                  {/* Details */}
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
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
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
