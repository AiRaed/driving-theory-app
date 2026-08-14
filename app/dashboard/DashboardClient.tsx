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

export default function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
  const dashboardViewTracked = useRef(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showInstallPopup, setShowInstallPopup] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { hasInstallPrompt, isInstalled, triggerInstall } = useInstallPrompt();

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (!user) {
        router.push('/auth');
      }
    });

    // Listen for auth state changes
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
        alert(data.error || 'Failed to delete account');
        setDeleteLoading(false);
        setDeleteConfirm(false);
      }
    } catch (error) {
      console.error('Delete account error:', error);
      alert('Failed to delete account');
      setDeleteLoading(false);
      setDeleteConfirm(false);
    }
  };

  // Get question counts
  const practiceQuestionsCount = questions.length;
  const mockTestQuestionsCount = 50; // Standard mock test size

  // Handle install button click
  const handleInstallClick = async () => {
    if (hasInstallPrompt) {
      // Trigger native install prompt
      await triggerInstall();
    } else {
      // Open popup in fallback mode with instructions
      setShowInstallPopup(true);
    }
  };

  // Check if install button should be visible (mobile only, not installed, not Capacitor)
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

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-start justify-center py-8 md:py-10">
      <div className="w-full max-w-[420px] md:max-w-lg mx-4 md:mx-auto flex flex-col">
        <div className="mb-5 px-1">
          <p className="lt-kicker mb-2">Your study hub</p>
          <h1 className="text-2xl sm:text-[1.75rem] font-bold text-[var(--text-primary)] tracking-tight">
            Dashboard
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1.5">
            Choose how you want to practise today.
          </p>
        </div>

        <div className="lt-card p-5 sm:p-6 w-full space-y-4">
          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--lingo-red-soft)]/50 p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lingo-red)] mb-2">
              Primary
            </p>
            <Link
              href="/practice"
              onClick={() => void trackEvent('start_practice_clicked')}
              className="lt-btn-primary w-full py-3.5 text-sm sm:text-base"
            >
              Start Practice
            </Link>
            <p className="text-xs text-[var(--text-secondary)] mt-2.5 text-center">
              {practiceQuestionsCount} questions · all topics
            </p>
          </div>

          <IosInstallHint />

          <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
              Exam simulation
            </p>
            <Link
              href="/mock-test"
              onClick={() => void trackEvent('mock_test_clicked')}
              className="lt-btn-secondary w-full py-3.5 text-sm sm:text-base"
            >
              Take Mock Test
            </Link>
            <p className="text-xs text-[var(--text-secondary)] mt-2.5 text-center">
              {mockTestQuestionsCount} questions · timed practice
            </p>
          </div>

          <div className="border-t border-[var(--border)] pt-4 space-y-2">
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className={cn(
                'w-full py-2.5 px-4 rounded-[var(--radius-sm)] text-xs sm:text-sm font-medium transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed',
                deleteConfirm
                  ? 'bg-[var(--lingo-red)] text-white hover:bg-[var(--lingo-red-hover)]'
                  : 'border border-[var(--border)] bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)] hover:text-[var(--text-primary)]'
              )}
            >
              {deleteLoading
                ? 'Deleting...'
                : deleteConfirm
                ? 'Confirm delete account'
                : 'Delete account'}
            </button>
            <p className="text-[11px] text-[var(--text-secondary)] text-center">
              This action is permanent.
            </p>
            {deleteConfirm && (
              <p className="text-[11px] text-[var(--text-secondary)] text-center">
                Click again to confirm.
              </p>
            )}
          </div>

          {shouldShowInstallButton && (
            <div className="pt-1">
              <button
                onClick={handleInstallClick}
                className="lt-btn-ghost w-full py-3 text-sm md:hidden"
              >
                {isIOSDevice() ? 'Add to Home Screen' : 'Install app'}
              </button>
            </div>
          )}
        </div>

        <p className="mt-5 text-xs text-[var(--text-secondary)] text-center px-2">
          Practice daily to increase your chances of passing.
        </p>
      </div>

      {/* Add to Home Screen Popup - Mobile only */}
      {user && <AddToHomeScreenPopup forceShow={showInstallPopup} onClose={() => setShowInstallPopup(false)} />}
    </div>
  );
}

