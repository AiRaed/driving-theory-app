"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function ResetClient() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if user has a valid session (required for password reset)
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        // User might be coming from email link, wait a moment for session to be established
        setTimeout(() => {
          supabase.auth.getUser().then(({ data: { user: retryUser } }) => {
            if (!retryUser) {
              router.push('/auth?next=/auth/reset');
            }
          });
        }, 500);
      }
    });
  }, [router, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-[var(--border)]/60 bg-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]"></div>
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h1 className="text-2xl font-semibold mb-2 text-[var(--navy)]">Password updated!</h1>
              <p className="text-[var(--muted-text)] mb-4">Redirecting to dashboard...</p>
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

