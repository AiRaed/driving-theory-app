import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { buildArabicReview } from '@/lib/i18n/arabic/reviewSummary';

export const dynamic = 'force-dynamic';

/** Read-only Arabic draft review. Does not write Supabase or publish. */
export async function GET() {
  const admin = await requireAdminApi();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    ...buildArabicReview(),
    writes_database: false,
  });
}
