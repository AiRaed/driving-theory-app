/**
 * Practice Keyword dialog copy.
 * English blocks stay LTR. Arabic blocks stay RTL and use the app Arabic font
 * via the global [dir="rtl"] rule. This module does not publish cards.
 */

export interface KeywordDialogCopy {
  dir: 'ltr' | 'rtl';
  lang: string;
  title: string;
  triggerLabel: string;
  closeLabel: string;
  gotItLabel: string;
  saveLabel: string;
  unsaveLabel: string;
  previousLabel: string;
  nextLabel: string;
  chooseLabel: string;
  learnMoreLabel: string;
  imageAltFallback: string;
  englishHeading: string;
  arabicHeading: string;
  disclaimer: string;
  loginToSave: string;
}

export function isArabicKeywordLanguage(language: string | null | undefined): boolean {
  return String(language || '').trim().toLowerCase() === 'ar';
}

export function keywordDialogCopy(language: string | null | undefined): KeywordDialogCopy {
  if (isArabicKeywordLanguage(language)) {
    return {
      dir: 'rtl',
      lang: 'ar',
      title: 'كلمات',
      triggerLabel: 'كلمات',
      closeLabel: 'إغلاق',
      gotItLabel: 'فهمت',
      saveLabel: 'حفظ البطاقة',
      unsaveLabel: 'إلغاء الحفظ',
      previousLabel: 'السابق',
      nextLabel: 'التالي',
      chooseLabel: 'اختر الكلمة',
      learnMoreLabel: 'اعرف المزيد',
      imageAltFallback: 'صورة الكلمة',
      englishHeading: 'English',
      arabicHeading: 'العربية',
      disclaimer:
        'هذه بطاقة كلمة من LingoTheory وليست تعريفًا معتمدًا من DVSA، ولا تعرض الإجابة الصحيحة.',
      loginToSave: 'سجّل الدخول لحفظ البطاقات.',
    };
  }
  return {
    dir: 'ltr',
    lang: 'en',
    title: 'Keywords',
    triggerLabel: 'Keywords',
    closeLabel: 'Close',
    gotItLabel: 'Got it',
    saveLabel: 'Save keyword card',
    unsaveLabel: 'Unsave keyword card',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    chooseLabel: 'Choose keyword',
    learnMoreLabel: 'Learn more',
    imageAltFallback: 'Keyword image',
    englishHeading: 'English',
    arabicHeading: 'Arabic',
    disclaimer:
      'This is a LingoTheory keyword card, not a DVSA definition, and it does not show the correct answer.',
    loginToSave: 'Log in to save cards.',
  };
}
