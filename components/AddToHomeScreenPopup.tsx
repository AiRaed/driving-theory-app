'use client';

import { useState, useEffect } from 'react';
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
  const [isIOS, setIsIOS] = useState(false);

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

    // Detect iOS
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      setIsIOS(/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream);
    }

    // Show popup if conditions are met
    if (shouldShow()) {
      setShow(true);
    }
  }, []);

  const handleGotIt = () => {
    // Dismiss for 7 days
    if (typeof window !== 'undefined') {
      const dismissedUntil = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      localStorage.setItem(STORAGE_KEY_DISMISSED_UNTIL, dismissedUntil.toString());
    }
    setShow(false);
    onClose?.();
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
        dir="rtl"
      >
        <div className="p-6 space-y-4">
          {/* Title */}
          <h2 className="text-xl font-bold text-[var(--navy)] text-center">
            ثبّت LingoTheory على موبايلك
          </h2>

          {/* Body */}
          <div className="space-y-3">
            <p className="text-base text-[var(--muted-text)] text-center leading-relaxed">
              خليه مثل تطبيق وافتحه بكبسة واحدة من الشاشة الرئيسية.
            </p>

            {/* iOS specific instructions */}
            {isIOS && (
              <p className="text-sm text-[var(--muted-text)]/80 text-center leading-relaxed">
                على الآيفون: اضغط زر المشاركة ⬆️ ثم اختر Add to Home Screen
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleGotIt}
              className={cn(
                'w-full py-3 rounded-xl',
                'bg-gradient-to-r from-[var(--primary-red)] to-[#C10500]',
                'text-white font-semibold text-base',
                'hover:from-red-700 hover:to-red-800',
                'transition-all duration-200 shadow-lg hover:shadow-xl',
                'active:scale-[0.98]'
              )}
            >
              فهمت
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
              لاحقًا
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
              لا تظهر مرة ثانية
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

