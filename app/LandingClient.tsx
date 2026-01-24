'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function LandingClient() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (user) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-2xl bg-[var(--primary-red)] text-white font-medium hover:bg-[#C10500] transition-colors shadow-sm hover:shadow-md"
        >
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Subtle yellow accent icon */}
      <div className="flex items-center justify-center mb-1">
        <span className="text-[#FFC107]/60 text-lg">✨</span>
      </div>
      <Link
        href="/auth"
        className="px-6 py-3 rounded-2xl bg-[var(--primary-red)] text-white font-medium hover:bg-[#C10500] transition-colors shadow-sm hover:shadow-md"
      >
        Log in / Get started
      </Link>
      <Link
        href="/auth"
        className="text-sm text-[var(--muted-text)] hover:text-[var(--navy)] transition-colors"
      >
        Create account
      </Link>
    </div>
  );
}

