import { NextResponse } from 'next/server';
import { requireAdminApi } from '@/lib/admin/auth';
import { createServiceClient } from '@/lib/admin/supabaseAdmin';
import {
  KNOWN_LANGS,
  TOPIC_META,
  getTranslation,
  langBadgeStatus,
  questionNeedsReview,
  rowToTranslationsMap,
  type QuestionRow,
} from '@/lib/questions/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAdminApi();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const admin = createServiceClient();

    const { data: rows, error } = await admin
      .from('questions')
      .select(
        'id, status, image_url, question_ar, question_ur, translations, correct_answer, answer_1_en, answer_2_en, topic_id, answer_1_ar, answer_1_ur, answer_2_ar, answer_2_ur, answer_3_ar, answer_3_ur, answer_4_ar, answer_4_ur, explanation_ar, explanation_ur'
      );

    if (error) {
      // Table may not exist yet, or translations column missing — retry without it
      const retry = await admin
        .from('questions')
        .select(
          'id, status, image_url, question_ar, question_ur, correct_answer, answer_1_en, answer_2_en, topic_id, answer_1_ar, answer_1_ur, answer_2_ar, answer_2_ur, answer_3_ar, answer_3_ur, answer_4_ar, answer_4_ur, explanation_ar, explanation_ur'
        );

      if (retry.error) {
        return NextResponse.json({
          total: 0,
          published: 0,
          drafts: 0,
          archived: 0,
          withImages: 0,
          missingArabic: 0,
          missingUrdu: 0,
          needsReview: 0,
          translationCounts: Object.fromEntries(KNOWN_LANGS.map((l) => [l.code, 0])),
          topics: TOPIC_META.length,
          tableReady: false,
          message: retry.error.message,
        });
      }

      return buildStats((retry.data || []) as QuestionRow[]);
    }

    return buildStats((rows || []) as QuestionRow[]);
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}

async function buildStats(list: QuestionRow[]) {
  const admin = createServiceClient();
  const published = list.filter((r) => r.status === 'published').length;
  const drafts = list.filter((r) => r.status === 'draft').length;
  const archived = list.filter((r) => r.status === 'archived').length;
  const withImages = list.filter((r) => !!r.image_url).length;

  const translationCounts: Record<string, number> = Object.fromEntries(
    KNOWN_LANGS.map((l) => [l.code, 0])
  );

  let missingArabic = 0;
  let missingUrdu = 0;
  let needsReview = 0;

  for (const r of list) {
    const badges = langBadgeStatus(r);
    if (!badges.ar) missingArabic += 1;
    if (!badges.ur) missingUrdu += 1;
    if (questionNeedsReview(r)) needsReview += 1;

    const map = rowToTranslationsMap(r);
    for (const [code, t] of Object.entries(map)) {
      if (getTranslation(map, code)?.question?.trim() || t?.question?.trim()) {
        translationCounts[code] = (translationCounts[code] || 0) + 1;
      }
    }
  }

  const { data: recent } = await admin
    .from('questions')
    .select('id, question_en, topic_id, status, updated_at')
    .order('updated_at', { ascending: false })
    .limit(8);

  return NextResponse.json({
    total: list.length,
    published,
    drafts,
    archived,
    withImages,
    missingArabic,
    missingUrdu,
    needsReview,
    translationCounts,
    topics: TOPIC_META.length,
    recent: recent || [],
    tableReady: true,
  });
}
