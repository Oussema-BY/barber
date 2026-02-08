'use client';

import { createContext, useContext, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface OnboardingContextType {
  isOnboarded: boolean;
}

const OnboardingContext = createContext<OnboardingContextType>({ isOnboarded: false });

export function OnboardingProvider({
  isOnboarded,
  children,
}: {
  isOnboarded: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isOnboarded && pathname !== '/onboarding') {
      router.replace('/onboarding');
    }
  }, [isOnboarded, pathname, router]);

  return (
    <OnboardingContext.Provider value={{ isOnboarded }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
