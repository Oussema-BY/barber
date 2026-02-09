import React from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { UserProvider } from '@/lib/user-context';
import { OnboardingProvider } from '@/lib/onboarding-context';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav } from '@/components/layout/mobile-nav';
import dbConnect from '@/lib/mongodb';
import Settings from '@/lib/models/settings.model';
import ShopMember from '@/lib/models/shop-member.model';
import Shop from '@/lib/models/shop.model';
import type { GlobalRole, UserRole } from '@/lib/types';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const globalRole = ((session.user as Record<string, unknown>).role as string) === 'super_admin'
    ? 'super_admin'
    : 'user';

  // Super admin goes to admin dashboard
  if (globalRole === 'super_admin') {
    redirect('/admin');
  }

  await dbConnect();

  // Find user's shop membership
  const membership = await ShopMember.findOne({
    userId: session.user.id,
    isActive: true,
  });

  const shopId = membership ? (membership.shopId as string) : null;
  const shopRole = membership ? (membership.role as UserRole) : null;

  // Get shop name
  let shopName: string | null = null;
  if (shopId) {
    const shop = await Shop.findById(shopId);
    shopName = shop ? (shop.name as string) : null;
  }

  // Check if shop is onboarded
  let isOnboarded = false;
  if (shopId) {
    const settings = await Settings.findOne({ shopId });
    isOnboarded = settings?.isOnboarded === true;
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    globalRole: globalRole as GlobalRole,
    shopId,
    shopRole,
    shopName,
  };

  // No shop membership → onboarding (staff join via invite code)
  // Owner with un-onboarded shop → onboarding (configure shop)
  const needsOnboarding = !shopId || (shopRole === 'owner' && !isOnboarded);

  if (needsOnboarding) {
    return (
      <UserProvider user={user}>
        <OnboardingProvider isOnboarded={false} hasShop={!!shopId}>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </OnboardingProvider>
      </UserProvider>
    );
  }

  return (
    <UserProvider user={user}>
      <OnboardingProvider isOnboarded={true} hasShop={true}>
        <div className="flex min-h-screen bg-background">
          <Sidebar />
          <div className="flex-1 flex flex-col md:ltr:ml-64 md:rtl:mr-64">
            <Topbar />
            <main className="flex-1 overflow-auto pb-24 md:pb-0 bg-background-secondary">
              {children}
            </main>
            <MobileNav />
          </div>
        </div>
      </OnboardingProvider>
    </UserProvider>
  );
}
