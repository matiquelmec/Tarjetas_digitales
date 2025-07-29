'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function usePostLoginRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && session) {
      // Check if there's a redirect intention stored
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      
      if (redirectPath) {
        // Clear the stored intention
        sessionStorage.removeItem('redirectAfterLogin');
        
        // Redirect to the intended destination
        console.log('Redirecting after login to:', redirectPath);
        router.push(redirectPath);
      }
    }
  }, [session, status, router]);
}