'use server';

import dbConnect from '@/lib/mongodb';
import Transaction from '@/lib/models/transaction.model';
import { getSessionContext } from '@/lib/session';
import { getTodayDate } from '@/lib/utils';
import type { POSTransaction } from '@/lib/types';

export async function createTransaction(data: {
  items: { name: string; price: number; quantity: number; type: string; serviceId?: string; packageId?: string }[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: string;
  date: string;
  time: string;
  completedBy?: string;
}): Promise<POSTransaction> {
  const { shopId } = await getSessionContext();
  if (!shopId) throw new Error('No shop');

  await dbConnect();
  const transaction = await Transaction.create({ ...data, shopId });
  return JSON.parse(JSON.stringify(transaction.toJSON()));
}

export async function getTransactions(): Promise<POSTransaction[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();
  const transactions = await Transaction.find({ shopId }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(transactions.map((t: { toJSON: () => unknown }) => t.toJSON())));
}

export async function getTodayTransactions(): Promise<POSTransaction[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();
  const today = getTodayDate();
  const transactions = await Transaction.find({ shopId, date: today }).sort({ time: -1 });
  return JSON.parse(JSON.stringify(transactions.map((t: { toJSON: () => unknown }) => t.toJSON())));
}
