import React from 'react';
import { Calendar, ShoppingCart, Zap, Package, TrendingUp, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const QUICK_ACTIONS = [
  {
    labelKey: 'newAppointment',
    icon: Calendar,
    href: '/appointments',
    color: 'bg-info-light text-info hover:bg-info/20',
  },
  {
    labelKey: 'schedulePackage',
    icon: CalendarDays,
    href: '/packages',
    color: 'bg-pink-50 text-pink-600 hover:bg-pink-100',
  },
  {
    labelKey: 'newSale',
    icon: ShoppingCart,
    href: '/pos',
    color: 'bg-success-light text-success hover:bg-success/20',
  },
  {
    labelKey: 'addService',
    icon: Zap,
    href: '/services',
    color: 'bg-warning-light text-warning hover:bg-warning/20',
  },
  {
    labelKey: 'manageStock',
    icon: Package,
    href: '/inventory',
    color: 'bg-purple-light text-purple hover:bg-purple/20',
  },
  {
    labelKey: 'viewReports',
    icon: TrendingUp,
    href: '/finance',
    color: 'bg-destructive-light text-destructive hover:bg-destructive/20',
  },
];

export function QuickActions() {
  const t = useTranslations('dashboard');
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.labelKey} href={action.href}>
            <button
              className={`w-full flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl transition-all duration-200 ${action.color} hover:scale-[1.02] active:scale-[0.98]`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs sm:text-sm font-semibold text-center">{t(action.labelKey)}</span>
            </button>
          </Link>
        );
      })}
    </div>
  );
}
