import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import Link from "next/link";
import HeaderClient from "@/components/HeaderClient";
import Analytics from "@/components/Analytics";
import { AccessProvider } from "@/lib/providers/AccessProvider";
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
          <div className="min-h-screen flex flex-col bg-[var(--background)]">
            <HeaderClient />
            <main className="flex-1 relative z-10">
              {children}
            </main>
            <footer className="mt-auto border-t border-[var(--border)] bg-[var(--surface)]">
              <div className="max-w-5xl mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">LingoTheory</p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">© 2026 · Driving theory, in your language</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                    <Link href="/terms" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--lingo-red)] transition-colors">
                      Terms & Conditions
                    </Link>
                    <Link href="/privacy" className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--lingo-red)] transition-colors">
                      Privacy Policy
                    </Link>
                  </div>
                </div>
                <div className="border-t border-[var(--border)] pt-4 space-y-1">
                  <p className="text-xs text-[var(--text-secondary)]">
                    Support: <a href="mailto:support@lingotheory.org" className="font-medium hover:text-[var(--lingo-red)] transition-colors">support@lingotheory.org</a>
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Created by Raed Mahfoud — Independent AI Product Creator
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </AccessProvider>
      </body>
    </html>
  );
}
