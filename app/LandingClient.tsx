'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useInstallPrompt } from '@/lib/hooks/useInstallPrompt';
import { isAndroidChrome, isCapacitorWebView, isIOSDevice, isStandaloneMode } from '@/lib/utils/platform';

export default function LandingClient() {
  return (
    <div className="flex w-full flex-col items-stretch gap-3">
      <Link
        href="/practice"
        className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--lingo-red)] px-6 text-base font-bold text-white"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="currentColor"><path d="M8 5.5v13l11-6.5-11-6.5Z" /></svg>
        Start Practising
      </Link>
      <Link
        href="/download"
        className="inline-flex min-h-[54px] w-full items-center justify-center gap-2 rounded-xl border border-white/80 bg-transparent px-6 text-base font-bold text-white"
      >
        <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4v10M8 10l4 4 4-4M5 19h14" strokeLinecap="round" strokeLinejoin="round" /></svg>
        Download App
      </Link>
    </div>
  );
}

export function AndroidInstallHeroCta() {
  const [eligible, setEligible] = useState(false);
  const { hasInstallPrompt, isInstalled, triggerInstall } = useInstallPrompt();

  useEffect(() => {
    setEligible(isAndroidChrome() && !isStandaloneMode() && !isCapacitorWebView() && !isIOSDevice());
  }, []);

  if (!eligible || isInstalled) return null;

  return (
    <div className="mt-3 flex flex-col items-center gap-1.5">
      <button type="button" onClick={() => void triggerInstall()} className="lt-btn-ghost px-5 py-2 text-sm">
        Install app
      </button>
      {!hasInstallPrompt ? (
        <p className="px-2 text-center text-xs text-[var(--text-secondary)]">Use browser menu → Install app</p>
      ) : null}
    </div>
  );
}
