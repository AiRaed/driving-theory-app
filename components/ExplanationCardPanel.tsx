'use client';

import SaveCardButton from '@/components/SaveCardButton';
import {
  hintDialogCopy,
  hintMediaVisibility,
  type PracticeHintCard,
} from '@/lib/learning-cards/hintDialog';

export default function ExplanationCardPanel({
  card,
  descriptionId,
}: {
  card: PracticeHintCard | null;
  descriptionId?: string;
}) {
  if (!card || !String(card.explanation || '').trim()) return null;
  const copy = hintDialogCopy(card.language);
  const media = hintMediaVisibility(card);
  return (
    <div className="space-y-3">
      <p
        dir={copy.dir}
        lang={copy.lang}
        className="text-base leading-7 text-[var(--text-primary)] whitespace-pre-wrap"
      >
        {card.explanation}
      </p>
      {media.image && card.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={card.image_url}
          alt={card.image_alt || copy.imageAltFallback}
          className="w-full max-h-64 object-contain rounded-[var(--radius-sm)] border border-[var(--border)]"
        />
      ) : null}
      {media.video && card.video_url ? (
        <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-sm)] border border-[var(--border)]">
          <iframe
            title={copy.videoTitle}
            src={card.video_url}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
      <p id={descriptionId} dir="ltr" lang="en" className="text-[11px] text-[var(--text-secondary)]">
        This is a LingoTheory learning hint, not a DVSA-approved explanation. Official wording
        stays on the question.
      </p>
      <SaveCardButton cardKind="explanation" explanationCardId={card.id} />
    </div>
  );
}
