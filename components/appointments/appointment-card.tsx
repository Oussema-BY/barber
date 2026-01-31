import React from 'react';
import { Clock, User, Phone, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Appointment } from '@/lib/types';
import { formatTime, formatCurrency } from '@/lib/utils';

interface AppointmentCardProps {
  appointment: Appointment;
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (id: string) => void;
}

const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
  confirmed: 'success',
  pending: 'warning',
  completed: 'info',
  cancelled: 'danger',
};

export function AppointmentCard({
  appointment,
  onDelete,
}: AppointmentCardProps) {
  const statusVariant = statusVariants[appointment.status] || 'default';

  return (
    <div className="p-3 sm:p-4 rounded-xl bg-card border border-border hover:shadow-sm transition-all animate-fade-in">
      {/* Mobile Layout */}
      <div className="flex items-start gap-3">
        {/* Time indicator */}
        <div className="hidden sm:flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-primary-light text-primary shrink-0">
          <span className="text-lg font-bold leading-none">{formatTime(appointment.time).split(':')[0]}</span>
          <span className="text-xs font-medium">{formatTime(appointment.time).split(':')[1]}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{appointment.clientName}</h3>
              <p className="text-sm text-foreground-secondary truncate">{appointment.serviceName}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge variant={statusVariant} size="sm" className="capitalize">
                {appointment.status}
              </Badge>
              {onDelete && (
                <button
                  onClick={() => onDelete(appointment.id)}
                  className="p-1.5 hover:bg-destructive-light rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              )}
            </div>
          </div>

          {/* Details row */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-foreground-tertiary">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span className="sm:hidden">{formatTime(appointment.time)}</span>
              <span className="hidden sm:inline">{appointment.duration} min</span>
            </div>

            {appointment.clientPhone && (
              <div className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" />
                <span>{appointment.clientPhone}</span>
              </div>
            )}

            {appointment.staffMemberName && (
              <div className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span>{appointment.staffMemberName}</span>
              </div>
            )}

            <span className="ml-auto font-bold text-foreground text-sm">
              {formatCurrency(appointment.price)}
            </span>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <p className="text-xs text-foreground-muted mt-2 line-clamp-1 italic">
              {appointment.notes}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
