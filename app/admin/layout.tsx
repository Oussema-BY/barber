import React from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/admin-sidebar';

export default async function AdminLayout({
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

  const role = (session.user as Record<string, unknown>).role as string;

  if (role !== 'super_admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 ml-[260px]">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
