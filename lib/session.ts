'use server';

import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import ShopMember from '@/lib/models/shop-member.model';
import type { GlobalRole, UserRole } from '@/lib/types';

export interface SessionContext {
  userId: string;
  userName: string;
  userEmail: string;
  globalRole: GlobalRole;
  shopId: string | null;
  shopRole: UserRole | null;
}

export async function getSessionContext(): Promise<SessionContext> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error('Not authenticated');
  }

  const globalRole = ((session.user as Record<string, unknown>).role as string) === 'super_admin' ? 'super_admin' : 'user';

  if (globalRole === 'super_admin') {
    return {
      userId: session.user.id,
      userName: session.user.name,
      userEmail: session.user.email,
      globalRole: 'super_admin',
      shopId: null,
      shopRole: null,
    };
  }

  await dbConnect();
  const membership = await ShopMember.findOne({
    userId: session.user.id,
    isActive: true,
  });

  return {
    userId: session.user.id,
    userName: session.user.name,
    userEmail: session.user.email,
    globalRole: 'user',
    shopId: membership ? membership.shopId : null,
    shopRole: membership ? (membership.role as UserRole) : null,
  };
}
