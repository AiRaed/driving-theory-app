/**
 * Phase 4B pre-import verification against shared Supabase (service role).
 * Read-only. Does not mutate data.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' tools/verify-phase-4b-pre-import.ts
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const PRE_CUTOVER_PUBLISHED = 742;
const EXPECTED_MEDIA = 534;

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
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

async function main() {
  const cwd = process.cwd();
  loadEnvLocal(cwd);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase URL or service role key');

  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const errors: string[] = [];
  const report: Record<string, unknown> = {
    generated_at: new Date().toISOString(),
    host: new URL(url).host,
  };

  // 1) Schema: content_version + option image columns
  const { data: schemaSample, error: schemaErr } = await admin
    .from('questions')
    .select(
      'id,status,content_version,media_review_status,official_locked,official_source_id,media_original_refs,answer_1_image_url,answer_2_image_url,answer_3_image_url,answer_4_image_url'
    )
    .limit(1);
  report.schema_questions_columns = schemaErr
    ? { ok: false, error: schemaErr.message }
    : { ok: true, sample_keys: schemaSample?.[0] ? Object.keys(schemaSample[0]) : [] };
  if (schemaErr) errors.push(`questions schema: ${schemaErr.message}`);

  // 2) question_media_revisions table
  const { count: revCount, error: revErr } = await admin
    .from('question_media_revisions')
    .select('id', { count: 'exact', head: true });
  report.question_media_revisions = revErr
    ? { ok: false, error: revErr.message }
    : { ok: true, count: revCount };
  if (revErr) errors.push(`question_media_revisions: ${revErr.message}`);

  // 3) content_bank_meta
  const { data: meta, error: metaErr } = await admin
    .from('content_bank_meta')
    .select('*')
    .eq('id', 'default')
    .maybeSingle();
  report.content_bank_meta = metaErr
    ? { ok: false, error: metaErr.message }
    : {
        ok: true,
        row: meta,
        active_content_version: meta?.active_content_version,
        expected_published_count: meta?.expected_published_count,
        source_verification_status: meta?.source_verification_status,
      };
  if (metaErr) errors.push(`content_bank_meta: ${metaErr.message}`);
  if (meta && meta.active_content_version !== 'v1') {
    errors.push(`content_bank_meta.active_content_version=${meta.active_content_version} (expected v1)`);
  }
  if (meta && meta.expected_published_count !== PRE_CUTOVER_PUBLISHED) {
    errors.push(
      `content_bank_meta.expected_published_count=${meta.expected_published_count} (expected ${PRE_CUTOVER_PUBLISHED})`
    );
  }

  // 4) Published bank unchanged
  const { count: published, error: pubErr } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  const { count: publishedV1, error: pubV1Err } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('content_version', 'v1');
  const { count: draftV2, error: dErr } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft')
    .eq('content_version', 'v2');
  const { count: total, error: tErr } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true });

  report.counts = {
    published,
    published_v1: publishedV1,
    draft_v2: draftV2,
    total,
    errors: [pubErr, pubV1Err, dErr, tErr].filter(Boolean).map((e) => e!.message),
  };
  if (pubErr) errors.push(`published count: ${pubErr.message}`);
  if (published !== PRE_CUTOVER_PUBLISHED) {
    errors.push(`published=${published} expected ${PRE_CUTOVER_PUBLISHED}`);
  }

  // 5) Media accessibility (sample from upload result; no re-upload)
  const uploadResultPath = path.join(
    cwd,
    'local-data/dvsa/staging/media-upload-result.phase-4b.json'
  );
  const uploadManifestPath = path.join(
    cwd,
    'local-data/dvsa/staging/media-upload-manifest.phase-4a.json'
  );
  let mediaReport: Record<string, unknown> = { ok: false };
  if (fs.existsSync(uploadResultPath) && fs.existsSync(uploadManifestPath)) {
    const result = JSON.parse(fs.readFileSync(uploadResultPath, 'utf8')) as {
      uploaded: number;
      failed: number;
      bucket: string;
      sample_public_url?: string;
      sample_reachable?: boolean;
      results: Array<{ original_ref: string; storage_path: string; public_url: string; ok: boolean }>;
    };
    const manifest = JSON.parse(fs.readFileSync(uploadManifestPath, 'utf8')) as {
      entry_count: number;
      entries: Array<{ original_ref: string; storage_path: string }>;
    };

    const okResults = (result.results || []).filter((r) => r.ok);
    const sample = okResults.slice(0, 5);
    const reachability: Array<{ ref: string; status: number | null; ok: boolean }> = [];
    for (const s of sample) {
      try {
        const res = await fetch(s.public_url, { method: 'HEAD' });
        reachability.push({ ref: s.original_ref, status: res.status, ok: res.ok });
      } catch {
        reachability.push({ ref: s.original_ref, status: null, ok: false });
      }
    }

    // Spot-check storage list for first path prefix
    const listPath = 'v2/unreviewed';
    const { data: listed, error: listErr } = await admin.storage
      .from(result.bucket || 'question-images')
      .list(listPath, { limit: 10 });

    mediaReport = {
      ok:
        result.uploaded === EXPECTED_MEDIA &&
        result.failed === 0 &&
        manifest.entry_count === EXPECTED_MEDIA &&
        reachability.every((r) => r.ok) &&
        !listErr,
      uploaded: result.uploaded,
      failed: result.failed,
      manifest_entries: manifest.entry_count,
      sample_reachability: reachability,
      storage_list_ok: !listErr,
      storage_list_error: listErr?.message || null,
      storage_list_sample_count: listed?.length ?? 0,
      prior_sample_reachable: result.sample_reachable,
    };
    if (result.uploaded !== EXPECTED_MEDIA || result.failed !== 0) {
      errors.push(`media upload incomplete: uploaded=${result.uploaded} failed=${result.failed}`);
    }
    if (!reachability.every((r) => r.ok)) {
      errors.push('media sample HEAD checks failed');
    }
  } else {
    errors.push('missing media upload result or phase-4a manifest');
    mediaReport = { ok: false, error: 'missing files' };
  }
  report.media = mediaReport;

  report.migration_0008 = {
    status: errors.length === 0 ? 'APPLIED' : 'FAILED_OR_INCOMPLETE',
    errors,
  };
  report.verdict = errors.length === 0 ? 'PASS' : 'FAIL';

  const out = path.join(cwd, 'local-data/dvsa/staging/phase-4b-pre-import-verification.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  console.log(`\nWrote ${out}`);
  if (errors.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
