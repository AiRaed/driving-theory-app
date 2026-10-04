'use client';

import Link from 'next/link';
import { CONTENT_MAINTENANCE_MESSAGE } from '@/lib/maintenance/contentMaintenance';

type ContentMaintenanceNoticeProps = {
  /** Compact card for dashboard; full page block for Practice/Mock/Paywall */
  variant?: 'card' | 'page' | 'inline';
  showDashboardLink?: boolean;
};

export default function ContentMaintenanceNotice({
  variant = 'page',
  showDashboardLink = true,
}: ContentMaintenanceNoticeProps) {
  if (variant === 'inline') {
    return (
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed text-center">
        {CONTENT_MAINTENANCE_MESSAGE}
      </p>
    );
  }

  if (variant === 'card') {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--lingo-red)] mb-2">
          Temporarily unavailable
        </p>
        <p className="text-sm text-[var(--text-primary)] leading-relaxed">
          {CONTENT_MAINTENANCE_MESSAGE}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10 bg-[var(--background)]">
      <div className="lt-card max-w-md w-full p-6 sm:p-8 text-center space-y-4">
        <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
          Content update in progress
        </h1>
        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
          {CONTENT_MAINTENANCE_MESSAGE}
        </p>
        {showDashboardLink ? (
          <Link href="/dashboard" className="lt-btn-secondary inline-flex px-5 py-2.5 text-sm">
            Back to dashboard
          </Link>
        ) : null}
      </div>
    </div>
  );
}
