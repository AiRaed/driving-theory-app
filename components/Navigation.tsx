'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { useIsAdmin } from '@/lib/admin/useIsAdmin';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { BilingualNavLabel } from '@/components/BilingualLabel';
import { enLabel } from '@/lib/i18n/ui-strings';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { isAdmin, ready: adminReady } = useIsAdmin(authReady ? user : undefined);
  const { lang } = useLanguage();

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
  const onboarding = pathname.startsWith('/choose-language');

  return (
    <nav className="flex gap-0.5 md:gap-1 text-xs md:text-sm items-center flex-nowrap overflow-x-auto hide-scrollbar">
      {!onboarding && (
        <>
          <Link
            href="/practice"
            prefetch={true}
            data-active={pathname === '/practice'}
            className={navLinkClass(pathname === '/practice')}
          >
            <BilingualNavLabel
              keyName="navPractice"
              lang={lang}
              active={pathname === '/practice'}
            />
          </Link>
          <Link
            href="/mock-test"
            prefetch={true}
            data-active={pathname === '/mock-test'}
            className={navLinkClass(pathname === '/mock-test')}
          >
            <BilingualNavLabel
              keyName="navMockTest"
              lang={lang}
              active={pathname === '/mock-test'}
            />
          </Link>
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
        </>
      )}
      {user ? (
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="px-3 py-1.5 md:px-3.5 md:py-2 rounded-[var(--radius-sm)] text-xs md:text-sm font-semibold tracking-tight transition-colors duration-150 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex-shrink-0"
        >
          {loggingOut ? (
            <BilingualNavLabel keyName="loggingOut" lang={lang} />
          ) : (
            <BilingualNavLabel keyName="logOut" lang={lang} />
          )}
        </button>
      ) : (
        <Link
          href="/auth"
          className={cn(
            navLinkClass(pathname === '/auth'),
            pathname !== '/auth' && 'text-[var(--lingo-red)]'
          )}
        >
          <BilingualNavLabel keyName="logIn" lang={lang} active={pathname === '/auth'} />
        </Link>
      )}
    </nav>
  );
}
