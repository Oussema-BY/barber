import React from 'react';
import { Scissors, Trash2 } from 'lucide-react';
import { Service } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  onDelete?: (id: string) => void;
}

export function ServiceCard({ service, onDelete }: ServiceCardProps) {
  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all duration-200">
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary to-primary/50" />

      <div className="p-5">
        {/* Icon + Name */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
            <Scissors className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">
              {service.name}
            </h3>
            {service.description && (
              <p className="text-sm text-foreground-secondary line-clamp-1 mt-0.5">
                {service.description}
              </p>
            )}
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-foreground">
            {formatCurrency(service.price)}
          </span>

          {onDelete && (
            <button
              onClick={() => onDelete(service.id)}
              className="p-2 hover:bg-destructive-light rounded-xl transition-all active:scale-95 opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
