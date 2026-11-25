'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import BrandLogo from '@/components/BrandLogo';
import { enLabel } from '@/lib/i18n/ui-strings';
import { getLanguageMeta, type TranslationLang } from '@/lib/i18n/languages';
import { cn } from '@/lib/utils';

function Icon({ d, className = 'h-5 w-5' }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={cn('shrink-0', className)} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  home: 'M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z',
  car: 'M4 14.5 5.2 9.2A2 2 0 0 1 7.1 7.6h9.8a2 2 0 0 1 1.9 1.6L20 14.5 M4 14.5h16V17a1 1 0 0 1-1 1h-1.2a1 1 0 0 1-1-1v-.4H7.2V17a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2.5Z M7.2 14.5h.1 M16.7 14.5h.1',
  clipboard: 'M9 4.5h6a1 1 0 0 1 1 1V7H8V5.5a1 1 0 0 1 1-1Z M8 6.5H7a1 1 0 0 0-1 1V19a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7.5a1 1 0 0 0-1-1h-1 M9 12.2l1.6 1.6L15 9.8',
  bookmark: 'M7 4.5h10a1 1 0 0 1 1 1V20l-6-3.2L6 20V5.5a1 1 0 0 1 1-1Z',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M3 12h18 M12 3c2.4 2.7 3.6 5.8 3.6 9s-1.2 6.3-3.6 9c-2.4-2.7-3.6-5.8-3.6-9S9.6 5.7 12 3Z',
  account: 'M12 12a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 12 12Z M5.6 19.2a6.4 6.4 0 0 1 12.8 0',
  chevron: 'M6 9l6 6 6-6',
  admin: 'M12 3.5 19 7v5.2c0 4.2-2.8 7-7 8.3-4.2-1.3-7-4.1-7-8.3V7l7-3.5Z',
};

const DASHBOARD_LANGUAGES: Array<{ code: TranslationLang; label: string }> = [
  { code: 'off', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: ICONS.home, match: (path: string) => path === '/dashboard' },
  { href: '/practice', label: 'Practice', icon: ICONS.car, match: (path: string) => path.startsWith('/practice') },
  { href: '/mock-test', label: 'Mock Test', icon: ICONS.clipboard, match: (path: string) => path.startsWith('/mock-test') },
  { href: '/saved-cards', label: 'Saved Cards', icon: ICONS.bookmark, match: (path: string) => path.startsWith('/saved-cards') },
];

export default function DashboardChrome({
  user,
  showAdmin,
  lang,
  setLang,
  loggingOut,
  logout,
}: {
  user: User | null;
  showAdmin: boolean;
  lang: TranslationLang;
  setLang: (lang: TranslationLang) => void;
  loggingOut: boolean;
  logout: () => void;
}) {
  const pathname = usePathname() || '/dashboard';
  const [accountOpen, setAccountOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const known = DASHBOARD_LANGUAGES.find((item) => item.code === lang);
  const languageLabel = known?.label || getLanguageMeta(lang).nativeName;

  useEffect(() => {
    setAccountOpen(false);
    setLanguageOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!accountOpen && !languageOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
        setLanguageOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAccountOpen(false);
        setLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [accountOpen, languageOpen]);

  return (
    <>
      <header ref={rootRef} dir="ltr" className="lt-safe-top sticky top-0 z-30 min-w-0 border-b border-[#E6EDF5] bg-white shadow-[0_1px_0_rgba(16,45,78,0.04)]">
        <div className="mx-auto flex h-[4.5rem] w-full min-w-0 max-w-[1120px] items-center gap-3 px-4 md:h-20 md:gap-6 md:px-6">
          <Link href="/dashboard" aria-label={enLabel('homeAria')} className="flex min-w-0 max-w-[9.5rem] shrink items-center sm:max-w-[11rem] md:max-w-[12.5rem] md:shrink-0">
            <BrandLogo size="header" priority />
          </Link>

          <nav className="mx-auto hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  className={cn(
                    'inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm font-semibold text-[#102D4E] lg:px-4',
                    active && 'bg-[#D71920] text-white shadow-[0_6px_16px_rgba(215,25,32,0.22)]'
                  )}
                >
                  <Icon d={item.icon} className="h-[18px] w-[18px]" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#D7E1EC] bg-white px-3 text-sm font-semibold text-[#102D4E] shadow-[0_1px_2px_rgba(16,45,78,0.04)]"
                aria-expanded={languageOpen}
                aria-haspopup="listbox"
                onClick={() => {
                  setLanguageOpen((open) => !open);
                  setAccountOpen(false);
                }}
              >
                <Icon d={ICONS.globe} className="h-[18px] w-[18px]" />
                <span>{languageLabel}</span>
                <Icon d={ICONS.chevron} className="h-4 w-4 text-[#4E5D73]" />
              </button>
              {languageOpen ? (
                <div className="absolute right-0 z-40 mt-2 w-44 rounded-2xl border border-[#E6EDF5] bg-white p-1 shadow-[0_12px_32px_rgba(16,45,78,0.12)]" role="listbox">
                  {DASHBOARD_LANGUAGES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      role="option"
                      aria-selected={item.code === lang}
                      dir={item.code === 'ar' ? 'rtl' : 'ltr'}
                      lang={item.code === 'ar' ? 'ar' : 'en'}
                      className={cn(
                        'flex min-h-11 w-full items-center rounded-xl px-3 text-sm font-semibold text-[#102D4E]',
                        item.code === lang && 'bg-[#FDECEE] text-[#D71920]'
                      )}
                      onClick={() => {
                        setLang(item.code);
                        setLanguageOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#102D4E] text-white shadow-[0_6px_16px_rgba(16,45,78,0.18)]"
                aria-label={user ? 'Account' : 'Sign in'}
                aria-expanded={accountOpen}
                onClick={() => {
                  setAccountOpen((open) => !open);
                  setLanguageOpen(false);
                }}
              >
                <Icon d={ICONS.account} />
              </button>
              {accountOpen ? (
                <div className="absolute right-0 z-40 mt-2 w-56 rounded-2xl border border-[#E6EDF5] bg-white p-2 shadow-[0_12px_32px_rgba(16,45,78,0.12)]">
                  {user ? (
                    <>
                      <p className="truncate px-3 py-2 text-xs text-[#4E5D73]">{user.email}</p>
                      {showAdmin ? (
                        <Link href="/admin" className="flex min-h-11 w-full items-center gap-2 rounded-xl px-3 text-sm font-semibold text-[#102D4E]">
                          <Icon d={ICONS.admin} className="h-[18px] w-[18px]" />
                          {enLabel('navAdmin')}
                        </Link>
                      ) : null}
                      <button type="button" className="flex min-h-11 w-full items-center rounded-xl px-3 text-left text-sm font-semibold text-[#102D4E]" onClick={logout} disabled={loggingOut}>
                        {loggingOut ? enLabel('loggingOut') : enLabel('logOut')}
                      </button>
                    </>
                  ) : (
                    <Link href="/auth" className="flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-[#102D4E]">
                      Sign in
                    </Link>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <nav
        dir="ltr"
        aria-label="Primary"
        className="lt-safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-[#E6EDF5] bg-white shadow-[0_-6px_20px_rgba(16,45,78,0.06)] md:hidden"
      >
        <div className="grid grid-cols-4">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active}
                className={cn(
                  'flex min-h-[4.25rem] flex-col items-center justify-center gap-1 px-1 text-[11px] font-semibold text-[#102D4E]',
                  active && 'text-[#D71920]'
                )}
              >
                <span className={cn('inline-flex h-8 w-8 items-center justify-center rounded-xl', active && 'bg-[#FDECEE]')}>
                  <Icon d={item.icon} className="h-5 w-5" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
