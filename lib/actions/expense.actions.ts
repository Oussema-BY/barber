'use server';

import dbConnect from '@/lib/mongodb';
import Expense from '@/lib/models/expense.model';
import { getSessionContext } from '@/lib/session';
import type { Expense as ExpenseType } from '@/lib/types';

export async function getExpenses(): Promise<ExpenseType[]> {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId || shopRole !== 'owner') return [];

  await dbConnect();
  const expenses = await Expense.find({ shopId }).sort({ date: -1 });
  return JSON.parse(JSON.stringify(expenses.map((e: { toJSON: () => unknown }) => e.toJSON())));
}

export async function createExpense(data: {
  title: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
}): Promise<ExpenseType> {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  const expense = await Expense.create({ ...data, shopId });
  return JSON.parse(JSON.stringify(expense.toJSON()));
}

export async function deleteExpense(id: string) {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  await Expense.findOneAndDelete({ _id: id, shopId });
}
