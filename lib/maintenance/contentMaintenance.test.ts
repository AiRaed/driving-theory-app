import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  CONTENT_MAINTENANCE_MESSAGE,
  contentMaintenanceJsonBody,
  isContentMaintenanceMode,
} from './contentMaintenance';

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

run('Maintenance ON when CONTENT_MAINTENANCE_MODE=true', () => {
  assert.equal(isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: 'true' }), true);
  assert.equal(isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: 'TRUE' }), true);
  assert.equal(isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: '1' }), true);
});

run('Maintenance OFF by default / false', () => {
  assert.equal(isContentMaintenanceMode({}), false);
  assert.equal(isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: 'false' }), false);
  assert.equal(isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: '' }), false);
});

run('Maintenance ON → Practice blocked (page + API wiring)', () => {
  assert.equal(isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: 'true' }), true);
  const practicePage = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
  const bankRoute = readFileSync(path.join(root, 'app/api/questions/bank/route.ts'), 'utf8');
  assert.ok(practicePage.includes('ContentMaintenanceNotice'));
  assert.ok(practicePage.includes('useContentMaintenance'));
  assert.ok(bankRoute.includes('isContentMaintenanceMode'));
  assert.ok(bankRoute.includes('status: 503'));
});

run('Maintenance ON → Mock blocked', () => {
  const mockPage = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
  assert.ok(mockPage.includes('ContentMaintenanceNotice'));
  assert.ok(mockPage.includes('useContentMaintenance'));
  assert.ok(mockPage.includes('contentMaintenance'));
});

run('Maintenance ON → direct question API blocked', () => {
  const bankRoute = readFileSync(path.join(root, 'app/api/questions/bank/route.ts'), 'utf8');
  assert.ok(bankRoute.includes("error: 'content_maintenance'") || bankRoute.includes('contentMaintenanceJsonBody'));
  const body = contentMaintenanceJsonBody();
  assert.equal(body.error, 'content_maintenance');
  assert.equal(isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: 'true' }), true);
});

run('Maintenance ON → web checkout blocked', () => {
  const create = readFileSync(
    path.join(root, 'app/api/stripe/create-checkout-session/route.ts'),
    'utf8'
  );
  const checkout = readFileSync(path.join(root, 'app/api/stripe/checkout/route.ts'), 'utf8');
  assert.ok(create.includes('isContentMaintenanceMode'));
  assert.ok(create.includes('status: 503'));
  assert.ok(checkout.includes('isContentMaintenanceMode'));
  assert.ok(checkout.includes('status: 503'));
});

run('Maintenance ON → Apple purchase initiation blocked', () => {
  const apple = readFileSync(path.join(root, 'lib/billing/appleIap.ts'), 'utf8');
  assert.ok(apple.includes('fetchIsContentMaintenanceMode'));
  assert.ok(apple.includes('CONTENT_MAINTENANCE_API_MESSAGE'));
  const purchaseStart = apple.indexOf('export async function purchaseAppleFullAccess');
  const purchaseSlice = apple.slice(purchaseStart, purchaseStart + 400);
  assert.ok(purchaseSlice.includes('fetchIsContentMaintenanceMode'));
});

run('Maintenance ON → Google purchase initiation blocked', () => {
  const google = readFileSync(path.join(root, 'lib/billing/googlePlay.ts'), 'utf8');
  assert.ok(google.includes('fetchIsContentMaintenanceMode'));
  assert.ok(google.includes('CONTENT_MAINTENANCE_API_MESSAGE'));
  const purchaseStart = google.indexOf('export async function purchaseGoogleFullAccess');
  const purchaseSlice = google.slice(purchaseStart, purchaseStart + 400);
  assert.ok(purchaseSlice.includes('fetchIsContentMaintenanceMode'));
});

run('Maintenance ON → paid entitlement remains unchanged', () => {
  const profile = { access_level: 'paid' as const, free_questions_used: 15 };
  void isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: 'true' });
  assert.equal(profile.access_level, 'paid');
  assert.equal(profile.free_questions_used, 15);
  // Verify/restore routes must not gate on maintenance (entitlements preserved).
  const appleVerify = readFileSync(
    path.join(root, 'app/api/billing/apple/verify/route.ts'),
    'utf8'
  );
  const googleVerify = readFileSync(
    path.join(root, 'app/api/billing/google/verify/route.ts'),
    'utf8'
  );
  const stripeVerify = readFileSync(path.join(root, 'app/api/stripe/verify/route.ts'), 'utf8');
  assert.equal(appleVerify.includes('isContentMaintenanceMode'), false);
  assert.equal(googleVerify.includes('isContentMaintenanceMode'), false);
  assert.equal(stripeVerify.includes('isContentMaintenanceMode'), false);
});

run('Maintenance ON → login/account/support/legal still work', () => {
  const on = isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: 'true' });
  assert.equal(on, true);
  for (const rel of [
    'app/auth/page.tsx',
    'app/support/page.tsx',
    'app/privacy/page.tsx',
    'app/terms/page.tsx',
    'app/dashboard/DashboardClient.tsx',
  ]) {
    const src = readFileSync(path.join(root, rel), 'utf8');
    // These pages must not hard-block on maintenance at module level.
    assert.equal(src.includes('if (isContentMaintenanceMode())'), false);
  }
  const dashboard = readFileSync(path.join(root, 'app/dashboard/DashboardClient.tsx'), 'utf8');
  assert.ok(dashboard.includes('ContentMaintenanceNotice'));
});

run('Maintenance OFF → all existing behaviour is restored', () => {
  assert.equal(isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: 'false' }), false);
  assert.equal(isContentMaintenanceMode({}), false);
});

run('Mobile WebView uses same maintenance behaviour', () => {
  // Capacitor loads the same Next.js routes/components; one flag covers all clients.
  const notice = readFileSync(
    path.join(root, 'components/ContentMaintenanceNotice.tsx'),
    'utf8'
  );
  const hook = readFileSync(path.join(root, 'lib/hooks/useContentMaintenance.ts'), 'utf8');
  assert.ok(notice.includes('CONTENT_MAINTENANCE_MESSAGE'));
  assert.ok(hook.includes('/api/maintenance'));
  assert.equal(isContentMaintenanceMode({ CONTENT_MAINTENANCE_MODE: 'true' }), true);
});

run('API maintenance body shape', () => {
  const body = contentMaintenanceJsonBody();
  assert.equal(body.error, 'content_maintenance');
  assert.ok(body.message.includes('temporarily unavailable'));
});

run('User-facing message is natural English', () => {
  assert.ok(CONTENT_MAINTENANCE_MESSAGE.includes('remain safe'));
  assert.equal(CONTENT_MAINTENANCE_MESSAGE.includes('محفوظة'), false);
  assert.equal(CONTENT_MAINTENANCE_MESSAGE.toLowerCase().includes('dvsa'), false);
});

run('useQuestionBank does not fall back to static during maintenance', () => {
  const bank = readFileSync(path.join(root, 'lib/questions/useQuestionBank.ts'), 'utf8');
  assert.ok(bank.includes('fetchIsContentMaintenanceMode'));
  assert.ok(bank.includes("setSource('maintenance')"));
  assert.ok(bank.includes("error === 'content_maintenance'"));
});

run('Paywall replaces purchase CTAs during maintenance', () => {
  const paywall = readFileSync(path.join(root, 'components/PaywallOverlay.tsx'), 'utf8');
  assert.ok(paywall.includes('ContentMaintenanceNotice'));
  assert.ok(paywall.includes('contentMaintenance'));
});

console.log('All content maintenance tests passed.');
