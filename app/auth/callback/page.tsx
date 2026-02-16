'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Capacitor } from '@capacitor/core';
import { cn } from '@/lib/utils';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [showFallback, setShowFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let mounted = true;

    const handleCallback = async () => {
      const params = {
        code: searchParams.get('code'),
        token_hash: searchParams.get('token_hash'),
        type: searchParams.get('type'),
        error: searchParams.get('error'),
        error_code: searchParams.get('error_code'),
        error_description: searchParams.get('error_description'),
      };

      // Log for debugging
      console.log('[Auth Callback] Params:', params);

      // Check for errors first
      if (params.error) {
        console.error('[Auth Callback] Error from URL:', params.error, params.error_description);
        setError(params.error_description || params.error || 'Authentication failed');
        setShowFallback(true);
        return;
      }

      // If code exists, exchange it for a session
      if (params.code) {
        try {
          console.log('[Auth Callback] Exchanging code for session...');
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(params.code);
          
          if (exchangeError) {
            console.error('[Auth Callback] Exchange error:', exchangeError);
            setError(exchangeError.message || 'Failed to exchange code for session');
            setShowFallback(true);
            return;
          }

          if (!mounted) return;

          console.log('[Auth Callback] Session exchange successful');
          
          // Get user after session exchange
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError) {
            console.error('[Auth Callback] Get user error:', userError);
          }

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
          
          if (!mounted) return;
          
          // Successfully exchanged code for session, redirect to dashboard
          console.log('[Auth Callback] Redirecting to dashboard...');
          router.push('/dashboard');
          return;
        } catch (err) {
          console.error('[Auth Callback] Unexpected error:', err);
          setError(err instanceof Error ? err.message : 'Unexpected error occurred');
          setShowFallback(true);
          return;
        }
      }

      // No code, but check if user session exists
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('[Auth Callback] Session check error:', sessionError);
        }
        
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
          
          if (!mounted) return;
          
          // User has a session, redirect to dashboard
          console.log('[Auth Callback] Session exists, redirecting to dashboard...');
          router.push('/dashboard');
          return;
        }
      } catch (err) {
        console.error('[Auth Callback] Error checking session:', err);
      }

      // No code and no session - set timeout to show fallback
      if (!mounted) return;
      
      console.warn('[Auth Callback] No code and no session, setting timeout...');
      timeoutId = setTimeout(() => {
        if (mounted) {
          console.warn('[Auth Callback] Timeout reached, showing fallback UI');
          setShowFallback(true);
        }
      }, 10000); // 10 second timeout
    };

    handleCallback();

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [searchParams, router, supabase]);

  const handleOpenInBrowser = () => {
    const code = searchParams.get('code');
    if (code) {
      const url = `https://www.lingotheory.org/auth/callback?code=${code}`;
      // Open in system browser (works in both web and native)
      window.open(url, '_blank');
    }
  };

  const handleBackToLogin = () => {
    router.push('/auth');
  };

  if (showFallback) {
    const code = searchParams.get('code');
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-[var(--navy)] mb-2">
              Authentication Issue
            </h2>
            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}
            <p className="text-base text-[var(--muted-text)] mb-6">
              {code 
                ? 'Unable to complete authentication. Try opening the link in your browser.'
                : 'No authentication code found. Please try again.'}
            </p>
          </div>

          <div className="space-y-3">
            {code && (
              <button
                onClick={handleOpenInBrowser}
                className={cn(
                  'w-full py-3 rounded-xl',
                  'bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]',
                  'text-white font-semibold text-base',
                  'hover:from-red-700 hover:to-red-800',
                  'transition-all duration-200 shadow-lg hover:shadow-xl',
                  'active:scale-[0.98]'
                )}
              >
                Open in Browser
              </button>
            )}
            <button
              onClick={handleBackToLogin}
              className={cn(
                'w-full py-2.5 rounded-xl',
                'border-2 border-[var(--primary-red)]',
                'bg-white text-[var(--primary-red)]',
                'font-medium text-sm',
                'hover:bg-red-50',
                'transition-all duration-200',
                'active:scale-[0.98]'
              )}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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

