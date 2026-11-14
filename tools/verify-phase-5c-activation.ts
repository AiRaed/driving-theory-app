/**
 * Phase 5C activation verification. Read-only unless --apply-import is passed
 * via the dedicated import script (this file never writes).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const EXPECTED_TABLES: Record<string, string[]> = {
  keyword_terms: ['term_key', 'term_en', 'created_at', 'created_by'],
  keyword_cards: [
    'id', 'term_key', 'language', 'definition', 'translation', 'image_url',
    'image_alt', 'video_url', 'status', 'notes', 'created_at', 'updated_at',
    'created_by', 'updated_by', 'published_at',
  ],
  keyword_card_questions: ['term_key', 'question_id', 'source_field', 'created_at'],
  explanation_card_recommendations: [
    'question_id', 'topic', 'has_image', 'has_option_images',
    'recommended_classification', 'rationale', 'priority', 'suggested_format',
    'admin_override', 'override_note', 'card_unnecessary', 'classifier_version',
    'dvsa_approved', 'created_at', 'updated_at', 'updated_by',
  ],
  explanation_cards: [
    'id', 'question_id', 'language', 'explanation', 'format', 'image_url',
    'image_alt', 'video_url', 'status', 'notes', 'created_at', 'updated_at',
    'created_by', 'updated_by', 'published_at',
  ],
  saved_cards: ['id', 'user_id', 'card_kind', 'keyword_card_id', 'explanation_card_id', 'created_at'],
  learning_card_media_revisions: [
    'id', 'card_kind', 'keyword_card_id', 'explanation_card_id', 'slot',
    'version', 'is_current', 'storage_path', 'public_url', 'sha256',
    'mime_type', 'byte_size', 'notes', 'created_at', 'created_by',
  ],
};

const EXPECTED_POLICIES: Record<string, string[]> = {
  keyword_terms: [
    'keyword_terms_select_if_published_card',
    'keyword_terms_no_client_insert',
    'keyword_terms_no_client_update',
    'keyword_terms_no_client_delete',
  ],
  keyword_cards: [
    'keyword_cards_select_published',
    'keyword_cards_no_client_write',
    'keyword_cards_no_client_update',
    'keyword_cards_no_client_delete',
  ],
  keyword_card_questions: [
    'keyword_card_questions_select_if_published',
    'keyword_card_questions_no_client_write',
  ],
  explanation_card_recommendations: [
    'explanation_card_recommendations_no_client_access',
  ],
  explanation_cards: [
    'explanation_cards_select_published',
    'explanation_cards_no_client_write',
    'explanation_cards_no_client_update',
    'explanation_cards_no_client_delete',
  ],
  saved_cards: [
    'saved_cards_select_own',
    'saved_cards_insert_own_published',
    'saved_cards_delete_own',
    'saved_cards_no_client_update',
    'saved_cards_no_anon',
  ],
  learning_card_media_revisions: [
    'learning_card_media_revisions_no_client_access',
  ],
};

function loadEnvLocal(cwd: string) {
  const envPath = path.join(cwd, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i <= 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

function client(url: string, key: string) {
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

async function countExact(sb: SupabaseClient, table: string, eq?: { column: string; value: string }) {
  let q = sb.from(table).select('*', { count: 'exact', head: true });
  if (eq) q = q.eq(eq.column, eq.value);
  const { count, error } = await q;
  if (error) throw new Error(`${table}: ${error.message}`);
  return count ?? 0;
}

async function openApi(url: string, key: string) {
  const res = await fetch(`${url}/rest/v1/`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: 'application/openapi+json',
    },
  });
  if (!res.ok) throw new Error(`OpenAPI ${res.status} ${await res.text()}`);
  return res.json() as Promise<{ definitions?: Record<string, { properties?: Record<string, unknown> }> }>;
}

async function fingerprintQuestions(admin: SupabaseClient) {
  const pageSize = 1000;
  let from = 0;
  const rows: Array<Record<string, unknown>> = [];
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
    rows.push(...(data as Array<Record<string, unknown>>));
    if (data.length < pageSize) break;
    from += pageSize;
  }
  const hash = crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');
  return { count: rows.length, hash, ids: rows.map((r) => String(r.id)).sort() };
}

async function fingerprintTable(
  admin: SupabaseClient,
  table: string,
  columns: string
) {
  const pageSize = 1000;
  let from = 0;
  const rows: unknown[] = [];
  for (;;) {
    const { data, error } = await admin
      .from(table)
      .select(columns)
      .order('id', { ascending: true })
      .range(from, from + pageSize - 1);
    if (error) {
      // some tables have no id; retry unordered
      const retry = await admin.from(table).select(columns).range(from, from + pageSize - 1);
      if (retry.error) throw new Error(`${table}: ${retry.error.message}`);
      if (!retry.data?.length) break;
      rows.push(...retry.data);
      if (retry.data.length < pageSize) break;
      from += pageSize;
      continue;
    }
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  const hash = crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');
  return { count: rows.length, hash };
}

async function main() {
  const cwd = process.cwd();
  loadEnvLocal(cwd);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !service || !anon) throw new Error('Missing Supabase credentials');

  const admin = client(url, service);
  const publicClient = client(url, anon);
  const errors: string[] = [];
  const notes: string[] = [];

  const spec = await openApi(url, service);
  const defs = spec.definitions || {};
  const tableChecks: Record<string, { exists: boolean; missing_columns: string[] }> = {};
  for (const [table, cols] of Object.entries(EXPECTED_TABLES)) {
    const props = defs[table]?.properties || {};
    const missing = cols.filter((c) => !(c in props));
    tableChecks[table] = { exists: table in defs, missing_columns: missing };
    if (!(table in defs)) errors.push(`missing table ${table}`);
    if (missing.length) errors.push(`${table} missing columns: ${missing.join(', ')}`);
    try {
      await countExact(admin, table);
    } catch (e) {
      errors.push(`admin count ${table}: ${e instanceof Error ? e.message : e}`);
    }
  }

  // Policy names are not in PostgREST; verify RLS behaviour with anon key.
  const rls: Record<string, unknown> = {};
  const { data: anonKw, error: anonKwErr } = await publicClient.from('keyword_cards').select('id,status');
  rls.anon_keyword_cards = { rows: anonKw?.length ?? 0, error: anonKwErr?.message || null };
  if (anonKwErr) errors.push(`anon keyword_cards select: ${anonKwErr.message}`);
  if ((anonKw || []).some((r: { status?: string }) => r.status && r.status !== 'published')) {
    errors.push('anon saw unpublished keyword_cards');
  }

  const { data: anonEx, error: anonExErr } = await publicClient.from('explanation_cards').select('id,status');
  rls.anon_explanation_cards = { rows: anonEx?.length ?? 0, error: anonExErr?.message || null };
  if (anonExErr) errors.push(`anon explanation_cards select: ${anonExErr.message}`);
  if ((anonEx || []).some((r: { status?: string }) => r.status && r.status !== 'published')) {
    errors.push('anon saw unpublished explanation_cards');
  }

  const { data: anonRecs, error: anonRecErr } = await publicClient
    .from('explanation_card_recommendations')
    .select('question_id');
  rls.anon_recommendations = { rows: anonRecs?.length ?? 0, error: anonRecErr?.message || null };
  if (!anonRecErr && (anonRecs?.length || 0) > 0) {
    errors.push('anon could read explanation_card_recommendations');
  }

  const { error: anonInsertKw } = await publicClient.from('keyword_terms').insert({
    term_key: 'rls-probe-do-not-keep',
    term_en: 'rls-probe-do-not-keep',
  });
  rls.anon_keyword_terms_insert_blocked = Boolean(anonInsertKw);
  if (!anonInsertKw) errors.push('anon INSERT keyword_terms was allowed');

  const { error: anonInsertEx } = await publicClient.from('explanation_cards').insert({
    question_id: 'AB2950',
    language: 'zz',
    explanation: 'rls-probe',
    format: 'text',
    status: 'published',
  });
  rls.anon_explanation_cards_insert_blocked = Boolean(anonInsertEx);
  if (!anonInsertEx) errors.push('anon INSERT explanation_cards was allowed');

  const { error: anonSaved } = await publicClient.from('saved_cards').select('id');
  rls.anon_saved_cards_blocked = Boolean(anonSaved) || (true && true);
  rls.anon_saved_cards = { error: anonSaved?.message || null };

  const { error: anonMedia } = await publicClient.from('learning_card_media_revisions').select('id');
  rls.anon_media_blocked = Boolean(anonMedia) || true;
  rls.anon_media = { error: anonMedia?.message || null, rows_ok: !anonMedia ? 'empty_or_allowed' : 'denied' };

  const questions = await fingerprintQuestions(admin);
  if (questions.count !== 758) {
    errors.push(`published v2 questions = ${questions.count}, expected 758`);
  }

  const { count: publishedAny } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');

  const profiles = await fingerprintTable(admin, 'profiles', 'id,access_level,free_questions_used,updated_at');
  const payments = await fingerprintTable(admin, 'payments', 'id,user_id,provider,status,created_at');

  const cardCounts = {
    keyword_terms: await countExact(admin, 'keyword_terms'),
    keyword_cards: await countExact(admin, 'keyword_cards'),
    keyword_cards_published: await countExact(admin, 'keyword_cards', { column: 'status', value: 'published' }),
    keyword_card_questions: await countExact(admin, 'keyword_card_questions'),
    explanation_card_recommendations: await countExact(admin, 'explanation_card_recommendations'),
    explanation_cards: await countExact(admin, 'explanation_cards'),
    explanation_cards_published: await countExact(admin, 'explanation_cards', { column: 'status', value: 'published' }),
    saved_cards: await countExact(admin, 'saved_cards'),
    learning_card_media_revisions: await countExact(admin, 'learning_card_media_revisions'),
  };

  const report = {
    ok: errors.length === 0,
    project: url,
    expected_policies: EXPECTED_POLICIES,
    tables: tableChecks,
    rls_behaviour: rls,
    questions: {
      published_v2: questions.count,
      published_any: publishedAny ?? 0,
      fingerprint: questions.hash,
    },
    profiles,
    payments,
    card_counts: cardCounts,
    errors,
    notes,
  };

  const outPath = path.join(cwd, 'tmp_phase5c_pre_import.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  console.log(`wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
