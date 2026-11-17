/**
 * Arabic draft checks. Does not write Supabase.
 * Full bank checks run when the local draft files are present.
 */

import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { keywordDisplay, directionForLanguage } from './display';
import {
  chooseExplanationArabic,
  isArabicDraftPreviewEnabled,
  overlayKeywordArabic,
  overlayQuestionArabic,
  planArabicActivation,
} from './preview';
import {
  ARABIC_QUESTION_DRAFT_PATH,
  auditExistingArabic,
  loadArabicHintDrafts,
  loadArabicKeywordDrafts,
  loadArabicQuestionDrafts,
  loadEnglishHints,
  loadEnglishKeywords,
  loadGlossaryEntries,
  loadOfficialV2Questions,
} from './loadDrafts';
import {
  countBySeverity,
  validateGlossary,
  validateHintDrafts,
  validateKeywordTranslations,
  validateQuestionDrafts,
} from './validate';

const root = process.cwd();
let failed = 0;

async function run(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    console.log(`ok ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`FAIL ${name}`);
    console.error(error);
  }
}

function errorsOf(issues: { severity: string; code: string }[], code: string): number {
  return issues.filter((item) => item.severity === 'error' && item.code === code).length;
}

async function main() {
  await run('glossary covers the canonical driving terms', () => {
    const entries = loadGlossaryEntries();
    const issues = validateGlossary(entries);
    assert.equal(countBySeverity(issues).errors, 0);
    assert.equal(entries.filter((entry) => entry.kind === 'keyword').length, 290);
    const hardShoulder = entries.find((entry) => entry.en === 'Hard shoulder');
    const dual = entries.find((entry) => entry.en === 'Dual carriageway');
    const zebra = entries.find((entry) => entry.en === 'Zebra crossing');
    const level = entries.find((entry) => entry.en === 'Level crossing');
    const central = entries.find((entry) => entry.en === 'Central reservation');
    assert.equal(hardShoulder?.ar, 'الكتف الصلب');
    assert.equal(dual?.ar, 'طريق مزدوج');
    assert.equal(zebra?.ar, 'معبر زيبرا');
    assert.equal(level?.ar, 'تقاطع سكة حديد');
    assert.equal(central?.ar, 'الفاصل الأوسط');
  });

  await run('existing V1 Arabic is preserved and not treated as V2', () => {
    const audit = auditExistingArabic();
    if (audit.v2_total === 0) {
      console.log('  (skip — local V2 staging is not on this machine)');
      return;
    }
    assert.equal(audit.v2_total, 758);
    assert.equal(audit.v2_arabic_stems, 0);
    assert.equal(audit.v2_arabic_complete, 0);
    assert.equal(audit.v1_total, 742);
    assert.equal(audit.v1_arabic_stems, 742);
    assert.equal(audit.v1_arabic_explanations, 626);
    assert.equal(audit.v1_arabic_complete, 625);
    assert.equal(audit.safe_to_reuse, 0);
    assert.equal(audit.preserved, true);
  });

  await run('validator catches missing Arabic, number drift, and review flags', () => {
    const glossary = loadGlossaryEntries();
    const official = [
      {
        id: 'AB1',
        question: 'What is the speed limit in a built-up area?',
        answers: ['20 mph', '30 mph', '40 mph', ''],
        explanation: 'The speed limit is 30 mph unless signs show otherwise.',
        correctAnswer: 2,
      },
    ];
    const padded = [
      official[0],
      ...Array.from({ length: 757 }, (_, index) => ({
        id: `X${index}`,
        question: 'Placeholder',
        answers: ['A', 'B', 'C', 'D'],
        explanation: 'Placeholder explanation.',
        correctAnswer: 1,
      })),
    ];
    const bad = validateQuestionDrafts({
      official: padded,
      glossary,
      drafts: [
        {
          id: 'AB1',
          question: 'ما حد السرعة في منطقة مبنية؟',
          answers: ['20 ميلاً في الساعة', '40 ميلاً في الساعة', '40 ميلاً في الساعة', 'إضافة'],
          explanation: 'حد السرعة 30 ميلاً في الساعة.',
          review_status: 'published',
          human_reviewed: true,
          published: true,
        },
      ],
    });
    assert.ok(errorsOf(bad, 'number_mismatch') >= 1);
    assert.ok(errorsOf(bad, 'added_text') >= 1);
    assert.ok(errorsOf(bad, 'marked_reviewed') >= 1);
    assert.ok(errorsOf(bad, 'published_draft') >= 1);
    assert.ok(errorsOf(bad, 'missing_arabic') >= 1);
  });

  await run('Arabic keyword display falls back to English without relabelling it', () => {
    const arabic = keywordDisplay({
      language: 'ar',
      term_en: 'Hard shoulder',
      translation_ar: 'الكتف الصلب',
      explanation_en: 'Emergency lane.',
      explanation_ar: 'مسار الطوارئ.',
    });
    assert.equal(arabic.termDir, 'ltr');
    assert.equal(arabic.showArabic, true);
    assert.equal(arabic.englishDefinition, 'Emergency lane.');
    assert.equal(arabic.arabicTerm, 'الكتف الصلب');
    assert.equal(arabic.arabicDefinition, 'مسار الطوارئ.');
    assert.equal(arabic.draft, false);
    assert.equal(arabic.fallback, false);
    const missing = keywordDisplay({
      language: 'ar',
      term_en: 'Hard shoulder',
      translation_ar: '',
      explanation_en: 'Emergency lane.',
      explanation_ar: '',
    });
    assert.equal(missing.fallback, true);
    assert.equal(missing.showArabic, false);
    assert.equal(missing.englishDefinition, 'Emergency lane.');
    const englishOnly = keywordDisplay({
      language: 'en',
      term_en: 'Hard shoulder',
      translation_ar: 'الكتف الصلب',
      explanation_en: 'Emergency lane.',
      explanation_ar: 'مسار الطوارئ.',
    });
    assert.equal(englishOnly.showArabic, false);
    assert.equal(directionForLanguage('ar'), 'rtl');
    assert.equal(directionForLanguage('en'), 'ltr');
  });

  await run('practice keeps English stems LTR and mock stays free of keyword popups', () => {
    const practice = readFileSync(path.join(root, 'app/practice/page.tsx'), 'utf8');
    const mock = readFileSync(path.join(root, 'app/mock-test/page.tsx'), 'utf8');
    const aids = readFileSync(path.join(root, 'components/PracticeLearningAids.tsx'), 'utf8');
    const dialog = readFileSync(path.join(root, 'components/PracticeKeywordDialog.tsx'), 'utf8');
    const provider = readFileSync(path.join(root, 'lib/i18n/LanguageProvider.tsx'), 'utf8');
    assert.ok(aids.includes('dir="ltr"'));
    assert.ok(aids.includes('lang="en"'));
    assert.ok(aids.includes('text={prompt}'));
    assert.ok(!aids.includes('options'));
    assert.ok(practice.includes('<PracticeLearningAids'));
    assert.ok(!mock.includes('PracticeKeywordDialog'));
    assert.ok(!mock.includes('PracticeLearningAids'));
    assert.ok(mock.includes('dir="ltr"'));
    assert.ok(dialog.includes('dir="rtl"'));
    assert.ok(dialog.includes('lang="ar"'));
    assert.ok(dialog.includes('keywordDisplay'));
    assert.ok(provider.includes("document.documentElement.dir = 'ltr'"));
    assert.ok(!provider.includes('document.documentElement.dir = meta.dir'));
    assert.ok(dialog.includes('dir="ltr"'));
    assert.ok(dialog.includes('englishDefinition'));
    const route = readFileSync(path.join(root, 'app/api/admin/translations/review/route.ts'), 'utf8');
    assert.ok(!route.includes('.insert('));
    assert.ok(!route.includes('.update('));
    assert.ok(!route.includes('.upsert('));
  });

  await run('prepared drafts stay unreviewed when the files exist', () => {
    const glossary = loadGlossaryEntries();
    const questions = loadArabicQuestionDrafts();
    const official = loadOfficialV2Questions();
    if (!questions || !official) {
      console.log('  (skip question drafts — file not prepared yet)');
    } else {
      const issues = validateQuestionDrafts({ official, drafts: questions.questions, glossary });
      const counts = countBySeverity(issues);
      assert.equal(questions.human_reviewed, false);
      assert.equal(questions.published, false);
      assert.equal(questions.questions.length, 758);
      assert.equal(
        counts.errors,
        0,
        JSON.stringify(issues.filter((item) => item.severity === 'error').slice(0, 8))
      );
    }

    const hints = loadArabicHintDrafts();
    if (!hints) {
      console.log('  (skip hint drafts — file not prepared yet)');
    } else {
      const issues = validateHintDrafts({ english: loadEnglishHints(), arabic: hints.drafts, glossary });
      assert.equal(hints.human_reviewed, false);
      assert.equal(hints.review_later, 57);
      assert.equal(hints.needs_explanation, 490);
      assert.equal(
        countBySeverity(issues).errors,
        0,
        JSON.stringify(issues.filter((item) => item.severity === 'error').slice(0, 8))
      );
    }

    const keywords = loadArabicKeywordDrafts();
    if (!keywords) {
      console.log('  (skip keyword drafts — file not prepared yet)');
    } else {
      const issues = validateKeywordTranslations({
        english: loadEnglishKeywords(),
        arabic: keywords.keywords,
        glossary,
      });
      assert.equal(keywords.human_reviewed, false);
      assert.equal(keywords.keyword_count, 290);
      assert.equal(
        countBySeverity(issues).errors,
        0,
        JSON.stringify(issues.filter((item) => item.severity === 'error').slice(0, 8))
      );
    }
  });

  await run('development preview keeps stored English and ignores V1 ids', () => {
    const base = {
      id: 'AB2001',
      promptEn: 'What should you do before making a U-turn?',
      promptAr: '',
      options: [
        { en: 'Signal', ar: '', correct: false },
        { en: 'Look', ar: '', correct: true },
      ],
    };
    const filled = overlayQuestionArabic(
      base,
      { question: 'ماذا يجب أن تفعل؟', answers: ['أشر', 'انظر'] },
      ['Signal', 'Look', '', '']
    );
    assert.equal(filled.promptEn, base.promptEn);
    assert.equal(filled.promptAr, 'ماذا يجب أن تفعل؟');
    assert.equal(filled.options[1].en, 'Look');
    assert.equal(filled.options[1].correct, true);
    assert.equal(filled.options[1].ar, 'انظر');
    assert.equal(filled.arabicReview, 'draft');
    assert.equal(filled.id, 'AB2001');

    const stored = overlayQuestionArabic(
      { ...base, promptAr: 'مخزن' },
      { question: 'مسودة', answers: ['أ', 'ب'] },
      ['Signal', 'Look']
    );
    assert.equal(stored.promptAr, 'مخزن');
    assert.equal(stored.options[0].ar, '');
    assert.equal(stored.arabicReview, undefined);

    const v1 = overlayQuestionArabic(
      { ...base, id: 'AL-01' },
      null,
      ['Signal', 'Look']
    );
    assert.equal(v1.promptAr, '');
    assert.equal(v1.arabicReview, undefined);

    const keyword = overlayKeywordArabic(
      { term_en: 'Hard shoulder', translation_ar: '', explanation_ar: '' },
      { translation_ar: 'الكتف الصلب', explanation_ar: 'مسار.' }
    );
    assert.equal(keyword.arabic_review, 'draft');
    const kept = overlayKeywordArabic(
      { term_en: 'Hard shoulder', translation_ar: 'معتمد', explanation_ar: '' },
      { translation_ar: 'مسودة', explanation_ar: 'مسودة' }
    );
    assert.equal(kept.translation_ar, 'معتمد');

    const hint = chooseExplanationArabic({
      publishedArabic: 'منشور',
      publishedLanguage: 'ar',
      fallback: false,
      questionId: 'AB2001',
    });
    assert.equal(hint.arabic_review, 'approved');
    assert.equal(hint.explanation_ar, 'منشور');

    const previewSource = readFileSync(path.join(root, 'lib/i18n/arabic/preview.ts'), 'utf8');
    assert.ok(!previewSource.includes('V1_BACKUP'));
    assert.ok(!previewSource.includes('.insert('));
    assert.ok(!previewSource.includes('.update('));
    assert.ok(!previewSource.includes('.upsert('));
    assert.ok(!previewSource.includes('supabase'));

    const previousNodeEnv = process.env.NODE_ENV;
    const previousRender = process.env.RENDER;
    process.env.NODE_ENV = 'production';
    delete process.env.RENDER;
    assert.equal(isArabicDraftPreviewEnabled(), false);
    process.env.NODE_ENV = 'development';
    process.env.RENDER = 'true';
    assert.equal(isArabicDraftPreviewEnabled(), false);
    process.env.NODE_ENV = previousNodeEnv;
    if (previousRender === undefined) delete process.env.RENDER;
    else process.env.RENDER = previousRender;

    const plan = planArabicActivation();
    assert.equal(plan.writes_database, false);
    assert.equal(plan.executed, false);
    assert.equal(plan.human_reviewed, false);
    assert.equal(plan.questions.marked_reviewed, 0);
    assert.equal(plan.hints.marked_reviewed, 0);
    assert.equal(plan.keywords.marked_reviewed, 0);
    if (existsSync(ARABIC_QUESTION_DRAFT_PATH)) {
      assert.equal(plan.questions.prepared, 758);
      assert.equal(plan.hints.prepared, 547);
      assert.equal(plan.hints.review_later, 57);
      assert.equal(plan.keywords.prepared, 290);
    }
  });

  if (failed) {
    console.error(`${failed} failed`);
    process.exit(1);
  }
  console.log('arabic drafts ok');
}

void main();
