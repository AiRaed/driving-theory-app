'use client';

import { useState, useEffect } from 'react';
import { isStandaloneMode, isCapacitorWebView, isIOSDevice, isSafari } from '@/lib/utils/platform';
import { cn } from '@/lib/utils';
import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';

const STORAGE_KEY_DISMISSED_FOREVER = 'addToHomeScreen_dismissedForever';

interface AddToHomeScreenPopupProps {
  onClose?: () => void;
  forceShow?: boolean; // Force show popup (for fallback mode from persistent button)
}

export default function AddToHomeScreenPopup({ onClose, forceShow = false }: AddToHomeScreenPopupProps) {
  const [show, setShow] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { hasInstallPrompt, isInstalled, triggerInstall } = useInstallPrompt();
  const isIOS = isIOSDevice();
  const hasWebShare = typeof window !== 'undefined' && 'share' in navigator;

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
    // iOS: Use Web Share API if available
    if (isIOS) {
      if (hasWebShare) {
        try {
          await navigator.share({
            title: 'LingoTheory',
            url: window.location.href
          });
          // Keep popup open after share closes (do NOT redirect)
        } catch (error) {
          // User cancelled or error occurred - keep popup open
        }
      }
      // If no Web Share API, no button is shown (instructions only)
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

  if (!show) {
    return null;
  }

  // Determine primary button text and action
  const primaryButtonText = isIOS 
    ? (hasWebShare ? 'Open Share Menu' : null)
    : hasInstallPrompt 
      ? 'Install app' 
      : 'Close';

  // Determine if we should show instructions in popup
  const showInstructions = !isIOS && !hasInstallPrompt;
  
  // iOS instructions text
  const iosInstructionsText = hasWebShare
    ? 'After the share sheet opens, scroll and tap "Add to Home Screen", then tap "Add".'
    : 'Tap the Share icon → Add to Home Screen';

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

            {/* iOS Instructions */}
            {isIOS && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                  {iosInstructionsText}
                </p>
              </div>
            )}

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
            {/* Primary Button - Only show if not iOS without Web Share */}
            {primaryButtonText && (
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
            )}

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

    </>
  );
}
