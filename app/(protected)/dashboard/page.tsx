'use client';

import React from 'react';
import { Calendar, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import { KPICard } from '@/components/dashboard/kpi-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { TodaySchedule } from '@/components/dashboard/today-schedule';
import { MOCK_APPOINTMENTS, MOCK_PRODUCTS } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  // Mock calculations
  const todayAppointments = MOCK_APPOINTMENTS.length;
  const dailyRevenue = MOCK_APPOINTMENTS.reduce((sum, apt) => sum + apt.price, 0);
  const lowStockProducts = MOCK_PRODUCTS.filter((p) => p.quantity <= p.minQuantity).length;
  const thisMonthRevenue = dailyRevenue * 25; // Mock: 25 business days

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 lg:space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-foreground-secondary mt-1">Welcome back! Here's your business overview.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title="Today's Appointments"
          value={todayAppointments}
          icon={Calendar}
          color="blue"
          change={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="Daily Revenue"
          value={formatCurrency(dailyRevenue)}
          icon={DollarSign}
          color="emerald"
          change={{ value: 8, isPositive: true }}
        />
        <KPICard
          title="Low Stock Items"
          value={lowStockProducts}
          icon={AlertCircle}
          color="amber"
          change={{ value: 3, isPositive: false }}
        />
        <KPICard
          title="This Month Revenue"
          value={formatCurrency(thisMonthRevenue)}
          icon={TrendingUp}
          color="purple"
          change={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
        <QuickActions />
      </section>

      {/* Today's Schedule */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">Today's Schedule</h2>
        <TodaySchedule appointments={MOCK_APPOINTMENTS} />
      </section>
    </div>
  );
}
