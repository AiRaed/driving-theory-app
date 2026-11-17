'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { DVSA_V2_EXPECTED_COUNT, LINGO_TOPIC_IDS } from '@/lib/questions/dvsaV2';
import AddToHomeScreenPopup from '@/components/AddToHomeScreenPopup';
import IosInstallHint from '@/components/IosInstallHint';
import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';
import { isMobileDevice, isStandaloneMode, isCapacitorWebView, isIOSDevice } from '@/lib/utils/platform';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import ContentMaintenanceNotice from '@/components/ContentMaintenanceNotice';
import { enLabel } from '@/lib/i18n/ui-strings';
import { useContentMaintenance } from '@/lib/hooks/useContentMaintenance';
import type { TranslationLang } from '@/lib/i18n/languages';

const DASHBOARD_LANGUAGES: Array<{ code: TranslationLang; label: string }> = [
  { code: 'off', label: 'English' },
  { code: 'ar', label: 'العربية' },
];

function ArrowButton({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_6px_16px_rgba(16,45,78,0.16)]"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l6 6-6 6" />
      </svg>
    </span>
  );
}

function CardWave() {
  return (
    <svg aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] w-full" viewBox="0 0 400 120" preserveAspectRatio="none">
      <path d="M0 72c48 26 96-24 156-8 48 12 78 34 128 16 34-12 72-28 116-6v46H0Z" fill="rgba(255,255,255,0.14)" />
      <path d="M0 96c72 16 108-18 168-4 52 12 88 22 136 4 28-10 62-16 96 4v20H0Z" fill="rgba(255,255,255,0.12)" />
    </svg>
  );
}

export default function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const dashboardViewTracked = useRef(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { hasInstallPrompt, isInstalled, triggerInstall } = useInstallPrompt();
  const { lang, setLang, t } = useLanguage();
  const { loading: maintenanceLoading, enabled: contentMaintenance } = useContentMaintenance();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user) {
        router.push('/auth');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        router.push('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  useEffect(() => {
    if (!user || dashboardViewTracked.current) return;
    dashboardViewTracked.current = true;
    void trackEvent('dashboard_viewed');
  }, [user]);

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch('/api/auth/delete-account', {
        method: 'POST',
      });

      if (response.ok) {
        await supabase.auth.signOut();
        router.push('/');
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.error || enLabel('deleteFailed'));
        setDeleteLoading(false);
        setDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Delete account error:', error);
      alert(enLabel('deleteFailed'));
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
  };

  const handleInstallClick = async () => {
    if (hasInstallPrompt) {
      await triggerInstall();
    } else {
      setShowInstallPopup(true);
    }
  };

  const [shouldShowInstallButton, setShouldShowInstallButton] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setShouldShowInstallButton(false);
      return;
    }

    const shouldShow =
      isMobileDevice() &&
      !isCapacitorWebView() &&
      !isStandaloneMode() &&
      !isInstalled;

    setShouldShowInstallButton(shouldShow);
  }, [isInstalled]);

  const deleteKey = deleteLoading
    ? 'deleting'
    : deleteConfirm
      ? 'confirmDeleteAccount'
      : 'deleteAccount';

  const actions = [
    {
      href: '/practice',
      title: 'Practice',
      subtitle: `${DVSA_V2_EXPECTED_COUNT} questions · ${LINGO_TOPIC_IDS.length} topics`,
      background: '#D71920',
      arrow: '#D71920',
      icon: 'car' as const,
      onClick: () => void trackEvent('start_practice_clicked'),
    },
    {
      href: '/mock-test',
      title: 'Mock Test',
      subtitle: '50 timed questions',
      background: '#102D4E',
      arrow: '#102D4E',
      icon: 'clipboard' as const,
      onClick: () => void trackEvent('mock_test_clicked'),
    },
    {
      href: '/saved-cards',
      title: 'Saved Cards',
      subtitle: 'Your learning cards',
      background: '#168CBA',
      arrow: '#168CBA',
      icon: 'bookmark' as const,
      onClick: undefined,
    },
  ];

  return (
    <div dir="ltr" className="bg-[#F7F9FC]">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-4 px-4 py-4 sm:gap-5 sm:px-6 sm:py-8">
        {!maintenanceLoading && contentMaintenance ? (
          <ContentMaintenanceNotice variant="card" showDashboardLink={false} />
        ) : null}

        <section className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-5">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              onClick={action.onClick}
              className="relative flex min-h-[146px] items-center gap-3 overflow-hidden rounded-[22px] px-4 py-4 text-white shadow-[0_12px_28px_rgba(16,45,78,0.12)] sm:px-5 md:min-h-[168px] md:px-6"
              style={{ backgroundColor: action.background }}
            >
              <CardWave />
              <span className="relative z-[1] inline-flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14">
                <ActionIcon name={action.icon} />
              </span>
              <span className="relative z-[1] min-w-0 flex-1">
                <span className="block text-[1.35rem] font-bold leading-tight tracking-tight sm:text-[1.6rem] md:text-[1.75rem]">
                  {action.title}
                </span>
                <span className="mt-1 block text-[13px] font-medium leading-snug text-white/90 sm:text-sm">
                  {action.subtitle}
                </span>
              </span>
              <span className="relative z-[1]">
                <ArrowButton color={action.arrow} />
              </span>
            </Link>
          ))}
        </section>

        <section className="rounded-[24px] border border-[#E6EDF5] bg-white px-4 py-5 shadow-[0_10px_30px_rgba(16,45,78,0.05)] sm:px-6 sm:py-6">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#D7E1EC] text-[#102D4E]">
              <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M3 12h18 M12 3c2.4 2.7 3.6 5.8 3.6 9s-1.2 6.3-3.6 9c-2.4-2.7-3.6-5.8-3.6-9S9.6 5.7 12 3Z" />
              </svg>
            </span>
            <div className="min-w-0">
              <h1 className="text-lg font-bold tracking-tight text-[#102D4E] sm:text-xl">Choose Your Language</h1>
              <p className="mt-0.5 text-sm text-[#4E5D73]">Learn and practise in your preferred language.</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-4">
            {DASHBOARD_LANGUAGES.map((item) => {
              const selected = lang === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  aria-pressed={selected}
                  dir={item.code === 'ar' ? 'rtl' : 'ltr'}
                  lang={item.code === 'ar' ? 'ar' : 'en'}
                  onClick={() => setLang(item.code)}
                  className={cn(
                    'relative min-h-[58px] rounded-2xl border-2 px-2 text-base font-bold text-[#102D4E] sm:min-h-[72px] sm:text-lg',
                    selected
                      ? 'border-[#D71920] bg-[#FDECEE]'
                      : 'border-[#D7E1EC] bg-white'
                  )}
                >
                  {item.label}
                  {selected ? (
                    <span className="absolute -right-1.5 -top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#D71920] text-white shadow-[0_4px_10px_rgba(215,25,32,0.35)]">
                      <svg viewBox="0 0 24 24" aria-hidden className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12.5 9.5 17 19 7.5" />
                      </svg>
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-[#E6EDF5] bg-white px-4 py-4 sm:px-5 md:mt-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#4E5D73]">Account management</p>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4E5D73]">
            Deleting your account is permanent. This cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleteLoading}
            className={cn(
              'mt-3 inline-flex min-h-10 items-center justify-center rounded-full border border-[#D71920] px-4 text-sm font-semibold text-[#D71920] disabled:cursor-not-allowed disabled:opacity-50',
              deleteConfirm && 'bg-[#D71920] text-white'
            )}
          >
            {t(deleteKey)}
          </button>
          {deleteConfirm ? (
            <p className="mt-2 text-xs text-[#4E5D73]">{t('deleteClickAgain')}</p>
          ) : null}
          <IosInstallHint />
          {shouldShowInstallButton ? (
            <button
              type="button"
              onClick={handleInstallClick}
              className="mt-3 inline-flex min-h-10 items-center text-sm font-semibold text-[#102D4E] md:hidden"
            >
              {t(isIOSDevice() ? 'addToHomeScreen' : 'installApp')}
            </button>
          ) : null}
        </section>
      </div>

      {user ? (
        <AddToHomeScreenPopup forceShow={showInstallPopup} onClose={() => setShowInstallPopup(false)} />
      ) : null}
    </div>
  );
}

function ActionIcon({ name }: { name: 'car' | 'clipboard' | 'bookmark' }) {
  if (name === 'car') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden className="h-11 w-11 md:h-12 md:w-12" fill="currentColor">
        <path d="M10.2 29.5 12.6 20a3.2 3.2 0 0 1 3.1-2.4h16.6a3.2 3.2 0 0 1 3.1 2.4l2.4 9.5v6.2a2.2 2.2 0 0 1-2.2 2.2h-2.1a2.2 2.2 0 0 1-2.2-2.2v-.6H14.7v.6a2.2 2.2 0 0 1-2.2 2.2h-2.1a2.2 2.2 0 0 1-2.2-2.2v-6.2Zm4.2-1.6a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Zm19.2 0a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6ZM15.8 20.2l-1.2 6.2h18.8l-1.2-6.2H15.8Z" />
      </svg>
    );
  }
  if (name === 'clipboard') {
    return (
      <svg viewBox="0 0 48 48" aria-hidden className="h-11 w-11 md:h-12 md:w-12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="12" y="10" width="24" height="28" rx="3" />
        <path d="M18 10.5h12v-1.2A2.3 2.3 0 0 0 27.7 7h-7.4A2.3 2.3 0 0 0 18 9.3v1.2Z" fill="currentColor" stroke="none" />
        <path d="m19 25.5 3.2 3.2 7.2-8" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="h-11 w-11 md:h-12 md:w-12" fill="currentColor">
      <path d="M14 8.5h20a2 2 0 0 1 2 2V40l-12-6.4L12 40V10.5a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
