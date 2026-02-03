'use server';

import dbConnect from '@/lib/mongodb';
import Service from '@/lib/models/service.model';
import type { Service as ServiceType } from '@/lib/types';

export async function getServices(): Promise<ServiceType[]> {
  await dbConnect();
  const services = await Service.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(services.map((s: { toJSON: () => unknown }) => s.toJSON())));
}

export async function createService(data: {
  name: string;
  category: string;
  price: number;
  duration: number;
  description?: string;
}): Promise<ServiceType> {
  await dbConnect();
  const service = await Service.create(data);
  return JSON.parse(JSON.stringify(service.toJSON()));
}

export async function deleteService(id: string) {
  await dbConnect();
  await Service.findByIdAndDelete(id);
}
