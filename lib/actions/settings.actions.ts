'use server';

import dbConnect from '@/lib/mongodb';
import Settings from '@/lib/models/settings.model';
import { DEFAULT_WORKING_HOURS } from '@/lib/constants';
import type { BusinessSettings } from '@/lib/types';

export async function getSettings(): Promise<BusinessSettings> {
  await dbConnect();
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      businessName: 'BarberPro Shop',
      businessPhone: '',
      workingHours: DEFAULT_WORKING_HOURS,
      currency: 'EUR',
      timezone: 'Europe/Paris',
      taxRate: 0,
    });
  }

  return JSON.parse(JSON.stringify(settings.toJSON()));
}

export async function updateSettings(data: {
  businessName?: string;
  businessPhone?: string;
  workingHours?: { day: string; open: string; close: string; isClosed: boolean }[];
}): Promise<BusinessSettings> {
  await dbConnect();
  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: data },
    { new: true, upsert: true }
  );
  return JSON.parse(JSON.stringify(settings.toJSON()));
}
