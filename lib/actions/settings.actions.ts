'use server';

import dbConnect from '@/lib/mongodb';
import Settings from '@/lib/models/settings.model';
import Staff from '@/lib/models/staff.model';
import { DEFAULT_WORKING_HOURS, STAFF_COLORS } from '@/lib/constants';
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
      salonMode: 'solo',
      numberOfChairs: 1,
      isOnboarded: false,
    });
  }

  return JSON.parse(JSON.stringify(settings.toJSON()));
}

export async function updateSettings(data: {
  businessName?: string;
  businessPhone?: string;
  workingHours?: { day: string; open: string; close: string; isClosed: boolean }[];
  salonMode?: 'solo' | 'multi';
  numberOfChairs?: number;
  isOnboarded?: boolean;
}): Promise<BusinessSettings> {
  await dbConnect();
  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: data },
    { new: true, upsert: true }
  );
  return JSON.parse(JSON.stringify(settings.toJSON()));
}

export async function completeOnboarding(data: {
  ownerId: string;
  businessName: string;
  salonMode: 'solo' | 'multi';
  numberOfChairs: number;
  barberNames: string[];
  workingHours: { day: string; open: string; close: string; isClosed: boolean }[];
}): Promise<BusinessSettings> {
  await dbConnect();

  // Create or update settings
  const settings = await Settings.findOneAndUpdate(
    { ownerId: data.ownerId },
    {
      $set: {
        businessName: data.businessName,
        salonMode: data.salonMode,
        numberOfChairs: data.numberOfChairs,
        workingHours: data.workingHours,
        ownerId: data.ownerId,
        isOnboarded: true,
        currency: 'EUR',
        timezone: 'Europe/Paris',
        taxRate: 0,
      },
    },
    { new: true, upsert: true }
  );

  // Create staff members
  for (let i = 0; i < data.barberNames.length; i++) {
    const name = data.barberNames[i].trim();
    if (name) {
      await Staff.create({
        name,
        color: STAFF_COLORS[i % STAFF_COLORS.length],
        isActive: true,
        ownerId: data.ownerId,
      });
    }
  }

  return JSON.parse(JSON.stringify(settings.toJSON()));
}
