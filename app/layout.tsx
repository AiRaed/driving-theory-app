import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import HeaderClient from "@/components/HeaderClient";
import FooterClient from "@/components/FooterClient";
import LanguageGate from "@/components/LanguageGate";
import Analytics from "@/components/Analytics";
import { AccessProvider } from "@/lib/providers/AccessProvider";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import PWAMetaTags from "@/components/PWAMetaTags";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";
import IOSInstallBanner from "@/components/IOSInstallBanner";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LingoTheory – Driving Theory Test. In Your Language.",
  description: "Multilingual driving theory test practice. Prepare for your UK driving theory test with bilingual practice questions and realistic mock tests.",
  icons: {
    icon: "/favicon-check.svg",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LingoTheory",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "LingoTheory",
  },
};

export const viewport: Viewport = {
  themeColor: "#F4F2EF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${plusJakarta.variable} ${ibmPlexSansArabic.variable} font-sans antialiased min-h-screen`}
      >
        <PWAMetaTags />
        <RegisterServiceWorker />
        <IOSInstallBanner />
        <Analytics />
        <AccessProvider>
          <LanguageProvider>
            <LanguageGate>
              <div className="min-h-screen flex flex-col bg-[var(--background)]">
                <HeaderClient />
                <main className="flex-1 relative z-10">
                  {children}
                </main>
                <FooterClient />
              </div>
            </LanguageGate>
          </LanguageProvider>
        </AccessProvider>
      </body>
    </html>
  );
}
