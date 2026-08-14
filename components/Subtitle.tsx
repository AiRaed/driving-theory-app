export default function Subtitle() {
  const arabicSubtitle = 'مساعدك الذكي لاجتياز اختبار القيادة النظري في بريطانيا';
  const urduSubtitle = 'اپنے برطانیہ کے ڈرائیونگ تھیوری ٹیسٹ کے لیے ذہین مددگار';

  return (
    <div className="mb-6 space-y-1.5 max-w-md mx-auto">
      <p
        className="text-sm sm:text-[0.95rem] text-[var(--text-secondary)] leading-relaxed"
        dir="rtl"
        style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
      >
        {arabicSubtitle}
      </p>
      <p
        className="text-sm sm:text-[0.95rem] text-[var(--text-secondary)] leading-relaxed"
        dir="rtl"
        style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
      >
        {urduSubtitle}
      </p>
    </div>
  );
}
