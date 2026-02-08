'use server';

import dbConnect from '@/lib/mongodb';
import Staff from '@/lib/models/staff.model';
import type { StaffMember } from '@/lib/types';

export async function getStaffMembers(): Promise<StaffMember[]> {
  await dbConnect();
  const staff = await Staff.find({ isActive: true }).sort({ createdAt: 1 });
  return JSON.parse(JSON.stringify(staff.map((s: { toJSON: () => unknown }) => s.toJSON())));
}

export async function createStaffMember(data: {
  name: string;
  phone?: string;
  color: string;
}): Promise<StaffMember> {
  await dbConnect();
  const member = await Staff.create(data);
  return JSON.parse(JSON.stringify(member.toJSON()));
}

export async function deleteStaffMember(id: string) {
  await dbConnect();
  await Staff.findByIdAndDelete(id);
}
