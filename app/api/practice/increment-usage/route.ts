import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Atomically increment free_questions_used
 * Only increments if user is not paid and hasn't exceeded limit
 */
export async function POST(request: NextRequest) {
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

    // Atomic increment: only if access_level != 'paid'
    // Use SQL to ensure atomicity
    const { data, error } = await adminClient.rpc('increment_free_questions', {
      user_id_param: user.id,
    });

    if (error) {
      // If function doesn't exist, fall back to manual update
      const { data: profile } = await adminClient
        .from('profiles')
        .select('access_level, free_questions_used')
        .eq('id', user.id)
        .single();

      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
      }

      // If already paid, don't increment
      if (profile.access_level === 'paid') {
        return NextResponse.json({
          access_level: 'paid',
          free_questions_used: profile.free_questions_used,
        });
      }

      // Atomic increment using SQL
      const { data: updated, error: updateError } = await adminClient
        .from('profiles')
        .update({ 
          free_questions_used: (profile.free_questions_used || 0) + 1 
        })
        .eq('id', user.id)
        .eq('access_level', 'free') // Only update if still free
        .select()
        .single();

      if (updateError) {
        console.error('Error incrementing usage:', updateError);
        return NextResponse.json(
          { error: 'Failed to increment usage' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        access_level: updated.access_level,
        free_questions_used: updated.free_questions_used,
      });
    }

    return NextResponse.json({
      access_level: data?.access_level || 'free',
      free_questions_used: data?.free_questions_used || 0,
    });
  } catch (error) {
    console.error('Increment usage error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
