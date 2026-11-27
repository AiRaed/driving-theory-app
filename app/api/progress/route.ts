import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { loadPracticeProgress } from '@/lib/progress/server';

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const summary = await loadPracticeProgress(user.id);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('[progress] load failed', error);
    return NextResponse.json({ error: 'Progress unavailable' }, { status: 500 });
  }
}
