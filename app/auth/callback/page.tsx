'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Parse URL hash for tokens (used in some auth flows)
        let hashParams: Record<string, string> = {};
        if (typeof window !== 'undefined' && window.location.hash) {
          const hash = window.location.hash.substring(1);
          hash.split('&').forEach((param) => {
            const [key, value] = param.split('=');
            if (key && value) {
              hashParams[decodeURIComponent(key)] = decodeURIComponent(value);
            }
          });
        }

        // Get query params
        const params = {
          code: searchParams.get('code'),
          token_hash: searchParams.get('token_hash'),
          type: searchParams.get('type'),
          error: searchParams.get('error') || hashParams.error,
          error_code: searchParams.get('error_code') || hashParams.error_code,
          error_description: searchParams.get('error_description') || hashParams.error_description,
          access_token: hashParams.access_token,
          refresh_token: hashParams.refresh_token,
        };

        // Check for errors first
        if (params.error) {
          console.error('[Callback] Auth error:', params.error, params.error_description);
          setError(params.error_description || params.error || 'Authentication failed');
          setLoading(false);
          return;
        }

        // Handle PKCE flow: code in query params
        if (params.code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(params.code);
          
          if (exchangeError) {
            console.error('[Callback] Code exchange error:', exchangeError);
            setError(exchangeError.message || 'Failed to complete authentication');
            setLoading(false);
            return;
          }
          
          // Get user after session exchange
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            // Ensure profile exists for new users via API (SINGLE SOURCE OF TRUTH)
            try {
              const response = await fetch('/api/access/status', {
                cache: 'no-store',
                headers: {
                  'Cache-Control': 'no-cache',
                },
              });
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

        // Handle hash token flow: access_token and refresh_token in hash
        if (params.access_token && params.refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (sessionError) {
            console.error('[Callback] Session set error:', sessionError);
            setError(sessionError.message || 'Failed to set session');
            setLoading(false);
            return;
          }

          // Get user after setting session
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (user) {
            // Ensure profile exists for new users via API (SINGLE SOURCE OF TRUTH)
            try {
              const response = await fetch('/api/access/status', {
                cache: 'no-store',
                headers: {
                  'Cache-Control': 'no-cache',
                },
              });
              if (!response.ok) {
                // Profile will be created by the API if missing
                console.log('[Callback] Profile check completed');
              }
            } catch (err) {
              console.error('[Callback] Error checking profile:', err);
            }
          }

          // Successfully set session, redirect to dashboard
          router.push('/dashboard');
          return;
        }

        // No code or hash tokens, but check if user session exists
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // User has a session, ensure profile exists via API (SINGLE SOURCE OF TRUTH)
          try {
            await fetch('/api/access/status', {
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache',
              },
            });
          } catch (err) {
            console.error('[Callback] Error checking profile:', err);
          }
          
          // User has a session, redirect to dashboard
          router.push('/dashboard');
          return;
        }

        // No code, no hash tokens, and no session - redirect to auth with confirmed flag
        router.push('/auth?confirmed=1');
      } catch (err) {
        console.error('[Callback] Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams, router, supabase]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-md w-full">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--navy)] mb-2">Authentication Failed</h2>
            <p className="text-[var(--muted-text)] mb-6">{error}</p>
          </div>
          <Link
            href="/auth"
            className="inline-block px-6 py-3 rounded-xl bg-[var(--primary-red)] text-white font-medium hover:bg-[#C10500] transition-colors shadow-sm hover:shadow-md"
          >
            Back to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-red)] mx-auto mb-4"></div>
        <p className="text-[var(--muted-text)]">Processing authentication...</p>
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

