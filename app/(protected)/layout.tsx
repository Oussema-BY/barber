import React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { MobileNav } from '@/components/layout/mobile-nav';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}
