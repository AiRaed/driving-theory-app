import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side route handler for password reset code exchange
 * This handles PKCE flow which requires server-side cookie management
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Missing code parameter' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Exchange code for session (PKCE flow)
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  // If successful, redirect to reset page without code (session is now in cookies)
  const url = new URL('/auth/reset', request.url);
  return NextResponse.redirect(url);
}

