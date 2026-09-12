import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await requireAdminApi();
  if (!user) {
    // 401 for non-admin / unauthenticated — UI link stays hidden; not an unlock.
    return NextResponse.json({ isAdmin: false }, { status: 401 });
  }
  return NextResponse.json({ isAdmin: true });
}
