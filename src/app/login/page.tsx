
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This component is now a redirector.
export default function LoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/login');
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
