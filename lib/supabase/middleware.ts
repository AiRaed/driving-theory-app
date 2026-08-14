import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedPaths = ['/practice', '/mock-test', '/dashboard', '/admin'];
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path));
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');

  // Allow auth routes (callback, reset)
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth/callback') || 
                       request.nextUrl.pathname.startsWith('/auth/reset');

  if (isProtectedPath && !user && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/auth';
    url.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // Admin: authenticated + email must match ADMIN_EMAIL (server env)
  if (isAdminPath && user) {
    const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
    const userEmail = (user.email || '').trim().toLowerCase();
    if (!adminEmail || userEmail !== adminEmail) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Redirect authenticated users away from auth pages (except callback and reset)
  if (request.nextUrl.pathname.startsWith('/auth') && !isAuthRoute && user) {
    const next = request.nextUrl.searchParams.get('next');
    return NextResponse.redirect(new URL(next || '/dashboard', request.url));
  }

  return supabaseResponse;
}

