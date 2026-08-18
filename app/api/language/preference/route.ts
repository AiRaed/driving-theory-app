import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import { ensureStats } from '@/lib/analytics/server';
import {
  fromAnalyticsLanguage,
  isTranslationLang,
  toAnalyticsLanguage,
} from '@/lib/i18n/languages';

export const dynamic = 'force-dynamic';

function parseLanguage(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const v = raw.trim().toLowerCase();
  if (v === 'en' || v === 'off' || isTranslationLang(v)) {
    return toAnalyticsLanguage(fromAnalyticsLanguage(v));
  }
  return null;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await ensureStats(user.id);
    return NextResponse.json({
      preferred_language: stats?.preferred_language ?? null,
    });
  } catch (error) {
    console.error('[language/preference] GET error:', error);
    return NextResponse.json({ preferred_language: null });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const language = parseLanguage(body?.language);
    if (!language) {
      return NextResponse.json({ error: 'Invalid language' }, { status: 400 });
    }

    await ensureStats(user.id);
    const admin = createServiceClient();
    const { error } = await admin
      .from('user_learning_stats')
      .update({
        preferred_language: language,
        last_language_used: language,
      })
      .eq('user_id', user.id);

    if (error) {
      console.error('[language/preference] POST update error:', error);
      return NextResponse.json({ error: 'Failed to save language' }, { status: 500 });
    }

    return NextResponse.json({ preferred_language: language });
  } catch (error) {
    console.error('[language/preference] POST error:', error);
    return NextResponse.json({ error: 'Failed to save language' }, { status: 500 });
  }
}
