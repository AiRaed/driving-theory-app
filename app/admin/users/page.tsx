'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { AdminUserFilter } from '@/lib/analytics/types';

type AdminUserListItem = {
  id: string;
  email: string | null;
  access_level: string;
  free_questions_used: number;
  has_purchased: boolean;
  questions_attempted: number;
  accuracy: number | null;
  mock_tests_started: number;
  mock_tests_completed: number;
  best_mock_score: number | null;
  free_limit_reached: boolean;
  preferred_language: string | null;
  last_language_used: string | null;
  last_activity_at: string | null;
  last_active_relative: string;
  first_activity_at: string | null;
  paid_at: string | null;
  updated_at: string;
};

const FILTER_OPTIONS: { value: AdminUserFilter; label: string }[] = [
  { value: 'all', label: 'All users' },
  { value: 'active_today', label: 'Active today' },
  { value: 'free_limit', label: 'Reached free limit' },
  { value: 'paywall', label: 'Saw paywall' },
  { value: 'checkout', label: 'Clicked checkout' },
  { value: 'paid', label: 'Paid' },
  { value: 'not_paid', label: 'Not paid' },
  { value: 'lang_ar', label: 'Language: Arabic' },
  { value: 'lang_ur', label: 'Language: Urdu' },
  { value: 'lang_ro', label: 'Language: Romanian' },
  { value: 'lang_en', label: 'Language: English' },
  { value: 'mock_started', label: 'Mock started' },
  { value: 'mock_completed', label: 'Mock completed' },
];

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

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function langLabel(code: string | null | undefined): string {
  if (!code) return '—';
  const map: Record<string, string> = { en: 'EN', ar: 'AR', ur: 'UR', ro: 'RO' };
  return map[code] || code.toUpperCase();
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  const [qDraft, setQDraft] = useState('');
  const [filter, setFilter] = useState<AdminUserFilter>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pageSize = 25;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        filter,
      });
      if (q.trim()) params.set('q', q.trim());
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, q, filter]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setQ(qDraft);
    }, 300);
    return () => clearTimeout(t);
  }, [qDraft]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="lt-kicker mb-1">Analytics</p>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Users</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {total} total · page {page} of {totalPages}
          </p>
        </div>
        <Link href="/admin" className="lt-btn-secondary px-4 py-2.5 text-sm">
          Overview
        </Link>
      </div>

      <div className="lt-card p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input
          className="lt-input sm:col-span-2"
          placeholder="Search email or user id…"
          value={qDraft}
          onChange={(e) => setQDraft(e.target.value)}
        />
        <select
          className="lt-input"
          value={filter}
          onChange={(e) => {
            setPage(1);
            setFilter(e.target.value as AdminUserFilter);
          }}
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-[var(--radius-md)] border border-[var(--wrong)]/30 bg-[var(--wrong-soft)] px-4 py-3 text-sm text-[var(--wrong)]">
          {error}
        </div>
      )}

      <div className="lt-card overflow-x-auto">
        <table className="w-full text-sm min-w-[1100px]">
          <thead>
            <tr className="border-b border-[var(--border)] text-left text-[11px] uppercase tracking-wider text-[var(--text-secondary)]">
              <th className="px-4 py-3 font-bold">User</th>
              <th className="px-3 py-3 font-bold">Joined</th>
              <th className="px-3 py-3 font-bold">Last active</th>
              <th className="px-3 py-3 font-bold">Questions</th>
              <th className="px-3 py-3 font-bold">Accuracy</th>
              <th className="px-3 py-3 font-bold">Mock tests</th>
              <th className="px-3 py-3 font-bold">Best mock</th>
              <th className="px-3 py-3 font-bold">Language</th>
              <th className="px-3 py-3 font-bold">Free usage</th>
              <th className="px-3 py-3 font-bold">Purchase</th>
              <th className="px-3 py-3 font-bold"> </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  Loading…
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-4 py-8 text-center text-[var(--text-secondary)]">
                  No users match this search.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const hasActivity = Boolean(u.last_activity_at) || u.questions_attempted > 0;
                const joined = u.first_activity_at || u.updated_at;
                return (
                  <tr
                    key={u.id}
                    className="border-b border-[var(--border)] align-top cursor-pointer hover:bg-[var(--surface-secondary)]/60"
                    onClick={() => router.push(`/admin/users/${encodeURIComponent(u.id)}`)}
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-[var(--text-primary)] truncate max-w-[220px]">
                        {u.email || 'No email'}
                      </p>
                      <p className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5 truncate max-w-[220px]">
                        {u.id}
                      </p>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-[var(--text-secondary)] text-xs">
                      {formatDate(joined)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-xs">
                      {hasActivity ? (
                        <span className="text-[var(--text-primary)]">
                          {relativeTime(u.last_activity_at)}
                        </span>
                      ) : (
                        <span className="text-[var(--text-secondary)]">No activity recorded yet</span>
                      )}
                    </td>
                    <td className="px-3 py-3 tabular-nums">
                      {hasActivity ? u.questions_attempted : (
                        <span className="text-[var(--text-secondary)]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 tabular-nums">
                      {u.accuracy != null ? `${u.accuracy}%` : (
                        <span className="text-[var(--text-secondary)]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 tabular-nums whitespace-nowrap">
                      {u.mock_tests_started > 0 || u.mock_tests_completed > 0 ? (
                        `${u.mock_tests_completed}/${u.mock_tests_started}`
                      ) : (
                        <span className="text-[var(--text-secondary)]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 tabular-nums">
                      {u.best_mock_score != null ? u.best_mock_score : (
                        <span className="text-[var(--text-secondary)]">—</span>
                      )}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {langLabel(u.last_language_used || u.preferred_language)}
                    </td>
                    <td className="px-3 py-3 tabular-nums whitespace-nowrap">
                      {u.free_questions_used}
                      {u.free_limit_reached ? (
                        <span className="ml-1 text-[10px] font-bold uppercase text-[var(--warning)]">
                          limit
                        </span>
                      ) : null}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      {u.has_purchased || u.access_level === 'paid' ? (
                        <span className="text-[var(--correct)] font-medium">Paid</span>
                      ) : (
                        <span className="text-[var(--text-secondary)]">Free</span>
                      )}
                    </td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <Link
                        href={`/admin/users/${encodeURIComponent(u.id)}`}
                        className="text-[var(--lingo-red)] font-medium hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          className="lt-btn-ghost px-4 py-2 text-sm"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        <p className="text-sm text-[var(--text-secondary)]">
          {page} / {totalPages}
        </p>
        <button
          type="button"
          className="lt-btn-ghost px-4 py-2 text-sm"
          disabled={page >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </div>
    </div>
  );
}
