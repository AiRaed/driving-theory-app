export type ProgressCopyLang = 'en' | 'ar';

export interface ProgressCopy {
  title: string;
  completion: string;
  completedOf: string;
  correct: string;
  incorrect: string;
  remaining: string;
  unavailable: string;
  saveFailed: string;
  loading: string;
  restartTitle: string;
  practiseAgain: string;
  totalQuestions: string;
  retryIncorrect: string;
  retryIncorrectHelp: string;
  retryNone: string;
  restartAll: string;
  restartAllHelp: string;
  cancel: string;
  retrySessionLabel: string;
  reviewed: string;
  corrected: string;
  remainingIncorrect: string;
  retryRemaining: string;
  backToTopics: string;
  allCorrected: string;
}

const EN: ProgressCopy = {
  title: 'Your Learning Progress',
  completion: 'Completion',
  completedOf: '{answered} of {total}',
  correct: 'Correct',
  incorrect: 'Incorrect',
  remaining: 'Remaining',
  unavailable: 'Progress could not be loaded.',
  saveFailed: 'Progress could not be saved. You can submit this answer again.',
  loading: 'Loading progress',
  restartTitle: 'Restart Practice',
  practiseAgain: 'Practise {topic} Again',
  totalQuestions: 'Total questions',
  retryIncorrect: 'Retry Incorrect Questions ({n})',
  retryIncorrectHelp: 'Focus on the questions you got wrong.',
  retryNone: 'No incorrect questions to retry.',
  restartAll: 'Restart All Questions ({n})',
  restartAllHelp: 'Practise the entire topic again.',
  cancel: 'Cancel',
  retrySessionLabel: 'Retry Incorrect Questions',
  reviewed: 'Questions reviewed',
  corrected: 'Questions corrected during this session',
  remainingIncorrect: 'Incorrect questions remaining in this topic',
  retryRemaining: 'Retry Remaining Incorrect Questions ({n})',
  backToTopics: 'Back to Practice Topics',
  allCorrected: 'Great work! You have corrected all your incorrect answers in this topic.',
};

const AR: ProgressCopy = {
  title: 'تقدّمك في التعلّم',
  completion: 'نسبة الإكمال',
  completedOf: '{answered} من {total}',
  correct: 'صحيحة',
  incorrect: 'غير صحيحة',
  remaining: 'متبقية',
  unavailable: 'تعذّر تحميل التقدّم.',
  saveFailed: 'تعذّر حفظ التقدّم. يمكنك إرسال هذه الإجابة مرة أخرى.',
  loading: 'جارٍ تحميل التقدّم',
  restartTitle: 'إعادة التدريب',
  practiseAgain: 'تدرّب على {topic} مرة أخرى',
  totalQuestions: 'إجمالي الأسئلة',
  retryIncorrect: 'إعادة الأسئلة غير الصحيحة ({n})',
  retryIncorrectHelp: 'ركّز على الأسئلة التي أخطأت فيها.',
  retryNone: 'لا توجد أسئلة غير صحيحة لإعادتها.',
  restartAll: 'إعادة كل الأسئلة ({n})',
  restartAllHelp: 'تدرّب على الموضوع كاملاً مرة أخرى.',
  cancel: 'إلغاء',
  retrySessionLabel: 'إعادة الأسئلة غير الصحيحة',
  reviewed: 'الأسئلة التي راجعتها',
  corrected: 'الأسئلة التي صحّحتها في هذه الجلسة',
  remainingIncorrect: 'الأسئلة غير الصحيحة المتبقية في هذا الموضوع',
  retryRemaining: 'إعادة الأسئلة غير الصحيحة المتبقية ({n})',
  backToTopics: 'العودة إلى مواضيع التدريب',
  allCorrected: 'أحسنت! لقد صحّحت كل إجاباتك غير الصحيحة في هذا الموضوع.',
};

export function progressCopy(lang: string): ProgressCopy {
  return lang === 'ar' ? AR : EN;
}

export function progressDir(lang: string): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

export function fillProgress(template: string, values: Record<string, number | string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}
