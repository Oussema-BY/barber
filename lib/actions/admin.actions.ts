'use server';

import crypto from 'crypto';
import { headers } from 'next/headers';
import { ObjectId } from 'mongodb';
import { auth, authDb } from '@/lib/auth';
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

  // Get all owner user IDs in one pass
  const shopIds = shops.map((s) => s._id.toString());
  const ownerMembers = await ShopMember.find({
    shopId: { $in: shopIds },
    role: 'owner',
  });
  const ownerUserIds = ownerMembers
    .map((m) => m.userId as string)
    .filter(Boolean);

  // Batch lookup owner emails from better-auth user collection
  // better-auth stores user ID as _id (ObjectId) in MongoDB
  const usersCol = authDb.collection('user');
  const objectIds = ownerUserIds.map((id) => new ObjectId(id));
  const users = await usersCol
    .find({ _id: { $in: objectIds } })
    .project({ _id: 1, email: 1 })
    .toArray();
  const ownerEmailMap: Record<string, string> = Object.fromEntries(
    users.map((u) => [u._id.toString(), u.email as string])
  );

  // Build owner map by shopId
  const ownerByShop: Record<string, string> = {};
  for (const m of ownerMembers) {
    ownerByShop[m.shopId as string] = m.userId as string;
  }

  // Get staff counts
  const shopsWithOwners = await Promise.all(
    shops.map(async (shop) => {
      const shopJson = JSON.parse(JSON.stringify(shop.toJSON()));
      const staffCount = await ShopMember.countDocuments({
        shopId: shop._id.toString(),
        role: 'staff',
        isActive: true,
      });
      const ownerUserId = ownerByShop[shop._id.toString()] || '';
      return {
        ...shopJson,
        ownerUserId,
        ownerEmail: ownerEmailMap[ownerUserId] || '',
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

export async function getAllOwners() {
  await requireSuperAdmin();
  await dbConnect();

  // Get all owner memberships
  const ownerMembers = await ShopMember.find({ role: 'owner' });
  const ownerUserIds = ownerMembers
    .map((m) => m.userId as string)
    .filter(Boolean);

  // Batch lookup owner details from better-auth user collection
  // better-auth stores user ID as _id (ObjectId) in MongoDB
  const usersCol = authDb.collection('user');
  const objectIds = ownerUserIds.map((id) => new ObjectId(id));
  const users = await usersCol
    .find({ _id: { $in: objectIds } })
    .project({ _id: 1, name: 1, email: 1, createdAt: 1 })
    .toArray();
  const userMap: Record<string, { name: string; email: string; createdAt: string }> =
    Object.fromEntries(
      users.map((u) => [
        u._id.toString(),
        {
          name: (u.name as string) || '',
          email: (u.email as string) || '',
          createdAt: u.createdAt ? new Date(u.createdAt as string).toISOString() : '',
        },
      ])
    );

  // Get shop info for each owner
  const shopIds = ownerMembers.map((m) => m.shopId as string).filter(Boolean);
  const shops = await Shop.find({ _id: { $in: shopIds } });
  const shopMap: Record<string, { name: string; status: string }> = Object.fromEntries(
    shops.map((s) => [
      s._id.toString(),
      { name: s.name as string, status: s.status as string },
    ])
  );

  return ownerMembers.map((m) => {
    const userId = m.userId as string;
    const shopId = m.shopId as string;
    const user = userMap[userId] || { name: '', email: '', createdAt: '' };
    const shop = shopMap[shopId] || { name: '', status: '' };
    return {
      id: userId,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      shopId,
      shopName: shop.name,
      shopStatus: shop.status,
      isActive: m.isActive as boolean,
    };
  });
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
