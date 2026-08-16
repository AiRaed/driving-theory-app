import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LingoTheory Support",
  description:
    "Need help with LingoTheory? Get support for account access, practice and mock tests, Full Access payments, and technical problems.",
};

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="lt-card-accent p-6 sm:p-8 mt-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-4 mt-1">
            LingoTheory Support
          </h1>
          <p className="text-base text-[var(--text-primary)] leading-relaxed mb-8">
            Need help with LingoTheory? We&apos;re here to help.
          </p>

          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">
                How can we help?
              </h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                    Account &amp; Login
                  </h3>
                  <p className="text-base text-[var(--text-primary)] leading-relaxed">
                    Help with registration, email verification, signing in, or accessing your account.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                    Practice &amp; Mock Tests
                  </h3>
                  <p className="text-base text-[var(--text-primary)] leading-relaxed">
                    Help with practice questions, topics, mock tests, and using LingoTheory.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                    Full Access &amp; Payments
                  </h3>
                  <p className="text-base text-[var(--text-primary)] leading-relaxed">
                    Help with purchasing or restoring LingoTheory Full Access on supported platforms.
                  </p>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
                    Technical Problems
                  </h3>
                  <p className="text-base text-[var(--text-primary)] leading-relaxed">
                    If something isn&apos;t working correctly, contact us at{" "}
                    <a
                      href="mailto:support@lingotheory.org"
                      className="font-medium text-[var(--lingo-red)] hover:underline"
                    >
                      support@lingotheory.org
                    </a>{" "}
                    and include a short description of the problem and the device you&apos;re using.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
