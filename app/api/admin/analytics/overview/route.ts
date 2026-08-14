import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const adminUser = await requireAdminApi();
    if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sb = createServiceClient();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysIso = sevenDaysAgo.toISOString();

    const [profilesCount, statsAll, active7d, eventPracticeUsers] = await Promise.all([
      sb.from('profiles').select('id', { count: 'exact', head: true }),
      sb.from('user_learning_stats').select(
        'user_id, practice_sessions, free_limit_reached, paywall_seen_count, checkout_clicked_count, has_purchased, questions_attempted, mock_tests_started, mock_tests_completed, last_activity_at'
      ),
      sb
        .from('user_learning_stats')
        .select('user_id', { count: 'exact', head: true })
        .gte('last_activity_at', sevenDaysIso),
      sb
        .from('product_events')
        .select('user_id')
        .eq('event_name', 'practice_started')
        .not('user_id', 'is', null)
        .limit(5000),
    ]);

    if (profilesCount.error) {
      return NextResponse.json({ error: profilesCount.error.message }, { status: 500 });
    }
    if (statsAll.error) {
      return NextResponse.json({ error: statsAll.error.message }, { status: 500 });
    }

    const rows = statsAll.data || [];

    let reachedFreeLimit = 0;
    let viewedPaywall = 0;
    let clickedCheckout = 0;
    let purchased = 0;
    let questionsAnsweredSum = 0;
    let mockStarted = 0;
    let mockCompleted = 0;
    let checkoutClicksSum = 0;

    const practiceUserIds = new Set<string>();

    for (const r of rows) {
      if ((r.practice_sessions || 0) > 0) practiceUserIds.add(r.user_id);
      if (r.free_limit_reached) reachedFreeLimit += 1;
      if ((r.paywall_seen_count || 0) > 0) viewedPaywall += 1;
      if ((r.checkout_clicked_count || 0) > 0) clickedCheckout += 1;
      if (r.has_purchased) purchased += 1;
      questionsAnsweredSum += r.questions_attempted || 0;
      mockStarted += r.mock_tests_started || 0;
      mockCompleted += r.mock_tests_completed || 0;
      checkoutClicksSum += r.checkout_clicked_count || 0;
    }

    for (const e of eventPracticeUsers.data || []) {
      if (e.user_id) practiceUserIds.add(e.user_id);
    }

    const registered = profilesCount.count ?? 0;

    return NextResponse.json({
      cards: {
        total_users: registered,
        active_7d: active7d.count ?? 0,
        questions_answered: questionsAnsweredSum,
        mock_tests_started: mockStarted,
        mock_tests_completed: mockCompleted,
        checkout_clicks: checkoutClicksSum,
      },
      funnel: {
        registered,
        started_practice: practiceUserIds.size,
        reached_free_limit: reachedFreeLimit,
        viewed_paywall: viewedPaywall,
        clicked_checkout: clickedCheckout,
        purchased,
      },
    });
  } catch (e) {
    console.error('[admin/analytics/overview]', e);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
