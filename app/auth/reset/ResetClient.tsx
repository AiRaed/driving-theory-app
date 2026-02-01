"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * NOTE: Make sure to add these redirect URLs in Supabase Dashboard:
 * - http://localhost:3000/auth/reset
 * - https://www.lingotheory.org/auth/reset
 */
export default function ResetClient() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [linkExpired, setLinkExpired] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  
  // Guard to prevent double verification (React strict mode / re-renders)
  const verificationAttempted = useRef(false);

  useEffect(() => {
    // Prevent double verification
    if (verificationAttempted.current) {
      return;
    }

    const handleRecovery = async () => {
      verificationAttempted.current = true;

      // First, check if user already has a valid session (after server-side code exchange)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('✅ Session already exists - user can reset password');
        setVerifying(false);
        return;
      }

      // Read from both searchParams (Next.js) and window.location (fallback)
      // This ensures we get the params even if searchParams isn't ready yet
      let tokenHash: string | null = null;
      let type: string | null = null;

      if (typeof window !== 'undefined') {
        // Log the FULL URL to see what Supabase actually sent
        console.log('🔍 FULL URL:', window.location.href);
        console.log('🔍 Search params:', window.location.search);
        console.log('🔍 Hash fragment:', window.location.hash);

        // Try searchParams first (Next.js way)
        tokenHash = searchParams.get('token_hash');
        type = searchParams.get('type');

        // Fallback 1: read directly from window.location.search
        if (!tokenHash || !type) {
          const urlParams = new URLSearchParams(window.location.search);
          tokenHash = tokenHash || urlParams.get('token_hash');
          type = type || urlParams.get('type');
          
          // Log ALL query parameters to see what Supabase sent
          console.log('🔍 All query params:', Object.fromEntries(urlParams.entries()));
        }

        // Fallback 2: check hash fragment (some Supabase configs use #)
        if (!tokenHash || !type) {
          const hash = window.location.hash.substring(1);
          if (hash) {
            const hashParams = new URLSearchParams(hash);
            tokenHash = tokenHash || hashParams.get('token_hash');
            type = type || hashParams.get('type');
            
            // Log ALL hash parameters
            console.log('🔍 All hash params:', Object.fromEntries(hashParams.entries()));
          }
        }
      }

      // Debug: log what we found (check browser console to see actual values)
      console.log('✅ Final parsed values:', { 
        tokenHash: tokenHash ? `present (${tokenHash.substring(0, 20)}...)` : 'missing', 
        type: type || 'missing',
        fullUrl: typeof window !== 'undefined' ? window.location.href : 'N/A'
      });

      // Check if Supabase sent 'code' instead of 'token_hash' (PKCE flow vs OTP flow)
      const code = typeof window !== 'undefined' 
        ? (searchParams.get('code') || new URLSearchParams(window.location.search).get('code'))
        : null;

      // Handle CODE flow (PKCE) - Supabase sends this when using {{ .ConfirmationURL }}
      // PKCE requires server-side code exchange due to cookie management in Next.js
      if (code) {
        console.log('✅ Found code parameter - redirecting to server-side handler for PKCE flow');
        
        // Redirect to server-side route handler which will exchange code for session
        // The server handler will set cookies and redirect back to /auth/reset
        const serverHandlerUrl = `/api/auth/reset?code=${encodeURIComponent(code)}`;
        window.location.href = serverHandlerUrl;
        return; // Don't continue - wait for redirect
      }

      // Handle TOKEN_HASH flow (OTP) - fallback if Supabase sends token_hash instead
      if (tokenHash && type === 'recovery') {
        console.log('✅ Found token_hash parameter - using OTP flow (verifyOtp)');
        try {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            type: 'recovery',
            token_hash: tokenHash,
          });

          if (verifyError) {
            console.error('❌ verifyOtp error:', verifyError);
            setLinkExpired(true);
            setError(verifyError.message || 'Invalid or expired link. Please request a new reset email.');
            setVerifying(false);
            return;
          }

          // Verification successful, user can now reset password
          console.log('✅ Token hash verification successful - user can reset password');
          setVerifying(false);
          return;
        } catch (err) {
          console.error('❌ Token hash verification exception:', err);
          setLinkExpired(true);
          setError('Invalid or expired link. Please request a new reset email.');
          setVerifying(false);
          return;
        }
      }

      // Neither code nor token_hash found - invalid link
      console.error('❌ Invalid reset link - missing both code and token_hash', { 
        tokenHash: !!tokenHash, 
        type,
        code: !!code,
        suggestion: 'Supabase should send either code (PKCE) or token_hash (OTP) parameter'
      });
      setLinkExpired(true);
      setError('Invalid or expired link. Please request a new reset email.');
      setVerifying(false);
    };

    handleRecovery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only run once on mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[var(--border)]/60 bg-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]"></div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-2 text-[var(--navy)]">Verifying link...</h1>
              <p className="text-[var(--muted-text)]">Please wait</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (linkExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[var(--border)]/60 bg-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]"></div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold mb-2 text-[var(--navy)]">Link expired</h1>
              <p className="text-[var(--muted-text)] mb-6">Invalid or expired link. Please request a new reset email.</p>
              <button
                onClick={() => router.push('/auth')}
                className="w-full px-6 py-3 rounded-xl bg-[var(--primary-red)] text-white font-medium hover:bg-[#C10500] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[var(--border)]/60 bg-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]"></div>
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h1 className="text-2xl font-semibold mb-2 text-[var(--navy)]">Password updated!</h1>
              <p className="text-[var(--muted-text)] mb-6">Your password has been successfully updated.</p>
              <button
                onClick={() => router.push('/auth')}
                className="w-full px-6 py-3 rounded-xl bg-[var(--primary-red)] text-white font-medium hover:bg-[#C10500] transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[var(--border)]/60 bg-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
          {/* Premium red top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]"></div>
          {/* Teal secondary accent line */}
          <div className="absolute top-1 left-0 right-0 h-[1px] bg-[var(--teal)]/30"></div>

          <h1 className="text-2xl font-semibold mb-6 text-[var(--navy)] text-center">
            Set new password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--navy)] mb-1.5">
                New Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)]/60 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]/20 focus:border-[var(--primary-red)] transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--navy)] mb-1.5">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)]/60 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]/20 focus:border-[var(--primary-red)] transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-[var(--wrong-soft)] text-[var(--wrong)] text-sm border border-[var(--wrong)]/20">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-[var(--primary-red)] text-white font-medium hover:bg-[#C10500] transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

