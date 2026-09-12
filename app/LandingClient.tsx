'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';
import {
  isAndroidChrome,
  isCapacitorWebView,
  isIOSDevice,
  isStandaloneMode,
} from '@/lib/utils/platform';
import { gaEvent } from '@/lib/ga';

function AndroidInstallHeroCta() {
  const [eligible, setEligible] = useState(false);
  const { hasInstallPrompt, isInstalled, triggerInstall } = useInstallPrompt();

  useEffect(() => {
    setEligible(
      isAndroidChrome() &&
        !isStandaloneMode() &&
        !isCapacitorWebView() &&
        !isIOSDevice()
    );
  }, []);

  if (!eligible || isInstalled) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-1.5 w-full max-w-sm mt-1">
      <button
        type="button"
        onClick={() => {
          void triggerInstall();
        }}
        className="lt-btn-ghost px-5 py-2 text-sm"
      >
        Install app
      </button>
      {!hasInstallPrompt ? (
        <p className="text-xs text-[var(--muted-text)] text-center px-2">
          Use browser menu → Install app
        </p>
      ) : null}
    </div>
  );
}

function DownloadAppCta({ className }: { className?: string }) {
  return (
    <Link
      href="/download"
      onClick={() => gaEvent('landing_download_app_clicked', { source: 'landing_hero' })}
      className={
        className ??
        'lt-btn-secondary px-10 py-3.5 text-[0.95rem] sm:text-base min-w-[240px] sm:min-w-[200px] w-full sm:w-auto'
      }
    >
      Download App
    </Link>
  );
}

export default function LandingClient() {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  if (user) {
    return (
      <div className="flex flex-col items-center gap-3 w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-lg">
          <Link
            href="/dashboard"
            className="lt-btn-primary px-10 py-3.5 text-[0.95rem] sm:text-base min-w-[240px] sm:min-w-[200px] w-full sm:w-auto shadow-[var(--shadow-sm)]"
          >
            Go to Dashboard
          </Link>
          <DownloadAppCta />
        </div>
        <AndroidInstallHeroCta />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-lg">
        <Link
          href="/auth"
          className="lt-btn-primary px-10 py-3.5 text-[0.95rem] sm:text-base min-w-[240px] sm:min-w-[200px] w-full sm:w-auto shadow-[var(--shadow-sm)]"
        >
          Log in / Get started
        </Link>
        <DownloadAppCta />
      </div>
      <AndroidInstallHeroCta />
      <Link
        href="/auth"
        className="text-sm text-[var(--text-secondary)] hover:text-[var(--lingo-red)] transition-colors font-medium"
      >
        Create account
      </Link>
    </div>
  );
}
