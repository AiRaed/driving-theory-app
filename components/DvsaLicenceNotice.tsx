import {
  ABOUT_LEARNING_MATERIALS_TITLE,
  ABOUT_LEARNING_MATERIALS_TITLE_AR,
  DVSA_CROWN_COPYRIGHT_STATEMENT,
  DVSA_REVISION_BANK_STATEMENT,
  LINGO_INDEPENDENT_STATEMENT,
  LINGO_INDEPENDENT_STATEMENT_AR,
  REVISION_NOT_LIVE_TEST,
  REVISION_NOT_LIVE_TEST_AR,
} from '@/lib/legal/dvsaLicence';

type DvsaLicenceNoticeProps = {
  lang?: string;
  /** Dashboard section, with the required heading. */
  heading?: boolean;
  /** Short distinction line used beside the mandatory English statements. */
  showDistinction?: boolean;
  className?: string;
};

export default function DvsaLicenceNotice({
  lang,
  heading = false,
  showDistinction = false,
  className = '',
}: DvsaLicenceNoticeProps) {
  const arabic = lang === 'ar';

  const body = (
    <div className="space-y-2">
      {showDistinction ? (
        <p
          dir={arabic ? 'rtl' : 'ltr'}
          lang={arabic ? 'ar' : 'en'}
          className="text-sm leading-relaxed text-[#4E5D73]"
        >
          {arabic ? REVISION_NOT_LIVE_TEST_AR : REVISION_NOT_LIVE_TEST}
        </p>
      ) : null}
      <p lang="en" dir="ltr" className="text-sm leading-relaxed text-[#4E5D73]">
        {DVSA_REVISION_BANK_STATEMENT}
      </p>
      <p lang="en" dir="ltr" className="text-sm leading-relaxed text-[#4E5D73]">
        {DVSA_CROWN_COPYRIGHT_STATEMENT}
      </p>
      <p lang="en" dir="ltr" className="text-sm leading-relaxed text-[#4E5D73]">
        {LINGO_INDEPENDENT_STATEMENT}
      </p>
      {arabic ? (
        <p dir="rtl" lang="ar" className="text-sm leading-relaxed text-[#4E5D73]">
          {LINGO_INDEPENDENT_STATEMENT_AR}
        </p>
      ) : null}
    </div>
  );

  if (!heading) {
    return <div className={className}>{body}</div>;
  }

  return (
    <section
      className={`rounded-2xl border border-[#E6EDF5] bg-white px-4 py-4 sm:px-5 ${className}`}
      aria-labelledby="about-learning-materials"
    >
      <h2 id="about-learning-materials" className="text-sm font-bold text-[#102D4E]" lang="en" dir="ltr">
        {ABOUT_LEARNING_MATERIALS_TITLE}
      </h2>
      {arabic ? (
        <p className="mt-0.5 text-sm font-semibold text-[#102D4E]" dir="rtl" lang="ar">
          {ABOUT_LEARNING_MATERIALS_TITLE_AR}
        </p>
      ) : null}
      <div className="mt-2">{body}</div>
    </section>
  );
}
