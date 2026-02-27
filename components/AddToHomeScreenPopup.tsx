'use client';

import { useState, useEffect } from 'react';
import {
  isStandaloneMode,
  isCapacitorWebView,
  isIOSDevice,
  isSafari,
  isIOSInAppOrChrome,
  copyToClipboard,
} from '@/lib/utils/platform';
import { cn } from '@/lib/utils';
import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';

const STORAGE_KEY_DISMISSED_FOREVER = 'addToHomeScreen_dismissedForever';

interface AddToHomeScreenPopupProps {
  onClose?: () => void;
  forceShow?: boolean; // Force show popup (e.g. dashboard "Install app" when no deferred prompt)
}

/**
 * Install UX by platform:
 * - Android/Chrome: "Install app" only when deferred prompt exists; else browser menu instructions.
 * - iOS Safari: Share → Add to Home Screen instructions only.
 * - iOS in-app/Chrome: "Open in Safari" guidance + copy link, then Add to Home Screen steps.
 */
export default function AddToHomeScreenPopup({ onClose, forceShow = false }: AddToHomeScreenPopupProps) {
  const [show, setShow] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const { hasInstallPrompt, isInstalled, triggerInstall } = useInstallPrompt();

  const isIOS = isIOSDevice();
  const isIOSSafari = isIOS && isSafari();
  const isIOSInApp = isIOSInAppOrChrome();

  useEffect(() => {
    const shouldShow = () => {
      if (forceShow) return true;
      if (isCapacitorWebView() || isStandaloneMode() || isInstalled) return false;
      if (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY_DISMISSED_FOREVER) === 'true') return false;
      // Auto-show only on iOS (Safari or in-app) so we can show correct guidance
      if (isIOS) return true;
      return false;
    };

    if (shouldShow()) setShow(true);
  }, [forceShow, isInstalled, isIOS]);

  const closeAndMaybePersist = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_DISMISSED_FOREVER, 'true');
    }
    setShow(false);
    onClose?.();
  };

  const handleInstall = async () => {
    // Android/Chrome: use deferred prompt
    if (hasInstallPrompt) {
      await triggerInstall();
      closeAndMaybePersist();
      return;
    }

    // Android without prompt: just close (instructions already shown)
    closeAndMaybePersist();
  };

  const handleCopyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const ok = await copyToClipboard(url);
    setCopySuccess(ok);
    if (ok) setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleNotNow = () => {
    setShow(false);
    onClose?.();
  };

  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowAgain(checked);
    if (checked && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_DISMISSED_FOREVER, 'true');
    }
  };

  if (!show) return null;

  // --- Platform-specific content ---

  // A) Android/Chrome: real Install button only when deferred prompt exists; else instructions
  const isAndroidChrome = !isIOS;
  const showAndroidInstallButton = isAndroidChrome && hasInstallPrompt;
  const showAndroidInstructions = isAndroidChrome && !hasInstallPrompt;

  // B) iOS Safari: instructions only (no install API on iOS)
  // C) iOS in-app/Chrome: Open in Safari step + copy link, then instructions

  const primaryButtonText = showAndroidInstallButton
    ? 'Install app'
    : isIOSSafari
      ? 'Got it'
      : isIOSInApp
        ? (copySuccess ? 'Got it' : 'Copy link')
        : showAndroidInstructions
          ? 'Got it'
          : 'Got it';

  const primaryAction = showAndroidInstallButton
    ? handleInstall
    : isIOSInApp && !copySuccess
      ? handleCopyLink
      : closeAndMaybePersist;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in pointer-events-none" />
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[9999] pointer-events-auto',
          'bg-white rounded-t-2xl shadow-2xl',
          'animate-in slide-in-from-bottom duration-300',
          'max-w-md mx-auto'
        )}
        dir="ltr"
      >
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold text-[var(--navy)] text-center">
            Install LingoTheory
          </h2>

          <div className="space-y-3">
            <p className="text-base text-[var(--muted-text)] text-center leading-relaxed">
              Add LingoTheory to your home screen for quick access.
            </p>

            {/* A) Android/Chrome – no deferred prompt: browser menu instructions */}
            {showAndroidInstructions && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                  Use the browser menu → <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                </p>
              </div>
            )}

            {/* B) iOS Safari: Share → Add to Home Screen */}
            {isIOSSafari && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                  Tap the <strong>Share</strong> icon (square with arrow) → <strong>Add to Home Screen</strong> → <strong>Add</strong>.
                </p>
              </div>
            )}

            {/* C) iOS in-app or Chrome: Open in Safari first */}
            {isIOSInApp && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                  Add to Home Screen is only available in <strong>Safari</strong>. Open this page in Safari first.
                </p>
                <ol className="text-sm text-[var(--muted-text)] list-decimal list-inside space-y-1 text-left">
                  <li>Tap <strong>Copy link</strong> below (or use this browser’s menu → Open in Safari).</li>
                  <li>Paste the link in Safari and go to the page.</li>
                  <li>In Safari: Share → Add to Home Screen → Add.</li>
                </ol>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            {(showAndroidInstallButton || isIOSSafari || isIOSInApp || showAndroidInstructions) && (
              <button
                onClick={primaryAction}
                className={cn(
                  'w-full py-3 rounded-xl',
                  'bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]',
                  'text-white font-semibold text-base',
                  'hover:from-red-700 hover:to-red-800',
                  'transition-all duration-200 shadow-lg hover:shadow-xl',
                  'active:scale-[0.98]'
                )}
              >
                {primaryButtonText}
              </button>
            )}

            <button
              onClick={handleNotNow}
              className={cn(
                'w-full py-2.5 rounded-xl',
                'border-2 border-[var(--primary-red)]',
                'bg-white text-[var(--primary-red)]',
                'font-medium text-sm',
                'hover:bg-red-50',
                'transition-all duration-200',
                'active:scale-[0.98]'
              )}
            >
              Not now
            </button>

            <label className="flex items-center justify-center gap-2 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => handleDontShowAgainChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[var(--primary-red)] focus:ring-[var(--primary-red)]"
              />
              <span className="text-xs text-[var(--muted-text)]">Don&apos;t show again</span>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
