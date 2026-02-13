'use client';

import { useState, useEffect } from 'react';
import { isMobileDevice, isStandaloneMode, isCapacitorWebView, isIOSDevice, isSafari, copyToClipboard } from '@/lib/utils/platform';
import { cn } from '@/lib/utils';
import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';

const STORAGE_KEY_DISMISSED_FOREVER = 'addToHomeScreen_dismissedForever';

interface AddToHomeScreenPopupProps {
  onClose?: () => void;
  forceShow?: boolean; // Force show popup (for fallback mode from persistent button)
}

/**
 * iOS Instructions Overlay Component
 * Full-screen overlay with step-by-step instructions and visual arrow indicator
 */
function IOSInstructionsOverlay({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      {/* Backdrop - pointer-events: none to allow touches to pass through to Safari UI */}
      <div
        className="fixed inset-0 bg-black/70 z-[10000] animate-in fade-in pointer-events-none"
      />

      {/* Overlay Content - pointer-events: auto to capture clicks on the popup */}
      <div
        className={cn(
          'fixed inset-0 z-[10001] pointer-events-none',
          'flex flex-col items-center justify-center',
          'px-6 py-8'
        )}
        onClick={(e) => {
          // Only close if clicking outside the popup card
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <h2 className="text-2xl font-bold text-[var(--navy)] text-center">
            Add to Home Screen
          </h2>

          {/* Instructions */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary-red)] text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <p className="text-base text-[var(--muted-text)] leading-relaxed pt-1">
                Tap the <strong>Share</strong> icon (square with arrow) in Safari
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary-red)] text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <p className="text-base text-[var(--muted-text)] leading-relaxed pt-1">
                Scroll and tap <strong>"Add to Home Screen"</strong>
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary-red)] text-white flex items-center justify-center font-bold text-sm">
                3
              </div>
              <p className="text-base text-[var(--muted-text)] leading-relaxed pt-1">
                Tap <strong>"Add"</strong>
              </p>
            </div>
          </div>

          {/* Visual Indicator - Arrow pointing to bottom center */}
          <div className="relative mt-6 pt-8 border-t border-gray-200">
            <div className="flex flex-col items-center">
              <div className="text-4xl mb-2">👇</div>
              <div className="text-sm text-[var(--muted-text)] font-medium">
                Look for the Share button at the bottom
              </div>
              {/* Arrow pointing down */}
              <div className="mt-4 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-[var(--primary-red)]"></div>
            </div>
          </div>

          {/* Copy Link Fallback Button */}
          <button
            onClick={handleCopyLink}
            className={cn(
              'w-full py-2.5 rounded-xl',
              'border-2 border-[var(--primary-red)]',
              'bg-white text-[var(--primary-red)]',
              'font-medium text-sm',
              'hover:bg-red-50',
              'transition-all duration-200',
              'active:scale-[0.98]',
              copied && 'bg-green-50 border-green-500 text-green-700'
            )}
          >
            {copied ? '✓ Copied!' : 'Copy link'}
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className={cn(
              'w-full py-3 rounded-xl',
              'bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]',
              'text-white font-semibold text-base',
              'hover:from-red-700 hover:to-red-800',
              'transition-all duration-200 shadow-lg hover:shadow-xl',
              'active:scale-[0.98]'
            )}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

export default function AddToHomeScreenPopup({ onClose, forceShow = false }: AddToHomeScreenPopupProps) {
  const [show, setShow] = useState(false);
  const [showIOSOverlay, setShowIOSOverlay] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { hasInstallPrompt, isInstalled, triggerInstall } = useInstallPrompt();
  const isIOS = isIOSDevice();

  useEffect(() => {
    // Check if we should show the popup
    const shouldShow = () => {
      // Force show if requested (for fallback mode)
      if (forceShow) {
        return true;
      }

      // Only show on iOS Safari (not Chrome iOS, not in-app browsers, not Capacitor webview)
      if (!isSafari()) {
        return false;
      }

      // Don't show in Capacitor WebView
      if (isCapacitorWebView()) {
        return false;
      }

      // Don't show if already installed (standalone mode)
      if (isStandaloneMode() || isInstalled) {
        return false;
      }

      // Check if dismissed forever
      if (typeof window !== 'undefined') {
        const dismissedForever = localStorage.getItem(STORAGE_KEY_DISMISSED_FOREVER);
        if (dismissedForever === 'true') {
          return false;
        }
      }

      return true;
    };

    // Show popup if conditions are met
    if (shouldShow()) {
      setShow(true);
    }
  }, [forceShow, isInstalled]);

  const handleInstall = async () => {
    // iOS: Show instructions overlay instead of trying to install
    if (isIOS) {
      setShowIOSOverlay(true);
      return;
    }

    // Android/Chromium: Use native install prompt if available
    if (hasInstallPrompt) {
      const result = await triggerInstall();
      // Close popup after user choice (accepted or dismissed)
      if (dontShowAgain) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_DISMISSED_FOREVER, 'true');
        }
      }
      setShow(false);
      onClose?.();
    } else {
      // No native prompt available - show instructions
      // For Android non-Chrome browsers
      if (typeof window !== 'undefined') {
        // Just close and let user know to use browser menu
        if (dontShowAgain) {
          localStorage.setItem(STORAGE_KEY_DISMISSED_FOREVER, 'true');
        }
      }
      setShow(false);
      onClose?.();
    }
  };

  const handleNotNow = () => {
    // Just close without persisting
    setShow(false);
    onClose?.();
  };

  const handleDontShowAgainChange = (checked: boolean) => {
    setDontShowAgain(checked);
    if (checked && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_DISMISSED_FOREVER, 'true');
    }
  };

  const handleCloseIOSOverlay = () => {
    setShowIOSOverlay(false);
    // Close main popup after viewing instructions
    // "Don't show again" is already persisted if checked
    setShow(false);
    onClose?.();
  };

  if (!show) {
    return null;
  }

  // Determine primary button text and action
  const primaryButtonText = isIOS 
    ? 'Show me how' 
    : hasInstallPrompt 
      ? 'Install app' 
      : 'Close';

  // Determine if we should show instructions in popup (for non-iOS, non-Chrome browsers)
  const showInstructions = !isIOS && !hasInstallPrompt;

  return (
    <>
      {/* Backdrop - pointer-events: none to allow touches to pass through to Safari UI */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in pointer-events-none"
      />

      {/* Popup - pointer-events: auto to capture clicks on the popup itself */}
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
          {/* Title */}
          <h2 className="text-xl font-bold text-[var(--navy)] text-center">
            Install LingoTheory
          </h2>

          {/* Body */}
          <div className="space-y-3">
            <p className="text-base text-[var(--muted-text)] text-center leading-relaxed">
              Add LingoTheory to your home screen for quick access.
            </p>

            {/* Instructions - shown for Android non-Chrome browsers */}
            {showInstructions && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                  Open the browser menu and tap "Install app" or "Add to Home screen"
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            {/* Primary Button */}
            <button
              onClick={handleInstall}
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

            {/* Secondary Button - Not now */}
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

            {/* Don't show again checkbox */}
            <label className="flex items-center justify-center gap-2 py-2 cursor-pointer">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => handleDontShowAgainChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[var(--primary-red)] focus:ring-[var(--primary-red)]"
              />
              <span className="text-xs text-[var(--muted-text)]">
                Don't show again
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* iOS Instructions Overlay */}
      {showIOSOverlay && <IOSInstructionsOverlay onClose={handleCloseIOSOverlay} />}
    </>
  );
}
