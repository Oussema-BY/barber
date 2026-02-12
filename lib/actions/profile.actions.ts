'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Staff from '@/lib/models/staff.model';

export async function updateProfile(data: {
  name: string;
  phone: string;
}): Promise<{ success: boolean; error?: string }> {
  const reqHeaders = await headers();
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session) {
    return { success: false, error: 'Not authenticated' };
  }

  try {
    // Update name via better-auth API
    if (data.name && data.name !== session.user.name) {
      await auth.api.updateUser({
        headers: reqHeaders,
        body: { name: data.name },
      });
    }

    // Update phone on Staff record if it exists
    await dbConnect();
    const staff = await Staff.findOne({ userId: session.user.id });
    if (staff) {
      staff.phone = data.phone || '';
      if (data.name) staff.name = data.name;
      await staff.save();
    }

    return { success: true };
  } catch (err) {
    console.error('Failed to update profile:', err);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function getProfile(): Promise<{
  name: string;
  email: string;
  phone: string;
}> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Not authenticated');
  }

  await dbConnect();
  const staff = await Staff.findOne({ userId: session.user.id });

  return {
    name: session.user.name,
    email: session.user.email,
    phone: staff?.phone || '',
  };
}
