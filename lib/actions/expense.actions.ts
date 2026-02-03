'use server';

import dbConnect from '@/lib/mongodb';
import Expense from '@/lib/models/expense.model';
import type { Expense as ExpenseType } from '@/lib/types';

export async function getExpenses(): Promise<ExpenseType[]> {
  await dbConnect();
  const expenses = await Expense.find().sort({ date: -1 });
  return JSON.parse(JSON.stringify(expenses.map((e: { toJSON: () => unknown }) => e.toJSON())));
}

export async function createExpense(data: {
  title: string;
  category: string;
  amount: number;
  date: string;
  description?: string;
}): Promise<ExpenseType> {
  await dbConnect();
  const expense = await Expense.create(data);
  return JSON.parse(JSON.stringify(expense.toJSON()));
}

export async function deleteExpense(id: string) {
  await dbConnect();
  await Expense.findByIdAndDelete(id);
}
