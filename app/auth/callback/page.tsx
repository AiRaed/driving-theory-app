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
    
    // Successfully exchanged code for session, redirect to dashboard
    redirect('/dashboard');
  }

  // No code, but check if user session exists
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    // User has a session, redirect to dashboard
    redirect('/dashboard');
  }

  // No code and no session, redirect to auth with confirmed flag
  redirect('/auth?confirmed=1');
}

