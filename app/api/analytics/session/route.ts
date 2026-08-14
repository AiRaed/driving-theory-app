import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import {
  completeLearningSession,
  startLearningSession,
} from '@/lib/analytics/server';
import type { AnalyticsMode, SessionAction } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      action?: SessionAction;
      mode?: AnalyticsMode;
      language?: string | null;
      client_session_id?: string;
      questions_attempted?: number;
      correct_answers?: number;
      score?: number | null;
    };

    if (!body.action || !body.client_session_id) {
      return NextResponse.json(
        { error: 'action and client_session_id are required' },
        { status: 400 }
      );
    }

    if (body.action === 'start') {
      if (!body.mode || (body.mode !== 'practice' && body.mode !== 'mock')) {
        return NextResponse.json({ error: 'mode must be practice or mock' }, { status: 400 });
      }
      await startLearningSession({
        userId: user.id,
        mode: body.mode,
        language: body.language,
        clientSessionId: body.client_session_id,
      });
      return NextResponse.json({ ok: true });
    }

    if (body.action === 'complete') {
      await completeLearningSession({
        userId: user.id,
        clientSessionId: body.client_session_id,
        questionsAttempted: body.questions_attempted,
        correctAnswers: body.correct_answers,
        score: body.score,
      });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'action must be start or complete' }, { status: 400 });
  } catch (e) {
    console.error('[api/analytics/session]', e);
    const message = e instanceof Error ? e.message : 'Internal server error';
    const status = message.includes('not found') ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
