/**
 * Admin stays in the account menu and is still authorised on the server.
 * The study-page redesign removed the old primary-nav Admin link.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

const root = path.join(__dirname, '..', '..');

function source(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

run('Study chrome keeps Admin inside the account menu', () => {
  const chrome = source('components/DashboardChrome.tsx');
  const header = source('components/HeaderClient.tsx');
  const accountMenu = chrome.slice(chrome.indexOf('aria-label={user ? \'Account\''));
  assert.ok(accountMenu.includes('showAdmin ?'));
  assert.ok(accountMenu.includes('href="/admin"'));
  assert.ok(accountMenu.includes("enLabel('navAdmin')"));
  assert.equal(accountMenu.includes('ADMIN_EMAIL'), false);
  assert.ok(header.includes('showAdmin={showAdmin}'));
  assert.ok(header.includes("pathname.startsWith('/practice')"));
  assert.ok(header.includes("pathname.startsWith('/saved-cards')"));
  const drawer = header.slice(header.indexOf('id="mobile-navigation"'));
  assert.ok(drawer.includes('showAdmin ?'));
  assert.ok(drawer.includes('href="/admin"'));
});

run('Admin visibility uses the server check, not a client email comparison', () => {
  const hook = source('lib/admin/useIsAdmin.ts');
  const route = source('app/api/admin/me/route.ts');
  const auth = source('lib/admin/auth.ts');
  const middleware = source('lib/supabase/middleware.ts');
  assert.ok(hook.includes("fetch('/api/admin/me'"));
  assert.ok(hook.includes("cache: 'no-store'"));
  assert.equal(hook.includes('ADMIN_EMAIL'), false);
  assert.equal(hook.includes('user.email'), false);
  assert.equal(hook.includes('user?.email'), false);
  assert.ok(route.includes('requireAdminApi'));
  assert.ok(route.includes('isAdmin: true'));
  assert.ok(route.includes('status: 401'));
  assert.ok(auth.includes('ADMIN_EMAIL'));
  assert.ok(auth.includes('requireAdmin'));
  assert.ok(middleware.includes("pathname.startsWith('/admin')"));
  assert.ok(middleware.includes('ADMIN_EMAIL'));
});

run('Next bundles are not served from the stale app-shell cache', () => {
  const worker = source('public/sw.js');
  assert.ok(worker.includes("startsWith('/_next/')"));
  assert.ok(worker.includes('lingotheory-v3'));
});
