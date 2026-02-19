'use client';

import React from 'react';
import { Clock, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Appointment } from '@/lib/types';
import { formatTime, formatCurrency } from '@/lib/utils';

interface TodayScheduleProps {
  appointments: Appointment[];
}

export function TodaySchedule({ appointments }: TodayScheduleProps) {
  const t = useTranslations('dashboard');
  const todayAppointments = appointments.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('todaySchedule')}</CardTitle>
      </CardHeader>
      <CardContent>
        {todayAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-foreground-muted" />
            </div>
            <p className="text-foreground-secondary font-medium">{t('noAppointmentsToday')}</p>
            <p className="text-foreground-muted text-sm mt-1">{t('scheduleIsClear')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-start justify-between p-4 rounded-xl bg-background-secondary border border-border hover:border-border-secondary hover:shadow-sm transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="font-semibold text-foreground">{appointment.clientName}</p>
                    <Badge variant={appointment.packageId ? "purple" : "info"} size="sm" className={appointment.packageId ? "bg-violet-100 text-violet-700 border-violet-200" : ""}>
                      {appointment.packageId ? appointment.packageName : appointment.serviceName}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground-tertiary">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(appointment.time)} ({appointment.duration} min)</span>
                    </div>
                    {appointment.clientPhone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-4 h-4" />
                        <span>{appointment.clientPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 ml-4">
                  <Badge
                    variant={
                      appointment.status === 'confirmed'
                        ? 'success'
                        : appointment.status === 'pending'
                          ? 'warning'
                          : 'danger'
                    }
                    size="sm"
                  >
                    {appointment.status}
                  </Badge>
                  <p className="text-sm font-bold text-foreground">
                    {formatCurrency(appointment.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
