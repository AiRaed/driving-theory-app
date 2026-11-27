'use client';

import ArabicDraftNote from '@/components/ArabicDraftNote';
import SaveCardButton from '@/components/SaveCardButton';
import {
  hintDialogCopy,
  hintMediaVisibility,
  isArabicHintLanguage,
  type PracticeHintCard,
} from '@/lib/learning-cards/hintDialog';

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?|#|$)/i.test(url);
}

export default function ExplanationCardPanel({
  card,
  descriptionId,
  requestSave,
  onSavedChange,
  uiLanguage,
}: {
  card: PracticeHintCard | null;
  descriptionId?: string;
  requestSave?: () => Promise<Response>;
  onSavedChange?: (saved: boolean) => void;
  uiLanguage?: string;
}) {
  if (
    !card ||
    (!String(card.explanation || '').trim() && !String(card.explanation_ar || '').trim())
  ) {
    return null;
  }
  const language = uiLanguage || 'en';
  const copy = hintDialogCopy(language);
  const media = hintMediaVisibility(card);
  const storedArabic = String(card.language || '').trim().toLowerCase() === 'ar';
  const english = storedArabic ? '' : String(card.explanation || '').trim();
  const arabic = String(card.explanation_ar || (storedArabic ? card.explanation : '') || '').trim();
  const showArabic = isArabicHintLanguage(language) && arabic.length > 0;
  const imageUrl = media.image && card.image_url ? card.image_url : '';
  const videoUrl = media.video && card.video_url ? card.video_url : '';
  const describedByEnglish = Boolean(english);

  return (
    <div>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={card.image_alt || copy.imageAltFallback}
          className="lt-hint-dialog-image"
        />
      ) : null}
      {videoUrl ? (
        isDirectVideo(videoUrl) ? (
          <video
            className="lt-hint-dialog-image"
            src={videoUrl}
            controls
            playsInline
            title={copy.videoTitle}
          />
        ) : (
          <iframe
            title={copy.videoTitle}
            src={videoUrl}
            className="lt-hint-dialog-video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )
      ) : null}
      {english ? (
        <p
          id={describedByEnglish ? descriptionId : undefined}
          dir="ltr" lang="en"
          className="lt-hint-dialog-copy"
        >
          {card.explanation}
        </p>
      ) : null}
      {showArabic ? (
        <div className={english ? 'mt-3' : undefined}>
          <ArabicDraftNote show={card.arabic_review === 'draft'} />
          <p
            id={describedByEnglish ? undefined : descriptionId}
            dir="rtl"
            lang="ar"
            className="lt-hint-dialog-copy text-start"
          >
            {arabic}
          </p>
        </div>
      ) : null}
      <SaveCardButton
        cardKind="explanation"
        explanationCardId={card.id}
        requestSave={requestSave}
        onSavedChange={onSavedChange}
        tone="explanation"
        saveLabel={copy.saveLabel}
        savedLabel={copy.savedLabel}
        loginLabel={copy.loginToSave}
      />
      <p
        id={!describedByEnglish && !showArabic ? descriptionId : undefined}
        dir={copy.dir}
        lang={copy.lang}
        className="lt-hint-dialog-note"
      >
        {copy.disclaimer}
      </p>
    </div>
  );
}
