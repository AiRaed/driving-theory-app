/**
 * Inline Practice keywords: literal matches, link gating, publication, and the
 * existing popup. Does not write to Supabase or publish cards.
 */

import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { readFileSync } from 'node:fs';
import { approvedAliasesForTerm } from './approvedAliases';
import { keywordDialogCopy } from './dialog';
import { highlightedKeywordIds, segmentKeywordText, type KeywordHighlightSource } from './highlightTerms';
import { isolateKeywordActivation } from './keywordActivation';
import { createLocalKeywordCardsRepository } from './localRepository';
import { keywordIndexForId } from './rules';

const root = path.join(__dirname, '..', '..');
process.env.LOCAL_KEYWORD_CARDS_STORE = path.join(
  mkdtempSync(path.join(tmpdir(), 'keyword-highlight-')),
  'store.json'
);

function run(name: string, fn: () => void | Promise<void>) {
  const result = fn();
  if (result && typeof (result as Promise<void>).then === 'function') {
    return (result as Promise<void>).then(
      () => console.log(`PASS ${name}`),
      (error) => {
        console.error(`FAIL ${name}`);
        throw error;
      }
    );
  }
  console.log(`PASS ${name}`);
  return Promise.resolve();
}

function card(
  id: string,
  term: string,
  aliases: string[] = [],
  extra: Partial<KeywordHighlightSource> = {}
): KeywordHighlightSource {
  return { id, term_en: term, aliases, explanation_en: 'A simple explanation.', ...extra };
}

function segments(text: string, keywords: KeywordHighlightSource[]) {
  const parts = segmentKeywordText(text, keywords);
  assert.equal(parts.map((part) => part.text).join(''), text);
  return parts;
}

function hits(text: string, keywords: KeywordHighlightSource[]) {
  return segments(text, keywords)
    .filter((part) => part.keywordId)
    .map((part) => part.text);
}

const hardShoulder = card('shoulder', 'Hard shoulder', approvedAliasesForTerm('Hard shoulder'));
const giveWay = card('give-way', 'Give way', approvedAliasesForTerm('Give way'));
const boxJunction = card('box', 'Box junction', approvedAliasesForTerm('Box junction'));
const dual = card('dual', 'Dual carriageway', approvedAliasesForTerm('Dual carriageway'));
const carriageway = card('carriageway', 'Carriageway', approvedAliasesForTerm('Carriageway'));
const blindSpot = card('blind', 'Blind spot', approvedAliasesForTerm('Blind spot'));

async function main() {
  await run('Multi-word terms keep the official wording and punctuation', () => {
    const text = 'Use the hard shoulder, then give way at the box junction on a dual carriageway.';
    const parts = segments(text, [hardShoulder, giveWay, boxJunction, dual]);
    assert.deepEqual(hits(text, [hardShoulder, giveWay, boxJunction, dual]), [
      'hard shoulder',
      'give way',
      'box junction',
      'dual carriageway',
    ]);
    assert.equal(parts[0].text, 'Use the ');
    assert.equal(parts[parts.length - 1].text, '.');
    assert.equal(text, 'Use the hard shoulder, then give way at the box junction on a dual carriageway.');
  });

  await run('Matching is case-insensitive and does not invent a plural', () => {
    assert.deepEqual(hits('HARD SHOULDERS are for emergencies.', [hardShoulder]), ['HARD SHOULDERS']);
    const singularOnly = card('box-only', 'Box junction', ['box junction']);
    assert.deepEqual(hits('There are box junctions ahead.', [singularOnly]), []);
    assert.deepEqual(hits('There is a box junction ahead.', [singularOnly]), ['box junction']);
  });

  await run('Approved aliases include grammatical variants and exclude editorial inferences', () => {
    assert.ok(approvedAliasesForTerm('Hard shoulder').includes('hard shoulders'));
    assert.ok(approvedAliasesForTerm('Give way').includes('giving way'));
    assert.equal(approvedAliasesForTerm('Blind spot').includes('look over your shoulder'), false);
    assert.deepEqual(hits('You are giving way to traffic.', [giveWay]), ['giving way']);
    assert.deepEqual(hits('Look over your shoulder for a final check.', [blindSpot]), []);
    assert.deepEqual(hits('Check the blind spot before you move.', [blindSpot]), ['blind spot']);
  });

  await run('The longest overlapping phrase wins and a substring is not a separate word', () => {
    const text = 'Join the dual carriageway, not a yellow box junction.';
    assert.deepEqual(hits(text, [dual, carriageway, boxJunction]), ['dual carriageway', 'yellow box junction']);
    assert.deepEqual(highlightedKeywordIds(segments(text, [dual, carriageway, boxJunction])), ['dual', 'box']);
    assert.deepEqual(hits('The carriage is on the way to Oxford.', [carriageway, giveWay, card('ford', 'Ford', ['ford'])]), []);
    assert.deepEqual(hits('Cross the ford.', [card('ford', 'Ford', ['ford'])]), ['ford']);
    const drug = card('drug', 'Drug', ['drug']);
    assert.deepEqual(hits('These drugs are prescribed.', [drug]), []);
    assert.deepEqual(hits('This drug is prescribed.', [drug]), ['drug']);
  });

  await run('Overlapping different cards highlight only the longest literal phrase', () => {
    const right = card('right', 'Right-hand lane', ['right-hand lane']);
    const closed = card('closed', 'Lane closed', ['lane closed', 'lane is closed']);
    const text = 'The right-hand lane closed ahead.';
    assert.deepEqual(hits(text, [right, closed]), ['right-hand lane']);
    assert.deepEqual(highlightedKeywordIds(segments(text, [right, closed])), ['right']);
  });

  await run('Level crossing is interactive in both road-sign answers and nowhere else', () => {
    const level = card('level-crossing', 'Level crossing', approvedAliasesForTerm('Level crossing'));
    const withGate = 'Level crossing with gate or barrier';
    const withoutGate = 'Level crossing without gate or barrier';
    const gated = 'Gated road ahead';
    const cattle = 'Cattle grid ahead';
    assert.deepEqual(hits(withGate, [level]), ['Level crossing']);
    assert.deepEqual(hits(withoutGate, [level]), ['Level crossing']);
    assert.equal(segments(withGate, [level]).map((part) => part.text).join(''), withGate);
    assert.equal(segments(withoutGate, [level]).map((part) => part.text).join(''), withoutGate);
    assert.deepEqual(hits(gated, [level]), []);
    assert.deepEqual(hits(cattle, [level]), []);
    assert.deepEqual(hits('level crossing without gate or barrier', [level]), ['level crossing']);
    assert.deepEqual(hits(withGate, [card('level-crossing', 'Level crossing', ['level crossing'], { status: 'draft' })]), []);
    assert.deepEqual(hits('A level crossing and another level crossing.', [level]), ['level crossing', 'level crossing']);
  });

  await run('A keyword tap is stopped before the answer option can select it', () => {
    let selected = false;
    const event = {
      preventDefault() {
        this.prevented = true;
      },
      stopPropagation() {
        this.stopped = true;
      },
      prevented: false,
      stopped: false,
    };
    isolateKeywordActivation(event);
    if (!event.stopped) selected = true;
    assert.equal(event.prevented, true);
    assert.equal(event.stopped, true);
    assert.equal(selected, false);
    assert.equal(keywordDialogCopy('en').learnMoreLabel, 'Learn more');
    assert.equal(keywordDialogCopy('ar').learnMoreLabel, 'اعرف المزيد');
    assert.equal(keywordDialogCopy('ar').dir, 'rtl');
  });

  await run('A keyword is highlighted only when it is passed for this question', () => {
    const text = 'Use the hard shoulder and give way.';
    assert.deepEqual(hits(text, [giveWay]), ['give way']);
    assert.deepEqual(hits(text, []), []);
    assert.deepEqual(segmentKeywordText(text, []), [{ text, keywordId: null }]);
  });

  await run('Draft, submitted, approved, and archived cards are not highlighted', () => {
    const text = 'Use the hard shoulder.';
    for (const status of ['draft', 'submitted', 'approved', 'archived'] as const) {
      assert.deepEqual(hits(text, [card('shoulder', 'Hard shoulder', ['hard shoulder'], { status })]), []);
    }
    assert.deepEqual(
      hits(text, [card('shoulder', 'Hard shoulder', ['hard shoulder'], { status: 'published', explanation_en: '   ' })]),
      []
    );
    assert.deepEqual(
      hits(text, [card('shoulder', 'Hard shoulder', ['hard shoulder'], { status: 'published' })]),
      ['hard shoulder']
    );
  });

  await run('Curly apostrophes and repeated terms stay in the original text', () => {
    const text = 'Check the driver\u2019s blind spot, then the other blind spot.';
    const parts = segments(text, [blindSpot]);
    assert.deepEqual(
      parts.filter((part) => part.keywordId).map((part) => part.text),
      ['blind spot', 'blind spot']
    );
    assert.ok(parts.some((part) => part.text.includes('\u2019')));
    assert.equal(parts.map((part) => part.text).join(''), text);
  });

  await run('A manual term matches itself when it has no approved alias', () => {
    const manual = card('manual', 'Zigzag crossing');
    assert.deepEqual(hits('Stop at the zigzag crossing.', [manual]), ['zigzag crossing']);
    assert.deepEqual(hits('Stop at the zigzag.', [manual]), []);
  });

  await run('Direct popup selection opens the tapped card', () => {
    const keywords = [
      { id: 'dual' },
      { id: 'shoulder' },
      { id: 'box' },
    ];
    assert.equal(keywordIndexForId(keywords, 'box'), 2);
    assert.equal(keywordIndexForId(keywords, 'missing'), 0);
    assert.equal(keywordIndexForId([], 'box'), 0);
    assert.equal(keywordIndexForId(keywords, null), 0);
  });

  await run('Question links and publication decide what can be highlighted or saved', async () => {
    const repo = createLocalKeywordCardsRepository();
    const shoulder = await repo.create(
      {
        term_en: 'Hard shoulder',
        explanation_en: 'The strip at the edge of a motorway for emergencies.',
        image_url: 'https://cdn.example/shoulder.png',
        image_alt: 'Hard shoulder',
      },
      'admin-1'
    );
    const draft = await repo.create(
      { term_en: 'Give way', explanation_en: 'Let other road users go first.' },
      'admin-1'
    );
    await repo.link(shoulder.id, 'AB2001', 'admin-1');
    await repo.link(shoulder.id, 'AB2002', 'admin-1');
    await repo.link(draft.id, 'AB2001', 'admin-1');
    assert.equal((await repo.listPublishedForQuestion('AB2001')).length, 0);

    await repo.setStatus(shoulder.id, 'submitted', 'admin-1');
    await repo.setStatus(shoulder.id, 'approved', 'admin-1');
    await repo.setStatus(shoulder.id, 'published', 'admin-1');

    const published = await repo.listPublishedForQuestion('AB2001');
    assert.deepEqual(published.map((item) => item.term_en), ['Hard shoulder']);
    assert.equal(published[0].image_url, 'https://cdn.example/shoulder.png');
    const visible = published.map((item) =>
      card(item.id, item.term_en, approvedAliasesForTerm(item.term_en), {
        status: 'published',
        explanation_en: item.explanation_en,
      })
    );
    const prompt = 'You may use the hard shoulder, then give way.';
    assert.deepEqual(hits(prompt, visible), ['hard shoulder']);

    const first = await repo.addSave('user-a', shoulder.id);
    const second = await repo.addSave('user-a', shoulder.id);
    assert.equal(first.id, second.id);
    assert.equal((await repo.listSaved('user-a')).length, 1);
    assert.equal((await repo.listSaved('user-a'))[0].image_url, 'https://cdn.example/shoulder.png');
    assert.equal((await repo.toggleSave('user-a', shoulder.id)).saved, false);
    assert.equal((await repo.listSaved('user-a')).length, 0);
    assert.equal((await repo.toggleSave('user-a', shoulder.id)).saved, true);
    assert.equal((await repo.listSaved('user-a')).length, 1);
    await assert.rejects(() => repo.addSave('user-a', draft.id), /Only published/);
    assert.equal((await repo.list()).keywords.every((row) => row.term_en !== 'Give way' || row.status === 'draft'), true);
  });

  await run('Practice wires the popup and Mock Test stays isolated', () => {
    const text = readFileSync(path.join(root, 'components/PracticeKeywordText.tsx'), 'utf8');
    const control = readFileSync(path.join(root, 'components/PracticeKeywordControl.tsx'), 'utf8');
    const dialog = readFileSync(path.join(root, 'components/PracticeKeywordDialog.tsx'), 'utf8');
    const aids = readFileSync(path.join(root, 'components/PracticeLearningAids.tsx'), 'utf8');
    const hook = readFileSync(path.join(root, 'lib/keyword-cards/useQuestionKeywords.ts'), 'utf8');
    const route = readFileSync(path.join(root, 'app/api/keyword-cards/for-question/route.ts'), 'utf8');
    const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
    const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
    const manager = readFileSync(path.join(root, 'components/admin/KeywordCardsManager.tsx'), 'utf8');
    const saved = readFileSync(path.join(root, 'app/saved-cards/page.tsx'), 'utf8');

    assert.ok(text.includes('type="button"'));
    assert.ok(text.includes('segmentKeywordText'));
    assert.ok(text.includes('isolateKeywordActivation'));
    assert.ok(text.includes('event.stopPropagation()'));
    assert.ok(text.includes('copy.learnMoreLabel'));
    assert.ok(text.includes('data-testid="practice-keyword-term"'));
    assert.ok(text.includes('initialKeywordId={selectedId}'));
    assert.ok(text.includes('returnFocusRef={triggerRef}'));
    assert.ok(text.includes('triggerRef.current = event.currentTarget'));
    assert.ok(text.includes('usePublishedQuestionKeywords'));
    assert.equal(text.includes('/api/keyword-cards/for-question'), false);
    assert.equal(text.includes('correct_answer'), false);
    assert.ok(control.includes('usePublishedQuestionKeywords'));
    assert.equal(control.includes('initialKeywordId'), false);
    assert.equal(control.includes('/api/keyword-cards/for-question'), false);
    assert.ok(control.includes('if (!keywords.length) return null'));
    assert.equal((hook.match(/\/api\/keyword-cards\/for-question/g) || []).length, 1);
    assert.ok(dialog.includes('keywordIndexForId(keywords, initialKeywordId)'));
    assert.ok(dialog.includes('data-keyword-id={keyword.id}'));
    assert.ok(dialog.includes('data-testid="practice-keyword-save"'));
    assert.ok(dialog.includes('/api/keyword-cards/saved'));
    assert.ok(dialog.includes('keyword_id: keyword.id'));
    assert.ok(dialog.includes('lockPageScroll'));
    assert.ok(dialog.includes("event.key === 'Escape'"));
    assert.equal(dialog.includes('correct_answer'), false);
    assert.ok(aids.includes('<PracticeKeywordText'));
    assert.ok(aids.includes('<PracticeExplanationHint') || aids.includes('export function PracticeExplanationHint'));
    assert.ok(aids.includes('PracticeHintDialog'));
    assert.equal((aids.match(/setOpen\(true\)/g) || []).length, 1);
    assert.ok(route.includes('listPublishedForQuestion'));
    assert.ok(route.includes('approvedAliasesForTerm'));
    assert.equal(route.includes("from('questions')"), false);
    assert.equal(route.includes('correct_answer'), false);
    assert.ok(practice.includes('<PracticeLearningAids'));
    assert.equal((practice.match(/prompt=\{currentQuestion\.promptEn\}/g) || []).length, 1);
    const options = readFileSync(path.join(root, 'components/AnswerOptionContent.tsx'), 'utf8');
    assert.ok(options.includes('PracticeKeywordText'));
    assert.ok(options.includes('keywordQuestionId'));
    assert.equal(options.includes('segmentKeywordText'), false);
    const answerBlock = practice.slice(practice.indexOf('{/* Answer Options */}'), practice.indexOf('validHints'));
    assert.equal(answerBlock.includes('<button'), false);
    assert.ok(answerBlock.includes('role="radio"'));
    assert.ok(answerBlock.includes('keywordQuestionId={currentQuestion.id}'));
    assert.ok(answerBlock.includes('practice-keyword-term'));
    assert.equal(mock.includes('keywordQuestionId'), false);
    assert.ok(practice.includes('<PracticeKeywordControl'));
    assert.ok(practice.includes('<PracticeExplanationHint'));
    assert.equal(practice.includes('PracticeKeywordDialog'), false);
    assert.equal(mock.includes('PracticeKeyword'), false);
    assert.equal(mock.includes('PracticeLearningAids'), false);
    assert.equal(mock.includes('segmentKeywordText'), false);
    assert.equal(mock.includes('/api/keyword-cards'), false);
    assert.ok(mock.includes('no hints, vocab cards, or tappable keywords'));
    assert.ok(mock.includes('{currentQuestion.promptEn}'));
    assert.ok(saved.includes('Keyword Card'));
    assert.ok(saved.includes('keyword_id'));
    assert.ok(saved.includes('image_url'));

    const creator = manager.slice(manager.indexOf('const startNewKeyword'), manager.indexOf('const fillEditor'));
    assert.equal(creator.includes('setRows'), false);
    assert.ok(manager.includes('fillEditor(row)'));
    assert.ok(manager.includes('image_url: row.image_url'));
    assert.ok(manager.includes('explanation_en: row.explanation_en'));
    assert.ok(manager.includes('${rows.length} keyword cards'));
    assert.ok(manager.includes('overflow-y-scroll'));
    assert.ok(manager.includes('Scroll the list to browse'));
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
