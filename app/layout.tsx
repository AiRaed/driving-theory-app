import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import Link from "next/link";
import HeaderClient from "@/components/HeaderClient";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${inter.variable} ${ibmPlexSansArabic.variable} font-sans antialiased min-h-screen`}
      >
        <div className="min-h-screen flex flex-col bg-[var(--bg)]">
          <HeaderClient />
          <main className="flex-1 relative z-10">
            {children}
          </main>
          <footer className="border-t border-[var(--border)]/50 bg-white/80 backdrop-blur-sm">
            <div className="max-w-5xl mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-3">
                <span className="text-xs text-[var(--muted-text)]">© {new Date().getFullYear()} Driving Theory Helper</span>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-[var(--muted-text)]">Practice • Mock Test • Multilingual</span>
                  <Link href="/terms" className="text-xs text-[var(--muted-text)] hover:text-[var(--navy)] transition-colors">
                    Terms & Conditions
                  </Link>
                  <Link href="/privacy" className="text-xs text-[var(--muted-text)] hover:text-[var(--navy)] transition-colors">
                    Privacy Policy
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
