export type MockCopyKey =
  | 'timeRemaining'
  | 'finishTest'
  | 'unansweredTitle'
  | 'unansweredBody'
  | 'submitAnyway'
  | 'keepGoing'
  | 'pass'
  | 'fail'
  | 'correctCount'
  | 'incorrectCount'
  | 'incorrectLabel'
  | 'unansweredCount'
  | 'accuracy'
  | 'timeTaken'
  | 'passMotivation'
  | 'failMotivation'
  | 'perfectMotivation'
  | 'hazardNote'
  | 'reviewIncorrect'
  | 'newMock'
  | 'backToDashboard'
  | 'backToResults'
  | 'incorrectPosition'
  | 'unansweredPosition'
  | 'yourAnswer'
  | 'unanswered'
  | 'correctAnswer'
  | 'dvsaExplanation'
  | 'explanationMissing'
  | 'keywordSection'
  | 'congratsTitle'
  | 'congratsBody'
  | 'previous'
  | 'next'
  | 'submitting'
  | 'submitFailed'
  | 'startFailed'
  | 'retry';

const EN: Record<MockCopyKey, string> = {
  timeRemaining: 'Time remaining',
  finishTest: 'Finish Test',
  unansweredTitle: 'Unanswered questions',
  unansweredBody: 'You have {n} unanswered questions. Submit the test anyway?',
  submitAnyway: 'Submit test',
  keepGoing: 'Continue test',
  pass: 'PASS',
  fail: 'FAIL',
  correctCount: 'Correct answers',
  incorrectCount: 'Incorrect answers',
  incorrectLabel: 'Incorrect',
  unansweredCount: 'Unanswered',
  accuracy: 'Accuracy',
  timeTaken: 'Time taken',
  passMotivation: 'Well done. You reached the pass mark of 43 out of 50 for this multiple-choice mock.',
  failMotivation:
    'The pass mark for this multiple-choice mock is 43 out of 50. Review the questions you missed and try again.',
  perfectMotivation: 'A perfect score. You answered every question in this mock correctly.',
  hazardNote:
    'This mock covers multiple-choice questions only. The official theory test also includes a hazard perception part.',
  reviewIncorrect: 'Review Incorrect Questions ({n})',
  newMock: 'Start a New Mock Test',
  backToDashboard: 'Back to Dashboard',
  backToResults: 'Back to results',
  incorrectPosition: 'Incorrect question {current} of {total}',
  unansweredPosition: 'Unanswered question {current} of {total}',
  yourAnswer: 'Your answer',
  unanswered: 'Unanswered',
  correctAnswer: 'Correct answer',
  dvsaExplanation: 'DVSA Explanation',
  explanationMissing: 'The official explanation for this question is not available.',
  keywordSection: 'Related Keyword Cards',
  congratsTitle: 'Congratulations',
  congratsBody: 'You have no incorrect or unanswered questions.',
  previous: 'Previous',
  next: 'Next',
  submitting: 'Submitting…',
  submitFailed: 'The test could not be submitted. Please try again.',
  startFailed: 'The mock test could not be started. Please try again.',
  retry: 'Try again',
};

const AR: Record<MockCopyKey, string> = {
  timeRemaining: 'الوقت المتبقي',
  finishTest: 'إنهاء الاختبار',
  unansweredTitle: 'أسئلة بلا إجابة',
  unansweredBody: 'لديك {n} من الأسئلة بلا إجابة. هل تريد تسليم الاختبار؟',
  submitAnyway: 'تسليم الاختبار',
  keepGoing: 'متابعة الاختبار',
  pass: 'ناجح',
  fail: 'غير ناجح',
  correctCount: 'الإجابات الصحيحة',
  incorrectCount: 'الإجابات غير الصحيحة',
  incorrectLabel: 'غير صحيح',
  unansweredCount: 'بلا إجابة',
  accuracy: 'نسبة الدقة',
  timeTaken: 'الوقت المستغرق',
  passMotivation: 'أحسنت. وصلت إلى درجة النجاح في هذا الاختبار التجريبي متعدد الخيارات، وهي 43 من 50.',
  failMotivation:
    'درجة النجاح في هذا الاختبار التجريبي متعدد الخيارات هي 43 من 50. راجع الأسئلة التي فاتتك وحاول مرة أخرى.',
  perfectMotivation: 'نتيجة كاملة. أجبت عن كل أسئلة هذا الاختبار التجريبي إجابة صحيحة.',
  hazardNote:
    'يغطي هذا الاختبار أسئلة الاختيار من متعدد فقط. يتضمن الاختبار النظري الرسمي أيضاً قسماً لإدراك المخاطر.',
  reviewIncorrect: 'مراجعة الأسئلة غير الصحيحة ({n})',
  newMock: 'بدء اختبار تجريبي جديد',
  backToDashboard: 'العودة إلى لوحة المتابعة',
  backToResults: 'العودة إلى النتيجة',
  incorrectPosition: 'سؤال غير صحيح {current} من {total}',
  unansweredPosition: 'سؤال بلا إجابة {current} من {total}',
  yourAnswer: 'إجابتك',
  unanswered: 'بلا إجابة',
  correctAnswer: 'الإجابة الصحيحة',
  dvsaExplanation: 'شرح DVSA',
  explanationMissing: 'الشرح الرسمي لهذا السؤال غير متوفر.',
  keywordSection: 'بطاقات الكلمات ذات الصلة',
  congratsTitle: 'أحسنت',
  congratsBody: 'ليست لديك إجابات غير صحيحة أو أسئلة بلا إجابة.',
  previous: 'السابق',
  next: 'التالي',
  submitting: 'جارٍ التسليم…',
  submitFailed: 'تعذر تسليم الاختبار. حاول مرة أخرى.',
  startFailed: 'تعذر بدء الاختبار التجريبي. حاول مرة أخرى.',
  retry: 'حاول مرة أخرى',
};

export function mockCopy(
  lang: string,
  key: MockCopyKey,
  vars?: Record<string, string | number>
): string {
  let text = (lang === 'ar' ? AR[key] : EN[key]) || EN[key];
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function mockDir(lang: string): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}
