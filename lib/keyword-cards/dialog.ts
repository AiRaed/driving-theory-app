/**
 * Practice Keyword dialog copy.
 * English blocks stay LTR. Arabic blocks stay RTL and use the app Arabic font
 * via the global [dir="rtl"] rule. This module does not publish cards.
 */

export interface KeywordDialogCopy {
  dir: 'ltr' | 'rtl';
  lang: string;
  title: string;
  cardKicker: string;
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
      cardKicker: 'بطاقة كلمة',
      triggerLabel: 'كلمات',
      closeLabel: 'إغلاق',
      gotItLabel: 'فهمت',
      saveLabel: 'حفظ البطاقة',
      unsaveLabel: 'محفوظة',
      previousLabel: 'السابق',
      nextLabel: 'التالي',
      chooseLabel: 'اختر الكلمة',
      learnMoreLabel: 'اعرف المزيد',
      imageAltFallback: 'صورة الكلمة',
      englishHeading: 'English',
      arabicHeading: 'العربية',
      disclaimer:
        'أُعدّت بطاقة الكلمة هذه من قِبل LingoTheory كدعم تعليمي إضافي، وهي ليست جزءاً من مادة المراجعة الخاصة بـ DVSA.',
      loginToSave: 'سجّل الدخول لحفظ البطاقات.',
    };
  }
  return {
    dir: 'ltr',
    lang: 'en',
    title: 'Keywords',
    cardKicker: 'Keyword card',
    triggerLabel: 'Keywords',
    closeLabel: 'Close',
    gotItLabel: 'Got it',
    saveLabel: 'Save card',
    unsaveLabel: 'Saved',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    chooseLabel: 'Choose keyword',
    learnMoreLabel: 'Learn more',
    imageAltFallback: 'Keyword image',
    englishHeading: 'English',
    arabicHeading: 'Arabic',
    disclaimer:
      'This keyword card has been created by LingoTheory as additional learning support and is not part of the DVSA revision material.',
    loginToSave: 'Log in to save cards.',
  };
}
