import assert from 'node:assert/strict';
import { isV2FirstPublishBlocked } from './v2PublishGate';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run('Already-published V2 may be updated without DVSA_V2_ALLOW_PUBLISH', () => {
  assert.equal(
    isV2FirstPublishBlocked(
      { status: 'published', content_version: 'v2' },
      'published',
      {}
    ),
    false
  );
});

run('Unpublished V2 → published is blocked without flag', () => {
  assert.equal(
    isV2FirstPublishBlocked(
      { status: 'draft', content_version: 'v2' },
      'published',
      {}
    ),
    true
  );
  assert.equal(
    isV2FirstPublishBlocked(
      { status: 'approved', content_version: 'v2' },
      'published',
      { DVSA_V2_ALLOW_PUBLISH: 'false' }
    ),
    true
  );
});

run('Unpublished V2 → published allowed when flag is true', () => {
  assert.equal(
    isV2FirstPublishBlocked(
      { status: 'draft', content_version: 'v2' },
      'published',
      { DVSA_V2_ALLOW_PUBLISH: 'true' }
    ),
    false
  );
});

run('Non-publish status changes are never blocked by this gate', () => {
  assert.equal(
    isV2FirstPublishBlocked(
      { status: 'draft', content_version: 'v2' },
      'submitted',
      {}
    ),
    false
  );
});

run('V1 rows are not gated', () => {
  assert.equal(
    isV2FirstPublishBlocked(
      { status: 'draft', content_version: 'v1' },
      'published',
      {}
    ),
    false
  );
});
