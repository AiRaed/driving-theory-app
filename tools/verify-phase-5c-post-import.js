/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

function loadEnvLocal(cwd) {
  const envPath = path.join(cwd, '.env.local');
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i <= 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim().replace(/\r$/g, '');
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[k]) process.env[k] = v.replace(/\r/g, '');
  }
}

async function fingerprintQuestions(admin) {
  const pageSize = 1000;
  let from = 0;
  const rows = [];
  for (;;) {
    const { data, error } = await admin
      .from('questions')
      .select('id,status,content_version,question_en,answer_1_en,answer_2_en,answer_3_en,answer_4_en,correct_answer,explanation_en')
      .eq('status', 'published')
      .eq('content_version', 'v2')
      .order('id')
      .range(from, from + pageSize - 1);
    if (error) throw new Error(error.message);
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return { count: rows.length, hash: crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex') };
}

async function fingerprintTable(admin, table, columns) {
  const pageSize = 1000;
  let from = 0;
  const rows = [];
  for (;;) {
    const { data, error } = await admin.from(table).select(columns).order('id').range(from, from + pageSize - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return { count: rows.length, hash: crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex') };
}

async function countExact(admin, table, eq) {
  let q = admin.from(table).select('*', { count: 'exact', head: true });
  if (eq) q = q.eq(eq[0], eq[1]);
  const { count, error } = await q;
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

(async () => {
  loadEnvLocal(process.cwd());
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\r/g, '');
  const key = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').replace(/\r/g, '');
  const anon = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').replace(/\r/g, '');
  const admin = createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
  const pub = createClient(url, anon, { auth: { autoRefreshToken: false, persistSession: false } });

  const recAll = [];
  let from = 0;
  for (;;) {
    const { data, error } = await admin
      .from('explanation_card_recommendations')
      .select('question_id,dvsa_approved,recommended_classification,admin_override,card_unnecessary')
      .range(from, from + 999);
    if (error) throw new Error(error.message);
    if (!data?.length) break;
    recAll.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }
  const { data: kwCards, error: kwErr } = await admin.from('keyword_cards').select('id,status,term_key,language,published_at');
  if (kwErr) throw new Error(kwErr.message);
  const { data: exCards, error: exErr } = await admin.from('explanation_cards').select('id,status,question_id,language,published_at');
  if (exErr) throw new Error(exErr.message);
  const { data: terms, error: tErr } = await admin.from('keyword_terms').select('term_key,term_en');
  if (tErr) throw new Error(tErr.message);
  const { data: links, error: lErr } = await admin.from('keyword_card_questions').select('term_key,question_id,source_field');
  if (lErr) throw new Error(lErr.message);
  const { data: anonKw } = await pub.from('keyword_cards').select('id,status');
  const { data: anonEx } = await pub.from('explanation_cards').select('id,status');
  const { data: anonRec } = await pub.from('explanation_card_recommendations').select('question_id');
  const q = await fingerprintQuestions(admin);
  const profiles = await fingerprintTable(admin, 'profiles', 'id,access_level,free_questions_used,updated_at');
  const payments = await fingerprintTable(admin, 'payments', 'id,user_id,provider,status,created_at');
  const { data: access } = await admin.from('profiles').select('access_level');
  const accessDist = {};
  for (const row of access || []) accessDist[row.access_level] = (accessDist[row.access_level] || 0) + 1;
  const recIds = new Set(recAll.map((r) => r.question_id));
  const statuses = ['draft', 'submitted', 'approved', 'published', 'archived'];
  const report = {
    card_counts: {
      explanation_card_recommendations: recAll.length,
      unique_recommendation_ids: recIds.size,
      keyword_terms: (terms || []).length,
      keyword_cards: (kwCards || []).length,
      keyword_card_questions: (links || []).length,
      explanation_cards: (exCards || []).length,
      keyword_cards_published: (kwCards || []).filter((c) => c.status === 'published').length,
      explanation_cards_published: (exCards || []).filter((c) => c.status === 'published').length,
      saved_cards: await countExact(admin, 'saved_cards'),
    },
    keyword_card_statuses: Object.fromEntries(statuses.map((s) => [s, (kwCards || []).filter((c) => c.status === s).length])),
    explanation_card_statuses: Object.fromEntries(statuses.map((s) => [s, (exCards || []).filter((c) => c.status === s).length])),
    keyword_terms: terms,
    keyword_cards: kwCards,
    explanation_cards: (exCards || []).map((c) => ({
      id: c.id,
      question_id: c.question_id,
      language: c.language,
      status: c.status,
      published_at: c.published_at,
    })),
    dvsa_approved_true: recAll.filter((r) => r.dvsa_approved === true).length,
    rec_classifications: recAll.reduce((acc, r) => {
      acc[r.recommended_classification] = (acc[r.recommended_classification] || 0) + 1;
      return acc;
    }, {}),
    questions: q,
    profiles,
    payments,
    entitlement_access_level: accessDist,
    anon_cannot_see_drafts: {
      keyword_cards: (anonKw || []).length,
      explanation_cards: (anonEx || []).length,
      recommendations: (anonRec || []).length,
    },
  };
  fs.writeFileSync('tmp_phase5c_post_import.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
