/**
 * Import Learning Cards recommendations + local drafts into Supabase.
 *
 * Default: --dry-run (no network writes).
 * Live apply (later approved window only):
 *   --apply --confirm-shared-supabase
 *
 * Never publishes. Never mutates questions / profiles / payments.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { assertImportConfirm } from '../lib/learning-cards/guard';
import { planLearningCardsImport } from '../lib/learning-cards/importPlan';
import { readLocalLearningCards } from '../lib/learning-cards/localStore';
import { loadBundledRecommendations } from '../lib/learning-cards/recommendations';
import { DVSA_V2_EXPECTED_COUNT } from '../lib/questions/dvsaV2';

function loadEnvLocal(cwd: string) {
  const envPath = path.join(cwd, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i <= 0) continue;
    let k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

function chunk<T>(rows: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < rows.length; i += size) out.push(rows.slice(i, i + size));
  return out;
}

async function main() {
  const argv = process.argv.slice(2);
  assertImportConfirm(argv);
  const apply = argv.includes('--apply');
  loadEnvLocal(process.cwd());

  const recs = loadBundledRecommendations();
  if (recs.length !== DVSA_V2_EXPECTED_COUNT) {
    throw new Error(`Expected ${DVSA_V2_EXPECTED_COUNT} recommendations, got ${recs.length}`);
  }
  const ids = new Set(recs.map((r) => r.question_id));
  if (ids.size !== DVSA_V2_EXPECTED_COUNT) {
    throw new Error('Recommendation IDs are not unique');
  }
  for (const rec of recs) {
    if (rec.dvsa_approved !== false) throw new Error('dvsa_approved must be false');
  }

  const plan = planLearningCardsImport({
    recommendations: recs,
    localState: readLocalLearningCards(),
  });
  if (plan.published) throw new Error('Import plan must never publish');
  if (plan.keyword_cards.some((c) => c.status === 'published')) {
    throw new Error('Import plan contains published keyword cards');
  }
  if (plan.explanation_cards.some((c) => c.status === 'published')) {
    throw new Error('Import plan contains published explanation cards');
  }

  const report = {
    ok: true,
    mode: apply ? 'apply' : 'dry-run',
    live_database_written: false,
    published: false,
    dvsa_approved: false,
    unique_recommendation_ids: plan.unique_recommendation_ids,
    recommendation_count: plan.recommendations.length,
    keyword_terms: plan.keyword_terms.length,
    keyword_cards: plan.keyword_cards.length,
    keyword_card_questions: plan.keyword_card_questions.length,
    explanation_cards: plan.explanation_cards.length,
    coerced_from_published: plan.coerced_from_published,
    skipped_saved_cards: plan.skipped_saved_cards,
    questions_mutated: false,
    profiles_mutated: false,
    payments_mutated: false,
  };

  if (!apply) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const upsert = async (table: string, rows: Array<Record<string, unknown>>, onConflict: string) => {
    for (const part of chunk(rows, 100)) {
      const { error } = await supabase.from(table).upsert(part, { onConflict });
      if (error) throw new Error(`${table}: ${error.message}`);
    }
  };

  if (plan.keyword_terms.length) {
    await upsert('keyword_terms', plan.keyword_terms, 'term_key');
  }
  if (plan.keyword_cards.length) {
    await upsert('keyword_cards', plan.keyword_cards, 'term_key,language');
  }
  if (plan.keyword_card_questions.length) {
    await upsert('keyword_card_questions', plan.keyword_card_questions, 'term_key,question_id');
  }
  await upsert('explanation_card_recommendations', plan.recommendations, 'question_id');
  if (plan.explanation_cards.length) {
    await upsert('explanation_cards', plan.explanation_cards, 'question_id,language');
  }

  report.live_database_written = true;
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
