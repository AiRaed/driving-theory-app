'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const SKIP_PREFIXES = ['/choose-language', '/auth', '/admin'];
const PUBLIC_EXACT = ['/', '/terms', '/privacy', '/support'];
const LEARNER_PREFIXES = ['/dashboard', '/practice', '/mock-test', '/choose-language'];

export default function LanguageGate({ children }: { children: React.ReactNode }) {
  const { ready, needsOnboarding } = useLanguage();
  const pathname = usePathname() || '/';
  const router = useRouter();

  const skip =
    SKIP_PREFIXES.some((p) => pathname.startsWith(p)) || PUBLIC_EXACT.includes(pathname);
  const isLearnerPath = LEARNER_PREFIXES.some((p) => pathname.startsWith(p));
  const redirecting = ready && needsOnboarding && !skip;

  useEffect(() => {
    if (!redirecting) return;
    const next = pathname.startsWith('/dashboard') ? '' : pathname;
    const url = next ? `/choose-language?next=${encodeURIComponent(next)}` : '/choose-language';
    router.replace(url);
  }, [redirecting, pathname, router]);

  if (!ready && isLearnerPath) {
    return null;
  }

  if (redirecting) {
    return null;
  }

  return <>{children}</>;
}
