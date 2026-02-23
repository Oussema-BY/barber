'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Store,
  Users,
  LogOut,
  Scissors,
  ArrowLeft,
} from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/shops', label: 'Shops', icon: Store, exact: false },
  { href: '/admin/owners', label: 'Owners', icon: Users, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + '/');
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/sign-in');
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-65 bg-slate-900 flex flex-col z-40">
      {/* Branding */}
      <div className="px-6 py-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-md">
            <Scissors className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white block leading-tight">
              BarberPro
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Admin Panel
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                active
                  ? 'bg-indigo-500/20 text-white shadow-sm'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  active ? 'text-indigo-400' : 'text-slate-400'
                }`}
              />
              <span>{item.label}</span>
              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-slate-700/50 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to App</span>
        </Link>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 w-full text-left"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
