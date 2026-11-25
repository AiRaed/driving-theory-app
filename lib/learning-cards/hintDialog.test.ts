/**
 * Practice Hint dialog: language, focus cycle, scroll lock, responsive layout, a11y.
 */

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  hintDialogCopy,
  hintFormatLabel,
  hintMediaVisibility,
  lockPageScroll,
  nextDialogFocusIndex,
  type PageScrollLockTarget,
} from './hintDialog';

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

function blankScrollTarget(previous: Partial<PageScrollLockTarget['body']['style']> = {}): PageScrollLockTarget {
  return {
    documentElement: { style: { overflow: previous.overflow === undefined ? '' : 'scroll' } },
    body: {
      style: {
        overflow: '',
        position: '',
        top: '',
        left: '',
        right: '',
        width: '',
        ...previous,
      },
    },
  };
}

run('English hints are LTR and Arabic hints are RTL, with language labels', () => {
  const en = hintDialogCopy('en');
  assert.equal(en.dir, 'ltr');
  assert.equal(en.lang, 'en');
  assert.equal(en.languageLabel, 'English');
  assert.equal(en.title, 'Hint');
  assert.equal(en.closeLabel, 'Close');
  assert.equal(en.gotItLabel, 'Got it');
  assert.equal(en.triggerLabel, 'Hint');
  assert.equal(en.videoTitle, 'Explanation hint video');

  const ar = hintDialogCopy(' AR ');
  assert.equal(ar.dir, 'rtl');
  assert.equal(ar.lang, 'ar');
  assert.equal(ar.languageLabel, 'العربية');
  assert.equal(ar.title, 'تلميح');
  assert.equal(ar.closeLabel, 'إغلاق');
  assert.equal(ar.gotItLabel, 'فهمت');
  assert.equal(ar.triggerLabel, 'تلميح');
  assert.equal(ar.videoTitle, 'فيديو التلميح');

  assert.equal(hintDialogCopy(null).languageLabel, 'English');
  assert.equal(hintDialogCopy('').dir, 'ltr');
  assert.equal(hintDialogCopy('fr').dir, 'ltr');
  assert.equal(hintDialogCopy('fr').languageLabel, 'FR');
  assert.equal(hintDialogCopy('fr').title, 'Hint');
});

run('Format labels follow language and do not change stored media', () => {
  assert.equal(hintFormatLabel('text', 'en'), 'Text');
  assert.equal(hintFormatLabel('diagram', 'en'), 'Diagram');
  assert.equal(hintFormatLabel('image', 'ar'), 'صورة');
  assert.equal(hintFormatLabel('video', 'ar'), 'فيديو');
  assert.equal(hintFormatLabel(null, 'en'), 'Text');
  assert.equal(hintFormatLabel('custom-override', 'en'), 'custom-override');
  assert.deepEqual(
    hintMediaVisibility({ image_url: 'https://cdn.example/sign.png', video_url: null }),
    { image: true, video: false }
  );
  assert.deepEqual(
    hintMediaVisibility({ image_url: '', video_url: 'https://cdn.example/rule.mp4' }),
    { image: false, video: true }
  );
  assert.deepEqual(hintMediaVisibility({ image_url: null, video_url: undefined }), {
    image: false,
    video: false,
  });
});

run('Tab cycles inside the dialog and Shift+Tab wraps backwards', () => {
  assert.equal(nextDialogFocusIndex(0, 0, false), -1);
  assert.equal(nextDialogFocusIndex(3, -1, false), 0);
  assert.equal(nextDialogFocusIndex(3, 0, false), 1);
  assert.equal(nextDialogFocusIndex(3, 2, false), 0);
  assert.equal(nextDialogFocusIndex(3, 0, true), 2);
  assert.equal(nextDialogFocusIndex(3, -1, true), 2);
  assert.equal(nextDialogFocusIndex(3, 2, true), 1);
  assert.equal(nextDialogFocusIndex(1, 0, false), 0);
  assert.equal(nextDialogFocusIndex(1, 0, true), 0);
});

run('Opening the dialog locks page scroll and closing restores it', () => {
  const target = blankScrollTarget({
    overflow: 'auto',
    position: 'relative',
    top: '4px',
    left: '1px',
    right: '2px',
    width: '10px',
  });
  target.documentElement.style.overflow = 'scroll';
  let restored = -1;
  const unlock = lockPageScroll(target, 240, (y) => {
    restored = y;
  });
  assert.equal(target.documentElement.style.overflow, 'hidden');
  assert.equal(target.body.style.overflow, 'hidden');
  assert.equal(target.body.style.position, 'fixed');
  assert.equal(target.body.style.top, '-240px');
  assert.equal(target.body.style.left, '0');
  assert.equal(target.body.style.right, '0');
  assert.equal(target.body.style.width, '100%');
  assert.equal(restored, -1);
  unlock();
  assert.equal(target.documentElement.style.overflow, 'scroll');
  assert.equal(target.body.style.overflow, 'auto');
  assert.equal(target.body.style.position, 'relative');
  assert.equal(target.body.style.top, '4px');
  assert.equal(target.body.style.left, '1px');
  assert.equal(target.body.style.right, '2px');
  assert.equal(target.body.style.width, '10px');
  assert.equal(restored, 240);
});

run('Hint dialog uses the keyword card floating layout with a red header', () => {
  const css = readFileSync(path.join(root, 'app/globals.css'), 'utf8');
  const overlayAt = css.indexOf('.lt-hint-dialog-overlay {');
  const panelAt = css.indexOf('.lt-hint-dialog-panel {');
  const headerAt = css.indexOf('.lt-hint-dialog-header {');
  const scrollAt = css.indexOf('.lt-hint-dialog-scroll {');
  const footerAt = css.indexOf('.lt-hint-dialog-footer {');
  const mediaAt = css.indexOf('@media (min-width: 640px)', overlayAt);
  assert.ok(overlayAt > 0 && panelAt > overlayAt && scrollAt > panelAt && footerAt > scrollAt);
  assert.ok(mediaAt > footerAt);

  const overlay = css.slice(overlayAt, panelAt);
  const panel = css.slice(panelAt, headerAt);
  const header = css.slice(headerAt, scrollAt);
  const scroll = css.slice(scrollAt, footerAt);
  const media = css.slice(mediaAt, css.indexOf('@layer utilities'));
  const hintCss = css.slice(overlayAt, mediaAt);

  assert.ok(overlay.includes('position: fixed'));
  assert.ok(overlay.includes('align-items: flex-end'));
  assert.ok(overlay.includes('overflow: hidden'));
  assert.ok(overlay.includes('overscroll-behavior: none'));
  assert.ok(overlay.includes('--lt-safe-top'));
  assert.ok(overlay.includes('--lt-safe-bottom'));
  assert.ok(overlay.includes('--lt-safe-left'));
  assert.ok(overlay.includes('--lt-safe-right'));
  assert.ok(!overlay.includes('overflow-y: auto'));

  assert.ok(panel.includes('overflow: hidden'));
  assert.ok(panel.includes('min(88dvh, 100%)'));
  assert.ok(!panel.includes('safe-area-inset-top'));
  assert.ok(!panel.includes('--lt-safe-top'));
  assert.ok(panel.includes('max-width: 32rem'));
  assert.ok(panel.includes('border-radius: 1.15rem'));
  assert.ok(panel.includes('var(--surface)'));

  assert.ok(header.includes('#fdecee'));
  assert.ok(header.includes('#D71920'));
  assert.ok(scroll.includes('overflow-y: auto'));
  assert.ok(scroll.includes('overscroll-behavior: contain'));
  assert.ok(scroll.includes('min-height: 0'));
  assert.ok(!scroll.includes('safe-area-inset-bottom'));
  assert.ok(!scroll.includes('--lt-safe-bottom'));
  const imageRule = css.slice(css.indexOf('.lt-hint-dialog-image {'), css.indexOf('.lt-hint-dialog-video {'));
  assert.ok(imageRule.includes('width: 100%'));
  assert.ok(imageRule.includes('height: auto'));
  assert.ok(imageRule.includes('object-fit: contain'));
  assert.ok(!imageRule.includes('max-height'));
  assert.ok(!imageRule.includes('object-fit: cover'));
  assert.ok(!hintCss.includes('.lt-hint-dialog-grabber'));
  assert.ok(!hintCss.includes('92dvh'));

  assert.ok(media.includes('align-items: center'));
  assert.ok(media.includes('1.5rem'));
  assert.ok(media.includes('--lt-safe-top'));
  assert.ok(media.includes('--lt-safe-bottom'));
  assert.ok(!media.includes('align-items: flex-end'));
});

run('Dialog semantics, focus trap, Escape, and no backdrop dismissal', () => {
  const dialog = readFileSync(path.join(root, 'components/PracticeHintDialog.tsx'), 'utf8');
  const aids = readFileSync(path.join(root, 'components/PracticeLearningAids.tsx'), 'utf8');
  const panel = readFileSync(path.join(root, 'components/ExplanationCardPanel.tsx'), 'utf8');
  const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
  const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');

  assert.ok(dialog.includes('role="dialog"'));
  assert.ok(dialog.includes('aria-modal="true"'));
  assert.ok(dialog.includes('aria-labelledby={titleId}'));
  assert.ok(dialog.includes('aria-describedby={descriptionId}'));
  assert.ok(dialog.includes('tabIndex={-1}'));
  assert.ok(dialog.includes('dir={copy.dir}'));
  assert.ok(dialog.includes('lang={copy.lang}'));
  assert.ok(dialog.includes('Explanation Hint'));
  assert.equal(dialog.includes('copy.languageLabel'), false);
  assert.equal(dialog.includes('hintFormatLabel'), false);
  assert.ok(dialog.includes('copy.closeLabel'));
  assert.ok(dialog.includes('copy.gotItLabel'));
  assert.ok(dialog.includes('lt-hint-dialog-overlay'));
  assert.ok(dialog.includes('lt-hint-dialog-panel'));
  assert.ok(dialog.includes('lt-hint-dialog-header'));
  assert.ok(dialog.includes('lt-hint-dialog-scroll'));
  assert.ok(dialog.includes('lt-hint-dialog-footer'));
  assert.ok(dialog.includes('lt-hint-dialog-close'));
  assert.ok(dialog.includes('lt-btn-primary'));
  assert.equal(dialog.includes('lt-btn-ghost'), false);
  assert.equal(dialog.includes('lt-hint-dialog-grabber'), false);
  assert.ok(dialog.includes("event.key === 'Escape'"));
  assert.ok(dialog.includes('nextDialogFocusIndex'));
  assert.ok(dialog.includes('lockPageScroll'));
  assert.ok(dialog.includes('previouslyFocused'));
  assert.ok(dialog.includes("setAttribute('aria-hidden', 'true')"));
  assert.ok(dialog.includes('node.inert = true'));
  assert.ok(dialog.includes('node === portalRoot || node.contains(portalRoot)'));
  assert.ok(dialog.includes('restore?.focus({ preventScroll: true })'));
  assert.ok(dialog.includes('<ExplanationCardPanel'));
  assert.ok(!dialog.includes('correct_answer'));
  assert.ok(!dialog.includes('selectedAnswer'));
  assert.ok(!dialog.includes('useState(true)'));

  const backdropStart = dialog.indexOf('data-hint-backdrop');
  const dialogRole = dialog.indexOf('role="dialog"');
  assert.ok(backdropStart > 0 && dialogRole > backdropStart);
  const backdrop = dialog.slice(backdropStart, dialogRole);
  assert.ok(!backdrop.includes('onClick'));
  assert.ok(!backdrop.includes('onPointerDown'));
  assert.ok(!backdrop.includes('onClose'));

  assert.ok(aids.includes('useState(false)'));
  assert.equal((aids.match(/setOpen\(true\)/g) || []).length, 1);
  assert.ok(aids.slice(aids.indexOf('setOpen(true)') - 40, aids.indexOf('setOpen(true)')).includes('onClick'));
  assert.ok(aids.includes('setOpen(false)'));
  assert.ok(aids.includes('aria-haspopup="dialog"'));
  assert.ok(aids.includes('aria-expanded={open}'));
  assert.ok(!aids.includes('ExplanationCardPanel'));
  assert.ok(!aids.includes('Hide hint'));
  assert.ok(!aids.includes('useState(true)'));

  assert.ok(panel.includes('{card.explanation}'));
  assert.ok(panel.includes('image_url'));
  assert.ok(panel.includes('video_url'));
  assert.ok(panel.includes('hintMediaVisibility'));
  assert.ok(panel.includes('SaveCardButton'));
  assert.ok(panel.includes('not a DVSA-approved explanation'));
  assert.ok(panel.includes('dir="ltr" lang="en"'));
  assert.ok(panel.includes('isArabicHintLanguage'));
  assert.ok(panel.includes('tone="explanation"'));
  const imageAt = panel.indexOf('lt-hint-dialog-image');
  const englishAt = panel.indexOf('{card.explanation}');
  const saveAt = panel.indexOf('<SaveCardButton');
  const disclaimerAt = panel.indexOf('not a DVSA-approved explanation');
  assert.ok(imageAt > 0 && imageAt < englishAt && englishAt < saveAt && saveAt < disclaimerAt);
  const headerAt = dialog.indexOf('lt-hint-dialog-header');
  const panelAt = dialog.indexOf('<ExplanationCardPanel');
  const gotItAt = dialog.indexOf('practice-hint-got-it');
  assert.ok(headerAt > 0 && headerAt < panelAt && panelAt < gotItAt);

  assert.ok(practice.includes('<PracticeExplanationHint'));
  assert.ok(!practice.includes('PracticeHintDialog'));
  assert.ok(!mock.includes('PracticeHintDialog'));
  assert.ok(!mock.includes('PracticeExplanationHint'));
  assert.ok(!mock.includes('ExplanationCardPanel'));
  assert.ok(!mock.includes('practice-hint-dialog'));
});
