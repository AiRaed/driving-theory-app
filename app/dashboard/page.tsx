import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  // Ensure profile exists - create if missing
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code === 'PGRST116') {
    // Profile doesn't exist, create it
    if (process.env.NODE_ENV === 'development') {
      console.log('[Dashboard] Creating profile for user:', user.id);
    }
    
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: user.id,
        email: user.email,
        access_level: 'free',
        free_questions_used: 0,
      });

    if (insertError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Dashboard] Error creating profile:', insertError);
      }
      // Don't fail - let client handle it
    } else if (process.env.NODE_ENV === 'development') {
      console.log('[Dashboard] Profile created successfully for user:', user.id);
    }
  } else if (profileError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Dashboard] Error fetching profile:', profileError);
    }
    // Don't fail - let client handle it
  } else if (process.env.NODE_ENV === 'development') {
    console.log('[Dashboard] Profile exists for user:', user.id, 'access_level:', profile?.access_level);
  }

  return <DashboardClient />;
}

