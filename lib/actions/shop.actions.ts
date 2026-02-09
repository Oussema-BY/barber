'use server';

import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import Shop from '@/lib/models/shop.model';
import ShopMember from '@/lib/models/shop-member.model';
import Staff from '@/lib/models/staff.model';
import { getSessionContext } from '@/lib/session';
import { STAFF_COLORS } from '@/lib/constants';

export async function getMyShop() {
  const ctx = await getSessionContext();
  if (!ctx.shopId) return null;

  await dbConnect();
  const shop = await Shop.findById(ctx.shopId);
  if (!shop) return null;

  return JSON.parse(JSON.stringify(shop.toJSON()));
}

export async function joinShopByInviteCode(inviteCode: string) {
  const ctx = await getSessionContext();
  if (ctx.shopId) {
    throw new Error('You are already a member of a shop');
  }

  await dbConnect();
  const shop = await Shop.findOne({ inviteCode, status: 'active' });
  if (!shop) {
    throw new Error('Invalid invite code');
  }

  // Check if already a member
  const existing = await ShopMember.findOne({
    userId: ctx.userId,
    shopId: shop._id.toString(),
  });
  if (existing) {
    throw new Error('You are already a member of this shop');
  }

  // Create ShopMember
  await ShopMember.create({
    userId: ctx.userId,
    shopId: shop._id.toString(),
    role: 'staff',
    isActive: true,
  });

  // Create Staff document for the barber
  const staffCount = await Staff.countDocuments({ shopId: shop._id.toString() });
  await Staff.create({
    name: ctx.userName,
    color: STAFF_COLORS[staffCount % STAFF_COLORS.length],
    isActive: true,
    ownerId: shop.ownerId,
    shopId: shop._id.toString(),
    userId: ctx.userId,
  });

  return {
    shopId: shop._id.toString(),
    shopName: shop.name,
  };
}

export async function getShopMembers() {
  const ctx = await getSessionContext();
  if (!ctx.shopId || ctx.shopRole !== 'owner') {
    throw new Error('Unauthorized');
  }

  await dbConnect();
  const members = await ShopMember.find({
    shopId: ctx.shopId,
    isActive: true,
  });

  return JSON.parse(JSON.stringify(members.map((m: { toJSON: () => unknown }) => m.toJSON())));
}

export async function removeMember(memberId: string) {
  const ctx = await getSessionContext();
  if (!ctx.shopId || ctx.shopRole !== 'owner') {
    throw new Error('Unauthorized');
  }

  await dbConnect();
  const member = await ShopMember.findById(memberId);
  if (!member || member.shopId !== ctx.shopId) {
    throw new Error('Member not found');
  }
  if (member.role === 'owner') {
    throw new Error('Cannot remove shop owner');
  }

  await ShopMember.findByIdAndUpdate(memberId, { isActive: false });

  // Deactivate corresponding staff record
  await Staff.findOneAndUpdate(
    { userId: member.userId, shopId: ctx.shopId },
    { isActive: false }
  );
}

export async function regenerateInviteCode() {
  const ctx = await getSessionContext();
  if (!ctx.shopId || ctx.shopRole !== 'owner') {
    throw new Error('Unauthorized');
  }

  await dbConnect();
  const newCode = crypto.randomBytes(4).toString('hex').toUpperCase();
  const shop = await Shop.findByIdAndUpdate(
    ctx.shopId,
    { inviteCode: newCode },
    { new: true }
  );

  if (!shop) throw new Error('Shop not found');
  return newCode;
}
