'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Check initial user session
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

  // Reset loggingOut when pathname changes
  useEffect(() => {
    setLoggingOut(false);
  }, [pathname]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await supabase.auth.signOut();
      router.replace('/auth');
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  };


  return (
    <nav className="flex gap-1.5 md:gap-2 text-xs md:text-sm items-center flex-nowrap overflow-x-auto hide-scrollbar">
      <Link 
        href="/practice"
        prefetch={true}
        data-active={pathname === '/practice'}
        className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 text-[var(--navy)]/70 hover:text-[var(--navy)] relative data-[active=true]:text-[var(--navy)] data-[active=true]:bg-white/80 whitespace-nowrap flex-shrink-0"
      >
        Practice
        {pathname === '/practice' && (
          <>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-red)] rounded-full"></span>
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--teal)] rounded-full shadow-sm"></span>
          </>
        )}
      </Link>
      <Link
        href="/mock-test"
        prefetch={true}
        data-active={pathname === '/mock-test'}
        className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 text-[var(--navy)]/70 hover:text-[var(--navy)] relative data-[active=true]:text-[var(--navy)] data-[active=true]:bg-white/80 whitespace-nowrap flex-shrink-0"
      >
        Mock Test
        {pathname === '/mock-test' && (
          <>
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--primary-red)] rounded-full"></span>
            <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[var(--teal)] rounded-full shadow-sm"></span>
          </>
        )}
      </Link>
      {user && (
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-300 text-[var(--navy)]/70 hover:text-[var(--navy)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
        >
          {loggingOut ? 'Logging out...' : 'Log out'}
        </button>
      )}
    </nav>
  );
}

