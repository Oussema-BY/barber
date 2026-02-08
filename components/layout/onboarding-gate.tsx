'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export function OnboardingGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (pathname !== '/onboarding') {
      router.replace('/onboarding');
    }
  }, [pathname, router]);

  if (pathname !== '/onboarding') {
    return null;
  }

  return <>{children}</>;
}
