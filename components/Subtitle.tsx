export default function Subtitle() {
  const arabicSubtitle = 'مساعدك الذكي لاجتياز اختبار القيادة النظري في بريطانيا';
  const urduSubtitle = 'اپنے برطانیہ کے ڈرائیونگ تھیوری ٹیسٹ کے لیے ذہین مددگار';

  return (
    <div className="mt-2 mb-4">
      {/* Arabic subtitle */}
      <p 
        className="text-sm sm:text-base text-[var(--muted-text)]"
        dir="rtl"
        style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
      >
        {arabicSubtitle}
      </p>
      {/* Urdu subtitle - directly below Arabic, same style */}
      <p 
        className="text-sm sm:text-base text-[var(--muted-text)] mt-1"
        dir="rtl"
        style={{ fontFeatureSettings: '"liga" 1, "kern" 1' }}
      >
        {urduSubtitle}
      </p>
    </div>
  );
}

