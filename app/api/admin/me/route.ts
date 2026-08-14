import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAdminApi();
  return NextResponse.json({ isAdmin: !!user });
}
