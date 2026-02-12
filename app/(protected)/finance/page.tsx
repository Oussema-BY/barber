"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Loader2,
  BarChart3,
} from "lucide-react";
import { useUser } from "@/lib/user-context";
import {
  getFinanceReport,
  type FinanceReportData,
} from "@/lib/actions/finance.actions";

type DatePeriod = "today" | "week" | "month" | "year" | "custom";

function getDateRange(
  period: DatePeriod,
  customStart?: string,
  customEnd?: string,
) {
  const now = new Date();
  const today = now.toISOString().split("T")[0];

  switch (period) {
    case "today":
      return { start: today, end: today };
    case "week": {
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      return { start: weekStart.toISOString().split("T")[0], end: today };
    }
    case "month": {
      const monthStart = today.slice(0, 7) + "-01";
      return { start: monthStart, end: today };
    }
    case "year": {
      const yearStart = today.slice(0, 4) + "-01-01";
      return { start: yearStart, end: today };
    }
    case "custom":
      return {
        start: customStart || today,
        end: customEnd || today,
      };
  }
}

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
];

const PERIOD_KEYS: DatePeriod[] = ["today", "week", "month", "year", "custom"];

export default function FinancePage() {
  const router = useRouter();
  const { shopRole, shopName } = useUser();
  const t = useTranslations("finance");

  useEffect(() => {
    if (shopRole && shopRole !== "owner") {
      router.replace("/dashboard");
    }
  }, [shopRole, router]);

  const [period, setPeriod] = useState<DatePeriod>("month");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [report, setReport] = useState<FinanceReportData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadReport = useCallback(async () => {
    setLoading(true);
    try {
      const { start, end } = getDateRange(period, customStart, customEnd);
      const data = await getFinanceReport(start, end);
      setReport(data);
    } catch (err) {
      console.error("Failed to load finance report:", err);
    } finally {
      setLoading(false);
    }
  }, [period, customStart, customEnd]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const periodLabel = (p: DatePeriod) => {
    const map: Record<DatePeriod, string> = {
      today: t("periodToday"),
      week: t("periodWeek"),
      month: t("periodMonth"),
      year: t("periodYear"),
      custom: t("periodCustom"),
    };
    return map[p];
  };

  const { start: displayStart, end: displayEnd } = getDateRange(
    period,
    customStart,
    customEnd,
  );

  if (loading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!report) return null;

  const profitMargin =
    report.totalRevenue > 0
      ? ((report.netProfit / report.totalRevenue) * 100).toFixed(1)
      : "0.0";

  // Chart data
  const monthlyChartData = report.monthlyTrend.map((d) => ({
    name: new Date(d.month + "-01").toLocaleString(undefined, {
      month: "short",
    }),
    [t("revenue")]: d.revenue,
    [t("expenses")]: d.expenses,
  }));

  const serviceChartData = report.revenueByService.map((s) => ({
    name: s.serviceName,
    revenue: s.revenue,
  }));

  const expenseChartData = report.expenseBreakdown.map((e) => ({
    name: e.category.charAt(0).toUpperCase() + e.category.slice(1),
    value: e.amount,
  }));

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Print-only header */}
      <div className="hidden print-only">
        <h1 className="text-2xl font-bold">
          {shopName} — {t("title")}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {displayStart} — {displayEnd} | {new Date().toLocaleDateString()}
        </p>
      </div>

      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        data-print-hide
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t("title")}
          </h1>
          <p className="text-foreground-secondary mt-1">{t("subtitle")}</p>
        </div>
      </div>

      {/* Period selector */}
      <div className="flex flex-wrap items-center gap-2" data-print-hide>
        {PERIOD_KEYS.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              period === p
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground-secondary hover:text-foreground"
            }`}
          >
            {periodLabel(p)}
          </button>
        ))}
        {period === "custom" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none"
            />
            <span className="text-foreground-secondary">—</span>
            <input
              type="date"
              value={customEnd}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border-2 border-border bg-input text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Total Revenue */}
        <Card>
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-foreground-secondary">
                  {t("totalRevenue")}
                </p>
                <p className="text-lg md:text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(report.totalRevenue)}
                </p>
                <p className="text-xs text-foreground-tertiary mt-1">
                  {report.transactionCount} {t("transactions")}
                </p>
              </div>
              <div className="p-2 bg-success-light rounded-lg hidden sm:block">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card>
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-foreground-secondary">
                  {t("totalExpenses")}
                </p>
                <p className="text-lg md:text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(report.totalExpenses)}
                </p>
              </div>
              <div className="p-2 bg-destructive-light rounded-lg hidden sm:block">
                <TrendingDown className="w-5 h-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Profit */}
        <Card>
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-foreground-secondary">
                  {t("netProfit")}
                </p>
                <p
                  className={`text-lg md:text-2xl font-bold mt-1 ${report.netProfit >= 0 ? "text-success" : "text-destructive"}`}
                >
                  {formatCurrency(report.netProfit)}
                </p>
                <p className="text-xs text-foreground-tertiary mt-1">
                  {profitMargin}% {t("margin")}
                </p>
              </div>
              <div className="p-2 bg-primary-light rounded-lg hidden sm:block">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Value */}
        <Card>
          <CardContent className="pt-4 pb-4 md:pt-5 md:pb-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-foreground-secondary">
                  {t("inventoryValue")}
                </p>
                <p className="text-lg md:text-2xl font-bold text-foreground mt-1">
                  {formatCurrency(report.inventoryValue)}
                </p>
                <p className="text-xs text-foreground-tertiary mt-1">
                  {report.productCount} {t("products")}
                </p>
              </div>
              <div className="p-2 bg-warning-light rounded-lg hidden sm:block">
                <Package className="w-5 h-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods */}
      {report.paymentMethodBreakdown.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {report.paymentMethodBreakdown.map((pm) => (
            <div
              key={pm.method}
              className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5"
            >
              <span className="text-sm font-medium text-foreground-secondary capitalize">
                {t(pm.method as "cash" | "card" | "transfer")}
              </span>
              <span className="text-sm font-bold text-foreground">
                {formatCurrency(pm.total)}
              </span>
              <span className="text-xs text-foreground-tertiary">
                ({pm.count})
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Charts */}
      {report.totalRevenue === 0 && report.totalExpenses === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-foreground-muted" />
          </div>
          <p className="text-foreground-secondary font-medium">{t("noData")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
            {/* Revenue by Service */}
            {serviceChartData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {t("revenueByService")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceChartData} margin={{ bottom: 60 }}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="stroke-border"
                        />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          tick={{ fontSize: 11 }}
                          className="fill-foreground-secondary"
                        />
                        <YAxis
                          tick={{ fontSize: 11 }}
                          className="fill-foreground-secondary"
                        />
                        <Tooltip
                          formatter={(value) => formatCurrency(value as number)}
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar
                          dataKey="revenue"
                          fill="var(--primary)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Expense Breakdown */}
            {expenseChartData.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {t("expenseBreakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {expenseChartData.map((_entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => formatCurrency(value as number)}
                          contentStyle={{
                            backgroundColor: "var(--card)",
                            border: "1px solid var(--border)",
                            borderRadius: "8px",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Monthly Trend */}
          {monthlyChartData.length > 1 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{t("monthlyTrend")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 md:h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11 }}
                        className="fill-foreground-secondary"
                      />
                      <YAxis
                        tick={{ fontSize: 11 }}
                        className="fill-foreground-secondary"
                      />
                      <Tooltip
                        formatter={(value) => formatCurrency(value as number)}
                        contentStyle={{
                          backgroundColor: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={t("revenue")}
                        stroke="var(--success)"
                        strokeWidth={2}
                        dot={{ fill: "var(--success)" }}
                      />
                      <Line
                        type="monotone"
                        dataKey={t("expenses")}
                        stroke="var(--destructive)"
                        strokeWidth={2}
                        dot={{ fill: "var(--destructive)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Recent Expenses */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("recentExpenses")}</CardTitle>
        </CardHeader>
        <CardContent>
          {report.recentExpenses.length === 0 ? (
            <p className="text-foreground-secondary text-center py-8">
              {t("noExpenses")}
            </p>
          ) : (
            <div className="space-y-3">
              {report.recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-background-secondary border border-border"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">
                      {expense.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge size="sm" variant="default" className="capitalize">
                        {expense.category}
                      </Badge>
                      <p className="text-sm text-foreground-tertiary">
                        {expense.date}
                      </p>
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
