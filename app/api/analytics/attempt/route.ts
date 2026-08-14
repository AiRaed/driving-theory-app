import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import { recordQuestionAttempt } from '@/lib/analytics/server';
import type { AnalyticsMode } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      question_id?: string;
      topic?: string | null;
      answer_selected?: string | null;
      correct_answer?: string | null;
      is_correct?: boolean;
      mode?: AnalyticsMode;
      language?: string | null;
      session_id?: string;
    };

    if (!body.question_id || !body.session_id || !body.mode) {
      return NextResponse.json(
        { error: 'question_id, session_id, and mode are required' },
        { status: 400 }
      );
    }

    if (body.mode !== 'practice' && body.mode !== 'mock') {
      return NextResponse.json({ error: 'mode must be practice or mock' }, { status: 400 });
    }

    if (typeof body.is_correct !== 'boolean') {
      return NextResponse.json({ error: 'is_correct required' }, { status: 400 });
    }

    await recordQuestionAttempt({
      userId: user.id,
      questionId: body.question_id,
      topic: body.topic,
      answerSelected: body.answer_selected,
      correctAnswer: body.correct_answer,
      isCorrect: body.is_correct,
      mode: body.mode,
      language: body.language,
      sessionId: body.session_id,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/analytics/attempt]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
