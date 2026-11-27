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
