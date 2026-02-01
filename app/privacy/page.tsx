export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="rounded-2xl border border-red-100/60 bg-gradient-to-br from-red-50/50 via-white to-red-50/30 p-6 sm:p-8 mt-4 shadow-xl relative overflow-hidden backdrop-blur-sm">
          {/* Premium red top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-red-600 to-red-700"></div>
          {/* Teal secondary accent line */}
          <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-300/40 to-transparent"></div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 mt-2">
            Privacy Policy
          </h1>

          <div className="space-y-6">
            {/* Section 1: Data Collection */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                1. Data Collection
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                We only collect your email address when you create an account. This is used solely for account access and authentication. We do not collect any other personal information.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                نجمع عنوان بريدك الإلكتروني فقط عند إنشاء حساب. يُستخدم حصرياً للوصول إلى الحساب والمصادقة. لا نجمع أي معلومات شخصية أخرى.
              </p>
            </section>

            {/* Section 2: Data Usage */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                2. How We Use Your Data
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                Your email address is used only to provide you with access to your account and to enable app functionality such as saving your progress. We do not use your data for any other purpose.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                يُستخدم عنوان بريدك الإلكتروني فقط لمنحك الوصول إلى حسابك وتمكين وظائف التطبيق مثل حفظ تقدمك. لا نستخدم بياناتك لأي غرض آخر.
              </p>
            </section>

            {/* Section 3: Data Sharing */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                3. Data Sharing and Selling
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                We do not sell, rent, or share your personal information with any third parties. Your data remains private and is only used for the app&apos;s core functionality.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أي أطراف ثالثة. تبقى بياناتك خاصة وتُستخدم فقط لوظائف التطبيق الأساسية.
              </p>
            </section>

            {/* Section 4: Tracking and Analytics */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                4. Tracking and Analytics
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                We use basic analytics to understand how the app is used and to improve the user experience. This does not involve tracking individual users or collecting personal data beyond what is necessary for account management.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                نستخدم تحليلات أساسية لفهم كيفية استخدام التطبيق وتحسين تجربة المستخدم. لا يتضمن ذلك تتبع المستخدمين الفرديين أو جمع بيانات شخصية أكثر مما هو ضروري لإدارة الحساب.
              </p>
            </section>

            {/* Section 5: Account Deletion */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                5. Account Deletion
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                You can delete your account at any time through your dashboard settings. When you delete your account, all associated data will be permanently removed from our systems.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                يمكنك حذف حسابك في أي وقت من خلال إعدادات لوحة التحكم. عند حذف حسابك، سيتم حذف جميع البيانات المرتبطة به بشكل دائم من أنظمتنا.
              </p>
            </section>

            {/* Section 6: App Purpose */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                6. Purpose of This App
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                This application is designed solely for driving theory practice and education. We are not affiliated with any official driving test authority, and this app is for learning purposes only.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                هذا التطبيق مخصص فقط لممارسة وتعلم نظرية القيادة. لسنا مرتبطين بأي سلطة رسمية لاختبار القيادة، وهذا التطبيق لأغراض تعليمية فقط.
              </p>
            </section>

            {/* Section 7: Payments */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                7. Payments
              </h2>
              <p className="text-base text-slate-800 leading-relaxed mb-3">
                Payments are handled by a third-party provider (Stripe). We do not collect, store, or process any card or financial details. We only store a confirmation that a payment has been completed to manage access within the app.
              </p>
              <p className="text-xs text-slate-800/70 leading-relaxed font-normal" dir="rtl" style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}>
                تتم معالجة عمليات الدفع من خلال مزوّد خارجي (Stripe). لا نقوم بجمع أو تخزين أو معالجة أي بيانات مالية أو معلومات بطاقات الدفع. نحتفظ فقط بتأكيد إتمام الدفع لغرض إدارة صلاحيات الوصول داخل التطبيق.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

