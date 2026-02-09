'use client';

import { createContext, useContext } from 'react';
import type { GlobalRole, UserRole } from '@/lib/types';

interface UserContextType {
  id: string;
  name: string;
  email: string;
  globalRole: GlobalRole;
  shopId: string | null;
  shopRole: UserRole | null;
  shopName: string | null;
}

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  user,
  children,
}: {
  user: UserContextType;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
