'use server';

import crypto from 'crypto';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Shop from '@/lib/models/shop.model';
import ShopMember from '@/lib/models/shop-member.model';
import { getSessionContext } from '@/lib/session';

async function requireSuperAdmin() {
  const ctx = await getSessionContext();
  if (ctx.globalRole !== 'super_admin') {
    throw new Error('Unauthorized: super admin only');
  }
  return ctx;
}

export async function createShopWithOwner(data: {
  shopName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPassword: string;
}) {
  const ctx = await requireSuperAdmin();
  await dbConnect();

  // Create the owner user via Better Auth
  const result = await auth.api.signUpEmail({
    headers: await headers(),
    body: {
      name: data.ownerName,
      email: data.ownerEmail,
      password: data.ownerPassword,
    },
  });

  if (!result?.user) {
    throw new Error('Failed to create owner account');
  }

  const ownerId = result.user.id;

  // Generate invite code
  const inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();

  // Create shop
  const shop = await Shop.create({
    name: data.shopName,
    inviteCode,
    status: 'active',
    ownerId,
    createdBy: ctx.userId,
  });

  // Create ShopMember for owner
  await ShopMember.create({
    userId: ownerId,
    shopId: shop._id.toString(),
    role: 'owner',
    isActive: true,
  });

  return JSON.parse(JSON.stringify(shop.toJSON()));
}

export async function getAllShops() {
  await requireSuperAdmin();
  await dbConnect();

  const shops = await Shop.find().sort({ createdAt: -1 });

  // Get owner info for each shop
  const shopsWithOwners = await Promise.all(
    shops.map(async (shop) => {
      const shopJson = JSON.parse(JSON.stringify(shop.toJSON()));
      // Get owner info from Better Auth user collection
      const member = await ShopMember.findOne({
        shopId: shop._id.toString(),
        role: 'owner',
      });
      const staffCount = await ShopMember.countDocuments({
        shopId: shop._id.toString(),
        role: 'staff',
        isActive: true,
      });
      return {
        ...shopJson,
        ownerUserId: member?.userId || '',
        staffCount,
      };
    })
  );

  return shopsWithOwners;
}

export async function getShopDetails(shopId: string) {
  await requireSuperAdmin();
  await dbConnect();

  const shop = await Shop.findById(shopId);
  if (!shop) throw new Error('Shop not found');

  const members = await ShopMember.find({ shopId: shop._id.toString() });

  return {
    shop: JSON.parse(JSON.stringify(shop.toJSON())),
    members: JSON.parse(JSON.stringify(members.map((m: { toJSON: () => unknown }) => m.toJSON()))),
  };
}

export async function updateShopStatus(shopId: string, status: 'active' | 'suspended') {
  await requireSuperAdmin();
  await dbConnect();

  const shop = await Shop.findByIdAndUpdate(
    shopId,
    { status },
    { new: true }
  );
  if (!shop) throw new Error('Shop not found');

  return JSON.parse(JSON.stringify(shop.toJSON()));
}

export async function getAdminStats() {
  await requireSuperAdmin();
  await dbConnect();

  const totalShops = await Shop.countDocuments();
  const activeShops = await Shop.countDocuments({ status: 'active' });
  const totalMembers = await ShopMember.countDocuments({ isActive: true });
  const recentShops = await Shop.find().sort({ createdAt: -1 }).limit(5);

  return {
    totalShops,
    activeShops,
    totalMembers,
    recentShops: JSON.parse(JSON.stringify(recentShops.map((s: { toJSON: () => unknown }) => s.toJSON()))),
  };
}
