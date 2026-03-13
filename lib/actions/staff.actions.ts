'use server';

import { randomUUID } from 'crypto';
import dbConnect from '@/lib/mongodb';
import Staff from '@/lib/models/staff.model';
import ShopMember from '@/lib/models/shop-member.model';
import { getSessionContext } from '@/lib/session';
import { STAFF_COLORS } from '@/lib/constants';
import { authDb } from '@/lib/auth';
import { hashPassword } from 'better-auth/crypto';
import type { StaffMember } from '@/lib/types';

export async function getStaffMembers(): Promise<StaffMember[]> {
  const { shopId } = await getSessionContext();
  if (!shopId) return [];

  await dbConnect();
  const staff = await Staff.find({ shopId }).sort({ createdAt: 1 });
  return JSON.parse(JSON.stringify(staff.map((s: { toJSON: () => unknown }) => s.toJSON())));
}

export async function createStaffUser(data: {
  name: string;
  email: string;
  password: string;
  phone?: string;
}): Promise<StaffMember> {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();

  // Check if user already exists in auth DB
  const existingAuthUser = await authDb.collection('user').findOne({
    email: data.email.toLowerCase(),
  });

  let userId: string;

  if (existingAuthUser) {
    userId = existingAuthUser._id.toString();

    // Check if already member of this shop
    const existingMembership = await ShopMember.findOne({ userId, shopId });
    if (existingMembership) {
      if (existingMembership.isActive) {
        throw new Error('This user is already an active staff member of your shop');
      }
      // Reactivate existing member
      await ShopMember.findByIdAndUpdate(existingMembership._id, { isActive: true });
      const staffRecord = await Staff.findOneAndUpdate(
        { userId, shopId },
        { isActive: true },
        { new: true }
      );
      if (staffRecord) return JSON.parse(JSON.stringify(staffRecord.toJSON()));
    }
  } else {
    // Create new auth user directly in the DB (server-side, no session side-effects)
    const hashedPassword = await hashPassword(data.password);
    const now = new Date();
    userId = randomUUID();

    await authDb.collection('user').insertOne({
      _id: userId as unknown as import('mongodb').ObjectId,
      id: userId,
      name: data.name,
      email: data.email.toLowerCase(),
      emailVerified: false,
      role: 'user',
      createdAt: now,
      updatedAt: now,
    });

    await authDb.collection('account').insertOne({
      userId,
      accountId: userId,
      providerId: 'credential',
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });
  }

  // Create shop membership
  await ShopMember.create({
    userId,
    shopId,
    role: 'staff',
    isActive: true,
  });

  // Create staff record
  const staffCount = await Staff.countDocuments({ shopId });
  const colorIndex = staffCount % STAFF_COLORS.length;
  const member = await Staff.create({
    name: data.name,
    phone: data.phone || '',
    color: STAFF_COLORS[colorIndex],
    isActive: true,
    shopId,
    userId,
  });

  return JSON.parse(JSON.stringify(member.toJSON()));
}

export async function toggleStaffActive(id: string): Promise<StaffMember> {
  const { shopId, shopRole, userId: callerId } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  const member = await Staff.findOne({ _id: id, shopId });
  if (!member) throw new Error('Staff member not found');

  // Prevent the owner from deactivating their own account
  if (member.userId && member.userId === callerId) {
    throw new Error('You cannot deactivate your own account');
  }

  const newActive = !member.isActive;
  const updated = await Staff.findByIdAndUpdate(id, { isActive: newActive }, { new: true });

  // Also update the ShopMember record if userId exists
  if (member.userId) {
    await ShopMember.findOneAndUpdate(
      { userId: member.userId, shopId },
      { isActive: newActive }
    );
  }

  return JSON.parse(JSON.stringify(updated.toJSON()));
}

export async function deleteStaffMember(id: string) {
  const { shopId, shopRole } = await getSessionContext();
  if (!shopId) throw new Error('No shop');
  if (shopRole !== 'owner') throw new Error('Owner only');

  await dbConnect();
  const member = await Staff.findOne({ _id: id, shopId });
  if (!member) throw new Error('Staff member not found');

  await Staff.findByIdAndDelete(id);

  // Deactivate shop membership if linked to a user
  if (member.userId) {
    await ShopMember.findOneAndUpdate(
      { userId: member.userId, shopId },
      { isActive: false }
    );
  }
}
