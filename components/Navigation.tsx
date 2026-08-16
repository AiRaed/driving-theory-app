'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { useIsAdmin } from '@/lib/admin/useIsAdmin';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { isAdmin, ready: adminReady } = useIsAdmin(authReady ? user : undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

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

  const navLinkClass = (active: boolean) =>
    cn(
      'relative px-3 py-1.5 md:px-3.5 md:py-2 rounded-[var(--radius-sm)] text-xs md:text-sm font-semibold tracking-tight transition-colors duration-150 whitespace-nowrap flex-shrink-0',
      active
        ? 'text-[var(--lingo-red)] bg-[var(--lingo-red-soft)]'
        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]'
    );

  const showAdmin = authReady && adminReady && !!user && isAdmin;
  const adminActive = pathname === '/admin' || pathname.startsWith('/admin/');

  return (
    <nav className="flex gap-0.5 md:gap-1 text-xs md:text-sm items-center flex-nowrap overflow-x-auto hide-scrollbar">
      <Link
        href="/practice"
        prefetch={true}
        data-active={pathname === '/practice'}
        className={navLinkClass(pathname === '/practice')}
      >
        Practice
      </Link>
      <Link
        href="/mock-test"
        prefetch={true}
        data-active={pathname === '/mock-test'}
        className={navLinkClass(pathname === '/mock-test')}
      >
        Mock Test
      </Link>
      {showAdmin ? (
        <Link
          href="/admin"
          prefetch={true}
          data-active={adminActive}
          className={navLinkClass(adminActive)}
        >
          Admin
        </Link>
      ) : null}
      {user ? (
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-3 py-1.5 md:px-3.5 md:py-2 rounded-[var(--radius-sm)] text-xs md:text-sm font-semibold tracking-tight transition-colors duration-150 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
        >
          {loggingOut ? 'Logging out...' : 'Log out'}
        </button>
      ) : (
        <Link
          href="/auth"
          className={cn(
            navLinkClass(pathname === '/auth'),
            pathname !== '/auth' && 'text-[var(--lingo-red)]'
          )}
        >
          Log in
        </Link>
      )}
    </nav>
  );
}
