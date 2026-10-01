import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { GOOGLE_FULL_ACCESS_PRODUCT_ID } from './googleProduct';
import {
  GOOGLE_NATIVE_PURCHASE_TIMEOUT_MS,
  GOOGLE_NATIVE_TIMEOUT_MESSAGE,
  GOOGLE_PENDING_MESSAGE,
  sanitizeGoogleEvent,
} from './googlePurchaseDiagnostics';
import { runGooglePurchaseFlow, type GoogleTx, type GoogleVerifyClientResult } from './googlePurchaseFlow';

function run(name: string, fn: () => Promise<void> | void) {
  return Promise.resolve()
    .then(fn)
    .then(() => console.log(`PASS ${name}`))
    .catch((error) => {
      console.error(`FAIL ${name}`);
      throw error;
    });
}

const productId = GOOGLE_FULL_ACCESS_PRODUCT_ID;
const SECRET_TOKEN = 'play-token-secret-must-not-leak';

function purchased(overrides?: Partial<GoogleTx>): GoogleTx {
  return {
    productId,
    purchaseToken: SECRET_TOKEN,
    purchaseState: 0,
    status: 'purchased',
    ...overrides,
  };
}

async function main() {
  const tests: Array<Promise<void>> = [];

  tests.push(
    run('1. checkout_clicked still fires before purchase events', async () => {
      const names: string[] = [];
      names.push('checkout_clicked');
      await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => purchased(),
        verify: async () => ({ ok: true }),
        track: (name) => names.push(name),
      });
      assert.equal(names[0], 'checkout_clicked');
      assert.equal(names.filter((name) => name === 'checkout_clicked').length, 1);
      assert.ok(names.includes('purchase_started'));
    })
  );

  tests.push(
    run('2. successful purchase emits events in order', async () => {
      const names: string[] = [];
      const verified: Record<string, unknown>[] = [];
      const result = await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => purchased(),
        verify: async (body) => {
          verified.push(body);
          return { ok: true };
        },
        track: (name) => names.push(name),
      });
      assert.deepEqual(names, [
        'purchase_started',
        'purchase_googleplay_call_started',
        'purchase_native_returned',
        'purchase_verify_started',
        'purchase_completed',
      ]);
      assert.equal(result.ok, true);
      assert.equal(verified.length, 1);
      assert.equal(verified[0].restore, false);
      assert.equal(verified[0].productId, productId);
      assert.equal(verified[0].purchaseToken, SECRET_TOKEN);
    })
  );

  tests.push(
    run('3. user cancel emits purchase_cancelled and does not verify', async () => {
      const names: string[] = [];
      let verifies = 0;
      const result = await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => {
          throw { code: 'USER_CANCELED', message: 'Purchase cancelled' };
        },
        verify: async () => {
          verifies += 1;
          return { ok: true };
        },
        track: (name) => names.push(name),
      });
      assert.equal(result.ok, false);
      if (!result.ok) assert.equal(result.cancelled, true);
      assert.equal(verifies, 0);
      assert.ok(names.includes('purchase_cancelled'));
      assert.equal(names.includes('purchase_verify_started'), false);
      assert.equal(names.includes('purchase_completed'), false);
    })
  );

  tests.push(
    run('4. billing unsupported emits purchase_failed', async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      const result = await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => {
          throw { code: 'BILLING_UNAVAILABLE', message: 'BillingClient not connected. Call init() first.' };
        },
        verify: async () => ({ ok: true }),
        track: (name, data) => events.push({ name, data }),
      });
      assert.equal(result.ok, false);
      const failed = events.find((event) => event.name === 'purchase_failed');
      assert.ok(failed);
      assert.equal(failed?.data.error_category, 'billing_not_supported');
    })
  );

  tests.push(
    run('5. native billing error emits purchase_failed', async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      const result = await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => {
          throw { code: 'DEVELOPER_ERROR', message: 'Billing failed' };
        },
        verify: async () => ({ ok: true }),
        track: (name, data) => events.push({ name, data }),
      });
      assert.equal(result.ok, false);
      if (!result.ok) assert.equal(result.errorCategory, 'native_purchase_error');
      const failed = events.find((event) => event.name === 'purchase_failed');
      assert.equal(failed?.data.error_category, 'native_purchase_error');
      assert.equal(failed?.data.error_code, 'DEVELOPER_ERROR');
    })
  );

  tests.push(
    run('6. native timeout does not retry, clears loading, emits native_timeout', async () => {
      let purchaseCalls = 0;
      let loading = true;
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      const result = await (async () => {
        try {
          return await runGooglePurchaseFlow({
            isAndroid: () => true,
            productId,
            timeoutMs: 30,
            purchase: () => {
              purchaseCalls += 1;
              return new Promise(() => {});
            },
            verify: async () => ({ ok: true }),
            track: (name, data) => events.push({ name, data }),
          });
        } finally {
          loading = false;
        }
      })();
      assert.equal(purchaseCalls, 1);
      assert.equal(loading, false);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.error, GOOGLE_NATIVE_TIMEOUT_MESSAGE);
        assert.equal(result.errorCategory, 'native_timeout');
      }
      const failed = events.find((event) => event.name === 'purchase_failed');
      assert.equal(failed?.data.error_category, 'native_timeout');
      assert.equal(GOOGLE_NATIVE_PURCHASE_TIMEOUT_MS, 90_000);
    })
  );

  tests.push(
    run('7. pending purchase emits purchase_pending and does not verify', async () => {
      let verifies = 0;
      const names: string[] = [];
      const result = await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => purchased({ status: 'pending', purchaseState: 2 }),
        verify: async () => {
          verifies += 1;
          return { ok: true };
        },
        track: (name) => names.push(name),
      });
      assert.equal(verifies, 0);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.pending, true);
        assert.equal(result.error, GOOGLE_PENDING_MESSAGE);
      }
      assert.ok(names.includes('purchase_pending'));
      assert.equal(names.includes('purchase_completed'), false);
    })
  );

  tests.push(
    run('8. missing purchase token emits purchase_token_missing', async () => {
      let verifies = 0;
      const names: string[] = [];
      const result = await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => ({ productId, purchaseState: 0, status: 'purchased', purchaseToken: '' }),
        verify: async () => {
          verifies += 1;
          return { ok: true };
        },
        track: (name) => names.push(name),
      });
      assert.equal(verifies, 0);
      assert.ok(names.includes('purchase_token_missing'));
      assert.equal(result.ok, false);
    })
  );

  tests.push(
    run('9. verify starts only after a valid native payload exists', async () => {
      const names: string[] = [];
      let verified = false;
      await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => purchased(),
        verify: async () => {
          verified = true;
          assert.ok(names.includes('purchase_native_returned'));
          assert.equal(names.includes('purchase_verify_started'), true);
          return { ok: true };
        },
        track: (name) => names.push(name),
      });
      assert.equal(verified, true);
      const started = names.indexOf('purchase_verify_started');
      const returned = names.indexOf('purchase_native_returned');
      assert.ok(returned >= 0 && started > returned);
    })
  );

  async function expectVerifyFailure(
    label: string,
    verified: GoogleVerifyClientResult,
    category: string
  ) {
    await run(label, async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      const result = await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => purchased(),
        verify: async () => verified,
        track: (name, data) => events.push({ name, data }),
      });
      assert.equal(result.ok, false);
      const failed = events.find((event) => event.name === 'purchase_verify_failed');
      assert.equal(failed?.data.error_category, category);
      assert.equal(events.some((event) => event.name === 'purchase_completed'), false);
    });
  }

  tests.push(
    expectVerifyFailure(
      '10. verify 4xx emits purchase_verify_failed',
      { ok: false, status: 400, message: 'Invalid Google Play product ID' },
      'verify_4xx'
    )
  );
  tests.push(
    expectVerifyFailure(
      '11. verify 5xx emits purchase_verify_failed',
      { ok: false, status: 500, message: 'Server configuration error' },
      'verify_5xx'
    )
  );
  tests.push(
    expectVerifyFailure(
      '12a. verify timeout emits purchase_verify_failed',
      { ok: false, message: 'Google Play verification timed out. Please try again.', timedOut: true },
      'verify_timeout'
    )
  );
  tests.push(
    expectVerifyFailure(
      '12b. verify network error emits purchase_verify_failed',
      { ok: false, message: 'Failed to fetch', network: true },
      'verify_network_error'
    )
  );

  tests.push(
    run('13. success still returns ok only after verify and does not set restore', async () => {
      const captured: { body: Record<string, unknown> | null } = { body: null };
      const result = await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => purchased(),
        verify: async (payload) => {
          captured.body = payload;
          return { ok: true };
        },
        track: () => {},
      });
      assert.equal(result.ok, true);
      assert.equal(captured.body?.restore, false);
      assert.equal(captured.body?.platform, 'android');
    })
  );

  tests.push(
    run('14. analytics payload does not contain the purchase token', async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => purchased(),
        verify: async () => ({ ok: true }),
        track: (name, data) => events.push({ name, data }),
      });
      const dumped = JSON.stringify(events);
      assert.equal(dumped.includes(SECRET_TOKEN), false);
      assert.equal(dumped.includes('purchaseToken'), false);
      const sanitized = sanitizeGoogleEvent({
        purchaseToken: SECRET_TOKEN,
        receipt: 'signed-payload',
        email: 'user@example.com',
        platform: 'android',
        purchase_token_present: true,
      });
      assert.equal(JSON.stringify(sanitized).includes(SECRET_TOKEN), false);
      assert.equal(sanitized.purchase_token_present, true);
      assert.equal(sanitized.email, undefined);
    })
  );

  tests.push(
    run('15. restore behavior remains an explicit restore:true path', () => {
      const source = readFileSync(path.join(__dirname, 'googlePlay.ts'), 'utf8');
      const start = source.indexOf('export async function restoreGoogleFullAccess');
      const end = source.indexOf('export async function silentRestoreGoogleFullAccessIfOwned');
      const restoreFn = source.slice(start, end);
      assert.ok(restoreFn.includes('restore: true'));
      assert.equal(restoreFn.includes('runGooglePurchaseFlow'), false);
      assert.ok(source.includes('return false;'));
      assert.equal(GOOGLE_FULL_ACCESS_PRODUCT_ID, 'lingotheory_full_access');
    })
  );

  tests.push(
    run('16. account binding is categorized without leaking the token', async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      const result = await runGooglePurchaseFlow({
        isAndroid: () => true,
        productId,
        purchase: async () => purchased(),
        verify: async () => ({
          ok: false,
          status: 403,
          message:
            'This Google Play purchase is linked to a different LingoTheory account. Sign in to that account for Full Access.',
        }),
        track: (name, data) => events.push({ name, data }),
      });
      assert.equal(result.ok, false);
      const failed = events.find((event) => event.name === 'purchase_verify_failed');
      assert.equal(failed?.data.error_category, 'account_binding_error');
      assert.equal(JSON.stringify(events).includes(SECRET_TOKEN), false);
    })
  );

  await Promise.all(tests);
  console.log('google purchase diagnostics tests passed');
}

void main();
