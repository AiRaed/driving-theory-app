import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import type {
  LearningSessionRow,
  ProductEventRow,
  QuestionAttemptRow,
  UserLearningStatsRow,
} from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

type TimelineItem =
  | {
      kind: 'event';
      id: string;
      at: string;
      event_name: string;
      metadata: Record<string, unknown>;
    }
  | {
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

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const adminUser = await requireAdminApi();
    if (!adminUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await Promise.resolve(context.params);
    const userId = params.id;
    if (!userId) {
      return NextResponse.json({ error: 'Missing user id' }, { status: 400 });
    }

    const sb = createServiceClient();

    const { data: profile, error: profileErr } = await sb
      .from('profiles')
      .select('id, email, access_level, free_questions_used, paid_at, updated_at, stripe_customer_id')
      .eq('id', userId)
      .maybeSingle();

    if (profileErr) {
      return NextResponse.json({ error: profileErr.message }, { status: 500 });
    }
    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { data: stats } = await sb
      .from('user_learning_stats')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    const { data: attempts } = await sb
      .from('question_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(500);

    const attemptRows = (attempts || []) as QuestionAttemptRow[];

    const topicMap = new Map<
      string,
      {
        topic: string;
        attempted: number;
        unique_attempted: number;
        correct: number;
        incorrect: number;
        questionIds: Set<string>;
      }
    >();
    for (const a of attemptRows) {
      const key = a.topic || 'unknown';
      const cur = topicMap.get(key) || {
        topic: key,
        attempted: 0,
        unique_attempted: 0,
        correct: 0,
        incorrect: 0,
        questionIds: new Set<string>(),
      };
      cur.attempted += 1;
      cur.questionIds.add(a.question_id);
      if (a.is_correct) cur.correct += 1;
      else cur.incorrect += 1;
      topicMap.set(key, cur);
    }
    const topics = Array.from(topicMap.values())
      .map(({ questionIds, ...t }) => ({
        ...t,
        unique_attempted: questionIds.size,
        accuracy:
          t.attempted > 0 ? Math.round((t.correct / t.attempted) * 1000) / 10 : null,
      }))
      .sort((a, b) => b.attempted - a.attempted);

    const { data: events } = await sb
      .from('product_events')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: recentAttempts } = await sb
      .from('question_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    const { data: sessions } = await sb
      .from('learning_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(30);

    const timeline: TimelineItem[] = [];
    for (const e of (events || []) as ProductEventRow[]) {
      timeline.push({
        kind: 'event',
        id: e.id,
        at: e.created_at,
        event_name: e.event_name,
        metadata: (e.metadata || {}) as Record<string, unknown>,
      });
    }
    for (const a of (recentAttempts || []) as QuestionAttemptRow[]) {
      timeline.push({
        kind: 'attempt',
        id: a.id,
        at: a.created_at,
        question_id: a.question_id,
        topic: a.topic,
        is_correct: a.is_correct,
        mode: a.mode,
        language: a.language,
        session_id: a.session_id,
      });
    }
    timeline.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    const timelineTop = timeline.slice(0, 50);

    const statsRow = (stats || null) as UserLearningStatsRow | null;
    const answered =
      (statsRow?.correct_answers || 0) + (statsRow?.incorrect_answers || 0);
    const accuracyPct =
      answered > 0 && statsRow
        ? Math.round((statsRow.correct_answers / answered) * 1000) / 10
        : null;

    let signupAt: string | null = null;
    try {
      const { data: authUser } = await sb.auth.admin.getUserById(userId);
      signupAt = authUser.user?.created_at ?? null;
    } catch {
      signupAt = null;
    }

    return NextResponse.json({
      profile: { ...profile, signup_at: signupAt },
      stats: statsRow,
      accuracy: accuracyPct,
      topics,
      timeline: timelineTop,
      sessions: (sessions || []) as LearningSessionRow[],
      has_activity:
        !!(statsRow?.questions_attempted ||
          statsRow?.practice_sessions ||
          statsRow?.mock_tests_started ||
          (events || []).length ||
          attemptRows.length),
    });
  } catch (e) {
    console.error('[admin/users/[id]]', e);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
