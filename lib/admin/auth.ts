import type { User } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/supabase/auth';

/** Server-only admin email. Prefer ADMIN_EMAIL; never rely on UI alone. */
export function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
}

export function isAdminEmail(email: string | null | undefined): boolean {
  const admin = getAdminEmail();
  if (!admin || !email) return false;
  return email.trim().toLowerCase() === admin;
}

export function isAdminUser(user: User | null | undefined): boolean {
  return isAdminEmail(user?.email);
}

/** For Server Components / pages — redirects if not admin. */
export async function requireAdmin(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth?next=/admin');
  }
  if (!isAdminUser(user) || !getAdminEmail()) {
    if (!getAdminEmail()) {
      console.error('[admin] ADMIN_EMAIL is not configured');
    }
    redirect('/dashboard');
  }
  return user;
}

/** For API routes — returns user or null (no redirect). */
export async function requireAdminApi(): Promise<User | null> {
  const user = await getCurrentUser();
  if (!user || !isAdminUser(user) || !getAdminEmail()) {
    return null;
  }
  return user;
}

export async function getAdminUserOrNull(): Promise<User | null> {
  return requireAdminApi();
}
