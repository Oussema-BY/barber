'use server';

import dbConnect from '@/lib/mongodb';
import Transaction from '@/lib/models/transaction.model';
import Expense from '@/lib/models/expense.model';
import Product from '@/lib/models/product.model';
import { getSessionContext } from '@/lib/session';

export interface MonthlyDataPoint {
  month: string;
  revenue: number;
  expenses: number;
}

export interface RevenueByServiceItem {
  serviceName: string;
  revenue: number;
  count: number;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
}

export interface PaymentMethodItem {
  method: string;
  total: number;
  count: number;
}

export interface RecentExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
}

export interface FinanceReportData {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  transactionCount: number;
  inventoryValue: number;
  productCount: number;
  monthlyTrend: MonthlyDataPoint[];
  revenueByService: RevenueByServiceItem[];
  expenseBreakdown: ExpenseByCategory[];
  recentExpenses: RecentExpenseItem[];
  paymentMethodBreakdown: PaymentMethodItem[];
}

const EMPTY_REPORT: FinanceReportData = {
  totalRevenue: 0,
  totalExpenses: 0,
  netProfit: 0,
  transactionCount: 0,
  inventoryValue: 0,
  productCount: 0,
  monthlyTrend: [],
  revenueByService: [],
  expenseBreakdown: [],
  recentExpenses: [],
  paymentMethodBreakdown: [],
};

export async function getFinanceReport(
  startDate: string,
  endDate: string
): Promise<FinanceReportData> {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId || shopRole !== 'owner') return EMPTY_REPORT;

  await dbConnect();

  const dateFilter = { $gte: startDate, $lte: endDate };

  const [transactions, expenses, products] = await Promise.all([
    Transaction.find({ shopId, date: dateFilter }).sort({ date: -1, time: -1 }),
    Expense.find({ shopId, date: dateFilter }).sort({ date: -1 }),
    Product.find({ shopId }),
  ]);

  // Total revenue from actual transactions
  const totalRevenue = transactions.reduce(
    (sum: number, t: { total: number }) => sum + t.total, 0
  );

  const totalExpenses = expenses.reduce(
    (sum: number, e: { amount: number }) => sum + e.amount, 0
  );

  // Real monthly trend — group by YYYY-MM
  const revenueByMonth: Record<string, number> = {};
  const expensesByMonth: Record<string, number> = {};

  for (const t of transactions) {
    const month = (t as { date: string }).date.slice(0, 7);
    revenueByMonth[month] = (revenueByMonth[month] || 0) + (t as { total: number }).total;
  }

  for (const e of expenses) {
    const month = (e as { date: string }).date.slice(0, 7);
    expensesByMonth[month] = (expensesByMonth[month] || 0) + (e as { amount: number }).amount;
  }

  const allMonths = new Set([
    ...Object.keys(revenueByMonth),
    ...Object.keys(expensesByMonth),
  ]);
  const monthlyTrend: MonthlyDataPoint[] = Array.from(allMonths)
    .sort()
    .map((month) => ({
      month,
      revenue: revenueByMonth[month] || 0,
      expenses: expensesByMonth[month] || 0,
    }));

  // Revenue by service — from transaction items
  const serviceRevMap: Record<string, { revenue: number; count: number }> = {};
  for (const t of transactions) {
    for (const item of (t as { items: Array<{ name: string; price: number; quantity: number }> }).items) {
      if (!serviceRevMap[item.name]) serviceRevMap[item.name] = { revenue: 0, count: 0 };
      serviceRevMap[item.name].revenue += item.price * item.quantity;
      serviceRevMap[item.name].count += item.quantity;
    }
  }
  const revenueByService = Object.entries(serviceRevMap)
    .map(([serviceName, data]) => ({ serviceName, ...data }))
    .sort((a, b) => b.revenue - a.revenue);

  // Expense breakdown by category
  const expCatMap: Record<string, number> = {};
  for (const e of expenses) {
    const cat = (e as { category: string }).category;
    expCatMap[cat] = (expCatMap[cat] || 0) + (e as { amount: number }).amount;
  }
  const expenseBreakdown = Object.entries(expCatMap)
    .map(([category, amount]) => ({ category, amount }));

  // Inventory value (always current, not date-filtered)
  const inventoryValue = products.reduce(
    (sum: number, p: { costPrice: number; quantity: number }) => sum + p.costPrice * p.quantity, 0
  );

  // Payment method breakdown
  const pmMap: Record<string, { total: number; count: number }> = {};
  for (const t of transactions) {
    const pm = (t as { paymentMethod: string }).paymentMethod;
    if (!pmMap[pm]) pmMap[pm] = { total: 0, count: 0 };
    pmMap[pm].total += (t as { total: number }).total;
    pmMap[pm].count += 1;
  }
  const paymentMethodBreakdown = Object.entries(pmMap)
    .map(([method, data]) => ({ method, ...data }));

  // Recent expenses (limit 10)
  const recentExpenses: RecentExpenseItem[] = expenses.slice(0, 10).map(
    (e: { toJSON: () => Record<string, unknown> }) => {
      const exp = e.toJSON();
      return {
        id: String(exp.id),
        title: String(exp.title),
        category: String(exp.category),
        amount: Number(exp.amount),
        date: String(exp.date),
      };
    }
  );

  return {
    totalRevenue,
    totalExpenses,
    netProfit: totalRevenue - totalExpenses,
    transactionCount: transactions.length,
    inventoryValue,
    productCount: products.length,
    monthlyTrend,
    revenueByService,
    expenseBreakdown,
    recentExpenses,
    paymentMethodBreakdown,
  };
}
