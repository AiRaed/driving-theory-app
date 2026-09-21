'use client';

import { useEffect, useState } from 'react';
import { gaEvent } from '@/lib/ga';
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/lib/storeLinks';
import {
  detectStoreAudiencePlatform,
  isCapacitorWebView,
  type StoreAudiencePlatform,
} from '@/lib/utils/platform';

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.18 23.71c-.11.05-.22.06-.33.04a.77.77 0 0 1-.5-.35.8.8 0 0 1-.1-.55V1.15c0-.2.07-.39.2-.54.15-.17.35-.27.57-.28.12 0 .24.02.35.08l14.7 8.35c.18.1.32.26.4.45.08.2.08.41 0 .61-.08.19-.22.35-.4.45L3.18 23.71zM6.4 6.48v11.04L14.4 12 6.4 6.48z" />
    </svg>
  );
}

/**
 * Device-aware App Store / Google Play CTAs for the public Landing Page.
 * Hidden inside the installed Capacitor app.
 */
export default function StoreDownloadCta() {
  const [platform, setPlatform] = useState<StoreAudiencePlatform | null>(null);
  const [inNativeApp, setInNativeApp] = useState(false);

  useEffect(() => {
    setInNativeApp(isCapacitorWebView());
    setPlatform(detectStoreAudiencePlatform());
  }, []);

  if (inNativeApp || platform === null) {
    return null;
  }

  const showApple = platform === 'ios' || platform === 'desktop' || platform === 'unknown';
  const showGoogle =
    platform === 'android' || platform === 'desktop' || platform === 'unknown';

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-sm mt-2">
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--text-primary)]">
          Download LingoTheory free
        </p>
        <p className="text-xs text-[var(--text-secondary)] mt-0.5">
          Try before you pay
        </p>
      </div>

      <div className="flex flex-col gap-2.5 w-full">
        {showApple ? (
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              gaEvent('download_ios_clicked', {
                source_page: 'landing',
                detected_platform: platform,
              })
            }
            className="flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-md)] bg-[var(--navy)] px-4 py-3.5 text-white shadow-sm transition-opacity hover:opacity-95 active:opacity-90"
          >
            <AppleIcon className="h-6 w-6 flex-shrink-0" />
            <span className="text-sm font-semibold">Download on the App Store</span>
          </a>
        ) : null}

        {showGoogle ? (
          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              gaEvent('download_android_clicked', {
                source_page: 'landing',
                detected_platform: platform,
              })
            }
            className="flex w-full items-center justify-center gap-2.5 rounded-[var(--radius-md)] bg-[var(--lingo-red)] px-4 py-3.5 text-white shadow-sm transition-colors hover:bg-[var(--lingo-red-hover)] active:bg-[var(--lingo-red-dark)]"
          >
            <PlayIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-semibold">Get it on Google Play</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
