import { NextResponse } from 'next/server';
import { requirePaidMockUser } from '@/lib/mock/guard';
import { buildActiveExam } from '@/lib/mock/present';
import { MOCK_DURATION_SEC, MOCK_QUESTION_COUNT, findAnswerLeak } from '@/lib/mock/exam';
import { isDatabaseBankComplete, type QuestionRow } from '@/lib/questions/types';

export const dynamic = 'force-dynamic';

function randomUnit() {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] / 0x100000000;
}

/** Starts a 50-question mock. The response has no correct answers or explanations. */
export async function POST() {
  const access = await requirePaidMockUser();
  if (!access.ok) return access.response;

  const { data, error } = await access.supabase
    .from('questions')
    .select('*')
    .eq('status', 'published');
  if (error || !data) {
    return NextResponse.json({ error: 'bank_unavailable' }, { status: 503 });
  }

  const rows = data as QuestionRow[];
  const gate = isDatabaseBankComplete(rows);
  if (!gate.ok) {
    return NextResponse.json({ error: 'bank_unavailable' }, { status: 503 });
  }

  try {
    const questions = buildActiveExam(rows, randomUnit);
    const leaks = findAnswerLeak(questions);
    if (leaks.length > 0 || questions.length !== MOCK_QUESTION_COUNT) {
      return NextResponse.json({ error: 'exam_unavailable' }, { status: 500 });
    }
    return NextResponse.json({
      attemptId: crypto.randomUUID(),
      durationSec: MOCK_DURATION_SEC,
      questionCount: MOCK_QUESTION_COUNT,
      questions,
    });
  } catch {
    return NextResponse.json({ error: 'bank_unavailable' }, { status: 503 });
  }
}
