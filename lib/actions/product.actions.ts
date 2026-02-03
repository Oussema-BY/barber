'use server';

import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/product.model';
import type { Product as ProductType } from '@/lib/types';

export async function getProducts(): Promise<ProductType[]> {
  await dbConnect();
  const products = await Product.find().sort({ createdAt: -1 });
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
  await dbConnect();
  const product = await Product.create(data);
  return JSON.parse(JSON.stringify(product.toJSON()));
}

export async function updateProductQuantity(id: string, quantity: number): Promise<ProductType | null> {
  await dbConnect();
  const product = await Product.findByIdAndUpdate(id, { quantity }, { new: true });
  return product ? JSON.parse(JSON.stringify(product.toJSON())) : null;
}

export async function deleteProduct(id: string) {
  await dbConnect();
  await Product.findByIdAndDelete(id);
}
