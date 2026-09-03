import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { isPaidAccessLevel } from '@/lib/access/entitlement';

export const dynamic = 'force-dynamic';

/**
 * SINGLE SOURCE OF TRUTH for user access status
 * Returns { paid: boolean, free_questions_used: number }
 * paid === true ONLY when profiles.access_level === 'paid'
 * free_questions_used comes from profiles.free_questions_used
 *
 * Fail closed: DB/config errors return HTTP 5xx (never invent free_questions_used: 0).
 */
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

    if (profileError) {
      console.error('[access/status] profile query error:', profileError.code);
      return NextResponse.json(
        { error: 'Failed to load access status' },
        { status: 500 }
      );
    }

    // Missing profile: treat as unpaid with 0 used (new account), not as an error unlock.
    const paid = isPaidAccessLevel(profile?.access_level);
    const free_questions_used =
      typeof profile?.free_questions_used === 'number'
        ? profile.free_questions_used
        : 0;

    return NextResponse.json({ paid, free_questions_used });
  } catch (error) {
    console.error('[access/status] Error:', error);
    return NextResponse.json(
      { error: 'Failed to load access status' },
      { status: 500 }
    );
  }
}
