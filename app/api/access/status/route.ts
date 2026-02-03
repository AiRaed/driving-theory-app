import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * SINGLE SOURCE OF TRUTH for user access status
 * Returns { paid: boolean, free_questions_used: number }
 * paid === true ONLY when profiles.access_level === 'paid'
 * free_questions_used comes from profiles.free_questions_used
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use SERVICE_ROLE_KEY to query profiles (bypasses RLS)
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

    // Query profiles table - access_level and free_questions_used are the ONLY source of truth
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('access_level, free_questions_used')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      // Profile doesn't exist - return unpaid with 0 free questions used
      if (profileError.code === 'PGRST116') {
        return NextResponse.json({ paid: false, free_questions_used: 0 });
      }
      // Other error - return unpaid with 0 free questions used
      return NextResponse.json({ paid: false, free_questions_used: 0 });
    }

    // EXACTLY ONE source of truth: profiles.access_level === 'paid'
    const paid = profile?.access_level === 'paid';
    const free_questions_used = profile?.free_questions_used || 0;

    return NextResponse.json({ paid, free_questions_used });
  } catch (error) {
    console.error('[access/status] Error:', error);
    return NextResponse.json({ paid: false, free_questions_used: 0 });
  }
}

