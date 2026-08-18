import LandingClient from './LandingClient';
import Subtitle from '@/components/Subtitle';
import AppVersionBadge from '@/components/AppVersionBadge';

export default function Home() {
  return (
    <>
      <AppVersionBadge />
      <div className="lt-page py-10 sm:py-14 flex flex-col items-center">
        <section className="w-full max-w-xl text-center">
          <p className="lt-kicker mb-4">LingoTheory</p>

          <h1 className="text-[1.75rem] sm:text-[2.35rem] font-bold mb-4 text-[var(--text-primary)] leading-[1.15] text-balance">
            Driving Theory Helper
          </h1>

          <Subtitle />

          <p className="text-[var(--text-primary)] mb-3 text-lg sm:text-xl font-semibold leading-snug text-balance">
            Pass your UK driving theory test faster — in your own language.
          </p>

          <p className="text-[var(--text-secondary)] mb-9 text-[0.95rem] sm:text-base leading-relaxed max-w-md mx-auto">
            Bilingual practice questions, clear explanations, and realistic mock tests — built to help you understand, not just memorise.
          </p>

          <div className="mb-8">
            <LandingClient />
          </div>

          <p className="text-sm text-[var(--text-secondary)]">
            English by default ·{' '}
            <span className="font-semibold text-[var(--text-primary)]">Arabic</span>
            {', '}
            <span className="font-semibold text-[var(--text-primary)]">Urdu</span>
            {', '}
            <span className="font-semibold text-[var(--text-primary)]">Romanian</span>
            {', '}
            <span className="font-semibold text-[var(--text-primary)]">Polish</span>
            {' '}&{' '}
            <span className="font-semibold text-[var(--text-primary)]">Portuguese</span>
            {' '}translations
          </p>

          <div className="mt-10 pt-6 border-t border-[var(--border)] space-y-3 text-left sm:text-center">
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              For best results, use this app alongside official DVSA learning materials.
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              Disclaimer: Practice questions are designed to help learners prepare for the UK driving theory test. They are not official DVSA exam questions and are based on the same learning objectives and topics.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
