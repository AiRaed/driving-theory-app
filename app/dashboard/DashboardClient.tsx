'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import { questions } from '@/data/questions';
import AddToHomeScreenPopup from '@/components/AddToHomeScreenPopup';
import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';
import { isMobileDevice, isStandaloneMode, isCapacitorWebView } from '@/lib/utils/platform';

export default function DashboardClient() {
  const [user, setUser] = useState<User | null>(null);
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
    <div className="min-h-[calc(100vh-64px)] flex items-center md:items-start justify-center py-6 md:py-6 md:py-8">
      <div className="w-full max-w-[420px] md:max-w-5xl mx-4 md:mx-auto px-0 md:px-4 flex flex-col items-center md:items-stretch">
        <div className="rounded-2xl border border-[var(--border)]/60 bg-white p-5 sm:p-6 md:p-8 pb-8 md:pb-8 shadow-lg relative h-auto w-full">
          {/* Premium red top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]"></div>
          {/* Teal secondary accent line */}
          <div className="absolute top-1 left-0 right-0 h-[1px] bg-[var(--teal)]/30"></div>

          <div className="mb-6 md:mb-6">
            <h1 className="text-2xl sm:text-3xl font-semibold mb-1 md:mb-2 text-[var(--navy)]">
              Dashboard
            </h1>
            <p className="text-sm md:text-base text-gray-500 md:text-[var(--muted-text)]">
              Welcome back 👋
            </p>
          </div>

          <div className="space-y-3 md:space-y-4 mb-6">
            <div className="flex flex-col">
              <Link
                href="/practice"
                className="block w-full py-3 md:h-12 rounded-xl bg-[var(--primary-red)] text-white text-sm sm:text-base font-medium hover:bg-[#C10500] transition-all duration-200 shadow-sm hover:shadow-md text-center flex items-center justify-center"
              >
                Start Practice
              </Link>
              <p className="text-xs text-[var(--muted-text)]/70 mt-1.5 text-center">
                {practiceQuestionsCount} questions
              </p>
            </div>
            <div className="flex flex-col">
              <Link
                href="/mock-test"
                className="block w-full py-3 md:h-12 rounded-xl border-2 border-[var(--primary-red)] bg-white text-[var(--primary-red)] text-sm sm:text-base font-medium hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md text-center flex items-center justify-center"
              >
                Take Mock Test
              </Link>
              <p className="text-xs text-[var(--muted-text)]/70 mt-1.5 text-center">
                {mockTestQuestionsCount} questions
              </p>
            </div>
          </div>

          {/* Divider - separate element to ensure visibility */}
          <div className="my-6 md:my-8 border-t border-red-300/70"></div>

          {/* Delete account section */}
          <div className="pt-0 pb-0 space-y-2">
            <button
              onClick={handleDeleteAccount}
              disabled={deleteLoading}
              className={cn(
                'w-full py-2 md:py-2.5 px-6 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed',
                deleteConfirm
                  ? 'bg-red-600/90 text-white hover:bg-red-700'
                  : 'border border-red-300/60 bg-white text-red-600/80 hover:bg-red-50/50'
              )}
            >
              {deleteLoading
                ? 'Deleting...'
                : deleteConfirm
                ? 'Confirm delete account'
                : 'Delete account'}
            </button>
            <p className="text-xs text-[var(--muted-text)]/70 text-center">
              This action is permanent.
            </p>
            {deleteConfirm && (
              <p className="text-xs text-[var(--muted-text)]/70 text-center">
                Click again to confirm.
              </p>
            )}
          </div>

          {/* Persistent Install App Button - Mobile only */}
          {shouldShowInstallButton && (
            <div className="pt-4 pb-0">
              <button
                onClick={handleInstallClick}
                className={cn(
                  'w-full py-3 rounded-xl',
                  'bg-gradient-to-r from-blue-600 to-blue-700',
                  'text-white font-semibold text-sm sm:text-base',
                  'hover:from-blue-700 hover:to-blue-800',
                  'transition-all duration-200 shadow-md hover:shadow-lg',
                  'active:scale-[0.98]',
                  'md:hidden' // Only show on mobile screens
                )}
              >
                Install app
              </button>
            </div>
          )}
        </div>
        
        {/* Helper text below card */}
        <div className="mt-6 text-xs text-[var(--muted-text)]/60 text-center w-full max-w-[420px]">
          Practice daily to increase your chances of passing.
        </div>
      </div>

      {/* Add to Home Screen Popup - Mobile only */}
      {user && <AddToHomeScreenPopup forceShow={showInstallPopup} onClose={() => setShowInstallPopup(false)} />}
    </div>
  );
}

