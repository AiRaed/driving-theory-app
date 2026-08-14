import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/supabase/auth';
import {
  applyProductEventSideEffects,
  recordProductEvent,
} from '@/lib/analytics/server';
import type { AnalyticsEventName, AnalyticsMetadata } from '@/lib/analytics/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    const body = (await request.json().catch(() => ({}))) as {
      event_name?: string;
      metadata?: AnalyticsMetadata;
    };

    const eventName = (body.event_name || '').trim();
    if (!eventName) {
      return NextResponse.json({ error: 'event_name required' }, { status: 400 });
    }

    // Prefer authenticated user; allow unauthenticated only for signup_completed
    if (!user && eventName !== 'signup_completed') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = user?.id ?? null;
    const metadata = body.metadata ?? {};

    // NEVER mark purchase from this client-callable route
    await recordProductEvent(userId, eventName as AnalyticsEventName, metadata);

    if (userId) {
      await applyProductEventSideEffects(userId, eventName, metadata);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[api/analytics/track]', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
