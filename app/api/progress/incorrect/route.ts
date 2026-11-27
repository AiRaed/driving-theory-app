import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { listIncorrectQuestionIds } from '@/lib/progress/server';
import { PRACTICE_TOPIC_ORDER } from '@/lib/questions/practiceCategory';

const TOPICS = new Set<string>(PRACTICE_TOPIC_ORDER);

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const topic = new URL(request.url).searchParams.get('topic')?.trim() ?? '';
  if (!TOPICS.has(topic)) {
    return NextResponse.json({ error: 'Unknown topic' }, { status: 400 });
  }

  try {
    const questionIds = await listIncorrectQuestionIds(user.id, topic);
    return NextResponse.json({ questionIds });
  } catch (error) {
    console.error('[progress] incorrect lookup failed', error);
    return NextResponse.json({ error: 'Progress unavailable' }, { status: 500 });
  }
}
