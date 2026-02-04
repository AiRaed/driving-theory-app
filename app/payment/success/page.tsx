'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAccess } from '@/lib/providers/AccessProvider';

export const dynamic = 'force-dynamic';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { refresh } = useAccess();

  useEffect(() => {
    const sync = async () => {
      try {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
          router.replace('/dashboard');
          return;
        }

        // Verify payment
        const verifyResponse = await fetch('/api/stripe/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        });

        if (!verifyResponse.ok) {
          console.error('Payment verification failed');
          router.replace('/dashboard');
          return;
        }

        // Refresh session (fixes Capacitor stale session on Android)
        await supabase.auth.refreshSession();

        // Small delay to ensure database update completes
        await new Promise(resolve => setTimeout(resolve, 500));

        // Refresh access state from Supabase using access provider
        // This ensures paywall disappears immediately without reload
        // Works for both Web and Android
        await refresh();

        // Redirect to dashboard
        router.replace('/dashboard');
      } catch (err) {
        console.error('Payment sync error:', err);
        router.replace('/dashboard');
      }
    };

    sync();
  }, [searchParams, router, supabase, refresh]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Finalizing payment…</p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}

