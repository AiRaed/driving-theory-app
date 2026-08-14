/**
 * Verify question bank completeness (static vs Supabase).
 *
 * Usage:
 *   npm run verify:questions
 *
 * Requires env (same as import):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Exits 1 if published unique ids !== 742.
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { questions } from '../data/questions';
import {
  EXPECTED_PUBLISHED_COUNT,
  getTranslation,
  isDatabaseBankComplete,
  rowToTranslationsMap,
  type QuestionRow,
  type TranslationsMap,
} from '../lib/questions/types';

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const staticCount = questions.length;
  console.log('=== Question bank verification ===');
  console.log('Static source count:', staticCount);
  console.log('Expected published unique:', EXPECTED_PUBLISHED_COUNT);

  let { data, error } = await supabase.from('questions').select('*');
  if (error && /translations/i.test(error.message)) {
    ({ data, error } = await supabase
      .from('questions')
      .select(
        'id, topic_id, status, question_en, question_ar, question_ur, answer_1_en, answer_2_en, answer_3_en, answer_4_en, answer_1_ar, answer_1_ur, answer_2_ar, answer_2_ur, answer_3_ar, answer_3_ur, answer_4_ar, answer_4_ur, explanation_ar, explanation_ur, correct_answer, image_url'
      ));
  }
  if (error) {
    console.error('DB query failed:', error.message);
    process.exit(1);
  }

  const rows = (data || []) as QuestionRow[];
  const ids = rows.map((r) => r.id);
  const uniqueIds = new Set(ids);
  const published = rows.filter((r) => r.status === 'published');
  const publishedIds = published.map((r) => r.id);
  const publishedUnique = new Set(publishedIds);
  const topics = new Set(rows.map((r) => r.topic_id).filter(Boolean));
  const withImages = rows.filter((r) => !!r.image_url).length;

  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  const publishedDupes = publishedIds.filter((id, i) => publishedIds.indexOf(id) !== i);

  let arCount = 0;
  let urCount = 0;
  const extraLangCounts: Record<string, number> = {};

  for (const row of rows) {
    const map = rowToTranslationsMap(row);
    if (getTranslation(map, 'ar')?.question?.trim() || row.question_ar?.trim()) arCount += 1;
    if (getTranslation(map, 'ur')?.question?.trim() || row.question_ur?.trim()) urCount += 1;
    for (const code of Object.keys(map)) {
      if (code === 'ar' || code === 'ur') continue;
      if (getTranslation(map, code)?.question?.trim()) {
        extraLangCounts[code] = (extraLangCounts[code] || 0) + 1;
      }
    }
  }

  // Detect whether translations jsonb came back
  const sampleHasTranslations = rows.some(
    (r) => r.translations && typeof r.translations === 'object' && Object.keys(r.translations as TranslationsMap).length >= 0
  );

  console.log('---');
  console.log('DB total rows:', rows.length);
  console.log('DB unique ids:', uniqueIds.size);
  console.log('DB published:', published.length);
  console.log('DB published unique:', publishedUnique.size);
  console.log('Topics count:', topics.size);
  console.log('With images:', withImages);
  console.log('Arabic translations:', arCount);
  console.log('Urdu translations:', urCount);
  if (Object.keys(extraLangCounts).length) {
    console.log('Extra lang counts:', extraLangCounts);
  }
  console.log('Duplicate ids:', dupes.length ? Array.from(new Set(dupes)).join(', ') : '(none)');
  console.log(
    'Published duplicate ids:',
    publishedDupes.length ? Array.from(new Set(publishedDupes)).join(', ') : '(none)'
  );
  console.log('translations column present in select:', sampleHasTranslations || rows.length === 0);

  const gate = isDatabaseBankComplete(published, EXPECTED_PUBLISHED_COUNT);
  console.log('---');
  console.log('Completeness gate ok:', gate.ok);
  if (!gate.ok) {
    console.log('Reasons (sample):');
    for (const r of gate.reasons.slice(0, 15)) console.log(' -', r);
  }

  const ok =
    publishedUnique.size === EXPECTED_PUBLISHED_COUNT &&
    published.length === EXPECTED_PUBLISHED_COUNT &&
    dupes.length === 0;

  if (!ok) {
    console.error(
      `FAIL: need ${EXPECTED_PUBLISHED_COUNT} published unique questions (got published=${published.length}, unique=${publishedUnique.size})`
    );
    process.exit(1);
  }

  console.log('PASS: 742 published unique questions.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
