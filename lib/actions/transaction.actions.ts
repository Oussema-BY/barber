'use server';

import dbConnect from '@/lib/mongodb';
import Transaction from '@/lib/models/transaction.model';
import type { POSTransaction } from '@/lib/types';

export async function createTransaction(data: {
  items: { name: string; price: number; quantity: number; type: string; serviceId?: string }[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
  change: number;
  paymentMethod: string;
  date: string;
  time: string;
}): Promise<POSTransaction> {
  await dbConnect();
  const transaction = await Transaction.create(data);
  return JSON.parse(JSON.stringify(transaction.toJSON()));
}

export async function getTransactions(): Promise<POSTransaction[]> {
  await dbConnect();
  const transactions = await Transaction.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(transactions.map((t: { toJSON: () => unknown }) => t.toJSON())));
}
