'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, DollarSign, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { KPICard } from '@/components/dashboard/kpi-card';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { TodaySchedule } from '@/components/dashboard/today-schedule';
import { UpcomingEvents } from '@/components/dashboard/upcoming-events';
import { Appointment, Package } from '@/lib/types';
import { formatCurrency, getTodayDate } from '@/lib/utils';
import { getDashboardStats } from '@/lib/actions/dashboard.actions';
import { getAppointmentsByDate, getUpcomingScheduledAppointments } from '@/lib/actions/appointment.actions';

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const [stats, setStats] = useState({
    todayAppointments: 0,
    dailyRevenue: 0,
    lowStockProducts: 0,
    monthRevenue: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const today = getTodayDate();
        const [dashboardStats, appointments, upcoming] = await Promise.all([
          getDashboardStats(),
          getAppointmentsByDate(today),
          getUpcomingScheduledAppointments(),
        ]);
        setStats({
          todayAppointments: dashboardStats.todayAppointments,
          dailyRevenue: dashboardStats.dailyRevenue,
          lowStockProducts: dashboardStats.lowStockProducts,
          monthRevenue: dashboardStats.monthRevenue,
        });
        setTodaySchedule(appointments);
        setUpcomingAppointments(upcoming);
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
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('title')}</h1>
        <p className="text-foreground-secondary mt-1">{t('welcome')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KPICard
          title={t('todayAppointments')}
          value={stats.todayAppointments}
          icon={Calendar}
          color="blue"
        />
        <KPICard
          title={t('dailyRevenue')}
          value={formatCurrency(stats.dailyRevenue)}
          icon={DollarSign}
          color="emerald"
        />
        <KPICard
          title={t('lowStockItems')}
          value={stats.lowStockProducts}
          icon={AlertCircle}
          color="amber"
        />
        <KPICard
          title={t('monthRevenue')}
          value={formatCurrency(stats.monthRevenue)}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Quick Actions */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">{t('quickActions')}</h2>
        <QuickActions />
      </section>

      {/* Today's Schedule */}
      <section>
        <h2 className="text-lg font-bold text-foreground mb-4">{t('todaySchedule')}</h2>
        <TodaySchedule appointments={todaySchedule} />
      </section>

      {/* Upcoming Events */}
      <section>
        <UpcomingEvents appointments={upcomingAppointments} />
      </section>
    </div>
  );
}
