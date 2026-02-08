import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * SINGLE SOURCE OF TRUTH for paywall status
 * Reads from profiles table (access_level and free_questions_used)
 * Returns { paid: boolean, trialUsed: number, trialLimit: number }
 * paid === true ONLY when profiles.access_level === 'paid'
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user from Supabase auth cookies
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

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('[paywall/status] Error querying profile:', profileError);
    }

    // paid === true ONLY when profiles.access_level === 'paid'
    const paid = profile?.access_level === 'paid';
    
    // Normalize freeUsed: if null/undefined from DB => 0
    const trialUsed = profile?.free_questions_used ?? 0;
    const trialLimit = 15;

    // Safe console logs in development
    if (process.env.NODE_ENV === 'development') {
      console.log('[paywall/status]', {
        user_id: user.id,
        paid,
        trialUsed,
        trialLimit,
        status: 'ready',
      });
    }

    return NextResponse.json({
      paid,
      trialUsed,
      trialLimit,
    });
  } catch (error) {
    console.error('[paywall/status] Error:', error);
    return NextResponse.json({
      paid: false,
      trialUsed: 0,
      trialLimit: 15,
    });
  }
}


