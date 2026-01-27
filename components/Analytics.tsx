'use client';

import Script from 'next/script';

export default function Analytics() {
  // Only render in production
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID || 'G-6FYBSNW1VP';

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}

