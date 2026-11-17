import { buildArabicReview } from '@/lib/i18n/arabic/reviewSummary';

export const dynamic = 'force-dynamic';

function Count({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="lt-card p-4">
      <p className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function ArabicTranslationReviewPage() {
  const review = buildArabicReview();
  const sections = [
    { title: 'Questions', data: review.questions },
    { title: 'Explanation hints', data: review.hints },
    { title: 'Keyword cards', data: review.keywords },
    { title: 'Glossary', data: review.glossary },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Arabic translation review</h1>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Drafts only. These translations are pending review and are not published. This page does
          not write to the database and does not change official English wording.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Count label="V2 questions" value={review.existing.v2_total} />
        <Count label="V2 Arabic already stored" value={review.existing.v2_arabic_complete} />
        <Count label="V1 Arabic stems preserved" value={review.existing.v1_arabic_stems} />
        <Count label="V1 rows safe to copy" value={review.existing.safe_to_reuse} />
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{review.existing.note}</p>
      <p className="text-sm">
        Exact V1 stem overlaps left untouched: {review.existing.exact_stem_overlaps}. Review status
        stays draft. Machine drafts are not marked human-reviewed.
      </p>
      {sections.map((section) => {
        const prepared = 'prepared' in section.data ? section.data.prepared : section.data.entries;
        return (
          <section key={section.title} className="lt-card p-4 space-y-3">
            <h2 className="text-lg font-bold">{section.title}</h2>
            <p className="text-sm">
              Prepared {prepared}. Errors {section.data.errors}. Warnings {section.data.warnings}.
              Published: no.
            </p>
            {section.data.issues.length === 0 ? (
              <p className="text-sm text-[var(--text-secondary)]">No issues in the first review sample.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                {section.data.issues.map((item, index) => (
                  <li key={`${item.target}-${item.code}-${index}`}>
                    <span className="font-semibold">{item.severity}</span> {item.target}: {item.message}
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
      <section className="lt-card p-4">
        <h2 className="text-lg font-bold">Next activation steps</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
          {review.next_steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
