import { NextResponse } from 'next/server';
import {
  contentMaintenanceJsonBody,
  isContentMaintenanceMode,
} from '@/lib/maintenance/contentMaintenance';

export const dynamic = 'force-dynamic';

/** Public maintenance status for Web / iOS / Android WebViews. */
export async function GET() {
  return NextResponse.json({
    content_maintenance: isContentMaintenanceMode(),
    message: isContentMaintenanceMode()
      ? contentMaintenanceJsonBody().message
      : null,
  });
}
