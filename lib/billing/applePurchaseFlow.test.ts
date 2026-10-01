import assert from 'node:assert/strict';
import { APPLE_FULL_ACCESS_PRODUCT_ID } from './appleProduct';
import {
  APPLE_NATIVE_TIMEOUT_MESSAGE,
  sanitizeAppleEvent,
  classifyVerifyFailure,
  isUserCancelledMessage,
} from './applePurchaseDiagnostics';
import { runApplePurchaseFlow, type AppleTx } from './applePurchaseFlow';

function run(name: string, fn: () => Promise<void> | void) {
  return Promise.resolve()
    .then(fn)
    .then(() => console.log(`PASS ${name}`))
    .catch((error) => {
      console.error(`FAIL ${name}`);
      throw error;
    });
}

const productId = APPLE_FULL_ACCESS_PRODUCT_ID;

function okTx(): AppleTx {
  return {
    transactionId: 'tx-1',
    productIdentifier: productId,
    jwsRepresentation: 'signed-jws-secret-must-not-leak',
    receipt: 'legacy-receipt-secret-must-not-leak',
  };
}

async function main() {
  const tests: Array<Promise<void>> = [];

  tests.push(
    run('1. checkout_clicked still fires before purchase events', async () => {
      const names: string[] = [];
      // PaywallOverlay records checkout_clicked, then purchaseAppleFullAccess().
      names.push('checkout_clicked');
      await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => true,
        purchaseProduct: async () => okTx(),
        getPurchases: async () => [],
        verify: async () => ({ ok: true }),
        track: (name) => names.push(name),
        productId,
        sleep: async () => {},
      });
      assert.equal(names[0], 'checkout_clicked');
      assert.ok(names.includes('purchase_started'));
      assert.ok(names.indexOf('purchase_started') > 0);
    })
  );

  tests.push(
    run('2. success emits events in order and does not send secrets', async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      const captured: { body: Record<string, unknown> | null } = { body: null };
      const result = await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => true,
        purchaseProduct: async () => okTx(),
        getPurchases: async () => {
          throw new Error('getPurchases should not run when JWS exists');
        },
        verify: async (body) => {
          captured.body = body;
          return { ok: true };
        },
        track: (name, data) => events.push({ name, data }),
        productId,
      });
      assert.equal(result.ok, true);
      assert.deepEqual(
        events.map((e) => e.name),
        [
          'purchase_started',
          'purchase_storekit_call_started',
          'purchase_native_returned',
          'purchase_verify_started',
          'purchase_completed',
        ]
      );
      assert.equal(captured.body?.restore, false);
      assert.equal(captured.body?.productId, productId);
      const blob = JSON.stringify(events);
      assert.equal(blob.includes('signed-jws-secret'), false);
      assert.equal(blob.includes('legacy-receipt-secret'), false);
    })
  );

  tests.push(
    run('3. user cancel emits purchase_cancelled and does not verify', async () => {
      const names: string[] = [];
      let verified = false;
      const result = await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => true,
        purchaseProduct: async () => {
          throw new Error('User cancelled');
        },
        getPurchases: async () => [],
        verify: async () => {
          verified = true;
          return { ok: true };
        },
        track: (name) => names.push(name),
        productId,
      });
      assert.equal(result.ok, false);
      assert.equal('cancelled' in result && result.cancelled, true);
      assert.equal(verified, false);
      assert.ok(names.includes('purchase_cancelled'));
      assert.equal(names.includes('purchase_verify_started'), false);
    })
  );

  tests.push(
    run('4. billing unsupported emits purchase_failed', async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      let purchases = 0;
      const result = await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => false,
        purchaseProduct: async () => {
          purchases += 1;
          return okTx();
        },
        getPurchases: async () => [],
        verify: async () => ({ ok: true }),
        track: (name, data) => events.push({ name, data }),
        productId,
      });
      assert.equal(result.ok, false);
      assert.equal(purchases, 0);
      const failed = events.find((e) => e.name === 'purchase_failed');
      assert.equal(failed?.data.error_category, 'billing_not_supported');
    })
  );

  tests.push(
    run('5. native purchase error emits purchase_failed', async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => true,
        purchaseProduct: async () => {
          throw new Error('StoreKit failed');
        },
        getPurchases: async () => [],
        verify: async () => ({ ok: true }),
        track: (name, data) => events.push({ name, data }),
        productId,
      });
      const failed = events.find((e) => e.name === 'purchase_failed');
      assert.equal(failed?.data.error_category, 'native_purchase_error');
    })
  );

  tests.push(
    run('6. native timeout does not retry, clears loading, emits native_timeout', async () => {
      let calls = 0;
      let loading = true;
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      const result = await (async () => {
        try {
          return await runApplePurchaseFlow({
            isIos: () => true,
            isBillingSupported: async () => true,
            purchaseProduct: () => {
              calls += 1;
              return new Promise(() => {});
            },
            getPurchases: async () => [],
            verify: async () => ({ ok: true }),
            track: (name, data) => events.push({ name, data }),
            productId,
            timeoutMs: 30,
          });
        } finally {
          loading = false;
        }
      })();
      assert.equal(calls, 1);
      assert.equal(loading, false);
      assert.equal(result.ok, false);
      if (!result.ok) {
        assert.equal(result.error, APPLE_NATIVE_TIMEOUT_MESSAGE);
      }
      const failed = events.find((e) => e.name === 'purchase_failed');
      assert.equal(failed?.data.error_category, 'native_timeout');
    })
  );

  tests.push(
    run('7. missing receipt emits purchase_receipt_missing', async () => {
      const names: string[] = [];
      const result = await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => true,
        purchaseProduct: async () => ({ transactionId: 'tx', productIdentifier: productId }),
        getPurchases: async () => [],
        verify: async () => ({ ok: true }),
        track: (name) => names.push(name),
        productId,
        receiptRetryAttempts: 2,
        receiptRetryDelayMs: 0,
        sleep: async () => {},
      });
      assert.equal(result.ok, false);
      assert.ok(names.includes('purchase_receipt_missing'));
      assert.equal(names.includes('purchase_verify_started'), false);
    })
  );

  tests.push(
    run('8. verify starts only after a JWS or receipt exists', async () => {
      const names: string[] = [];
      await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => true,
        purchaseProduct: async () => okTx(),
        getPurchases: async () => [],
        verify: async () => ({ ok: true }),
        track: (name) => names.push(name),
        productId,
      });
      const nativeAt = names.indexOf('purchase_native_returned');
      const verifyAt = names.indexOf('purchase_verify_started');
      assert.ok(nativeAt >= 0 && verifyAt > nativeAt);
    })
  );

  tests.push(
    run('9. verify 403 other account is purchase_verify_failed', async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => true,
        purchaseProduct: async () => okTx(),
        getPurchases: async () => [],
        verify: async () => ({
          ok: false,
          status: 403,
          message:
            'This Apple purchase is linked to a different LingoTheory account. Sign in to that account for Full Access.',
        }),
        track: (name, data) => events.push({ name, data }),
        productId,
      });
      const failed = events.find((e) => e.name === 'purchase_verify_failed');
      assert.equal(failed?.data.error_category, 'already_owned_other_account');
      assert.equal(failed?.data.http_status, 403);
    })
  );

  tests.push(
    run('10. verify 500 emits purchase_verify_failed', async () => {
      const events: Array<{ name: string; data: Record<string, unknown> }> = [];
      await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => true,
        purchaseProduct: async () => okTx(),
        getPurchases: async () => [],
        verify: async () => ({
          ok: false,
          status: 500,
          message: 'Failed to update profile',
        }),
        track: (name, data) => events.push({ name, data }),
        productId,
      });
      const failed = events.find((e) => e.name === 'purchase_verify_failed');
      assert.equal(failed?.data.error_category, 'verify_5xx');
      assert.equal(failed?.data.http_status, 500);
    })
  );

  tests.push(
    run('11. success verify body keeps product id and restore=false', async () => {
      const captured: { body: Record<string, unknown> | null } = { body: null };
      const result = await runApplePurchaseFlow({
        isIos: () => true,
        isBillingSupported: async () => true,
        purchaseProduct: async () => okTx(),
        getPurchases: async () => [],
        verify: async (payload) => {
          captured.body = payload;
          return { ok: true };
        },
        track: () => {},
        productId,
      });
      assert.equal(result.ok, true);
      assert.equal(captured.body?.productId, 'org.lingotheory.fullaccess');
      assert.equal(captured.body?.restore, false);
      assert.equal(typeof captured.body?.jwsRepresentation, 'string');
    })
  );

  tests.push(
    run('13. user cancellation is an exact plugin message only', () => {
      assert.equal(isUserCancelledMessage('User cancelled'), true);
      assert.equal(isUserCancelledMessage('user cancelled'), true);
      assert.equal(isUserCancelledMessage('  User cancelled  '), true);
      assert.equal(isUserCancelledMessage('User canceled'), true);
      assert.equal(isUserCancelledMessage('Payment was cancelled by network'), false);
      assert.equal(isUserCancelledMessage('SKError paymentCancelled'), false);
      assert.equal(isUserCancelledMessage('SKErrorPaymentCancelled'), false);
      assert.equal(isUserCancelledMessage('StoreKit failed'), false);
      assert.equal(isUserCancelledMessage(''), false);
    })
  );

  tests.push(
    run('12. analytics sanitizer drops JWS, receipt, and tokens', () => {
      const safe = sanitizeAppleEvent({
        platform: 'ios',
        product_id: productId,
        jwsRepresentation: 'secret-jws',
        receipt: 'secret-receipt',
        token: 'secret-token',
        email: 'user@example.com',
        error_category: 'unknown',
        nested: { receipt: 'nope' },
      });
      const text = JSON.stringify(safe);
      assert.equal(text.includes('secret'), false);
      assert.equal(safe.platform, 'ios');
      assert.equal(safe.error_category, 'unknown');
      assert.equal(
        classifyVerifyFailure({
          status: 403,
          message: 'This Apple ID already owns Full Access from an earlier purchase that is not linked to this LingoTheory account.',
        }),
        'already_owned_other_account'
      );
    })
  );

  await Promise.all(tests);
  console.log('All Apple purchase observability tests passed.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
