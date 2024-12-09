// ConditionalLayout.tsx
'use client'

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";

import { useEffect, useState } from 'react';

const ConditionalLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isUnityRoute, setIsUnityRoute] = useState(false);

  useEffect(() => {
    setIsUnityRoute(pathname.startsWith('/unity'));
    console.log('Current pathname:', pathname);
    console.log('Is Unity route:', pathname.startsWith('/unity'));
  }, [pathname]);

  if (typeof window !== 'undefined') {
    console.log('Window location:', window.location.pathname);
  }

  return (
    <>

      {children}
      {!isUnityRoute}
     
    </>
  );
};

export default ConditionalLayout;