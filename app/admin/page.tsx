'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type Stats = {
  total: number;
  published: number;
  drafts: number;
  archived: number;
  withImages: number;
  missingArabic: number;
  missingUrdu: number;
  needsReview: number;
  topics: number;
  tableReady?: boolean;
  message?: string;
  translationCounts?: Record<string, number>;
  recent?: Array<{
    id: string;
    question_en: string;
    topic_id: string;
    status: string;
    updated_at: string;
  }>;
};

type AnalyticsOverview = {
  cards: {
    total_users: number;
    active_7d: number;
    questions_answered: number;
    mock_tests_started: number;
    mock_tests_completed: number;
    checkout_clicks: number;
  };
  funnel: {
    registered: number;
    started_practice: number;
    reached_free_limit: number;
    viewed_paywall: number;
    clicked_checkout: number;
    purchased: number;
  };
};

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="lt-card p-4">
      <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </p>
      <p className="text-2xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{value}</p>
      {hint ? <p className="text-xs text-[var(--text-secondary)] mt-1">{hint}</p> : null}
    </div>
  );
}

function pct(part: number, whole: number): string {
  if (!whole || whole <= 0) return '—';
  return `${Math.round((part / whole) * 1000) / 10}%`;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed to load stats');
        setStats(data);
      })
      .catch((e) => setError(e.message));

    fetch('/api/admin/analytics/overview')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed to load analytics');
        setAnalytics(data);
      })
      .catch((e) => setAnalyticsError(e.message));
  }, []);

  const funnel = analytics?.funnel;
  const cards = analytics?.cards;

  const funnelSteps = funnel
    ? [
        { key: 'registered', label: 'Registered', count: funnel.registered },
        { key: 'started_practice', label: 'Started Practice', count: funnel.started_practice },
        { key: 'reached_free_limit', label: 'Reached Free Limit', count: funnel.reached_free_limit },
        { key: 'viewed_paywall', label: 'Viewed Paywall', count: funnel.viewed_paywall },
        { key: 'clicked_checkout', label: 'Clicked Checkout', count: funnel.clicked_checkout },
        { key: 'purchased', label: 'Purchased', count: funnel.purchased },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="lt-kicker mb-1">Content</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Question Bank Admin</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage topics, translations, and images without editing source code.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/users" className="lt-btn-secondary px-4 py-2.5 text-sm">
            Users
          </Link>
          <Link href="/admin/questions" className="lt-btn-primary px-4 py-2.5 text-sm">
            Manage Questions
          </Link>
          <Link href="/admin/questions/new" className="lt-btn-secondary px-4 py-2.5 text-sm">
            Add Question
          </Link>
        </div>
      </div>

      {(error || analyticsError) && (
        <div className="rounded-[var(--radius-md)] border border-[var(--wrong)]/30 bg-[var(--wrong-soft)] px-4 py-3 text-sm text-[var(--wrong)] space-y-1">
          {error ? <p>{error}</p> : null}
          {analyticsError ? <p>{analyticsError}</p> : null}
        </div>
      )}

      <section className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="lt-kicker mb-1">Analytics</p>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">User overview</h2>
          </div>
          <Link href="/admin/users" className="text-sm font-medium text-[var(--lingo-red)] hover:underline">
            View all users →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard label="Total users" value={cards?.total_users ?? '—'} />
          <StatCard label="Active 7d" value={cards?.active_7d ?? '—'} />
          <StatCard label="Questions answered" value={cards?.questions_answered ?? '—'} />
          <StatCard label="Started Practice" value={funnel?.started_practice ?? '—'} />
          <StatCard label="Free limit" value={funnel?.reached_free_limit ?? '—'} />
          <StatCard label="Mock started" value={cards?.mock_tests_started ?? '—'} />
          <StatCard label="Mock completed" value={cards?.mock_tests_completed ?? '—'} />
          <StatCard label="Checkout clicks" value={cards?.checkout_clicks ?? '—'} />
          <StatCard label="Paid" value={funnel?.purchased ?? '—'} />
        </div>

        <div className="lt-card p-4 sm:p-5">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Conversion funnel</h3>
          {!funnel ? (
            <p className="text-sm text-[var(--text-secondary)]">
              {analyticsError ? 'Could not load funnel.' : 'Loading funnel…'}
            </p>
          ) : (
            <ol className="space-y-0">
              {funnelSteps.map((step, i) => {
                const prev = i === 0 ? null : funnelSteps[i - 1].count;
                const ofPrev = prev == null ? null : pct(step.count, prev);
                const ofReg = pct(step.count, funnel.registered);
                return (
                  <li
                    key={step.key}
                    className="flex flex-wrap items-center justify-between gap-2 py-2.5 border-b border-[var(--border)] last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[11px] font-bold tabular-nums text-[var(--text-secondary)] w-5">
                        {i + 1}
                      </span>
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {step.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3 text-sm tabular-nums">
                      <span className="font-bold text-[var(--text-primary)]">{step.count}</span>
                      {i === 0 ? (
                        <span className="text-xs text-[var(--text-secondary)]">100% of registered</span>
                      ) : (
                        <>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {ofPrev} of previous
                          </span>
                          <span className="text-xs text-[var(--text-secondary)]">
                            {ofReg} of registered
                          </span>
                        </>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </section>

      {stats && stats.tableReady === false && (
        <div className="rounded-[var(--radius-md)] border border-[var(--warning)]/40 bg-[var(--warning-soft)] px-4 py-3 text-sm text-[var(--text-primary)]">
          <p className="font-semibold">Database not ready yet</p>
          <p className="mt-1 text-[var(--text-secondary)]">
            Apply migration <code className="text-xs">0004_question_bank.sql</code> in Supabase, set{' '}
            <code className="text-xs">ADMIN_EMAIL</code>, then run the import script. Learners still use the
            static 742-question bank until then.
          </p>
          {stats.message ? <p className="mt-2 text-xs opacity-80">{stats.message}</p> : null}
        </div>
      )}

      <section className="space-y-3">
        <div>
          <p className="lt-kicker mb-1">Question bank</p>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">Content stats</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard label="Total questions" value={stats?.total ?? '—'} />
          <StatCard label="Published" value={stats?.published ?? '—'} />
          <StatCard label="Drafts" value={stats?.drafts ?? '—'} />
          <StatCard label="Topics" value={stats?.topics ?? 14} />
          <StatCard label="With images" value={stats?.withImages ?? '—'} />
          <StatCard label="Missing Arabic" value={stats?.missingArabic ?? '—'} />
          <StatCard label="Missing Urdu" value={stats?.missingUrdu ?? '—'} />
          <StatCard label="Needs review" value={stats?.needsReview ?? '—'} hint="Flags only — not auto-fixed" />
        </div>
      </section>

      {stats?.translationCounts && Object.keys(stats.translationCounts).length > 0 && (
        <div className="lt-card p-4">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">Translations by language</h2>
          <div className="flex flex-wrap gap-3 text-sm text-[var(--text-secondary)]">
            {Object.entries(stats.translationCounts)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([code, n]) => (
                <span key={code} className="tabular-nums">
                  <strong className="text-[var(--text-primary)]">{code.toUpperCase()}</strong>: {n}
                </span>
              ))}
          </div>
        </div>
      )}

      <div className="lt-card p-4 sm:p-5">
        <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">Recent changes</h2>
        {!stats?.recent?.length ? (
          <p className="text-sm text-[var(--text-secondary)]">No recent edits yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {stats.recent.map((r) => (
              <li key={r.id} className="py-2.5 flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <Link
                    href={`/admin/questions/${encodeURIComponent(r.id)}`}
                    className="text-sm font-medium text-[var(--text-primary)] hover:text-[var(--lingo-red)] line-clamp-1"
                  >
                    {r.id}: {r.question_en}
                  </Link>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {r.topic_id} · {r.status} · {new Date(r.updated_at).toLocaleString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
