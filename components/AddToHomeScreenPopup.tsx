'use client';

import { useState, useEffect, useRef } from 'react';
import { isMobileDevice, isStandaloneMode, isCapacitorWebView } from '@/lib/utils/platform';
import { cn } from '@/lib/utils';

const STORAGE_KEY_DISMISSED_UNTIL = 'addToHomeScreen_dismissedUntil';
const STORAGE_KEY_DISMISSED_FOREVER = 'addToHomeScreen_dismissedForever';
const STORAGE_KEY_INSTALLED = 'addToHomeScreen_installed';

interface AddToHomeScreenPopupProps {
  onClose?: () => void;
}

export default function AddToHomeScreenPopup({ onClose }: AddToHomeScreenPopupProps) {
  const [show, setShow] = useState(false);
  const [hasInstallPrompt, setHasInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    // Check if we should show the popup
    const shouldShow = () => {
      // Don't show on desktop
      if (!isMobileDevice()) {
        return false;
      }

      // Don't show in Capacitor WebView
      if (isCapacitorWebView()) {
        return false;
      }

      // Don't show if already installed (standalone mode)
      if (isStandaloneMode()) {
        // Mark as installed in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY_INSTALLED, 'true');
        }
        return false;
      }

      // Check if already installed (from localStorage)
      if (typeof window !== 'undefined') {
        const installed = localStorage.getItem(STORAGE_KEY_INSTALLED);
        if (installed === 'true') {
          return false;
        }
      }

      // Check if dismissed forever
      if (typeof window !== 'undefined') {
        const dismissedForever = localStorage.getItem(STORAGE_KEY_DISMISSED_FOREVER);
        if (dismissedForever === 'true') {
          return false;
        }
      }

      // Check if dismissed until a future date
      if (typeof window !== 'undefined') {
        const dismissedUntil = localStorage.getItem(STORAGE_KEY_DISMISSED_UNTIL);
        if (dismissedUntil) {
          const timestamp = parseInt(dismissedUntil, 10);
          if (!isNaN(timestamp) && Date.now() < timestamp) {
            return false;
          }
        }
      }

      return true;
    };

    // Detect platform
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream);
      setIsAndroid(/Android/.test(userAgent));
    }

    // Listen for beforeinstallprompt event (universal PWA install prompt)
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the default mini-infobar from appearing
      e.preventDefault();
      // Store the event so it can be triggered later
      deferredPromptRef.current = e;
      setHasInstallPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      // Mark as installed
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_INSTALLED, 'true');
      }
      setShow(false);
      deferredPromptRef.current = null;
      setHasInstallPrompt(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    // Show popup if conditions are met
    if (shouldShow()) {
      setShow(true);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, []);

  const handleInstall = async () => {
    // If browser supports native install prompt, use it
    if (deferredPromptRef.current) {
      try {
        // Show the install prompt
        const promptEvent = deferredPromptRef.current as any;
        await promptEvent.prompt();
        
        // Wait for the user to respond
        const { outcome } = await promptEvent.userChoice;
        
        // Clear the stored prompt
        deferredPromptRef.current = null;
        setHasInstallPrompt(false);
        
        // Close popup regardless of outcome
        setShow(false);
        onClose?.();
      } catch (error) {
        console.error('Install prompt error:', error);
        // If prompt fails, just close
        setShow(false);
        onClose?.();
      }
    } else {
      // No native prompt available - just close (instructions are already shown)
      setShow(false);
      onClose?.();
    }
  };

  const handleLater = () => {
    // Dismiss for 24 hours
    if (typeof window !== 'undefined') {
      const dismissedUntil = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      localStorage.setItem(STORAGE_KEY_DISMISSED_UNTIL, dismissedUntil.toString());
    }
    setShow(false);
    onClose?.();
  };

  const handleDontShowAgain = () => {
    // Dismiss forever
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_DISMISSED_FOREVER, 'true');
    }
    setShow(false);
    onClose?.();
  };

  if (!show) {
    return null;
  }

  // Determine button text and behavior
  const showInstructions = !hasInstallPrompt;
  const primaryButtonText = hasInstallPrompt ? 'Install app' : 'Close';

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998] animate-in fade-in"
        onClick={handleLater}
      />

      {/* Popup */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 z-[9999]',
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

            {/* Instructions - shown when native prompt is NOT available */}
            {showInstructions && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                {isIOS ? (
                  <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                    Tap the Share icon → Add to Home Screen
                  </p>
                ) : isAndroid ? (
                  <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                    Open the browser menu and tap "Add to Home screen" or "Install app"
                  </p>
                ) : (
                  <p className="text-sm text-[var(--muted-text)] text-center leading-relaxed">
                    Open the browser menu and look for "Add to Home screen" or "Install app"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
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

            <button
              onClick={handleLater}
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
              Later
            </button>

            <button
              onClick={handleDontShowAgain}
              className={cn(
                'w-full py-2 rounded-lg',
                'text-[var(--muted-text)] text-xs',
                'hover:text-[var(--navy)]',
                'transition-colors duration-200'
              )}
            >
              Don't show again
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
