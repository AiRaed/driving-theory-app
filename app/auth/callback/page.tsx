import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface PageProps {
  searchParams: {
    code?: string;
    token_hash?: string;
    type?: string;
    error?: string;
    error_code?: string;
    error_description?: string;
  };
}

export default async function CallbackPage({ searchParams }: PageProps) {
  const params = searchParams;
  
  // Check for errors first
  if (params.error) {
    redirect(`/auth?error=confirm_failed`);
  }

  const supabase = await createClient();

  // If code exists, exchange it for a session
  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code);
    
    if (error) {
      // If exchange fails, redirect to auth with error
      redirect(`/auth?error=confirm_failed`);
    }
    
    // Get user after session exchange
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Ensure profile exists for new users
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        if (process.env.NODE_ENV === 'development') {
          console.log('[Callback] Creating profile for new user:', user.id);
        }
        
        await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            access_level: 'free',
            free_questions_used: 0,
          });
      } else if (process.env.NODE_ENV === 'development' && profile) {
        console.log('[Callback] Profile exists for user:', user.id);
      }
    }
    
    // Successfully exchanged code for session, redirect to dashboard
    redirect('/dashboard');
  }

  // No code, but check if user session exists
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    // User has a session, ensure profile exists
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      // Profile doesn't exist, create it
      if (process.env.NODE_ENV === 'development') {
        console.log('[Callback] Creating profile for user:', session.user.id);
      }
      
      await supabase
        .from('profiles')
        .insert({
          id: session.user.id,
          email: session.user.email,
          access_level: 'free',
          free_questions_used: 0,
        });
    }
    
    // User has a session, redirect to dashboard
    redirect('/dashboard');
  }

  // No code and no session, redirect to auth with confirmed flag
  redirect('/auth?confirmed=1');
}

