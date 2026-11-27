import { NextResponse } from 'next/server';
import { isPaidAccessLevel } from '@/lib/access/entitlement';
import {
  contentMaintenanceJsonBody,
  isContentMaintenanceMode,
} from '@/lib/maintenance/contentMaintenance';
import { createClient } from '@/lib/supabase/server';

export async function requirePaidMockUser() {
  if (isContentMaintenanceMode()) {
    return {
      ok: false as const,
      response: NextResponse.json(contentMaintenanceJsonBody(), { status: 503 }),
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('access_level')
    .eq('id', user.id)
    .maybeSingle();
  if (!isPaidAccessLevel(profile?.access_level)) {
    return {
      ok: false as const,
      response: NextResponse.json({ error: 'mock_requires_paid' }, { status: 403 }),
    };
  }

  return { ok: true as const, supabase, userId: user.id };
}
