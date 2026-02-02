'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  useEffect(() => {
    const handleCallback = async () => {
      const params = {
        code: searchParams.get('code'),
        token_hash: searchParams.get('token_hash'),
        type: searchParams.get('type'),
        error: searchParams.get('error'),
        error_code: searchParams.get('error_code'),
        error_description: searchParams.get('error_description'),
      };

      // Check for errors first
      if (params.error) {
        router.push(`/auth?error=confirm_failed`);
        return;
      }

      // If code exists, exchange it for a session
      if (params.code) {
        const { error } = await supabase.auth.exchangeCodeForSession(params.code);
        
        if (error) {
          // If exchange fails, redirect to auth with error
          router.push(`/auth?error=confirm_failed`);
          return;
        }
        
        // Get user after session exchange
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          // Ensure profile exists for new users via API
          try {
            const response = await fetch('/api/practice/check-access');
            if (!response.ok) {
              // Profile will be created by the API if missing
              console.log('[Callback] Profile check completed');
            }
          } catch (err) {
            console.error('[Callback] Error checking profile:', err);
          }
        }
        
        // Successfully exchanged code for session, redirect to dashboard
        router.push('/dashboard');
        return;
      }

      // No code, but check if user session exists
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User has a session, ensure profile exists via API
        try {
          await fetch('/api/practice/check-access');
        } catch (err) {
          console.error('[Callback] Error checking profile:', err);
        }
        
        // User has a session, redirect to dashboard
        router.push('/dashboard');
        return;
      }

      // No code and no session, redirect to auth with confirmed flag
      router.push('/auth?confirmed=1');
    };

    handleCallback();
  }, [searchParams, router, supabase]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Processing authentication...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}

