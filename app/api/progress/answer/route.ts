import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { recordPracticeAnswer } from '@/lib/progress/server';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const questionId = typeof body?.question_id === 'string' ? body.question_id.trim() : '';
  const selectedAnswer = body?.selected_answer;
  const clientAttemptId =
    typeof body?.client_attempt_id === 'string' ? body.client_attempt_id.trim() : '';

  if (!questionId || questionId.length > 80) {
    return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
  }
  if (!Number.isInteger(selectedAnswer) || selectedAnswer < 1 || selectedAnswer > 4) {
    return NextResponse.json({ error: 'Invalid answer' }, { status: 400 });
  }
  if (!UUID_RE.test(clientAttemptId)) {
    return NextResponse.json({ error: 'Invalid attempt' }, { status: 400 });
  }

  try {
    const summary = await recordPracticeAnswer({
      userId: user.id,
      questionId,
      selectedAnswer,
      clientAttemptId,
    });
    return NextResponse.json({ summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (
      message.includes('question not in active bank') ||
      message.includes('invalid answer') ||
      message.includes('attempt id reused')
    ) {
      return NextResponse.json({ error: 'Answer was not accepted' }, { status: 400 });
    }
    console.error('[progress] save failed', error);
    return NextResponse.json({ error: 'Progress could not be saved' }, { status: 500 });
  }
}
