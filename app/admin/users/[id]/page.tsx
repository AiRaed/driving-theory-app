'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type {
  LearningSessionRow,
  UserLearningStatsRow,
} from '@/lib/analytics/types';

type TopicRow = {
  topic: string;
  attempted: number;
  correct: number;
  incorrect: number;
  accuracy: number | null;
};

type TimelineEvent = {
  kind: 'event';
  id: string;
  at: string;
  event_name: string;
  metadata: Record<string, unknown>;
};

type TimelineAttempt = {
  kind: 'attempt';
  id: string;
  at: string;
  question_id: string;
  topic: string | null;
  is_correct: boolean;
  mode: string;
  language: string | null;
  session_id: string;
};

type TimelineItem = TimelineEvent | TimelineAttempt;

type UserDetail = {
  profile: {
    id: string;
    email: string | null;
    access_level: string;
    free_questions_used: number;
    paid_at: string | null;
    updated_at: string;
    stripe_customer_id: string | null;
  };
  stats: UserLearningStatsRow | null;
  accuracy: number | null;
  topics: TopicRow[];
  timeline: TimelineItem[];
  sessions: LearningSessionRow[];
};

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return 'Never';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Never';
  const diffSec = Math.round((Date.now() - then) / 1000);
  if (diffSec < 60) return 'Just now';
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString();
}

function langLabel(code: string | null | undefined): string {
  if (!code) return '—';
  const map: Record<string, string> = {
    en: 'English',
    ar: 'Arabic',
    ur: 'Urdu',
  };
  return map[code] || code;
}

function eventLabel(name: string): string {
  return name.replace(/_/g, ' ');
}

function StatLine({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 py-2 border-b border-[var(--border)] last:border-0">
      <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
        {label}
      </span>
      <span className="text-sm font-medium text-[var(--text-primary)] tabular-nums text-right">
        {value}
      </span>
    </div>
  );
}

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const [data, setData] = useState<UserDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`/api/admin/users/${encodeURIComponent(id)}`)
      .then(async (r) => {
        const json = await r.json();
        if (!r.ok) throw new Error(json.error || 'Failed to load user');
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load user'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-sm text-[var(--text-secondary)]">Loading user…</p>;
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Link href="/admin/users" className="text-sm text-[var(--lingo-red)] hover:underline">
          ← Users
        </Link>
        <div className="rounded-[var(--radius-md)] border border-[var(--wrong)]/30 bg-[var(--wrong-soft)] px-4 py-3 text-sm text-[var(--wrong)]">
          {error}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { profile, stats, accuracy, topics, timeline, sessions } = data;
  const hasActivity = Boolean(stats?.last_activity_at) || (stats?.questions_attempted ?? 0) > 0;
  const mockSessions = sessions.filter((s) => s.mode === 'mock');

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link href="/admin/users" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--lingo-red)]">
            ← Users
          </Link>
          <p className="lt-kicker mt-2 mb-1">User detail</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] break-all">
            {profile.email || 'No email'}
          </h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mt-1 break-all">{profile.id}</p>
        </div>
      </div>

      {!hasActivity && (
        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface-secondary)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          No activity recorded yet for this user.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <section className="lt-card p-4 sm:p-5">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">Profile</h2>
          <StatLine label="Email" value={profile.email || '—'} />
          <StatLine
            label="Access"
            value={
              profile.access_level === 'paid' ? (
                <span className="text-[var(--correct)]">Paid</span>
              ) : (
                'Free'
              )
            }
          />
          <StatLine label="Paid at" value={formatDateTime(profile.paid_at)} />
          <StatLine label="Profile updated" value={formatDateTime(profile.updated_at)} />
          <StatLine
            label="Stripe customer"
            value={profile.stripe_customer_id || '—'}
          />
        </section>

        <section className="lt-card p-4 sm:p-5">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">Learning</h2>
          {!hasActivity ? (
            <p className="text-sm text-[var(--text-secondary)] py-2">No activity recorded yet.</p>
          ) : (
            <>
              <StatLine label="Questions attempted" value={stats?.questions_attempted ?? 0} />
              <StatLine label="Unique questions" value={stats?.unique_questions_attempted ?? 0} />
              <StatLine
                label="Correct / incorrect"
                value={`${stats?.correct_answers ?? 0} / ${stats?.incorrect_answers ?? 0}`}
              />
              <StatLine
                label="Accuracy"
                value={accuracy != null ? `${accuracy}%` : '—'}
              />
              <StatLine label="Practice sessions" value={stats?.practice_sessions ?? 0} />
              <StatLine
                label="First activity"
                value={formatDateTime(stats?.first_activity_at)}
              />
              <StatLine
                label="Last active"
                value={
                  stats?.last_activity_at
                    ? `${relativeTime(stats.last_activity_at)} · ${formatDateTime(stats.last_activity_at)}`
                    : 'Never'
                }
              />
            </>
          )}
        </section>

        <section className="lt-card p-4 sm:p-5">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">Free / Purchase journey</h2>
          <StatLine
            label="Free questions used"
            value={stats?.free_questions_used ?? profile.free_questions_used ?? 0}
          />
          <StatLine
            label="Free limit reached"
            value={stats?.free_limit_reached ? 'Yes' : 'No'}
          />
          <StatLine label="Paywall views" value={stats?.paywall_seen_count ?? 0} />
          <StatLine label="Checkout clicks" value={stats?.checkout_clicked_count ?? 0} />
          <StatLine
            label="Purchased"
            value={
              stats?.has_purchased || profile.access_level === 'paid' ? (
                <span className="text-[var(--correct)]">Yes</span>
              ) : (
                'No'
              )
            }
          />
        </section>

        <section className="lt-card p-4 sm:p-5">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">Mock test</h2>
          {(stats?.mock_tests_started ?? 0) === 0 && mockSessions.length === 0 ? (
            <p className="text-sm text-[var(--text-secondary)] py-2">No mock tests yet.</p>
          ) : (
            <>
              <StatLine label="Started" value={stats?.mock_tests_started ?? 0} />
              <StatLine label="Completed" value={stats?.mock_tests_completed ?? 0} />
              <StatLine
                label="Latest score"
                value={stats?.latest_mock_score != null ? stats.latest_mock_score : '—'}
              />
              <StatLine
                label="Best score"
                value={stats?.best_mock_score != null ? stats.best_mock_score : '—'}
              />
              {mockSessions.length > 0 && (
                <div className="mt-3 pt-2 border-t border-[var(--border)] space-y-2">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Recent mock sessions
                  </p>
                  {mockSessions.slice(0, 5).map((s) => (
                    <div key={s.id} className="text-xs text-[var(--text-secondary)]">
                      <span className="text-[var(--text-primary)] font-medium">
                        {s.is_completed ? 'Completed' : 'In progress'}
                      </span>
                      {' · '}
                      {formatDateTime(s.started_at)}
                      {s.score != null ? ` · score ${s.score}` : ''}
                      {` · ${s.correct_answers}/${s.questions_attempted}`}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        <section className="lt-card p-4 sm:p-5 md:col-span-2">
          <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">Language</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <StatLine
              label="Preferred"
              value={langLabel(stats?.preferred_language)}
            />
            <StatLine
              label="Last used"
              value={langLabel(stats?.last_language_used)}
            />
          </div>
        </section>
      </div>

      <section className="lt-card overflow-x-auto">
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-sm font-bold text-[var(--text-primary)]">Topic performance</h2>
        </div>
        {!topics.length ? (
          <p className="px-4 pb-4 text-sm text-[var(--text-secondary)]">
            No activity recorded yet.
          </p>
        ) : (
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
                <th className="px-4 py-3 font-bold">Topic</th>
                <th className="px-3 py-3 font-bold">Attempted</th>
                <th className="px-3 py-3 font-bold">Correct</th>
                <th className="px-3 py-3 font-bold">Incorrect</th>
                <th className="px-3 py-3 font-bold">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((t) => (
                <tr key={t.topic} className="border-b border-[var(--border)]">
                  <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">
                    {t.topic}
                  </td>
                  <td className="px-3 py-2.5 tabular-nums">{t.attempted}</td>
                  <td className="px-3 py-2.5 tabular-nums text-[var(--correct)]">{t.correct}</td>
                  <td className="px-3 py-2.5 tabular-nums text-[var(--wrong)]">{t.incorrect}</td>
                  <td className="px-3 py-2.5 tabular-nums">
                    {t.accuracy != null ? `${t.accuracy}%` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="lt-card p-4 sm:p-5">
        <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">Recent activity</h2>
        {!timeline.length ? (
          <p className="text-sm text-[var(--text-secondary)]">No activity recorded yet.</p>
        ) : (
          <ul className="space-y-0 divide-y divide-[var(--border)]">
            {timeline.map((item) => (
              <li key={`${item.kind}-${item.id}`} className="py-3 flex flex-wrap gap-2 justify-between">
                <div className="min-w-0">
                  {item.kind === 'event' ? (
                    <>
                      <p className="text-sm font-medium text-[var(--text-primary)] capitalize">
                        {eventLabel(item.event_name)}
                      </p>
                      {Object.keys(item.metadata || {}).length > 0 && (
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono line-clamp-2">
                          {JSON.stringify(item.metadata)}
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        Answered {item.question_id}{' '}
                        <span
                          className={
                            item.is_correct
                              ? 'text-[var(--correct)]'
                              : 'text-[var(--wrong)]'
                          }
                        >
                          {item.is_correct ? 'correct' : 'incorrect'}
                        </span>
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {item.mode}
                        {item.topic ? ` · ${item.topic}` : ''}
                        {item.language ? ` · ${item.language}` : ''}
                      </p>
                    </>
                  )}
                </div>
                <div className="text-xs text-[var(--text-secondary)] whitespace-nowrap text-right">
                  <p>{relativeTime(item.at)}</p>
                  <p className="opacity-70">{formatDateTime(item.at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
