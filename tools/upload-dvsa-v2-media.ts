/**
 * Upload Phase 4A media derivatives to the public question-images bucket
 * for learner display at cutover. Does not publish questions or change status.
 *
 * Paths: v2/unreviewed/<derivative> (deterministic; Admin can replace later).
 *
 * Usage:
 *   DVSA_V2_MEDIA_UPLOAD=true npx ts-node --compiler-options '{"module":"commonjs"}' \
 *     tools/upload-dvsa-v2-media.ts --confirm-shared-supabase
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'question-images';
const MANIFEST_REL = 'local-data/dvsa/staging/media-upload-manifest.phase-4a.json';
const RESULT_REL = 'local-data/dvsa/staging/media-upload-result.phase-4b.json';

type ManifestEntry = {
  original_ref: string;
  local_path: string;
  bucket: string;
  storage_path: string;
  public: boolean;
  review_status: string;
  derivative_sha256: string;
  derivative_bytes: number;
  mime_type: string;
  note?: string;
};

type Manifest = {
  generated_at: string;
  phase: string;
  uploaded: boolean;
  bucket: string;
  entry_count: number;
  entries: ManifestEntry[];
};

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

function contentTypeFor(filePath: string, fallback: string): string {
  if (filePath.endsWith('.webp')) return 'image/webp';
  if (filePath.endsWith('.png')) return 'image/png';
  if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) return 'image/jpeg';
  if (filePath.endsWith('.gif')) return 'image/gif';
  return fallback || 'application/octet-stream';
}

async function main() {
  const cwd = process.cwd();
  const args = new Set(process.argv.slice(2));
  const confirm = args.has('--confirm-shared-supabase');
  const enabled = process.env.DVSA_V2_MEDIA_UPLOAD === 'true';

  if (!enabled || !confirm) {
    console.error('BLOCKED. Required: DVSA_V2_MEDIA_UPLOAD=true and --confirm-shared-supabase');
    process.exitCode = 2;
    return;
  }

  loadEnvLocal(cwd);
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exitCode = 2;
    return;
  }

  const host = new URL(url).host;
  if (!host.includes('anrtgdfbxjuhyglzyhih')) {
    console.error('Refusing upload: unexpected Supabase host', host);
    process.exitCode = 2;
    return;
  }

  const manifestPath = path.join(cwd, MANIFEST_REL);
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as Manifest;
  if (!Array.isArray(manifest.entries) || manifest.entries.length === 0) {
    console.error('Empty media manifest');
    process.exitCode = 2;
    return;
  }

  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: buckets, error: bErr } = await admin.storage.listBuckets();
  if (bErr) {
    console.error('listBuckets failed:', bErr.message);
    process.exitCode = 1;
    return;
  }
  const qi = (buckets || []).find((b) => b.id === BUCKET || b.name === BUCKET);
  if (!qi) {
    console.error(`Bucket ${BUCKET} missing`);
    process.exitCode = 2;
    return;
  }
  if (!qi.public) {
    console.error(`Bucket ${BUCKET} must be public for learner image display`);
    process.exitCode = 2;
    return;
  }

  console.log(`Uploading ${manifest.entries.length} derivatives → ${BUCKET} @ ${host}`);

  const results: Array<{
    original_ref: string;
    storage_path: string;
    public_url: string | null;
    ok: boolean;
    error?: string;
    skipped?: boolean;
  }> = [];

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  // Concurrency-limited upload
  const concurrency = 8;
  let idx = 0;
  async function worker() {
    while (idx < manifest.entries.length) {
      const i = idx++;
      const entry = manifest.entries[i];
      // Force public learner bucket + keep deterministic path from Phase 4A.
      const storagePath = entry.storage_path.startsWith('v2/')
        ? entry.storage_path
        : `v2/unreviewed/${path.basename(entry.local_path)}`;
      const localAbs = path.join(cwd, entry.local_path);
      if (!fs.existsSync(localAbs)) {
        failed++;
        results.push({
          original_ref: entry.original_ref,
          storage_path: storagePath,
          public_url: null,
          ok: false,
          error: 'local file missing',
        });
        continue;
      }
      const buf = fs.readFileSync(localAbs);
      const contentType = contentTypeFor(localAbs, entry.mime_type);
      const { error: upErr } = await admin.storage
        .from(BUCKET)
        .upload(storagePath, buf, { contentType, upsert: true });
      if (upErr) {
        // Treat already-exists races as skip if we can still resolve URL
        const msg = upErr.message || '';
        if (/already exists|Duplicate/i.test(msg)) {
          skipped++;
          const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(storagePath);
          results.push({
            original_ref: entry.original_ref,
            storage_path: storagePath,
            public_url: pub.publicUrl,
            ok: true,
            skipped: true,
          });
          continue;
        }
        failed++;
        results.push({
          original_ref: entry.original_ref,
          storage_path: storagePath,
          public_url: null,
          ok: false,
          error: msg,
        });
        continue;
      }
      const { data: pub } = admin.storage.from(BUCKET).getPublicUrl(storagePath);
      uploaded++;
      results.push({
        original_ref: entry.original_ref,
        storage_path: storagePath,
        public_url: pub.publicUrl,
        ok: true,
      });
      if ((uploaded + skipped) % 50 === 0) {
        console.log(`  progress uploaded=${uploaded} skipped=${skipped} failed=${failed}`);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  const okCount = results.filter((r) => r.ok).length;
  const sampleOk = results.find((r) => r.ok && r.public_url);

  // HEAD-check a sample public URL
  let sampleReachable = false;
  if (sampleOk?.public_url) {
    try {
      const head = await fetch(sampleOk.public_url, { method: 'HEAD' });
      sampleReachable = head.ok;
    } catch {
      sampleReachable = false;
    }
  }

  const report = {
    generated_at: new Date().toISOString(),
    phase: 'phase-4b-media-upload',
    host,
    bucket: BUCKET,
    bucket_public: true,
    entry_count: manifest.entries.length,
    uploaded,
    skipped_existing: skipped,
    failed,
    ok_count: okCount,
    sample_public_url: sampleOk?.public_url || null,
    sample_reachable: sampleReachable,
    note: 'Files uploaded; question rows still draft/null URLs until cutover attaches them. source_verification unchanged (NOT_VERIFIED). media_review remains unreviewed.',
    results,
  };

  fs.writeFileSync(path.join(cwd, RESULT_REL), JSON.stringify(report, null, 2));
  console.log(`\nDone: uploaded=${uploaded} skipped=${skipped} failed=${failed} ok=${okCount}`);
  console.log(`Result: ${RESULT_REL}`);
  console.log(`Sample reachable: ${sampleReachable}`);

  if (failed > 0 || okCount !== manifest.entries.length) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
