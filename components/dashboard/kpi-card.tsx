import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'emerald' | 'amber' | 'purple';
  change?: {
    value: number;
    isPositive: boolean;
  };
}

const colorStyles = {
  blue: 'bg-info-light text-info',
  emerald: 'bg-success-light text-success',
  amber: 'bg-warning-light text-warning',
  purple: 'bg-purple-light text-purple',
};

export function KPICard({
  title,
  value,
  icon: Icon,
  color = 'blue',
  change,
}: KPICardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-5 pb-5">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground-secondary">{title}</p>
            <p className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">{value}</p>
            {change && (
              <div className={`flex items-center gap-1 text-sm font-medium ${
                change.isPositive ? 'text-success' : 'text-destructive'
              }`}>
                {change.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(change.value)}%</span>
                <span className="text-foreground-muted font-normal">vs last period</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorStyles[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
