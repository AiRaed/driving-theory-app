'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';
import BrandLogo from '@/components/BrandLogo';
import DashboardChrome from '@/components/DashboardChrome';
import { useIsAdmin } from '@/lib/admin/useIsAdmin';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { ENABLED_LANGUAGES, getLanguageMeta } from '@/lib/i18n/languages';
import { enLabel } from '@/lib/i18n/ui-strings';
import { gaEvent } from '@/lib/ga';
import { cn } from '@/lib/utils';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  home: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z',
  practice: 'M7 4h7l5 5v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z M14 4v5h5 M8 13h8 M8 17h5',
  mock: 'M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M12 8v4l3 2',
  saved: 'M7 4h10a1 1 0 0 1 1 1v15l-6-3-6 3V5a1 1 0 0 1 1-1Z',
  language: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M3 12h18 M12 3c2.5 2.8 3.8 6 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-6-3.8-9s1.3-6.2 3.8-9Z',
  download: 'M12 4v10 M8 10l4 4 4-4 M5 19h14',
  admin: 'M12 3.5 19 7v5.2c0 4.2-2.8 7-7 8.3-4.2-1.3-7-4.1-7-8.3V7l7-3.5Z',
  account: 'M12 12a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z M5.5 19.2a6.5 6.5 0 0 1 13 0',
  menu: 'M5 7h14 M5 12h14 M5 17h14',
  close: 'M6 6l12 12 M18 6 6 18',
};

export default function HeaderClient() {
  const pathname = usePathname() || '/';
  const router = useRouter();
  const supabase = createClient();
  const { lang, setLang } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const { isAdmin, ready: adminReady } = useIsAdmin(authReady ? user : undefined);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user: next } }) => {
      setUser(next);
      setAuthReady(true);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    setDrawerOpen(false);
    setAccountOpen(false);
    setLanguageOpen(false);
    setLoggingOut(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const drawer = drawerRef.current;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const focusable = () =>
      Array.from(drawer?.querySelectorAll<HTMLElement>('a, button') || []).filter((el) => !el.hasAttribute('disabled'));
    focusable()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      previous?.focus();
    };
  }, [drawerOpen]);

  if (pathname === '/download') return null;

  const showAdmin = authReady && adminReady && !!user && isAdmin;
  const homeHref = user ? '/dashboard' : '/';
  const homeLabel = pathname === '/' && !user ? 'Home' : 'Dashboard';
  const links = [
    { href: homeHref, label: homeLabel, icon: ICONS.home, active: pathname === '/' || pathname.startsWith('/dashboard') },
    { href: '/practice', label: enLabel('navPractice'), icon: ICONS.practice, active: pathname.startsWith('/practice') },
    { href: '/mock-test', label: enLabel('navMockTest'), icon: ICONS.mock, active: pathname.startsWith('/mock-test') },
    { href: '/saved-cards', label: enLabel('navSavedCards'), icon: ICONS.saved, active: pathname.startsWith('/saved-cards') },
  ];

  const logout = async () => {
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

  const languageName = getLanguageMeta(lang).nativeName;

  if (pathname === '/dashboard' || pathname.startsWith('/practice') || pathname.startsWith('/saved-cards')) {
    return (
      <DashboardChrome
        user={user}
        showAdmin={showAdmin}
        lang={lang}
        setLang={setLang}
        loggingOut={loggingOut}
        logout={() => void logout()}
      />
    );
  }

  return (
    <header className="lt-safe-top sticky top-0 z-30 border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center gap-2 px-3 md:h-20 md:gap-6 md:px-6">
        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-[var(--navy)] md:hidden"
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-navigation"
          onClick={() => setDrawerOpen(true)}
        >
          <Icon d={ICONS.menu} />
        </button>

        <Link href="/" aria-label={enLabel('homeAria')} className="mx-auto flex min-w-0 max-w-[9.5rem] items-center md:mx-0 md:max-w-[12.5rem] md:shrink-0">
          <BrandLogo size="header" priority />
        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex" aria-label="Primary">
          {links.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={item.active}
              className={cn(
                'inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[var(--navy)]',
                item.active && 'bg-[var(--lingo-red-soft)] text-[var(--lingo-red)]'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <div className="relative hidden md:block">
            <button
              type="button"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[var(--navy)]"
              aria-expanded={languageOpen}
              aria-haspopup="listbox"
              onClick={() => setLanguageOpen((open) => !open)}
            >
              <Icon d={ICONS.language} />
              {languageName}
            </button>
            {languageOpen ? (
              <div className="absolute right-0 z-40 mt-1 w-52 rounded-2xl border border-[var(--border)] bg-white p-1 shadow-[var(--shadow-md)]" role="listbox">
                {ENABLED_LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    role="option"
                    aria-selected={item.code === lang}
                    className={cn(
                      'flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-semibold text-[var(--navy)]',
                      item.code === lang && 'bg-[var(--lingo-red-soft)] text-[var(--lingo-red)]'
                    )}
                    onClick={() => {
                      setLang(item.code);
                      setLanguageOpen(false);
                    }}
                  >
                    {item.nativeName}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--navy)] text-white"
              aria-label={user ? 'Account' : 'Sign in'}
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
            >
              <Icon d={ICONS.account} />
            </button>
            {accountOpen ? (
              <div className="absolute right-0 z-40 mt-2 w-56 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-md)]">
                {user ? (
                  <>
                    <p className="truncate px-3 py-2 text-xs text-[var(--text-secondary)]">{user.email}</p>
                    {showAdmin ? (
                      <Link href="/admin" className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[var(--navy)]">
                        <Icon d={ICONS.admin} />
                        {enLabel('navAdmin')}
                      </Link>
                    ) : null}
                    <button type="button" className="flex min-h-11 w-full items-center rounded-xl px-3 text-sm font-semibold text-[var(--navy)]" onClick={() => void logout()} disabled={loggingOut}>
                      {loggingOut ? enLabel('loggingOut') : enLabel('logOut')}
                    </button>
                  </>
                ) : (
                  <Link href="/auth" className="flex min-h-12 items-center rounded-xl px-3 text-sm font-semibold text-[var(--navy)]">
                    Sign in
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button type="button" className="absolute inset-0 bg-[rgba(16,45,78,0.45)]" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
          <div
            ref={drawerRef}
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="absolute inset-y-0 left-0 flex w-[min(20rem,88vw)] flex-col bg-white shadow-[var(--shadow-md)]"
          >
            <div className="flex h-16 items-center justify-between border-b border-[var(--border)] px-4">
              <p id={titleId} className="text-base font-bold text-[var(--navy)]">Menu</p>
              <button type="button" className="inline-flex h-11 w-11 items-center justify-center text-[var(--navy)]" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
                <Icon d={ICONS.close} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3" aria-label="Mobile">
              {links.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-semibold text-[var(--navy)]',
                    item.active && 'bg-[var(--lingo-red-soft)] text-[var(--lingo-red)]'
                  )}
                >
                  <Icon d={item.icon} />
                  {item.label}
                </Link>
              ))}
              <p className="mt-4 px-3 text-xs font-bold uppercase tracking-wide text-[var(--text-secondary)]">Language</p>
              {ENABLED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={cn(
                    'flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-base font-semibold text-[var(--navy)]',
                    item.code === lang && 'bg-[var(--lingo-red-soft)] text-[var(--lingo-red)]'
                  )}
                  onClick={() => setLang(item.code)}
                >
                  <Icon d={ICONS.language} />
                  {item.nativeName}
                </button>
              ))}
              <Link
                href="/download"
                className="mt-2 flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-semibold text-[var(--navy)]"
                onClick={() => gaEvent('landing_download_app_clicked', { source: 'mobile_drawer' })}
              >
                <Icon d={ICONS.download} />
                Download App
              </Link>
              {showAdmin ? (
                <Link href="/admin" className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-base font-semibold text-[var(--navy)]">
                  <Icon d={ICONS.admin} />
                  {enLabel('navAdmin')}
                </Link>
              ) : null}
              {user ? (
                <button type="button" className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-base font-semibold text-[var(--navy)]" onClick={() => void logout()} disabled={loggingOut}>
                  {loggingOut ? enLabel('loggingOut') : enLabel('logOut')}
                </button>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
