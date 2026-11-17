'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { useIsAdmin } from '@/lib/admin/useIsAdmin';
import { enLabel } from '@/lib/i18n/ui-strings';
import { gaEvent } from '@/lib/ga';

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
      'relative inline-flex items-center min-h-11 px-2.5 py-1.5 md:px-3.5 md:py-2 rounded-xl text-xs md:text-sm font-semibold tracking-tight transition-colors duration-150 whitespace-nowrap flex-shrink-0',
      active
        ? 'bg-white text-[var(--navy)]'
        : 'text-white/80 hover:bg-white/10 hover:text-white'
    );

  const showAdmin = authReady && adminReady && !!user && isAdmin;
  const adminActive = pathname === '/admin' || pathname.startsWith('/admin/');
  const onboarding = pathname.startsWith('/choose-language');

  return (
    <nav className="flex gap-0.5 md:gap-1 text-xs md:text-sm items-center flex-nowrap overflow-x-auto hide-scrollbar">
      {!onboarding && (
        <>
          <Link
            href="/practice"
            prefetch={true}
            data-active={pathname === '/practice'}
            className={cn(navLinkClass(pathname === '/practice'), 'hidden md:inline-flex')}
          >
            {enLabel('navPractice')}
          </Link>
          <Link
            href="/mock-test"
            prefetch={true}
            data-active={pathname === '/mock-test'}
            className={cn(navLinkClass(pathname === '/mock-test'), 'hidden md:inline-flex')}
          >
            {enLabel('navMockTest')}
          </Link>
          {user ? (
            <Link
              href="/saved-cards"
              prefetch={true}
              data-active={pathname === '/saved-cards'}
              className={cn(navLinkClass(pathname === '/saved-cards'), 'hidden md:inline-flex')}
            >
              {enLabel('navSavedCards')}
            </Link>
          ) : null}
          {showAdmin ? (
            <Link
              href="/admin"
              prefetch={true}
              data-active={adminActive}
              className={navLinkClass(adminActive)}
            >
              {enLabel('navAdmin')}
            </Link>
          ) : null}
          {/* Desktop-only: keep mobile header compact; hero CTA covers phones */}
          <Link
            href="/download"
            prefetch={true}
            data-active={pathname === '/download'}
            onClick={() =>
              gaEvent('landing_download_app_clicked', { source: 'header_nav' })
            }
            className={cn(navLinkClass(pathname === '/download'), 'hidden md:inline-flex')}
          >
            Download App
          </Link>
        </>
      )}
      {user ? (
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex min-h-11 flex-shrink-0 items-center whitespace-nowrap rounded-xl px-2.5 py-1.5 text-xs font-semibold tracking-tight text-white/80 transition-colors duration-150 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:px-3.5 md:py-2 md:text-sm"
        >
          {loggingOut ? enLabel('loggingOut') : enLabel('logOut')}
        </button>
      ) : (
        <Link
          href="/auth"
          className={cn(
            navLinkClass(pathname === '/auth'),
            pathname !== '/auth' && 'text-white'
          )}
        >
          {enLabel('logIn')}
        </Link>
      )}
    </nav>
  );
}
