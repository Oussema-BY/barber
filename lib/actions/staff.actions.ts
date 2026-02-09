'use server';

import dbConnect from '@/lib/mongodb';
import Staff from '@/lib/models/staff.model';
import { getSessionContext } from '@/lib/session';
import type { StaffMember } from '@/lib/types';

export async function getStaffMembers(): Promise<StaffMember[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();
  const staff = await Staff.find({ isActive: true, shopId }).sort({ createdAt: 1 });
  return JSON.parse(JSON.stringify(staff.map((s: { toJSON: () => unknown }) => s.toJSON())));
}

export async function createStaffMember(data: {
  name: string;
  phone?: string;
  color: string;
}): Promise<StaffMember> {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  const member = await Staff.create({ ...data, shopId, isActive: true });
  return JSON.parse(JSON.stringify(member.toJSON()));
}

export async function deleteStaffMember(id: string) {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  await Staff.findOneAndDelete({ _id: id, shopId });
}
