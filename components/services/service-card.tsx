import React from 'react';
import { Clock, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Service } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  onEdit?: (service: Service) => void;
  onDelete?: (id: string) => void;
  onSchedule?: (service: Service) => void;
}

const categoryColors: Record<string, { bg: string; badge: 'info' | 'success' | 'warning' | 'purple' | 'default' }> = {
  hair: { bg: 'border-l-4 border-l-info', badge: 'info' },
  beard: { bg: 'border-l-4 border-l-success', badge: 'success' },
  grooming: { bg: 'border-l-4 border-l-warning', badge: 'warning' },
  package: { bg: 'border-l-4 border-l-purple', badge: 'purple' },
};

export function ServiceCard({
  service,
  onEdit,
  onDelete,
  onSchedule,
}: ServiceCardProps) {
  const colors = categoryColors[service.category] || { bg: '', badge: 'default' as const };

  return (
    <Card className={`overflow-hidden hover:shadow-md transition-all animate-fade-in ${colors.bg}`}>
      <CardContent className="p-3 sm:p-4">
        {/* Header Row - Name, Badge, Price & Actions */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-foreground truncate">{service.name}</h3>
              <Badge variant={colors.badge} size="sm" className="capitalize shrink-0 text-xs">
                {service.category}
              </Badge>
            </div>
          </div>

          {/* Price - prominent on mobile */}
          <span className="text-base sm:text-lg font-bold text-primary shrink-0">
            {formatCurrency(service.price)}
          </span>
        </div>

        {/* Description */}
        {service.description && (
          <p className="text-xs sm:text-sm text-foreground-secondary line-clamp-2 mb-2">
            {service.description}
          </p>
        )}

        {/* Footer - Duration & Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground-muted" />
            <span className="text-foreground-secondary">{service.duration} min</span>
          </div>

          {/* Actions */}
          {(onEdit || onDelete) && (
            <div className="flex gap-1">
              {onEdit && (
                <button
                  onClick={() => onEdit(service)}
                  className="p-1.5 sm:p-2 hover:bg-secondary rounded-lg transition-colors active:scale-95"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground-tertiary" />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(service.id)}
                  className="p-1.5 sm:p-2 hover:bg-destructive-light rounded-lg transition-colors active:scale-95"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Schedule Button */}
        {onSchedule && (
          <Button
            size="sm"
            className="w-full mt-3"
            onClick={() => onSchedule(service)}
          >
            Schedule Service
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
