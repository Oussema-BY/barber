'use server';

import dbConnect from '@/lib/mongodb';
import Service from '@/lib/models/service.model';
import { getSessionContext } from '@/lib/session';
import type { Service as ServiceType } from '@/lib/types';

export async function getServices(): Promise<ServiceType[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();
  const services = await Service.find({ shopId }).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(services.map((s: { toJSON: () => unknown }) => s.toJSON())));
}

export async function createService(data: {
  name: string;
  category: string;
  price: number;
  duration: number;
  description?: string;
}): Promise<ServiceType> {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  const service = await Service.create({ ...data, shopId });
  return JSON.parse(JSON.stringify(service.toJSON()));
}

export async function deleteService(id: string) {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  await Service.findOneAndDelete({ _id: id, shopId });
}
