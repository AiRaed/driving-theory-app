import assert from 'node:assert/strict';
import {
  formatPlatformsForAdmin,
  normalizeRuntimePlatform,
  platformDisplayLabel,
} from './platform';

function run(name: string, fn: () => void) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run('normalize accepts ios/android/web only', () => {
  assert.equal(normalizeRuntimePlatform('ios'), 'ios');
  assert.equal(normalizeRuntimePlatform('Android'), 'android');
  assert.equal(normalizeRuntimePlatform('WEB'), 'web');
  assert.equal(normalizeRuntimePlatform('iphone'), null);
  assert.equal(normalizeRuntimePlatform('google_play'), null);
  assert.equal(normalizeRuntimePlatform(null), null);
});

run('admin format shows dash when empty', () => {
  const empty = formatPlatformsForAdmin(null, []);
  assert.equal(empty.primary, '—');
  assert.equal(empty.all, null);
});

run('admin format last + multi used', () => {
  const one = formatPlatformsForAdmin('ios', ['ios']);
  assert.equal(one.primary, 'iOS');
  assert.equal(one.all, null);

  const multi = formatPlatformsForAdmin('ios', ['web', 'ios']);
  assert.equal(multi.primary, 'iOS');
  assert.equal(multi.all, 'iOS + Web');
});

run('display labels', () => {
  assert.equal(platformDisplayLabel('web'), 'Web');
  assert.equal(platformDisplayLabel(undefined), '—');
});

console.log('All platform tests passed.');
