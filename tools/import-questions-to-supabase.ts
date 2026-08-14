/**
 * Idempotent import of static question bank → Supabase.
 *
 * Usage (local, after applying migration 0004; 0005 optional but preferred):
 *   npx ts-node --compiler-options "{\"module\":\"commonjs\"}" tools/import-questions-to-supabase.ts
 *
 * Requires env:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * DOES NOT run automatically. DOES NOT deploy. Safe to re-run (upsert by id).
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { questions } from '../data/questions';
import {
  TOPIC_META,
  isMissingColumnError,
  pruneTranslations,
  type TranslationsMap,
} from '../lib/questions/types';

type UrduFile = Record<
  string,
  Record<string, { promptUr?: string; options?: Array<{ ur: string }> }>
>;

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

function loadUrdu(): UrduFile {
  const candidates = [
    path.join(process.cwd(), 'public', 'locales', 'ur.json'),
    path.join(process.cwd(), 'locales', 'ur.json'),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      return JSON.parse(fs.readFileSync(p, 'utf8')) as UrduFile;
    }
  }
  console.warn('Urdu file not found — importing without Urdu');
  return {};
}

function stripExtensible(rows: Record<string, unknown>[]) {
  return rows.map((r) => {
    const next = { ...r };
    delete next.translations;
    delete next.source_id;
    return next;
  });
}

async function main() {
  loadEnvLocal();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const urdu = loadUrdu();
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('Source questions:', questions.length);
  console.log('Source topics:', TOPIC_META.length);

  const { error: topicErr } = await supabase.from('topics').upsert(
    TOPIC_META.map((t) => ({
      id: t.id,
      label_en: t.label_en,
      label_ar: t.label_ar,
      label_ur: t.label_ur,
      sort_order: t.sort_order,
    })),
    { onConflict: 'id' }
  );
  if (topicErr) {
    console.error('Topics upsert failed:', topicErr.message);
    process.exit(1);
  }
  console.log('Topics upserted:', TOPIC_META.length);

  let usedTranslationsColumn = true;
  let loggedFallback = false;

  const rows = questions.map((q, index) => {
    const u = urdu[q.topic]?.[q.id];
    const opts = q.options || [];
    const correctIdx = Math.max(0, opts.findIndex((o) => o.correct));
    const pad = (i: number) => opts[i] || { en: '', ar: '', correct: false };
    const hint = q.keywords?.find((k) => k.term.startsWith('hint'));

    const question_ar = q.promptAr || '';
    const question_ur = u?.promptUr || '';
    const answer_1_ar = pad(0).ar || '';
    const answer_1_ur = u?.options?.[0]?.ur || '';
    const answer_2_ar = pad(1).ar || '';
    const answer_2_ur = u?.options?.[1]?.ur || '';
    const answer_3_ar = pad(2).ar || '';
    const answer_3_ur = u?.options?.[2]?.ur || '';
    const answer_4_ar = pad(3).ar || '';
    const answer_4_ur = u?.options?.[3]?.ur || '';
    const explanation_en = hint?.explainEn || null;
    const explanation_ar = hint?.explainAr || null;
    const explanation_ur: string | null = null;

    const translations: TranslationsMap = pruneTranslations({
      ar: {
        question: question_ar,
        answers: [answer_1_ar, answer_2_ar, answer_3_ar, answer_4_ar],
        explanation: explanation_ar || '',
      },
      ur: {
        question: question_ur,
        answers: [answer_1_ur, answer_2_ur, answer_3_ur, answer_4_ur],
        explanation: explanation_ur || '',
      },
    });

    return {
      id: q.id,
      topic_id: q.topic,
      question_en: q.promptEn,
      question_ar,
      question_ur,
      answer_1_en: pad(0).en,
      answer_1_ar,
      answer_1_ur,
      answer_2_en: pad(1).en,
      answer_2_ar,
      answer_2_ur,
      answer_3_en: pad(2).en,
      answer_3_ar,
      answer_3_ur,
      answer_4_en: pad(3).en,
      answer_4_ar,
      answer_4_ur,
      correct_answer: correctIdx + 1,
      explanation_en,
      explanation_ar,
      explanation_ur,
      keywords: q.keywords || [],
      image_url: q.image || null,
      image_alt: q.image ? `${q.topic} diagram` : null,
      status: 'published',
      sort_order: index,
      source_id: q.id,
      translations,
    };
  });

  const batchSize = 100;
  let upserted = 0;
  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize) as Record<string, unknown>[];
    let { error } = await supabase.from('questions').upsert(batch, { onConflict: 'id' });
    if (
      error &&
      (isMissingColumnError(error, 'translations') || isMissingColumnError(error, 'source_id'))
    ) {
      if (!loggedFallback) {
        console.warn(
          'translations/source_id column missing — upserting flat columns only (apply migration 0005)'
        );
        loggedFallback = true;
      }
      usedTranslationsColumn = false;
      ({ error } = await supabase
        .from('questions')
        .upsert(stripExtensible(batch), { onConflict: 'id' }));
    }
    if (error) {
      console.error(`Batch ${i}-${i + batch.length} failed:`, error.message);
      process.exit(1);
    }
    upserted += batch.length;
    console.log(`Upserted ${upserted}/${rows.length}`);
  }

  // Verification summary
  let { data: allRows, error: verifyErr } = await supabase
    .from('questions')
    .select('id, status, question_ar, question_ur, translations, image_url, topic_id');

  if (verifyErr && /translations/i.test(verifyErr.message)) {
    ({ data: allRows, error: verifyErr } = await supabase
      .from('questions')
      .select('id, status, question_ar, question_ur, image_url, topic_id'));
  }

  if (verifyErr) {
    console.error('Verify query failed:', verifyErr.message);
    process.exit(1);
  }

  const list = allRows || [];
  const published = list.filter((r) => r.status === 'published');
  const uniqueIds = new Set(published.map((r) => r.id));
  const withAr = published.filter((r) => {
    const t = r.translations as TranslationsMap | null | undefined;
    return !!(t?.ar?.question?.trim() || r.question_ar?.trim());
  }).length;
  const withUr = published.filter((r) => {
    const t = r.translations as TranslationsMap | null | undefined;
    return !!(t?.ur?.question?.trim() || r.question_ur?.trim());
  }).length;
  const withImages = published.filter((r) => !!r.image_url).length;
  const topics = new Set(published.map((r) => r.topic_id)).size;

  console.log('---');
  console.log('Import complete');
  console.log('Published in DB:', published.length);
  console.log('Unique published ids:', uniqueIds.size);
  console.log('Topics represented:', topics);
  console.log('With Arabic:', withAr);
  console.log('With Urdu:', withUr);
  console.log('With images:', withImages);
  console.log('translations column used:', usedTranslationsColumn);
  console.log('Expected source:', questions.length);
  if (published.length !== questions.length || uniqueIds.size !== questions.length) {
    console.warn('WARNING: counts differ — investigate before relying on DB in production');
  } else {
    console.log('Counts match.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
