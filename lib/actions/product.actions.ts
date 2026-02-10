'use server';

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/product.model';
import { getSessionContext } from '@/lib/session';
import type { Product as ProductType } from '@/lib/types';

export async function getProducts(): Promise<ProductType[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();
  const products = await Product.find({ shopId }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(products.map((p: { toJSON: () => unknown }) => p.toJSON())));
}

export async function createProduct(data: {
  name: string;
  category: string;
  supplier: string;
  costPrice: number;
  salePrice: number;
  quantity: number;
  minQuantity: number;
  unit?: string;
}): Promise<ProductType> {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  const product = await Product.create({ ...data, shopId });
  return JSON.parse(JSON.stringify(product.toJSON()));
}

export async function updateProductQuantity(id: string, quantity: number): Promise<ProductType | null> {
  const { shopId } = await getSessionContext();
  if (!shopId) throw new Error('No shop');

  await dbConnect();
  const product = await Product.findOneAndUpdate(
    { _id: id, shopId },
    { quantity },
    { new: true }
  );
  return product ? JSON.parse(JSON.stringify(product.toJSON())) : null;
}

export async function updateProduct(
  id: string,
  data: {
    name?: string;
    category?: string;
    supplier?: string;
    costPrice?: number;
    salePrice?: number;
    quantity?: number;
    minQuantity?: number;
    unit?: string;
  }
): Promise<ProductType | null> {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  const product = await Product.findOneAndUpdate(
    { _id: id, shopId },
    data,
    { new: true }
  );
  return product ? JSON.parse(JSON.stringify(product.toJSON())) : null;
}

export async function deleteProduct(id: string) {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  await Product.findOneAndDelete({ _id: id, shopId });
}
