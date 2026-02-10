'use server';

import dbConnect from '@/lib/mongodb';
import Appointment from '@/lib/models/appointment.model';
import Service from '@/lib/models/service.model';
import Product from '@/lib/models/product.model';
import { getSessionContext } from '@/lib/session';

export interface SearchResult {
  id: string;
  type: 'appointment' | 'service' | 'product';
  title: string;
  subtitle: string;
  href: string;
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();

  const regex = new RegExp(query.trim(), 'i');

  const [appointments, services, products] = await Promise.all([
    Appointment.find({
      shopId,
      $or: [
        { clientName: regex },
        { clientPhone: regex },
        { serviceName: regex },
      ],
    })
      .sort({ date: -1 })
      .limit(5),
    Service.find({
      shopId,
      name: regex,
    }).limit(5),
    Product.find({
      shopId,
      $or: [{ name: regex }, { category: regex }],
    }).limit(5),
  ]);

  const results: SearchResult[] = [];

  for (const a of appointments) {
    results.push({
      id: a._id.toString(),
      type: 'appointment',
      title: a.clientName,
      subtitle: `${a.serviceName} — ${a.date} ${a.time}`,
      href: '/appointments',
    });
  }

  for (const s of services) {
    results.push({
      id: s._id.toString(),
      type: 'service',
      title: s.name,
      subtitle: `€${s.price}`,
      href: '/services',
    });
  }

  for (const p of products) {
    results.push({
      id: p._id.toString(),
      type: 'product',
      title: p.name,
      subtitle: `${p.category} — qty: ${p.quantity}`,
      href: '/inventory',
    });
  }

  return results;
}
