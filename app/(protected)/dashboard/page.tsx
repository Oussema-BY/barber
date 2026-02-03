'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { KPICard } from '@/components/dashboard/kpi-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { TodaySchedule } from '@/components/dashboard/today-schedule';
import { Appointment } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { getDashboardStats } from '@/lib/actions/dashboard.actions';
import { getAppointmentsByDate } from '@/lib/actions/appointment.actions';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    dailyRevenue: 0,
    lowStockProducts: 0,
    monthRevenue: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const [dashboardStats, appointments] = await Promise.all([
          getDashboardStats(),
          getAppointmentsByDate(today),
        ]);
        setStats({
          todayAppointments: dashboardStats.todayAppointments,
          dailyRevenue: dashboardStats.dailyRevenue,
          lowStockProducts: dashboardStats.lowStockProducts,
          monthRevenue: dashboardStats.monthRevenue,
        });
        setTodaySchedule(appointments);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
          value={stats.todayAppointments}
          icon={Calendar}
          color="blue"
        />
        <KPICard
          title="Daily Revenue"
          value={formatCurrency(stats.dailyRevenue)}
          icon={DollarSign}
          color="emerald"
        />
        <KPICard
          title="Low Stock Items"
          value={stats.lowStockProducts}
          icon={AlertCircle}
          color="amber"
        />
        <KPICard
          title="This Month Revenue"
          value={formatCurrency(stats.monthRevenue)}
          icon={TrendingUp}
          color="purple"
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
        <TodaySchedule appointments={todaySchedule} />
      </section>
    </div>
  );
}
