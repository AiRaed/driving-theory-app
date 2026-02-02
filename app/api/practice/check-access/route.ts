import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[check-access] No user found');
      }
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('[check-access] User found:', user.id);
    }

    // Get user profile
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Create profile if it doesn't exist
    if (profileError && profileError.code === 'PGRST116') {
      if (process.env.NODE_ENV === 'development') {
        console.log('[check-access] Profile missing, creating for user:', user.id);
      }
      
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          access_level: 'free',
          free_questions_used: 0,
        })
        .select()
        .single();

      if (insertError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[check-access] Error creating profile:', insertError);
        }
        // Return default values instead of failing - NEVER sign out
        return NextResponse.json({
          access_level: 'free',
          free_questions_used: 0,
        });
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('[check-access] Profile created successfully');
      }
      profile = newProfile;
    } else if (profileError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[check-access] Error fetching profile:', profileError);
      }
      // Return default values instead of failing - NEVER sign out
      return NextResponse.json({
        access_level: 'free',
        free_questions_used: 0,
      });
    } else if (process.env.NODE_ENV === 'development') {
      console.log('[check-access] Profile exists, access_level:', profile?.access_level);
    }

    // NEVER call signOut here - missing profile is not a reason to log out
    return NextResponse.json({
      access_level: profile?.access_level || 'free',
      free_questions_used: profile?.free_questions_used || 0,
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[check-access] Error:', error);
    }
    // Return default values instead of failing - NEVER sign out
    return NextResponse.json({
      access_level: 'free',
      free_questions_used: 0,
    });
  }
}

