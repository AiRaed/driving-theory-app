'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { questions } from '@/data/questions';
import AddToHomeScreenPopup from '@/components/AddToHomeScreenPopup';
import IosInstallHint from '@/components/IosInstallHint';
import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';
import { isMobileDevice, isStandaloneMode, isCapacitorWebView, isIOSDevice } from '@/lib/utils/platform';
import { trackEvent } from '@/lib/analytics/trackEvent';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import DashboardLanguagePicker from '@/components/DashboardLanguagePicker';
import BilingualLabel from '@/components/BilingualLabel';
import { enLabel } from '@/lib/i18n/ui-strings';

export default function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const dashboardViewTracked = useRef(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { hasInstallPrompt, isInstalled, triggerInstall } = useInstallPrompt();
  const { lang, setLang } = useLanguage();

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

  const practiceQuestionsCount = questions.length;
  const mockTestQuestionsCount = 50;

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

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-start justify-center py-8 md:py-10">
      <div className="w-full max-w-[420px] md:max-w-lg mx-4 md:mx-auto flex flex-col">
        <div className="mb-5 px-1">
          <p className="lt-kicker mb-2">{enLabel('dashboardKicker')}</p>
          <h1 className="text-2xl sm:text-[1.75rem] font-bold text-[var(--text-primary)] tracking-tight">
            {enLabel('dashboardTitle')}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5">
            {enLabel('dashboardSubtitle')}
          </p>
        </div>

        <div className="lt-card p-4 sm:p-5 mb-4 w-full">
          <DashboardLanguagePicker value={lang} onChange={setLang} />
        </div>

        <div className="lt-card p-5 sm:p-6 w-full space-y-4">
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--lingo-red-soft)]/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lingo-red)] mb-2">
              {enLabel('dashboardPrimary')}
            </p>
            <Link
              href="/practice"
              onClick={() => void trackEvent('start_practice_clicked')}
              className="lt-btn-primary w-full py-3.5 text-sm sm:text-base flex flex-col items-center justify-center"
            >
              <BilingualLabel
                keyName="startPractice"
                lang={lang}
                primaryClassName="text-sm sm:text-base font-semibold"
                translationClassName="text-white/85"
              />
            </Link>
            <p className="text-xs text-[var(--text-secondary)] mt-2.5 text-center">
              {enLabel('questionsAllTopics', { n: practiceQuestionsCount })}
            </p>
          </div>

          <IosInstallHint />

          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              {enLabel('examSimulation')}
            </p>
            <Link
              href="/mock-test"
              onClick={() => void trackEvent('mock_test_clicked')}
              className="lt-btn-secondary w-full py-3.5 text-sm sm:text-base flex flex-col items-center justify-center"
            >
              <BilingualLabel
                keyName="takeMockTest"
                lang={lang}
                primaryClassName="text-sm sm:text-base font-semibold"
              />
            </Link>
            <p className="text-xs text-[var(--text-secondary)] mt-2.5 text-center">
              {enLabel('mockTestMeta', { n: mockTestQuestionsCount })}
            </p>
          </div>

          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className={cn(
                'w-full py-2.5 px-4 rounded-[var(--radius-sm)] text-xs sm:text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center justify-center',
                deleteConfirm
                  ? 'bg-[var(--lingo-red)] text-white hover:bg-[var(--lingo-red-hover)]'
                  : 'border border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              <BilingualLabel
                keyName={deleteKey}
                lang={lang}
                translationClassName={deleteConfirm ? 'text-white/85' : undefined}
              />
            </button>
            <p className="text-[11px] text-[var(--text-secondary)] text-center">
              {enLabel('deletePermanent')}
            </p>
            {deleteConfirm && (
              <p className="text-[11px] text-[var(--text-secondary)] text-center">
                {enLabel('deleteClickAgain')}
              </p>
            )}
          </div>

          {shouldShowInstallButton && (
            <div className="pt-1">
              <button
                onClick={handleInstallClick}
                className="lt-btn-ghost w-full py-3 text-sm md:hidden flex flex-col items-center"
              >
                <BilingualLabel
                  keyName={isIOSDevice() ? 'addToHomeScreen' : 'installApp'}
                  lang={lang}
                />
              </button>
            </div>
          )}
        </div>

        <p className="mt-5 text-xs text-[var(--text-secondary)] text-center px-2">
          {enLabel('dashboardFooterHint')}
        </p>
      </div>

      {user && (
        <AddToHomeScreenPopup forceShow={showInstallPopup} onClose={() => setShowInstallPopup(false)} />
      )}
    </div>
  );
}
