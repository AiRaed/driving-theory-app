import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { isPaidAccessLevel } from '@/lib/access/entitlement';
import { isAccountDiagnosticsEnabled } from '@/lib/account/diagnosticsEnabled';

export const dynamic = 'force-dynamic';

/**
 * DEVELOPMENT / explicitly-enabled diagnostics only.
 * Returns account entitlement + progress record counts for the authenticated user.
 * Never returns receipts, tokens, JWS, or passwords.
 */
export async function GET() {
  if (!isAccountDiagnosticsEnabled()) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const admin = createServiceClient();

    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('access_level, free_questions_used, email, paid_at')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: 'Failed to load profile' },
        { status: 500 }
      );
    }

    const [
      attemptsRes,
      sessionsRes,
      practiceAttemptsRes,
      mockAttemptsRes,
      statsRes,
      paymentsRes,
    ] = await Promise.all([
      admin
        .from('question_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      admin
        .from('learning_sessions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
      admin
        .from('question_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('mode', 'practice'),
      admin
        .from('question_attempts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('mode', 'mock'),
      admin
        .from('user_learning_stats')
        .select(
          'questions_attempted, correct_answers, incorrect_answers, practice_sessions, mock_tests_completed, latest_mock_score, free_questions_used, has_purchased'
        )
        .eq('user_id', user.id)
        .maybeSingle(),
      admin
        .from('payments')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id),
    ]);

    const paid = isPaidAccessLevel(profile?.access_level);
    const free_questions_used =
      typeof profile?.free_questions_used === 'number'
        ? profile.free_questions_used
        : 0;

    return NextResponse.json({
      user_id: user.id,
      email: profile?.email ?? user.email ?? null,
      access_level: profile?.access_level ?? 'free',
      paid,
      free_questions_used,
      paid_at: profile?.paid_at ?? null,
      counts: {
        question_attempts: attemptsRes.count ?? 0,
        practice_attempts: practiceAttemptsRes.count ?? 0,
        mock_attempts: mockAttemptsRes.count ?? 0,
        learning_sessions: sessionsRes.count ?? 0,
        payments: paymentsRes.count ?? 0,
      },
      learning_stats: statsRes.data ?? null,
      // Client platform is reported by the page; server notes Node env only.
      server_node_env: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('[dev/account-diagnostics]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
