import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * SINGLE SOURCE OF TRUTH for user access status
 * Returns { paid: boolean }
 * paid === true ONLY when profiles.access_level === 'paid'
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

    // Query profiles table - access_level is the ONLY flag
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('access_level')
      .eq('id', user.id)
      .maybeSingle();

    if (profileError) {
      // Profile doesn't exist - return unpaid
      if (profileError.code === 'PGRST116') {
        return NextResponse.json({ paid: false });
      }
      // Other error - return unpaid
      return NextResponse.json({ paid: false });
    }

    // EXACTLY ONE source of truth: profiles.access_level === 'paid'
    const paid = profile?.access_level === 'paid';

    return NextResponse.json({ paid });
  } catch (error) {
    console.error('[access/status] Error:', error);
    return NextResponse.json({ paid: false });
  }
}

