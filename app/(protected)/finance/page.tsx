'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart as PieChartIcon,
  Loader2,
} from 'lucide-react';
import { Service, Expense, Product, Appointment } from '@/lib/types';
import { getServices } from '@/lib/actions/service.actions';
import { getExpenses } from '@/lib/actions/expense.actions';
import { getProducts } from '@/lib/actions/product.actions';
import { getAllAppointments } from '@/lib/actions/appointment.actions';

export default function FinancePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, expensesData, productsData, appointmentsData] = await Promise.all([
          getServices(),
          getExpenses(),
          getProducts(),
          getAllAppointments(),
        ]);
        setServices(servicesData);
        setExpenses(expensesData);
        setProducts(productsData);
        setAppointments(appointmentsData);
      } catch (err) {
        console.error('Failed to load finance data:', err);
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

  const totalRevenue = appointments.reduce((sum, apt) => sum + apt.price, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const inventoryValue = products.reduce((sum, p) => sum + p.quantity * p.costPrice, 0);
  const netProfit = totalRevenue - totalExpenses;

  const revenueByService = services.map((service) => {
    const appointmentsCount = appointments.filter((apt) => apt.serviceId === service.id).length;
    return {
      name: service.name,
      revenue: service.price * appointmentsCount,
    };
  });

  const expenseBreakdown = Object.entries(
    expenses.reduce((acc: Record<string, number>, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {})
  ).map(([category, amount]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: amount,
  }));

  const monthlyTrend = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(2024, i, 1).toLocaleString('en-US', { month: 'short' });
    return {
      name: month,
      revenue: totalRevenue / 12,
      expenses: totalExpenses / 12,
    };
  });

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4'];

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Finance & Reports</h1>
        <p className="text-foreground-secondary mt-1">Business analytics and financial overview</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <Card>
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-foreground-secondary">Total Revenue</p>
                <p className="text-lg md:text-2xl font-bold text-foreground mt-1">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="p-2 bg-success-light rounded-lg hidden sm:block">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-foreground-secondary">Total Expenses</p>
                <p className="text-lg md:text-2xl font-bold text-foreground mt-1">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="p-2 bg-destructive-light rounded-lg hidden sm:block">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-foreground-secondary">Net Profit</p>
                <p className="text-lg md:text-2xl font-bold text-foreground mt-1">{formatCurrency(netProfit)}</p>
                <p className="text-xs md:text-sm text-success font-medium mt-1">
                  {totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0.0'}% margin
                </p>
              </div>
              <div className="p-2 bg-primary-light rounded-lg hidden sm:block">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-foreground-secondary">Inventory Value</p>
                <p className="text-lg md:text-2xl font-bold text-foreground mt-1">{formatCurrency(inventoryValue)}</p>
                <p className="text-xs md:text-sm text-foreground-tertiary font-medium mt-1">
                  {products.length} products
                </p>
              </div>
              <div className="p-2 bg-warning-light rounded-lg hidden sm:block">
                <PieChartIcon className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Revenue by Service */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Revenue by Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByService} margin={{ bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" tick={{ fontSize: 11 }} className="fill-foreground-secondary" />
                  <YAxis tick={{ fontSize: 11 }} className="fill-foreground-secondary" />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                  <Bar dataKey="revenue" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value as number)} contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Monthly Revenue vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 md:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-foreground-secondary" />
                <YAxis tick={{ fontSize: 11 }} className="fill-foreground-secondary" />
                <Tooltip formatter={(value) => formatCurrency(value as number)} contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="var(--success)" strokeWidth={2} name="Revenue" dot={{ fill: 'var(--success)' }} />
                <Line type="monotone" dataKey="expenses" stroke="var(--destructive)" strokeWidth={2} name="Expenses" dot={{ fill: 'var(--destructive)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Expense Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {expenses.length === 0 ? (
            <p className="text-foreground-secondary text-center py-8">No expenses recorded yet</p>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-background-secondary border border-border"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{expense.title}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge size="sm" variant="default">{expense.category}</Badge>
                      <p className="text-sm text-foreground-tertiary">{expense.date}</p>
                    </div>
                  </div>
                  <p className="text-base md:text-lg font-bold text-foreground ml-4">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
