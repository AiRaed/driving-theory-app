export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-red-100/60 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 p-6 sm:p-8 mt-4 shadow-xl relative overflow-hidden backdrop-blur-sm">
          {/* Premium red top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
          {/* Teal secondary accent line */}
          <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-300/40 to-transparent"></div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 mt-2">
            Terms & Conditions
          </h1>

          <div className="space-y-6">
            {/* Section 1: Purpose of the App */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                1. Purpose of the App
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                This application is designed for educational and practice purposes only. It helps users prepare for driving theory tests by understanding concepts and road safety rules.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                هذا التطبيق مخصص لأغراض تعليمية وتدريبية فقط، ويهدف إلى مساعدة المستخدمين على فهم مفاهيم القيادة وقواعد السلامة على الطريق.
              </p>
            </section>

            {/* Section 2: Practice Questions Disclaimer */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                2. Practice Questions Disclaimer
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                The practice questions in this app are NOT official exam questions. They are created for learning purposes and may be similar in meaning to real driving theory questions, but they are not identical to any official test content.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                الأسئلة الموجودة في هذا التطبيق ليست أسئلة رسمية من اختبار القيادة. تم إنشاؤها لأغراض تعليمية وقد تكون مشابهة في المعنى لأسئلة الاختبار الحقيقي، لكنها ليست مطابقة لها.
              </p>
            </section>

            {/* Section 3: No Guarantee of Exam Results */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                3. No Guarantee of Exam Results
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                Using this app does not guarantee passing any official driving theory test. Success in the exam depends on the user&apos;s preparation and understanding.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                استخدام هذا التطبيق لا يضمن النجاح في اختبار القيادة النظري الرسمي. يعتمد النجاح على استعداد المستخدم وفهمه للمحتوى.
              </p>
            </section>

            {/* Section 4: User Responsibility */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                4. User Responsibility
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                Users are responsible for verifying information with official sources such as the DVSA or local driving authorities.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                المستخدم مسؤول عن التحقق من المعلومات من المصادر الرسمية مثل DVSA أو الجهات المختصة بالقيادة.
              </p>
            </section>

            {/* Section 5: Limitation of Liability */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                5. Limitation of Liability
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                The app and its creators are not responsible for any loss, penalty, or consequence resulting from the use of this application.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                لا يتحمل التطبيق أو القائمون عليه أي مسؤولية عن أي خسائر أو مخالفات أو نتائج ناتجة عن استخدامه.
              </p>
            </section>

            {/* Section 6: Changes to These Terms */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                6. Changes to These Terms
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                These terms may be updated at any time. Continued use of the app means acceptance of the updated terms.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                يمكن تحديث هذه الشروط في أي وقت. استمرار استخدام التطبيق يعني الموافقة على الشروط المحدثة.
              </p>
            </section>

            {/* Section 7: Payment & Access */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                7. Payment & Access
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                This app offers a one-time payment to unlock full access to all practice questions and mock tests. Payments are processed securely via Stripe. We do not store or have access to your card or payment details. Once payment is completed successfully, access is granted immediately and remains available for the lifetime of the account, unless the account is deleted or access is revoked due to misuse. All sales are final. Refunds are not guaranteed and are reviewed only in exceptional cases.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                يوفّر هذا التطبيق خيار دفع لمرة واحدة لفتح الوصول الكامل إلى جميع أسئلة التدريب والاختبارات التجريبية. تتم جميع عمليات الدفع بشكل آمن عبر Stripe، ولا نقوم بتخزين أو الوصول إلى أي معلومات خاصة ببطاقات الدفع. بعد إتمام الدفع بنجاح، يتم تفعيل الوصول فورًا ويبقى متاحًا طوال مدة استخدام الحساب، ما لم يتم حذف الحساب أو إيقافه بسبب إساءة الاستخدام. جميع عمليات الشراء نهائية، ولا يضمن التطبيق استرداد المبلغ إلا في حالات استثنائية.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

