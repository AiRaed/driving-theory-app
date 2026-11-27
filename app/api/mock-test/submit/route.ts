import { NextResponse } from 'next/server';
import { requirePaidMockUser } from '@/lib/mock/guard';
import { parseSubmitBody } from '@/lib/mock/exam';
import { buildMockResult } from '@/lib/mock/present';
import type { QuestionRow } from '@/lib/questions/types';

export const dynamic = 'force-dynamic';

/**
 * Scores the latest selection for each question from the published bank.
 * Practice progress is left untouched. The same selections always produce the
 * same score. The client freezes the first accepted result for this attempt.
 */
export async function POST(request: Request) {
  const access = await requirePaidMockUser();
  if (!access.ok) return access.response;

  const parsed = parseSubmitBody(await request.json().catch(() => null));
  if (!parsed) {
    return NextResponse.json({ error: 'invalid_submission' }, { status: 400 });
  }

  const { data, error } = await access.supabase
    .from('questions')
    .select('*')
    .in('id', parsed.questionIds)
    .eq('status', 'published');
  if (error || !data) {
    return NextResponse.json({ error: 'bank_unavailable' }, { status: 503 });
  }

  try {
    const result = buildMockResult({
      attemptId: parsed.attemptId,
      rows: data as QuestionRow[],
      questionIds: parsed.questionIds,
      selections: parsed.selections,
      elapsedSec: parsed.elapsedSec,
    });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: 'invalid_submission' }, { status: 400 });
  }
}
