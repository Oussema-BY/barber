'use server';

import dbConnect from '@/lib/mongodb';
import Appointment from '@/lib/models/appointment.model';
import Product from '@/lib/models/product.model';
import Transaction from '@/lib/models/transaction.model';
import Expense from '@/lib/models/expense.model';
import { getSessionContext } from '@/lib/session';

export async function getDashboardStats() {
  const { shopId } = await getSessionContext();
  if (!shopId) {
    return {
      todayAppointments: 0,
      dailyRevenue: 0,
      lowStockProducts: 0,
      monthRevenue: 0,
      monthExpenses: 0,
      inventoryValue: 0,
    };
  }

  await dbConnect();

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const startOfMonth = today.slice(0, 7) + '-01';
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split('T')[0];

  const [
    todayAppointments,
    lowStockProducts,
    todayTransactions,
    monthTransactions,
    monthExpenses,
    totalProducts,
  ] = await Promise.all([
    Appointment.find({ date: today, shopId }),
    Product.countDocuments({ shopId, $expr: { $lte: ['$quantity', '$minQuantity'] } }),
    Transaction.find({ date: today, shopId }),
    Transaction.find({ date: { $gte: startOfMonth, $lte: endOfMonth }, shopId }),
    Expense.find({ date: { $gte: startOfMonth, $lte: endOfMonth }, shopId }),
    Product.find({ shopId }),
  ]);

  const dailyRevenue = todayTransactions.reduce(
    (sum: number, t: { total: number }) => sum + t.total,
    0
  );
  const monthRevenue = monthTransactions.reduce(
    (sum: number, t: { total: number }) => sum + t.total,
    0
  );
  const monthExpenseTotal = monthExpenses.reduce(
    (sum: number, e: { amount: number }) => sum + e.amount,
    0
  );
  const inventoryValue = totalProducts.reduce(
    (sum: number, p: { salePrice: number; quantity: number }) => sum + p.salePrice * p.quantity,
    0
  );

  return {
    todayAppointments: todayAppointments.length,
    dailyRevenue,
    lowStockProducts,
    monthRevenue,
    monthExpenses: monthExpenseTotal,
    inventoryValue,
  };
}
