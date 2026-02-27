'use client';

import { useState, useEffect } from 'react';
import {
  isStandaloneMode,
  isCapacitorWebView,
  isIOSDevice,
  isSafari,
  isIOSInAppOrChrome,
  copyToClipboard,
  CANONICAL_APP_URL,
} from '@/lib/utils/platform';
import { cn } from '@/lib/utils';
import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';

const STORAGE_KEY_DISMISSED_FOREVER = 'addToHomeScreen_dismissedForever';

interface AddToHomeScreenPopupProps {
  onClose?: () => void;
  forceShow?: boolean; // Force show popup (e.g. dashboard "Install app" when no deferred prompt)
}

/**
 * Install UX by platform (no programmatic install or Share sheet on iOS):
 * - iOS Safari: Short instructions only. Button: Close.
 * - iOS in-app: Copy link (canonical URL) + instructions to open in Safari. Buttons: Copy link, Close.
 * - Android Chrome: "Install app" if beforeinstallprompt captured; else browser menu instructions.
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
    const ok = await copyToClipboard(CANONICAL_APP_URL);
    setCopySuccess(ok);
    if (ok) setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleClose = () => {
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

  const isAndroidChrome = !isIOS;
  const showAndroidInstallButton = isAndroidChrome && hasInstallPrompt;
  const showAndroidInstructions = isAndroidChrome && !hasInstallPrompt;

  // iOS Safari: single "Close" button. iOS in-app: "Copy link" + "Close". Android: "Install app" or "Close" + "Close".
  const primaryButtonText = showAndroidInstallButton
    ? 'Install app'
    : isIOSInApp
      ? (copySuccess ? 'Copied' : 'Copy link')
      : showAndroidInstructions
        ? 'Close'
        : 'Close';

  const primaryAction = showAndroidInstallButton
    ? handleInstall
    : isIOSInApp && !copySuccess
      ? handleCopyLink
      : closeAndMaybePersist;

  // iOS Safari: only one button "Close". Other platforms may show primary + Close.
  const showPrimaryButton = showAndroidInstallButton || isIOSInApp || showAndroidInstructions;

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

            {/* Android/Chrome – no deferred prompt: browser Install banner/menu instructions */}
            {showAndroidInstructions && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                  Use the browser <strong>Install</strong> banner or menu → <strong>Install app</strong> / <strong>Add to Home screen</strong>.
                </p>
              </div>
            )}

            {/* iOS Safari: short instructions only */}
            {isIOSSafari && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                  Tap <strong>Share</strong> → <strong>Add to Home Screen</strong> → <strong>Add</strong>.
                </p>
              </div>
            )}

            {/* iOS in-app (WhatsApp, Instagram, Facebook, etc.): Safari-only message + Copy link */}
            {isIOSInApp && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                  Add to Home Screen works only in Safari. Copy the link, open Safari app, paste it, then Share → Add to Home Screen.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2">
            {showPrimaryButton && (
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
              onClick={handleClose}
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
              Close
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
