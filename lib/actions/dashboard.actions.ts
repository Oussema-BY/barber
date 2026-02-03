'use server';

import dbConnect from '@/lib/mongodb';
import Appointment from '@/lib/models/appointment.model';
import Product from '@/lib/models/product.model';
import Transaction from '@/lib/models/transaction.model';
import Expense from '@/lib/models/expense.model';

export async function getDashboardStats() {
  await dbConnect();

  const today = new Date().toISOString().split('T')[0];
  const startOfMonth = today.slice(0, 7) + '-01'; // YYYY-MM-01

  const [
    todayAppointments,
    lowStockProducts,
    monthTransactions,
    monthExpenses,
    totalProducts,
  ] = await Promise.all([
    Appointment.find({ date: today }),
    Product.countDocuments({ $expr: { $lte: ['$quantity', '$minQuantity'] } }),
    Transaction.find({ date: { $gte: startOfMonth } }),
    Expense.find({ date: { $gte: startOfMonth } }),
    Product.find(),
  ]);

  const dailyRevenue = todayAppointments.reduce(
    (sum: number, a: { price: number }) => sum + a.price,
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
