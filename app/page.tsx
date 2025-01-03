'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/') {
      router.push('/dashboard');
    }
  }, [pathname, router]);

  return null;
}
