/**
 * Explanation Hints (simplified Practice workflow).
 * Reuses Learning Cards. Does not auto-publish hundreds of hints.
 */

import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {
  isCompleteExplanationHint,
  isLearnerVisibleExplanationHint,
  resolveExplanationSaveStatus,
} from './hints';
import { isStraightforwardSignIdentification } from './classify';
import {
  disableExplanationCard,
  readLocalLearningCards,
  toggleSavedCard,
  upsertExplanationCard,
} from './localStore';
import { mockExamAllowsLearningAids } from './types';
import { loadBundledRecommendations } from './recommendations';
import { DVSA_V2_EXPECTED_COUNT } from '../questions/dvsaV2';
import { composeGroundedHint } from './groundedDraft';
import { loadHintDraft, PROVISIONAL_HINT_LABEL } from './hintDraftStore';

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

run('758 DVSA recommendations remain the hint identification source', () => {
  const recs = loadBundledRecommendations();
  assert.equal(recs.length, DVSA_V2_EXPECTED_COUNT);
  assert.ok(recs.some((r) => r.recommended_classification === 'needs_explanation'));
  assert.ok(recs.some((r) => r.recommended_classification === 'image_is_enough'));
  assert.equal(recs.every((r) => r.dvsa_approved === false), true);
});

run('Empty drafts are never learner-visible', () => {
  assert.equal(isCompleteExplanationHint({ explanation: '' }), false);
  assert.equal(isCompleteExplanationHint({ explanation: '   ' }), false);
  assert.equal(
    isLearnerVisibleExplanationHint({ status: 'published', explanation: '' }),
    false
  );
  assert.equal(
    isLearnerVisibleExplanationHint({ status: 'draft', explanation: 'Stopping distances double in the wet.' }),
    false
  );
});

run('Complete admin-activated hint is learner-visible', () => {
  const resolved = resolveExplanationSaveStatus({
    explanation: 'Leave a two-second gap in the dry.',
    activate: true,
    existingStatus: 'draft',
  });
  assert.equal(resolved.status, 'published');
  assert.equal(
    isLearnerVisibleExplanationHint({
      status: resolved.status,
      explanation: 'Leave a two-second gap in the dry.',
    }),
    true
  );
});

run('Saving without activate keeps a complete seed as draft', () => {
  const resolved = resolveExplanationSaveStatus({
    explanation: 'Draft example text',
    activate: false,
    existingStatus: null,
  });
  assert.equal(resolved.status, 'draft');
  assert.equal(resolved.published_at, null);
});

run('Clearing hint text unpublishes it', () => {
  const resolved = resolveExplanationSaveStatus({
    explanation: '',
    activate: true,
    existingStatus: 'published',
  });
  assert.equal(resolved.status, 'draft');
  assert.equal(resolved.published_at, null);
});

run('Admin page is a practical hint workflow, not a second card system', () => {
  const page = readFileSync(path.join(root, 'app/admin/learning-cards/page.tsx'), 'utf8');
  const editor = readFileSync(
    path.join(root, 'components/admin/ExplanationHintEditor.tsx'),
    'utf8'
  );
  assert.ok(page.includes('Explanation hints'));
  assert.ok(page.includes('needs_explanation'));
  assert.ok(page.includes('Do not create a hint for every question'));
  assert.ok(editor.includes('Official question'));
  assert.ok(editor.includes('Correct answer'));
  assert.ok(editor.includes('Official explanation'));
  assert.ok(editor.includes('English hint text'));
  assert.ok(editor.includes('Suggested Hint format'));
  assert.ok(editor.includes('Suggested draft'));
  assert.ok(editor.includes('Linked question IDs'));
  assert.ok(editor.includes('Disable hint'));
  assert.ok(editor.includes('Upload video'));
  assert.ok(page.includes('Search by question ID'));
  assert.ok(page.includes('Suggested Media'));
  assert.ok(page.includes('All formats'));
  assert.ok(page.includes('Text only'));
  assert.ok(page.includes('Diagram'));
  assert.ok(page.includes('Video'));
  assert.ok(page.includes('suggested_format'));
  assert.ok(page.includes('not an uploaded image or video'));
  assert.ok(page.includes('Provisional — Needs Human Review'));
  assert.ok(page.includes('Page '));
  assert.ok(!page.includes('slice(0, 100)'));
  assert.ok(editor.includes('Save hint'));
  assert.ok(editor.includes('Provisional — Needs Human Review'));
  assert.ok(editor.includes('Reject draft'));
  assert.ok(editor.includes('Show provisional draft'));
  assert.ok(editor.includes('Remove hint'));
  assert.ok(editor.includes('Reuse an existing hint'));
  assert.ok(editor.includes('activate: true'));
  assert.ok(editor.includes('correct_answer - 1'));
  assert.ok(!page.includes('Seed draft examples (never publish)'));
});

run('Save API publishes complete hints without a separate publication workflow', () => {
  const api = readFileSync(
    path.join(root, 'app/api/admin/learning-cards/explanations/route.ts'),
    'utf8'
  );
  assert.ok(api.includes('activate'));
  assert.ok(api.includes('action === \'remove\''));
  assert.ok(api.includes('action === \'disable\''));
  assert.ok(api.includes('action === \'reuse\''));
  assert.ok(api.includes('A complete English explanation is required'));
});

run('Practice shows Hint only for complete active hints; Mock Test stays clean', () => {
  const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
  const aids = readFileSync(path.join(root, 'components/PracticeLearningAids.tsx'), 'utf8');
  const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
  const panel = readFileSync(path.join(root, 'components/ExplanationCardPanel.tsx'), 'utf8');
  assert.ok(practice.includes('PracticeExplanationHint'));
  assert.ok(practice.includes('Saved cards'));
  assert.ok(aids.includes('PracticeHintDialog'));
  assert.ok(aids.includes('useState(false)'));
  assert.ok(aids.includes('setOpen(true)'));
  assert.ok(aids.includes('aria-haspopup="dialog"'));
  assert.ok(!aids.includes('Hide hint'));
  assert.ok(aids.includes("if (!card) return null"));
  assert.ok(panel.includes('image_url'));
  assert.ok(panel.includes('video_url'));
  assert.ok(panel.includes('SaveCardButton'));
  assert.ok(!mock.includes('PracticeExplanationHint'));
  assert.ok(!mock.includes('PracticeLearningAids'));
  assert.ok(mock.includes('no hints, vocab cards, or tappable keywords'));
  assert.equal(mockExamAllowsLearningAids(), false);
});

run('Keyword cards stay separate; no keyword extraction added', () => {
  const page = readFileSync(path.join(root, 'app/admin/learning-cards/page.tsx'), 'utf8');
  const editor = readFileSync(
    path.join(root, 'components/admin/ExplanationHintEditor.tsx'),
    'utf8'
  );
  assert.ok(page.includes('Keyword cards (separate)'));
  assert.ok(page.includes('KeywordCardEditor'));
  assert.ok(!editor.includes('extractKeywords'));
  assert.ok(!page.includes('keyword extraction'));
});

run('Official question content and payments are not rewritten by hint APIs', () => {
  const api = readFileSync(
    path.join(root, 'app/api/admin/learning-cards/explanations/route.ts'),
    'utf8'
  );
  const media = readFileSync(
    path.join(root, 'app/api/admin/learning-cards/explanations/media/route.ts'),
    'utf8'
  );
  assert.ok(!api.includes('from(\'questions\')'));
  assert.ok(media.includes('official_question_unchanged'));
  assert.ok(!media.includes("from('questions')"));
});

run('Straightforward sign naming is not selected, and hint drafts cover needs_explanation plus provisional review_later', () => {
  assert.equal(isStraightforwardSignIdentification('What does this sign mean?'), true);
  assert.equal(
    isStraightforwardSignIdentification('What should you do when you see this sign?'),
    false
  );
  const drafts = JSON.parse(
    readFileSync(path.join(root, 'data/explanation-hint-drafts.json'), 'utf8')
  );
  const recs = loadBundledRecommendations();
  const needs = recs.filter((r) => r.recommended_classification === 'needs_explanation');
  const review = recs.filter((r) => r.recommended_classification === 'review_later');
  const imageEnough = recs.filter((r) => r.recommended_classification === 'image_is_enough');
  const byId = new Map(
    drafts.drafts.map((draft: { question_id: string }) => [draft.question_id, draft])
  );
  assert.equal(recs.length, DVSA_V2_EXPECTED_COUNT);
  assert.equal(needs.length, 490);
  assert.equal(review.length, 57);
  assert.equal(imageEnough.length, 211);
  assert.equal(needs.length + review.length + imageEnough.length, DVSA_V2_EXPECTED_COUNT);
  assert.equal(drafts.published, false);
  assert.equal(drafts.review_required, true);
  assert.equal(drafts.count, 547);
  assert.equal(drafts.drafts.length, 547);
  assert.equal(needs.every((r) => byId.has(r.question_id)), true);
  assert.equal(review.every((r) => byId.has(r.question_id)), true);
  assert.equal(imageEnough.every((r) => !byId.has(r.question_id)), true);
  assert.equal(
    needs.every((r) => {
      const draft = byId.get(r.question_id) as { provisional?: boolean; published: boolean; english: string };
      return draft.provisional !== true && draft.published === false && draft.english.trim().length > 40;
    }),
    true
  );
  assert.equal(
    review.every((r) => {
      const draft = byId.get(r.question_id) as {
        provisional?: boolean;
        published: boolean;
        review_status: string;
        review_label: string;
        english: string;
      };
      return (
        draft.provisional === true &&
        draft.review_status === 'provisional' &&
        draft.review_label === PROVISIONAL_HINT_LABEL &&
        draft.published === false &&
        draft.english.trim().length > 40
      );
    }),
    true
  );
  const needsVideo = needs.filter((r) => r.suggested_format === 'video');
  const needsImage = needs.filter((r) => r.suggested_format === 'image');
  const needsDiagram = needs.filter((r) => r.suggested_format === 'diagram');
  const needsText = needs.filter((r) => r.suggested_format === 'text');
  assert.equal(needsVideo.length, 66);
  assert.equal(needsImage.length, 81);
  assert.equal(needsDiagram.length, 83);
  assert.equal(needsText.length, 260);
  assert.equal(recs.filter((r) => r.suggested_format === 'video').length, 69);
  const videoPage = needsVideo.length;
  const pageSize = 50;
  assert.equal(Math.ceil(videoPage / pageSize), 2);
  assert.equal(Math.min(pageSize, videoPage), 50);
  assert.equal(videoPage - pageSize, 16);
  const uTurn = byId.get('AB2001') as { english: string; provisional?: boolean };
  assert.match(uTurn.english, /U-turn/i);
  assert.doesNotMatch(uTurn.english, /convex/i);
  assert.equal(uTurn.provisional, false);
  const insured = byId.get('BB1243') as { english: string };
  assert.match(insured.english, /insur/i);
  assert.doesNotMatch(insured.english, /\bice\b|stopping distance/i);
  const loadedReview = loadHintDraft('AB2005');
  assert.equal(loadedReview?.provisional, true);
  assert.equal(loadedReview?.published, false);
  assert.equal(loadedReview?.review_label, PROVISIONAL_HINT_LABEL);
  assert.equal(loadHintDraft(imageEnough[0].question_id), null);
});

run('Grounded drafts teach the official situation instead of a shared template', () => {
  const turn = composeGroundedHint({
    prompt: 'What should you do before making a U-turn?',
    explanation:
      'If you have to make a U-turn, slow down and make sure that the road is clear in both directions. Make sure that the road is wide enough for you to carry out the manoeuvre safely.',
    correctAnswer: 'Look over your shoulder for a final check',
  });
  assert.match(turn.english, /U-turn/i);
  assert.match(turn.english, /clear/i);
  assert.doesNotMatch(turn.english, /convex|helmet/i);
  assert.notEqual(turn.english.toLowerCase(), 'look over your shoulder for a final check');
  const cover = composeGroundedHint({
    prompt: "What must you check before you drive someone else's vehicle?",
    explanation:
      "Driving a vehicle without insurance cover is illegal, so be sure that, whoever's car you drive, you're insured.",
    correctAnswer: 'That the vehicle is insured for your use',
  });
  assert.match(cover.english, /insur/i);
  assert.doesNotMatch(cover.english, /\bice\b|towing/i);
});

run('Suggested media counts stay distinct from uploaded assets and paginate with other filters', () => {
  const recs = loadBundledRecommendations();
  const apply = (filters: {
    classification?: string;
    topic?: string;
    priority?: string;
    media?: string;
    query?: string;
  }) =>
    recs.filter((row) => {
      if (filters.classification && row.recommended_classification !== filters.classification) return false;
      if (filters.topic && row.topic !== filters.topic) return false;
      if (filters.priority && row.priority !== filters.priority) return false;
      if (filters.media && row.suggested_format !== filters.media) return false;
      if (filters.query && !row.question_id.toLowerCase().includes(filters.query.toLowerCase())) return false;
      return true;
    });
  assert.equal(apply({ classification: 'needs_explanation', media: 'video' }).length, 66);
  assert.equal(apply({ media: 'video' }).length, 69);
  assert.equal(apply({ classification: 'needs_explanation', media: 'image' }).length, 81);
  assert.equal(apply({ classification: 'needs_explanation', media: 'diagram' }).length, 83);
  assert.equal(apply({ classification: 'needs_explanation', media: 'text' }).length, 260);
  assert.equal(apply({ classification: 'image_is_enough', media: 'video' }).length, 3);
  assert.equal(apply({ classification: 'review_later', media: 'video' }).length, 0);
  const hazardVideo = apply({
    classification: 'needs_explanation',
    topic: 'hazard-awareness',
    media: 'video',
  });
  assert.ok(hazardVideo.length < 66);
  const pageSize = 50;
  const video = apply({ classification: 'needs_explanation', media: 'video' });
  assert.equal(video.slice(0, pageSize).length, 50);
  assert.equal(video.slice(pageSize, pageSize * 2).length, 16);
  const searched = apply({ classification: 'needs_explanation', media: 'video', query: video[0].question_id });
  assert.equal(searched.length, 1);
});

run('Isolated save, Practice visibility, save card, unsave and disable', () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), 'hint-workflow-'));
  process.env.LOCAL_LEARNING_CARDS_STORE = path.join(dir, 'store.json');
  try {
    const hidden = upsertExplanationCard({
      question_id: 'AB0001',
      language: 'en',
      explanation: 'Leave a longer gap when the road is wet.',
      activate: false,
    });
    assert.equal(hidden.status, 'draft');
    assert.equal(isLearnerVisibleExplanationHint(hidden), false);
    const active = upsertExplanationCard({
      question_id: 'AB0001',
      language: 'en',
      explanation: 'Leave a longer gap when the road is wet.',
      activate: true,
    });
    assert.equal(active.status, 'published');
    assert.equal(isLearnerVisibleExplanationHint(active), true);
    const saved = toggleSavedCard({
      user_id: 'user-a',
      card_kind: 'explanation',
      explanation_card_id: active.id,
    });
    assert.equal(saved.saved, true);
    assert.equal(readLocalLearningCards().saved_cards.length, 1);
    const unsaved = toggleSavedCard({
      user_id: 'user-a',
      card_kind: 'explanation',
      explanation_card_id: active.id,
    });
    assert.equal(unsaved.saved, false);
    assert.equal(readLocalLearningCards().saved_cards.length, 0);
    const disabled = disableExplanationCard('AB0001', 'en');
    assert.equal(disabled?.status, 'draft');
    assert.equal(disabled?.published_at, null);
    assert.ok(String(disabled?.explanation || '').includes('longer gap'));
    assert.equal(isLearnerVisibleExplanationHint(disabled), false);
    assert.equal(
      readLocalLearningCards().explanation_cards.some((card) => card.question_id === 'AB0002'),
      false
    );
  } finally {
    delete process.env.LOCAL_LEARNING_CARDS_STORE;
  }
});
