"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
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
    // Handle email confirmation success
    if (confirmed === '1') {
      setMessage('Email confirmed successfully! You can now log in.');
    }
    // Handle email confirmation error
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
      router.push(next);
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

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
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
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[var(--border)]/60 bg-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
          {/* Premium red top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]"></div>
          {/* Teal secondary accent line */}
          <div className="absolute top-1 left-0 right-0 h-[1px] bg-[var(--teal)]/30"></div>

          <h1 className="text-2xl font-semibold mb-6 text-[var(--navy)] text-center">
            {mode === 'login' && 'Log in'}
            {mode === 'register' && 'Create account'}
            {mode === 'forgot' && 'Reset password'}
          </h1>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-[var(--border)]/50">
            <button
              onClick={() => {
                setMode('login');
                setError(null);
                setMessage(null);
              }}
              className={cn(
                'px-4 py-2 text-sm font-medium transition-colors',
                mode === 'login'
                  ? 'text-[var(--primary-red)] border-b-2 border-[var(--primary-red)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--navy)]'
              )}
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
                'px-4 py-2 text-sm font-medium transition-colors',
                mode === 'register'
                  ? 'text-[var(--primary-red)] border-b-2 border-[var(--primary-red)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--navy)]'
              )}
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
                'px-4 py-2 text-sm font-medium transition-colors',
                mode === 'forgot'
                  ? 'text-[var(--primary-red)] border-b-2 border-[var(--primary-red)]'
                  : 'text-[var(--muted-text)] hover:text-[var(--navy)]'
              )}
            >
              Forgot
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--navy)] mb-1.5">
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
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)]/60 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary-red)]/20 focus:border-[var(--primary-red)] transition-all"
                placeholder="your@email.com"
              />
            </div>

            {mode !== 'forgot' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[var(--navy)] mb-1.5">
                  Password
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
            )}

            {mode === 'register' && (
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
            )}

            {error && (
              <div className="px-4 py-2.5 rounded-xl bg-[var(--wrong-soft)] text-[var(--wrong)] text-sm border border-[var(--wrong)]/20">
                {error}
              </div>
            )}

            {message && (
              <div className="px-4 py-2.5 rounded-xl bg-[var(--teal-soft)] text-[var(--teal)] text-sm border border-[var(--teal)]/20">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                'w-full px-6 py-3 rounded-xl bg-[var(--primary-red)] text-white font-medium hover:bg-[#C10500] transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
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

