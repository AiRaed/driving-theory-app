import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import type { AdminUserFilter, UserLearningStatsRow } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

type ProfileRow = {
  id: string;
  email: string | null;
  access_level: string;
  free_questions_used: number;
  paid_at: string | null;
  updated_at: string;
};

function relativeTime(iso: string | null | undefined): string {
  if (!iso) return 'Never';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return 'Never';
  const diffSec = Math.round((Date.now() - then) / 1000);
  if (diffSec < 60) return 'Just now';
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function accuracy(stats: UserLearningStatsRow | null): number | null {
  if (!stats) return null;
  const total = (stats.correct_answers || 0) + (stats.incorrect_answers || 0);
  if (total <= 0) return null;
  return Math.round((stats.correct_answers / total) * 1000) / 10;
}

function startOfTodayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await requireAdminApi();
    if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sp = request.nextUrl.searchParams;
    const q = (sp.get('q') || '').trim().toLowerCase();
    const filter = (sp.get('filter') || 'all') as AdminUserFilter;
    const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(sp.get('pageSize') || '25', 10) || 25));

    const sb = createServiceClient();

    const { data: profiles, error: profilesErr } = await sb
      .from('profiles')
      .select('id, email, access_level, free_questions_used, paid_at, updated_at')
      .order('updated_at', { ascending: false });

    if (profilesErr) {
      console.error('[admin/users] profiles', profilesErr);
      return NextResponse.json({ error: profilesErr.message }, { status: 500 });
    }

    const profileList = (profiles || []) as ProfileRow[];
    const ids = profileList.map((p) => p.id);

    let statsByUser = new Map<string, UserLearningStatsRow>();
    if (ids.length > 0) {
      // Chunk to avoid URL limits
      const chunkSize = 200;
      for (let i = 0; i < ids.length; i += chunkSize) {
        const chunk = ids.slice(i, i + chunkSize);
        const { data: statsRows, error: statsErr } = await sb
          .from('user_learning_stats')
          .select('*')
          .in('user_id', chunk);
        if (statsErr) {
          console.error('[admin/users] stats', statsErr);
          return NextResponse.json({ error: statsErr.message }, { status: 500 });
        }
        for (const row of (statsRows || []) as UserLearningStatsRow[]) {
          statsByUser.set(row.user_id, row);
        }
      }
    }

    const today = startOfTodayIso();

    let merged = profileList.map((p) => {
      const stats = statsByUser.get(p.id) ?? null;
      return {
        id: p.id,
        email: p.email,
        access_level: p.access_level,
        free_questions_used: stats?.free_questions_used ?? p.free_questions_used ?? 0,
        has_purchased: stats?.has_purchased ?? p.access_level === 'paid',
        questions_attempted: stats?.questions_attempted ?? 0,
        unique_questions_attempted: stats?.unique_questions_attempted ?? 0,
        correct_answers: stats?.correct_answers ?? 0,
        incorrect_answers: stats?.incorrect_answers ?? 0,
        accuracy: accuracy(stats),
        practice_sessions: stats?.practice_sessions ?? 0,
        mock_tests_started: stats?.mock_tests_started ?? 0,
        mock_tests_completed: stats?.mock_tests_completed ?? 0,
        latest_mock_score: stats?.latest_mock_score ?? null,
        best_mock_score: stats?.best_mock_score ?? null,
        free_limit_reached: stats?.free_limit_reached ?? false,
        paywall_seen_count: stats?.paywall_seen_count ?? 0,
        checkout_clicked_count: stats?.checkout_clicked_count ?? 0,
        preferred_language: stats?.preferred_language ?? null,
        last_language_used: stats?.last_language_used ?? null,
        last_activity_at: stats?.last_activity_at ?? null,
        last_active_relative: relativeTime(stats?.last_activity_at),
        first_activity_at: stats?.first_activity_at ?? null,
        paid_at: p.paid_at,
        updated_at: p.updated_at,
      };
    });

    if (q) {
      merged = merged.filter(
        (u) =>
          (u.email || '').toLowerCase().includes(q) ||
          u.id.toLowerCase().includes(q)
      );
    }

    switch (filter) {
      case 'active_today':
        merged = merged.filter((u) => u.last_activity_at && u.last_activity_at >= today);
        break;
      case 'free_limit':
        merged = merged.filter((u) => u.free_limit_reached);
        break;
      case 'paywall':
        merged = merged.filter((u) => u.paywall_seen_count > 0);
        break;
      case 'checkout':
        merged = merged.filter((u) => u.checkout_clicked_count > 0);
        break;
      case 'paid':
        merged = merged.filter((u) => u.has_purchased || u.access_level === 'paid');
        break;
      case 'not_paid':
        merged = merged.filter((u) => !u.has_purchased && u.access_level !== 'paid');
        break;
      case 'lang_ar':
        merged = merged.filter(
          (u) => u.last_language_used === 'ar' || u.preferred_language === 'ar'
        );
        break;
      case 'lang_ur':
        merged = merged.filter(
          (u) => u.last_language_used === 'ur' || u.preferred_language === 'ur'
        );
        break;
      case 'lang_en':
        merged = merged.filter(
          (u) => u.last_language_used === 'en' || u.preferred_language === 'en'
        );
        break;
      case 'lang_ro':
        merged = merged.filter(
          (u) => u.last_language_used === 'ro' || u.preferred_language === 'ro'
        );
        break;
      case 'lang_pl':
        merged = merged.filter(
          (u) => u.last_language_used === 'pl' || u.preferred_language === 'pl'
        );
        break;
      case 'lang_pt':
        merged = merged.filter(
          (u) => u.last_language_used === 'pt' || u.preferred_language === 'pt'
        );
        break;
      case 'lang_bn':
        merged = merged.filter(
          (u) => u.last_language_used === 'bn' || u.preferred_language === 'bn'
        );
        break;
      case 'lang_fa':
        merged = merged.filter(
          (u) => u.last_language_used === 'fa' || u.preferred_language === 'fa'
        );
        break;
      case 'mock_started':
        merged = merged.filter((u) => u.mock_tests_started > 0);
        break;
      case 'mock_completed':
        merged = merged.filter((u) => u.mock_tests_completed > 0);
        break;
      case 'all':
      default:
        break;
    }

    // Sort by last activity desc (nulls last)
    merged.sort((a, b) => {
      const at = a.last_activity_at ? new Date(a.last_activity_at).getTime() : 0;
      const bt = b.last_activity_at ? new Date(b.last_activity_at).getTime() : 0;
      return bt - at;
    });

    const total = merged.length;
    const start = (page - 1) * pageSize;
    const users = merged.slice(start, start + pageSize);

    return NextResponse.json({
      users,
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      filter,
      q,
    });
  } catch (e) {
    console.error('[admin/users]', e);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
