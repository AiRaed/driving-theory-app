/**
 * Practice Hint dialog copy, focus order, and scroll lock.
 * Presentation only. Does not publish cards or change stored hint text.
 */

export interface PracticeHintCard {
  id: string;
  explanation: string;
  format?: string;
  language?: string;
  image_url?: string | null;
  image_alt?: string | null;
  video_url?: string | null;
  explanation_ar?: string | null;
  arabic_review?: 'approved' | 'draft' | null;
}

export interface HintDialogCopy {
  dir: 'ltr' | 'rtl';
  lang: string;
  languageLabel: string;
  title: string;
  closeLabel: string;
  gotItLabel: string;
  triggerLabel: string;
  videoTitle: string;
  imageAltFallback: string;
}

export interface PageScrollStyle {
  overflow: string;
  position: string;
  top: string;
  left: string;
  right: string;
  width: string;
}

export interface PageScrollLockTarget {
  documentElement: { style: { overflow: string } };
  body: { style: PageScrollStyle };
}

const FORMAT_LABELS: Record<string, { en: string; ar: string }> = {
  text: { en: 'Text', ar: 'نص' },
  diagram: { en: 'Diagram', ar: 'رسم' },
  image: { en: 'Image', ar: 'صورة' },
  video: { en: 'Video', ar: 'فيديو' },
};

export const HINT_DIALOG_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

export function isArabicHintLanguage(language: string | null | undefined): boolean {
  return String(language || '').trim().toLowerCase() === 'ar';
}

export function hintDialogCopy(language: string | null | undefined): HintDialogCopy {
  if (isArabicHintLanguage(language)) {
    return {
      dir: 'rtl',
      lang: 'ar',
      languageLabel: 'العربية',
      title: 'تلميح',
      closeLabel: 'إغلاق',
      gotItLabel: 'فهمت',
      triggerLabel: 'تلميح',
      videoTitle: 'فيديو التلميح',
      imageAltFallback: 'صورة التلميح',
    };
  }
  const lang = String(language || '').trim().toLowerCase();
  return {
    dir: 'ltr',
    lang: lang && lang !== 'en' ? lang : 'en',
    languageLabel: !lang || lang === 'en' ? 'English' : lang.toUpperCase(),
    title: 'Hint',
    closeLabel: 'Close',
    gotItLabel: 'Got it',
    triggerLabel: 'Hint',
    videoTitle: 'Explanation hint video',
    imageAltFallback: 'Explanation hint',
  };
}

/** Visible name for the stored media-type value. Does not change which media renders. */
export function hintFormatLabel(
  format: string | null | undefined,
  language: string | null | undefined
): string {
  const key = String(format || 'text').trim().toLowerCase() || 'text';
  const labels = FORMAT_LABELS[key];
  if (!labels) return key;
  return isArabicHintLanguage(language) ? labels.ar : labels.en;
}

/**
 * Attached media still renders when a URL is present.
 * The format field is a label and an admin override; it does not hide a saved URL.
 */
export function hintMediaVisibility(card: {
  image_url?: string | null;
  video_url?: string | null;
}): { image: boolean; video: boolean } {
  return {
    image: Boolean(card.image_url),
    video: Boolean(card.video_url),
  };
}

/** Next index in a trapped tab cycle. -1 means focus is on the dialog container. */
export function nextDialogFocusIndex(count: number, activeIndex: number, shiftKey: boolean): number {
  if (count <= 0) return -1;
  if (shiftKey) return activeIndex <= 0 ? count - 1 : activeIndex - 1;
  if (activeIndex < 0 || activeIndex >= count - 1) return 0;
  return activeIndex + 1;
}

export function lockPageScroll(
  target: PageScrollLockTarget,
  scrollY: number,
  scrollTo: (y: number) => void
): () => void {
  const htmlOverflow = target.documentElement.style.overflow;
  const prev: PageScrollStyle = {
    overflow: target.body.style.overflow,
    position: target.body.style.position,
    top: target.body.style.top,
    left: target.body.style.left,
    right: target.body.style.right,
    width: target.body.style.width,
  };
  target.documentElement.style.overflow = 'hidden';
  target.body.style.overflow = 'hidden';
  target.body.style.position = 'fixed';
  target.body.style.top = `-${scrollY}px`;
  target.body.style.left = '0';
  target.body.style.right = '0';
  target.body.style.width = '100%';
  return () => {
    target.documentElement.style.overflow = htmlOverflow;
    target.body.style.overflow = prev.overflow;
    target.body.style.position = prev.position;
    target.body.style.top = prev.top;
    target.body.style.left = prev.left;
    target.body.style.right = prev.right;
    target.body.style.width = prev.width;
    scrollTo(scrollY);
  };
}
