'use client';

import { useState, useEffect } from 'react';
import { isIOSDevice, isSafari, isStandaloneMode } from '@/lib/utils/platform';
import { cn } from '@/lib/utils';

const STORAGE_KEY_DONT_SHOW_AGAIN = 'ios_install_hint_dont_show_again';

/**
 * iOS Safari–only install hint: Install button that opens a modal with
 * instructions and an animated arrow pointing to the Safari Share button.
 * Renders nothing on server or when not eligible (avoids hydration mismatch).
 */
export default function IosInstallHint() {
  const [eligible, setEligible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  // Client-only eligibility: iOS Safari, not standalone, not "Don't show again"
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isIOSDevice() || !isSafari() || isStandaloneMode()) {
      setEligible(false);
      return;
    }
    try {
      if (localStorage.getItem(STORAGE_KEY_DONT_SHOW_AGAIN) === 'true') {
        setEligible(false);
        return;
      }
    } catch {
      setEligible(false);
      return;
    }
    setEligible(true);
  }, []);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!modalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [modalOpen]);

  const openModal = () => setModalOpen(true);

  const closeModal = () => {
    if (dontShowAgain) {
      try {
        localStorage.setItem(STORAGE_KEY_DONT_SHOW_AGAIN, 'true');
      } catch {
        // ignore
      }
    }
    setModalOpen(false);
  };

  const handleDontShowAgainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setDontShowAgain(checked);
    if (checked) {
      try {
        localStorage.setItem(STORAGE_KEY_DONT_SHOW_AGAIN, 'true');
      } catch {
        // ignore
      }
    }
  };

  // Render nothing until we know we're eligible (client-only, no SSR content)
  if (!eligible) return null;

  return (
    <>
      {/* Install button - shown below Start Practice on Dashboard */}
      <div className="flex flex-col">
        <button
          type="button"
          onClick={openModal}
          className={cn(
            'w-full py-3 rounded-xl',
            'border-2 border-[var(--primary-red)] bg-white text-[var(--primary-red)]',
            'text-sm sm:text-base font-medium',
            'hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md',
            'active:scale-[0.98]'
          )}
        >
          Install
        </button>
      </div>

      {/* Modal overlay - only when open */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ios-install-title"
        >
          {/* Backdrop - fade-in */}
          <div
            className="absolute inset-0 bg-black/50 animate-in fade-in duration-200"
            onClick={closeModal}
            aria-hidden="true"
          />

          {/* Modal panel - fade-in, mobile-first */}
          <div
            className={cn(
              'relative w-full max-w-sm rounded-2xl bg-white shadow-2xl',
              'animate-in fade-in duration-200',
              'p-6 space-y-5'
            )}
            >
            <h2
              id="ios-install-title"
              className="text-xl font-bold text-[var(--navy)] text-center"
            >
              Install LingoTheory
            </h2>

            <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
              Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> → <strong>Add</strong>
            </p>

            {/* Bouncing arrow pointing down to Share button */}
            <div className="flex flex-col items-center gap-2">
              <div
                className="text-[var(--primary-red)] animate-bounce"
                style={{ animationDuration: '1.2s' }}
                aria-hidden="true"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12l7 7 7-7" />
                </svg>
              </div>
              <span className="text-xs text-[var(--muted-text)]">Tap the Share button below</span>
            </div>

            {/* Small mock of Safari Share button (bottom center of Safari UI) */}
            <div className="flex justify-center">
              <div
                className={cn(
                  'flex items-center justify-center',
                  'w-14 h-10 rounded-lg',
                  'bg-gray-100 border border-gray-200',
                  'shadow-sm'
                )}
                aria-hidden="true"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[var(--navy)]"
                >
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                  <polyline points="16 6 12 2 8 6" />
                  <line x1="12" y1="2" x2="12" y2="15" />
                </svg>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className={cn(
                  'w-full py-3 rounded-xl',
                  'bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]',
                  'text-white font-semibold text-sm',
                  'hover:from-red-700 hover:to-red-800',
                  'transition-all duration-200 shadow-md',
                  'active:scale-[0.98]'
                )}
              >
                Close
              </button>

              <label className="flex items-center justify-center gap-2 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={handleDontShowAgainChange}
                  className="w-4 h-4 rounded border-gray-300 text-[var(--primary-red)] focus:ring-[var(--primary-red)]"
                />
                <span className="text-xs text-[var(--muted-text)]">Don&apos;t show again</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
