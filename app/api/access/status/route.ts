import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * SINGLE SOURCE OF TRUTH for user access status
 * Uses SERVICE_ROLE_KEY to directly query profiles table
 * Returns { paid: boolean, accessLevel: 'free' | 'paid' }
 */
export async function GET(request: NextRequest) {
  try {
    // First, get the authenticated user using server client (for session validation)
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('[access/status] No authenticated user found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[access/status] Checking access for user:', user.id);

    // Use SERVICE_ROLE_KEY to directly query profiles (bypasses RLS)
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!serviceRoleKey || !supabaseUrl) {
      console.error('[access/status] Missing SERVICE_ROLE_KEY or SUPABASE_URL');
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

    // Query profiles table directly using service role
    const { data: profile, error: profileError } = await adminClient
      .from('profiles')
      .select('access_level, free_questions_used')
      .eq('id', user.id)
      .single();

    if (profileError) {
      // Profile doesn't exist - create it
      if (profileError.code === 'PGRST116') {
        console.log('[access/status] Profile missing, creating for user:', user.id);
        
        const { error: insertError } = await adminClient
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            access_level: 'free',
            free_questions_used: 0,
          });

        if (insertError) {
          console.error('[access/status] Error creating profile:', insertError);
          // Return free access as default
          return NextResponse.json({
            paid: false,
            accessLevel: 'free',
            freeQuestionsUsed: 0,
          });
        }

        console.log('[access/status] Profile created successfully');
        return NextResponse.json({
          paid: false,
          accessLevel: 'free',
          freeQuestionsUsed: 0,
        });
      }

      console.error('[access/status] Error fetching profile:', profileError);
      // Return free access as default on error
      return NextResponse.json({
        paid: false,
        accessLevel: 'free',
        freeQuestionsUsed: 0,
      });
    }

    // Determine access status - access_level === 'paid' is the ONLY gate
    const accessLevel = profile?.access_level || 'free';
    const paid = accessLevel === 'paid';
    const freeQuestionsUsed = profile?.free_questions_used || 0;

    console.log('[access/status] User access_level:', accessLevel, 'paid:', paid, 'freeQuestionsUsed:', freeQuestionsUsed);

    return NextResponse.json({
      paid,
      accessLevel: accessLevel as 'free' | 'paid',
      freeQuestionsUsed,
    });
  } catch (error) {
    console.error('[access/status] Unexpected error:', error);
    // Return free access as default on error
    return NextResponse.json({
      paid: false,
      accessLevel: 'free',
      freeQuestionsUsed: 0,
    });
  }
}

