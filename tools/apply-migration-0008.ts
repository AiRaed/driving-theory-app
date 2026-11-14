/**
 * Apply supabase/migrations/0008_dvsa_v2_content_schema.sql to the shared project.
 *
 * Requires ONE of:
 *   DATABASE_URL=postgresql://...
 *   SUPABASE_ACCESS_TOKEN=sbp_...  (Management API)
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' tools/apply-migration-0008.ts
 */

import fs from 'fs';
import path from 'path';

const PROJECT_REF = 'anrtgdfbxjuhyglzyhih';

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

async function applyViaDatabaseUrl(sql: string, databaseUrl: string) {
  // Optional dependency — only needed when DATABASE_URL is provided.
  let Client: new (cfg: object) => {
    connect: () => Promise<void>;
    query: (q: string) => Promise<unknown>;
    end: () => Promise<void>;
  };
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Client = require('pg').Client;
  } catch {
    throw new Error('Install `pg` to apply via DATABASE_URL, or use SUPABASE_ACCESS_TOKEN instead.');
  }
  const client = new Client({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    await client.query(sql);
  } finally {
    await client.end();
  }
}

async function applyViaManagementApi(sql: string, token: string) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    }
  );
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Management API ${res.status}: ${text.slice(0, 500)}`);
  }
  return text;
}

async function main() {
  const cwd = process.cwd();
  loadEnvLocal(cwd);
  const sqlPath = path.join(cwd, 'supabase/migrations/0008_dvsa_v2_content_schema.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('Missing migration file:', sqlPath);
    process.exitCode = 2;
    return;
  }
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  if (!databaseUrl && !accessToken) {
    console.error('BLOCKED: cannot apply migration 0008.');
    console.error('Provide DATABASE_URL (Postgres) or SUPABASE_ACCESS_TOKEN (Management API).');
    console.error('Service role JWT alone cannot run DDL.');
    process.exitCode = 2;
    return;
  }

  console.log(`Applying 0008 to project ${PROJECT_REF}...`);
  if (databaseUrl) {
    await applyViaDatabaseUrl(sql, databaseUrl);
    console.log('Applied via DATABASE_URL.');
  } else {
    const out = await applyViaManagementApi(sql, accessToken!);
    console.log('Applied via Management API.', out.slice(0, 200));
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
