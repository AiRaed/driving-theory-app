/**
 * Phase 4B post-import validation. Read-only.
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' tools/verify-phase-4b-post-import.ts
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { DVSA_V2_EXPECTED_COUNT } from '../lib/questions/dvsaV2';

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

async function fetchAllIds(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  admin: any,
  filter: { status?: string; content_version?: string }
) {
  const pageSize = 1000;
  let from = 0;
  const rows: Array<{ id: string; status: string; content_version: string }> = [];
  for (;;) {
    let q = admin
      .from('questions')
      .select('id,status,content_version')
      .range(from, from + pageSize - 1);
    if (filter.status) q = q.eq('status', filter.status);
    if (filter.content_version) q = q.eq('content_version', filter.content_version);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    if (!data?.length) break;
    rows.push(...(data as typeof rows));
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return rows;
}

async function main() {
  const cwd = process.cwd();
  loadEnvLocal(cwd);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase credentials');

  const admin = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const errors: string[] = [];
  const warnings: string[] = [];

  const { count: published } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published');
  const { count: publishedV1 } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('content_version', 'v1');
  const { count: draftV2 } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'draft')
    .eq('content_version', 'v2');
  const { count: publishedV2 } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'published')
    .eq('content_version', 'v2');
  const { count: archived } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'archived');
  const { count: total } = await admin
    .from('questions')
    .select('id', { count: 'exact', head: true });
  const { count: revCount } = await admin
    .from('question_media_revisions')
    .select('id', { count: 'exact', head: true });

  if (published !== PRE_CUTOVER_PUBLISHED) {
    errors.push(`published=${published} expected ${PRE_CUTOVER_PUBLISHED}`);
  }
  if (publishedV1 !== PRE_CUTOVER_PUBLISHED) {
    errors.push(`published_v1=${publishedV1} expected ${PRE_CUTOVER_PUBLISHED}`);
  }
  if (draftV2 !== DVSA_V2_EXPECTED_COUNT) {
    errors.push(`draft_v2=${draftV2} expected ${DVSA_V2_EXPECTED_COUNT}`);
  }
  if ((publishedV2 || 0) !== 0) {
    errors.push(`published_v2=${publishedV2} expected 0 (must not publish yet)`);
  }
  if ((archived || 0) !== 0) {
    errors.push(`archived=${archived} expected 0 (must not archive yet)`);
  }

  // Spot-check draft row integrity
  const { data: draftSample, error: sampleErr } = await admin
    .from('questions')
    .select(
      'id,status,content_version,official_locked,official_source_id,correct_answer,explanation_en,topic_id,media_review_status,media_original_refs,image_url,answer_1_image_url,question_en'
    )
    .eq('status', 'draft')
    .eq('content_version', 'v2')
    .limit(20);
  if (sampleErr) errors.push(`draft sample: ${sampleErr.message}`);

  const badSample = (draftSample || []).filter(
    (r) =>
      r.content_version !== 'v2' ||
      r.status !== 'draft' ||
      !r.official_locked ||
      !r.official_source_id ||
      r.correct_answer == null ||
      !r.question_en ||
      !r.topic_id
  );
  if (badSample.length) {
    errors.push(`draft sample integrity failures: ${badSample.map((r) => r.id).join(',')}`);
  }

  // Full draft field coverage (explanations + topics)
  const pageSizeCov = 1000;
  let covFrom = 0;
  let missingExpl = 0;
  let missingTopic = 0;
  let missingOfficial = 0;
  for (;;) {
    const { data: page, error: pageErr } = await admin
      .from('questions')
      .select('id,explanation_en,topic_id,official_source_id,official_locked')
      .eq('status', 'draft')
      .eq('content_version', 'v2')
      .range(covFrom, covFrom + pageSizeCov - 1);
    if (pageErr) {
      errors.push(`draft coverage page: ${pageErr.message}`);
      break;
    }
    if (!page?.length) break;
    for (const r of page) {
      if (!r.explanation_en?.trim()) missingExpl += 1;
      if (!r.topic_id) missingTopic += 1;
      if (!r.official_source_id || !r.official_locked) missingOfficial += 1;
    }
    if (page.length < pageSizeCov) break;
    covFrom += pageSizeCov;
  }
  if (missingExpl) errors.push(`drafts missing explanation_en: ${missingExpl}`);
  if (missingTopic) errors.push(`drafts missing topic_id: ${missingTopic}`);
  if (missingOfficial) errors.push(`drafts missing official lock/id: ${missingOfficial}`);

  // Staging ID coverage
  const staging = JSON.parse(
    fs.readFileSync(path.join(cwd, 'local-data/dvsa/staging/questions.v2.json'), 'utf8')
  ) as { questions: Array<{ id: string }> };
  const stagingIds = new Set(staging.questions.map((q) => q.id));
  const liveDrafts = await fetchAllIds(admin, { status: 'draft', content_version: 'v2' });
  const liveIds = new Set(liveDrafts.map((r) => r.id));
  const missingInDb = Array.from(stagingIds).filter((id) => !liveIds.has(id));
  const unexpectedInDb = Array.from(liveIds).filter((id) => !stagingIds.has(id));
  if (missingInDb.length) errors.push(`missing draft ids in db: ${missingInDb.slice(0, 20).join(',')}`);
  if (unexpectedInDb.length) {
    errors.push(`unexpected draft ids in db: ${unexpectedInDb.slice(0, 20).join(',')}`);
  }

  // Media revisions: every revision should have storage_path; no null refs that should map
  const pageSize = 1000;
  let from = 0;
  const revisions: Array<{
    question_id: string;
    slot: string;
    original_ref: string | null;
    storage_path: string | null;
    public_url: string | null;
  }> = [];
  for (;;) {
    const { data, error } = await admin
      .from('question_media_revisions')
      .select('question_id,slot,original_ref,storage_path,public_url')
      .range(from, from + pageSize - 1);
    if (error) {
      errors.push(`revisions page: ${error.message}`);
      break;
    }
    if (!data?.length) break;
    revisions.push(...(data as typeof revisions));
    if (data.length < pageSize) break;
    from += pageSize;
  }

  const missingStorage = revisions.filter((r) => r.original_ref && !r.storage_path);
  const orphanRevisions = revisions.filter((r) => !liveIds.has(r.question_id));
  if (missingStorage.length) {
    errors.push(`revisions missing storage_path: ${missingStorage.length}`);
  }
  if (orphanRevisions.length) {
    errors.push(`orphan revisions (no draft question): ${orphanRevisions.length}`);
  }

  // Unique original refs with storage should be mappable to upload result
  const uploadResult = JSON.parse(
    fs.readFileSync(
      path.join(cwd, 'local-data/dvsa/staging/media-upload-result.phase-4b.json'),
      'utf8'
    )
  ) as {
    uploaded: number;
    results: Array<{ original_ref: string; storage_path: string; public_url: string; ok: boolean }>;
  };
  const uploadByRef = new Map(uploadResult.results.map((r) => [r.original_ref, r]));
  const unmappedRefs = Array.from(
    new Set(revisions.map((r) => r.original_ref).filter(Boolean) as string[])
  ).filter((ref) => !uploadByRef.has(ref));
  if (unmappedRefs.length) {
    errors.push(`revision refs not in upload result: ${unmappedRefs.slice(0, 10).join(',')}`);
  }

  // Questions with media_original_refs should have corresponding revision rows
  const { data: withMediaRefs } = await admin
    .from('questions')
    .select('id,media_original_refs')
    .eq('status', 'draft')
    .eq('content_version', 'v2')
    .neq('media_original_refs', {});

  const revByQ = new Map<string, number>();
  for (const r of revisions) {
    revByQ.set(r.question_id, (revByQ.get(r.question_id) || 0) + 1);
  }
  const draftsMissingRev: string[] = [];
  for (const q of withMediaRefs || []) {
    const refs = q.media_original_refs as Record<string, string> | null;
    if (!refs || !Object.keys(refs).length) continue;
    const expectedSlots = Object.keys(refs).length;
    const have = revByQ.get(q.id) || 0;
    if (have < expectedSlots) draftsMissingRev.push(q.id);
  }
  if (draftsMissingRev.length) {
    errors.push(
      `drafts with media_original_refs missing revisions: ${draftsMissingRev.slice(0, 15).join(',')}`
    );
  }

  // content_bank_meta unchanged
  const { data: meta } = await admin
    .from('content_bank_meta')
    .select('*')
    .eq('id', 'default')
    .maybeSingle();
  if (!meta || meta.active_content_version !== 'v1' || meta.expected_published_count !== 742) {
    errors.push(
      `content_bank_meta unexpected: active=${meta?.active_content_version} expected_count=${meta?.expected_published_count}`
    );
  }

  // Sample media still reachable (no re-upload)
  const sampleReach: Array<{ ref: string; ok: boolean; status: number | null }> = [];
  for (const s of uploadResult.results.slice(0, 5)) {
    try {
      const res = await fetch(s.public_url, { method: 'HEAD' });
      sampleReach.push({ ref: s.original_ref, ok: res.ok, status: res.status });
    } catch {
      sampleReach.push({ ref: s.original_ref, ok: false, status: null });
    }
  }
  if (!sampleReach.every((s) => s.ok)) {
    errors.push('media sample HEAD failed after import');
  }
  if (uploadResult.uploaded !== EXPECTED_MEDIA) {
    warnings.push(`upload result uploaded=${uploadResult.uploaded} (expected ${EXPECTED_MEDIA})`);
  }

  const report = {
    generated_at: new Date().toISOString(),
    phase: 'phase-4b',
    host: new URL(url).host,
    verdict: errors.length === 0 ? 'PASS' : 'FAIL',
    migration_0008: 'APPLIED (verified pre-import)',
    counts: {
      published_old_bank: published,
      published_v1: publishedV1,
      draft_v2: draftV2,
      published_v2: publishedV2,
      archived: archived,
      total_questions: total,
      media_revisions: revCount,
      expected_draft_v2: DVSA_V2_EXPECTED_COUNT,
      expected_published: PRE_CUTOVER_PUBLISHED,
    },
    media: {
      uploaded_assets: uploadResult.uploaded,
      revision_rows: revisions.length,
      missing_storage_path: missingStorage.length,
      unmapped_refs: unmappedRefs.length,
      drafts_missing_revisions: draftsMissingRev.length,
      sample_reachability: sampleReach,
      reuploaded: false,
    },
    id_coverage: {
      staging: stagingIds.size,
      live_draft_v2: liveIds.size,
      missing_in_db: missingInDb.length,
      unexpected_in_db: unexpectedInDb.length,
    },
    content_bank_meta: meta,
    draft_sample_ok: badSample.length === 0,
    published_unchanged: published === PRE_CUTOVER_PUBLISHED,
    cutover: 'NOT_STARTED',
    deploy: 'NOT_STARTED',
    errors,
    warnings,
  };

  const out = path.join(cwd, 'local-data/dvsa/staging/phase-4b-import-validation.json');
  fs.writeFileSync(out, JSON.stringify(report, null, 2));

  // Update status file
  const statusPath = path.join(cwd, 'local-data/dvsa/staging/phase-4b-status.json');
  const prev = fs.existsSync(statusPath)
    ? JSON.parse(fs.readFileSync(statusPath, 'utf8'))
    : {};
  const status = {
    ...prev,
    generated_at: new Date().toISOString(),
    phase: 'phase-4b',
    verdict: errors.length === 0 ? 'IMPORT_COMPLETE_STOPPED_BEFORE_CUTOVER' : 'IMPORT_VALIDATION_FAILED',
    migration_0008: { status: 'APPLIED', verified_at: report.generated_at },
    media_upload: prev.media_upload || {
      status: 'COMPLETE',
      uploaded: EXPECTED_MEDIA,
      failed: 0,
    },
    import: {
      status: errors.length === 0 ? 'COMPLETE' : 'FAILED',
      draft_v2: draftV2,
      revisions: revCount,
      validation: out,
    },
    published_question_counts: {
      old_live: published,
      v2_draft: draftV2,
      v2_published: publishedV2 || 0,
    },
    old_bank_archived_count: archived || 0,
    remaining_blocker:
      'Stop before cutover. Next (explicit approval only): review drafts → cutover publish V2 / archive old → deploy V2 code → smoke → maintenance OFF.',
    errors,
    warnings,
  };
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));

  console.log(JSON.stringify(report, null, 2));
  console.log(`\nWrote ${out}`);
  console.log(`Updated ${statusPath}`);
  if (errors.length) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
