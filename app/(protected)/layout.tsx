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

  // Check onboarding status
  await dbConnect();
  const settings = await Settings.findOne({ ownerId: session.user.id });
  const isOnboarded = settings?.isOnboarded === true;

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  // Show minimal layout during onboarding
  if (!isOnboarded) {
    return (
      <UserProvider user={user}>
        <OnboardingProvider isOnboarded={false}>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </OnboardingProvider>
      </UserProvider>
    );
  }

  return (
    <UserProvider user={user}>
      <OnboardingProvider isOnboarded={true}>
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
