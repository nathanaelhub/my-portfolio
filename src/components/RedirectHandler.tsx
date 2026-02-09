"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { basePath } from '@/utils/navigation';

export default function RedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    // Check if we have a redirect URL stored by 404.html
    const redirect = sessionStorage.getItem('redirect');
    if (redirect) {
      sessionStorage.removeItem('redirect');

      // Extract the path without the basePath
      if (redirect.startsWith(basePath)) {
        const targetPath = redirect.slice(basePath.length) || '/';
        router.replace(targetPath);
      }
    }
  }, [router]);

  return null;
}