'use client';

import React from 'react';
import { CalendarDays, Package as PackageIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Package } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface UpcomingEventsProps {
  packages: Package[];
}

export function UpcomingEvents({ packages }: UpcomingEventsProps) {
  const t = useTranslations('dashboard');
  const tPkg = useTranslations('packages');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{t('upcomingEvents')}</CardTitle>
          <Link href="/packages" className="text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            {t('viewAll')}
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
              <CalendarDays className="w-8 h-8 text-foreground-muted" />
            </div>
            <p className="text-foreground-secondary font-medium">{t('noUpcomingEvents')}</p>
            <p className="text-foreground-muted text-sm mt-1">{t('noUpcomingEventsHint')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {packages.map((pkg) => {
              const eventDate = pkg.scheduledDate
                ? new Date(pkg.scheduledDate + 'T00:00:00')
                : null;
              return (
                <Link key={pkg.id} href="/appointments">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-background-secondary border border-border hover:border-border-secondary hover:shadow-sm transition-all duration-200 cursor-pointer">
                    <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0 bg-pink-50">
                      {eventDate ? (
                        <>
                          <span className="text-xs font-bold leading-none text-pink-600">
                            {eventDate.toLocaleDateString(undefined, { month: 'short' })}
                          </span>
                          <span className="text-lg font-black leading-none text-pink-600">
                            {eventDate.getDate()}
                          </span>
                        </>
                      ) : (
                        <PackageIcon className="w-5 h-5 text-pink-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{pkg.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-foreground-muted">
                          {pkg.services.length} {tPkg('servicesCount')}
                        </span>
                        {(pkg.advance != null && pkg.advance > 0) && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                            {tPkg('advance')}: {formatCurrency(pkg.advance)}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground shrink-0">
                      {formatCurrency(pkg.price)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
