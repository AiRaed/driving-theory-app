import LandingClient from './LandingClient';
import Subtitle from '@/components/Subtitle';
import AppVersionBadge from '@/components/AppVersionBadge';

export default function Home() {
  return (
    <>
      {/* App version badge - only visible in native Android app */}
      <AppVersionBadge />
      <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col items-center">
        <section className="w-full max-w-2xl text-center mt-8 mb-8">
          <h1 className="text-[28px] sm:text-4xl font-semibold mb-4 text-[var(--ink)]">
            Driving Theory Helper
          </h1>
          <Subtitle />
          <p className="text-[var(--muted-text)] mb-2 text-lg font-medium">
            Pass your UK driving theory test faster — in your own language.
          </p>
          <p className="text-[var(--muted-text)] mb-6 text-base">
            Prepare for the UK driving theory test with bilingual practice questions, simplified explanations, and realistic mock tests — designed to help you understand, not just memorise.
          </p>
          <LandingClient />
          <p className="text-sm text-[var(--muted-text)] mt-4">
            English by default — <span className="text-[#FFC107]">Arabic</span> & <span className="text-[#FFC107]">Urdu</span> translations available.
          </p>
          {/* Informational note */}
          <p className="text-xs text-[var(--muted-text)]/70 mt-6 max-w-2xl mx-auto">
            For best results, we recommend using this app and website alongside the official DVSA learning materials.
          </p>
          {/* Disclaimer */}
          <div className="mt-4 max-w-2xl mx-auto">
            <p className="text-xs text-[var(--muted-text)]/80 leading-relaxed">
              Disclaimer: This app provides practice questions designed to help learners prepare for the UK driving theory test. The questions are not official DVSA exam questions and are based on the same learning objectives and topics.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
