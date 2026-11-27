import LandingClient, { AndroidInstallHeroCta } from './LandingClient';
import DvsaLicenceNotice from '@/components/DvsaLicenceNotice';
import AppVersionBadge from '@/components/AppVersionBadge';
import StoreDownloadCta from '@/components/StoreDownloadCta';
import Link from 'next/link';

const features = [
  {
    href: '/practice',
    title: 'Practice',
    body: '758 revision questions · 14 topics',
    icon: 'M4 16l4-6 4 4 4-7 4 9',
    surface: 'bg-[#FDECEE] text-[var(--lingo-red)]',
  },
  {
    href: '/mock-test',
    title: 'Mock Test',
    body: '50 timed questions',
    icon: 'M8 4h8v16H8zM10 8h4M10 12h4',
    surface: 'bg-[#E7F4FA] text-[var(--blue)]',
  },
  {
    href: '/saved-cards',
    title: 'Saved Cards',
    body: 'Your learning cards',
    icon: 'M7 4h10v16l-5-3-5 3z',
    surface: 'bg-[#E7F7F3] text-[var(--teal)]',
  },
  {
    href: '/practice',
    title: 'Hints & Keywords',
    body: 'Clear, simple explanations',
    icon: 'M12 4a5 5 0 0 1 2 9.5V16H10v-2.5A5 5 0 0 1 12 4zM10 18h4',
    surface: 'bg-[#E7F4FA] text-[var(--blue)]',
  },
  {
    href: '/choose-language',
    title: 'Multilingual Learning',
    body: 'Learn in your language',
    icon: 'M5 7h8M7 7c1 4 2 7 4 10M12 7c-1 4-2 7-4 10M4 19h16',
    surface: 'bg-[#F3EEF8] text-[#6B5B95]',
    wide: true,
  },
] as const;

function FeatureIcon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <AppVersionBadge />
      <div className="mx-auto max-w-[1200px] px-4 py-4 sm:px-6 sm:py-8">
        <section className="relative rounded-[22px] bg-[var(--navy)] text-white lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[22px]">
            <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-white/5" />
            <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-[var(--lingo-red)]/15" />
          </div>
          <div className="relative max-w-xl px-5 py-6 sm:px-10 sm:py-10">
            <h1 className="text-[1.7rem] font-bold leading-[1.15] sm:text-[2.6rem]">
              UK Driving Theory Test — Learn in{' '}
              <span className="mt-1 inline-block rounded-lg bg-[var(--lingo-red)] px-2.5 py-0.5 align-middle text-white">Your Language</span>
            </h1>
            <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-white/85 sm:text-[17px]">
              Practise in English with clear explanations, translated questions and helpful keywords.
            </p>
            <div className="mt-6 max-w-md">
              <LandingClient />
            </div>
          </div>
          <div className="relative mt-8 hidden justify-end lg:flex" aria-hidden>
            <div className="relative h-64 w-72">
              <div className="absolute right-0 top-6 h-52 w-40 rotate-6 rounded-[20px] border border-white/30 bg-white/10" />
              <div className="absolute left-4 top-0 h-56 w-44 -rotate-6 rounded-[20px] bg-white p-4 text-[var(--navy)] shadow-[var(--shadow-md)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--teal-soft)] text-[var(--teal)]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.5 10 17l9-10" /></svg>
                </div>
                <div className="mt-6 h-2.5 w-24 rounded-full bg-[var(--surface-secondary)]" />
                <div className="mt-3 h-2.5 w-16 rounded-full bg-[var(--surface-secondary)]" />
                <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--lingo-red)] text-3xl font-bold text-white">L</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              href={feature.href}
              className={`flex min-h-[132px] flex-col justify-between rounded-[20px] border border-[var(--border)] p-4 shadow-[var(--shadow-sm)] ${feature.surface} ${'wide' in feature && feature.wide ? 'col-span-2 lg:col-span-1' : ''}`}
            >
              <span className="flex items-start justify-between">
                <FeatureIcon d={feature.icon} />
                <span aria-hidden className="text-lg font-semibold opacity-70">›</span>
              </span>
              <span>
                <span className="block text-base font-bold text-[var(--navy)]">{feature.title}</span>
                <span className="mt-1 block text-[13px] leading-snug text-[var(--text-secondary)]">{feature.body}</span>
              </span>
            </Link>
          ))}
        </section>

        <div className="mt-6">
          <StoreDownloadCta />
          <AndroidInstallHeroCta />
        </div>

        <section className="mx-auto mt-8 max-w-3xl border-t border-[var(--border)] pt-5">
          <DvsaLicenceNotice showDistinction />
        </section>
      </div>
    </>
  );
}
