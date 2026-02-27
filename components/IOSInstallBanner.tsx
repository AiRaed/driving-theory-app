'use client';

import { useState, useEffect } from 'react';
import { isIOSDevice, isSafari, isStandaloneMode, isCapacitorWebView } from '@/lib/utils/platform';

const STORAGE_KEY = 'ios_install_banner_dismissed';

export default function IOSInstallBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isCapacitorWebView() || isStandaloneMode()) return;
    if (!isIOSDevice() || !isSafari()) return;
    if (localStorage.getItem(STORAGE_KEY) === 'true') return;
    setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (_) {}
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[9997] safe-area-pb bg-[var(--navy)] text-white text-center py-2.5 px-4 shadow-lg flex items-center justify-center gap-3"
      role="banner"
    >
      <span className="text-sm">
        To install: <strong>Share</strong> → <strong>Add to Home Screen</strong>
      </span>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 p-1.5 rounded-md hover:bg-white/20 transition-colors"
        aria-label="Dismiss"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
