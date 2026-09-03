import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import {
  FREE_QUESTION_LIMIT,
  isPaidAccessLevel,
} from '@/lib/access/entitlement';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Atomically increment free_questions_used for unpaid users.
 * Returns locked=true when free trial is exhausted (or user is unpaid at/over limit).
 * Paid users are not incremented.
 */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const adminClient = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('access_level, free_questions_used')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    if (isPaidAccessLevel(profile.access_level)) {
      return NextResponse.json({
        access_level: 'paid',
        free_questions_used: profile.free_questions_used ?? 0,
        locked: false,
        paid: true,
      });
    }

    const currentUsed = profile.free_questions_used ?? 0;

    // Already at/over limit — do not increment further; report locked.
    if (currentUsed >= FREE_QUESTION_LIMIT) {
      return NextResponse.json({
        access_level: 'free',
        free_questions_used: currentUsed,
        locked: true,
        paid: false,
      });
    }

    const { data: updated, error: updateError } = await adminClient
      .from('profiles')
      .update({
        free_questions_used: currentUsed + 1,
      })
      .eq('id', user.id)
      .eq('access_level', 'free')
      .select('access_level, free_questions_used')
      .maybeSingle();

    if (updateError) {
      console.error('Error incrementing usage:', updateError);
      return NextResponse.json(
        { error: 'Failed to increment usage' },
        { status: 500 }
      );
    }

    // Race: another request may have promoted to paid or updated count.
    if (!updated) {
      const { data: latest } = await adminClient
        .from('profiles')
        .select('access_level, free_questions_used')
        .eq('id', user.id)
        .maybeSingle();

      const paid = isPaidAccessLevel(latest?.access_level);
      const used = latest?.free_questions_used ?? currentUsed;
      return NextResponse.json({
        access_level: paid ? 'paid' : 'free',
        free_questions_used: used,
        locked: !paid && used >= FREE_QUESTION_LIMIT,
        paid,
      });
    }

    const used = updated.free_questions_used ?? currentUsed + 1;
    const paid = isPaidAccessLevel(updated.access_level);

    return NextResponse.json({
      access_level: paid ? 'paid' : 'free',
      free_questions_used: used,
      locked: !paid && used >= FREE_QUESTION_LIMIT,
      paid,
    });
  } catch (error) {
    console.error('Increment usage error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
