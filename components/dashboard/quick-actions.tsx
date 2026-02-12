import React from 'react';
import { Calendar, ShoppingCart, Zap, Package, TrendingUp } from 'lucide-react';
import Link from 'next/link';

const QUICK_ACTIONS = [
  {
    label: 'New Appointment',
    icon: Calendar,
    href: '/appointments',
    color: 'bg-info-light text-info hover:bg-info/20',
  },
  {
    label: 'New Sale',
    icon: ShoppingCart,
    href: '/pos',
    color: 'bg-success-light text-success hover:bg-success/20',
  },
  {
    label: 'Add Service',
    icon: Zap,
    href: '/services',
    color: 'bg-warning-light text-warning hover:bg-warning/20',
  },
  {
    label: 'Manage Stock',
    icon: Package,
    href: '/inventory',
    color: 'bg-purple-light text-purple hover:bg-purple/20',
  },
  {
    label: 'View Reports',
    icon: TrendingUp,
    href: '/finance',
    color: 'bg-destructive-light text-destructive hover:bg-destructive/20',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {QUICK_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Link key={action.href} href={action.href}>
            <button
              className={`w-full flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl transition-all duration-200 ${action.color} hover:scale-[1.02] active:scale-[0.98]`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs sm:text-sm font-semibold text-center">{action.label}</span>
            </button>
          </Link>
        );
      })}
    </div>
  );
}
