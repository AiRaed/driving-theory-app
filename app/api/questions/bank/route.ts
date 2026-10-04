import { NextResponse } from 'next/server';
import { getLearnerQuestionBank } from '@/lib/questions/bank';
import {
  contentMaintenanceJsonBody,
  isContentMaintenanceMode,
} from '@/lib/maintenance/contentMaintenance';

export const dynamic = 'force-dynamic';

/** Published question bank for Practice / Mock Test clients. */
export async function GET() {
  if (isContentMaintenanceMode()) {
    return NextResponse.json(contentMaintenanceJsonBody(), { status: 503 });
  }

  const bank = await getLearnerQuestionBank();
  return NextResponse.json({
    questions: bank.questions,
    urduByTopic: bank.urduByTopic,
    romanianByTopic: bank.romanianByTopic,
    polishByTopic: bank.polishByTopic,
    portugueseByTopic: bank.portugueseByTopic,
    persianByTopic: bank.persianByTopic,
    source: bank.source,
    count: bank.count,
  });
}
