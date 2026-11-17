"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { cn } from '@/lib/utils';

type AuthMode = 'login' | 'register' | 'forgot';

export default function AuthClient() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  const next = searchParams.get('next') || '/dashboard';
  const confirmed = searchParams.get('confirmed');
  const errorParam = searchParams.get('error');

  useEffect(() => {
    // Check if user is already logged in
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push(next);
      }
    });
  }, [router, next, supabase]);

  useEffect(() => {
    if (confirmed === '1') {
      setMode('login');
      setError(null);
      setMessage('Email confirmed successfully! You can now log in.');
      return;
    }
    if (errorParam === 'confirm_failed') {
      setError('Email confirmation failed. Please try again or request a new confirmation email.');
    }
  }, [confirmed, errorParam]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      void trackEvent('login');
      router.replace('/dashboard');
      router.refresh();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (typeof window !== 'undefined' ? window.location.origin : 'https://www.lingotheory.org');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      void trackEvent('signup_completed');
      setMessage('Please check your inbox (or Spam / Junk folder) to confirm your account.');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Use environment-aware SITE_URL for redirectTo
    // NEXT_PUBLIC_SITE_URL should be set to:
    // - http://localhost:3000 in development (.env.local)
    // - https://www.lingotheory.org in production (Render environment variables)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const redirectTo = `${siteUrl}/auth/reset`;
    
    // Debug: log the redirect URL being sent to Supabase
    console.log('Sending password reset email with redirectTo:', redirectTo);
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage('Reset email sent. Check your inbox (or Spam / Junk folder).');
      setEmail('');
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (mode === 'login') {
      handleLogin(e);
    } else if (mode === 'register') {
      handleRegister(e);
    } else {
      handleForgotPassword(e);
    }
  };

  return (
    <div className="lt-page flex items-center py-8 sm:py-12">
      <div className="grid w-full items-stretch gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <aside className="hidden flex-col justify-between rounded-[1.35rem] bg-[var(--navy)] p-8 text-white lg:flex">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/65">LingoTheory</p>
          <div>
            <h2 className="text-3xl font-bold leading-tight">Your theory practice, in one account.</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Sign in to practise, sit a mock test, and keep the cards you save. English stays first.
            </p>
          </div>
          <p className="text-xs text-white/55">UK driving theory</p>
        </aside>
        <div className="lt-card-accent p-6 sm:p-8">
          <h1 className="text-2xl font-semibold mb-6 text-[var(--text-primary)] text-center pt-1">
            {mode === 'login' && 'Log in'}
            {mode === 'register' && 'Create account'}
            {mode === 'forgot' && 'Reset password'}
          </h1>

          {/* Tabs */}
          <div className="lt-segmented mb-6 w-full">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                setMessage(null);
              }}
              className={cn(
                'lt-segmented-btn inline-flex flex-1 items-center justify-center min-h-11 px-3 py-2 text-sm'
              )}
              data-active={mode === 'login'}
            >
              Login
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError(null);
                setMessage(null);
              }}
              className={cn(
                'lt-segmented-btn inline-flex flex-1 items-center justify-center min-h-11 px-3 py-2 text-sm'
              )}
              data-active={mode === 'register'}
            >
              Register
            </button>
            <button
              onClick={() => {
                setMode('forgot');
                setError(null);
                setMessage(null);
              }}
              className={cn(
                'lt-segmented-btn inline-flex flex-1 items-center justify-center min-h-11 px-3 py-2 text-sm'
              )}
              data-active={mode === 'forgot'}
            >
              Forgot
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                tabIndex={0}
                disabled={false}
                readOnly={false}
                className="lt-input"
                placeholder="your@email.com"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="lt-input"
                  placeholder="••••••••"
                />
              </div>
            )}

            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-primary)] mb-1.5">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="lt-input"
                  placeholder="••••••••"
                />
              </div>
            )}

            {error && (
              <div className="px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--wrong-soft)] text-[var(--wrong)] text-sm border border-[var(--wrong)]/20">
                {error}
              </div>
            )}

            {message && (
              <div className="px-4 py-2.5 rounded-[var(--radius-md)] bg-[var(--teal-soft)] text-[var(--teal)] text-sm border border-[var(--teal)]/25">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'lt-btn-primary w-full px-6 py-3 text-base',
                loading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Log in' : mode === 'register' ? 'Create account' : 'Send reset email'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

