'use client';

import { useState } from 'react';

interface DisclaimerModalProps {
  showArabic: boolean;
}

export default function DisclaimerModal({ showArabic }: DisclaimerModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Compact Info Pattern - Mobile Only */}
      <div className="sm:hidden flex items-center justify-center gap-1.5 mt-2 mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 text-[10px] text-[var(--muted-text)]/70 hover:text-[var(--muted-text)] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>Disclaimer • Not official DVSA questions</span>
        </button>
      </div>

      {/* Modal/Bottom Sheet */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 z-50 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          {/* Bottom Sheet */}
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 sm:hidden max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Disclaimer</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-4 py-4 space-y-3">
              <p className="text-sm text-[var(--muted-text)] leading-relaxed">
                Disclaimer: This app provides practice questions designed to help learners prepare for the UK driving theory test. The questions are not official DVSA exam questions but are based on the same learning objectives and topics.
              </p>
              {showArabic && (
                <p className="text-sm text-[var(--muted-text)] leading-relaxed" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                  تنويه: هذا التطبيق يقدّم أسئلة تدريبية للمساعدة في الاستعداد لاختبار القيادة النظري في المملكة المتحدة. الأسئلة ليست أسئلة الامتحان الرسمية، لكنها مبنية على نفس الأهداف التعليمية.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

