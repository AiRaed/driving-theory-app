'use client';

import Image from 'next/image';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { UI_EN } from '@/lib/i18n/ui-strings';

export default function HeaderClient() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 min-w-0 group"
            aria-label={UI_EN.homeAria}
          >
            <Image
              src="/logo-lingotheory.png"
              alt="LingoTheory logo"
              width={56}
              height={56}
              className="flex-shrink-0 h-10 w-10 sm:h-11 sm:w-auto transition-opacity group-hover:opacity-90"
              priority
            />
            <div className="hidden sm:flex flex-col min-w-0 border-l border-[var(--border)] pl-3">
              <span className="text-[13px] md:text-sm font-semibold text-[var(--text-primary)] leading-snug tracking-tight">
                {UI_EN.taglineTitle}
              </span>
              <span className="text-[11px] md:text-xs text-[var(--text-secondary)] leading-snug">
                {UI_EN.taglineSubtitle}
              </span>
            </div>
          </Link>
          <div className="sm:flex-shrink-0 min-w-0">
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}
