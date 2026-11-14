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
  if (bank.source !== 'database' || bank.count === 0) {
    // Fail closed — never serve the obsolete static 742 bank.
    return NextResponse.json(
      {
        error: 'bank_unavailable',
        message: 'Question bank temporarily unavailable.',
        source: bank.source,
        count: 0,
        reasons: bank.reasons?.slice(0, 5),
      },
      { status: 503 }
    );
  }
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
