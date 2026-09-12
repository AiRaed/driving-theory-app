'use client';

import Image from 'next/image';
import { gaEvent } from '@/lib/ga';

const APP_STORE_URL =
  'https://apps.apple.com/gb/app/lingotheory/id6781758136';
const GOOGLE_PLAY_URL =
  'https://play.google.com/store/apps/details?id=io.lingotheory.mobile';
const WEBSITE_URL = 'https://www.lingotheory.org';

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3.18 23.71c-.11.05-.22.06-.33.04a.77.77 0 0 1-.5-.35.8.8 0 0 1-.1-.55V1.15c0-.2.07-.39.2-.54.15-.17.35-.27.57-.28.12 0 .24.02.35.08l14.7 8.35c.18.1.32.26.4.45.08.2.08.41 0 .61-.08.19-.22.35-.4.45L3.18 23.71zM6.4 6.48v11.04L14.4 12 6.4 6.48z" />
    </svg>
  );
}

export default function DownloadClient() {
  return (
    <div className="min-h-[calc(100vh-0px)] bg-[var(--background)]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col items-center justify-center px-5 py-12 sm:py-16">
        <Image
          src="/logo-lingotheory.png"
          alt="LingoTheory"
          width={88}
          height={88}
          className="h-16 w-16 sm:h-20 sm:w-20"
          priority
        />

        <p className="lt-kicker mt-6 mb-3">LingoTheory</p>

        <h1 className="text-center text-[1.55rem] sm:text-[1.85rem] font-bold leading-[1.2] text-[var(--text-primary)] text-balance">
          Practice the UK Driving Theory Test in your language
        </h1>

        <p className="mt-4 text-center text-[0.95rem] sm:text-base text-[var(--text-secondary)] leading-relaxed">
          Learn, practise and prepare with LingoTheory.
        </p>

        <div className="mt-10 w-full space-y-3.5">
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => gaEvent('app_store_clicked', { source: 'download_page' })}
            className="flex w-full items-center gap-3.5 rounded-[var(--radius-md)] bg-[var(--navy)] px-5 py-4 text-white shadow-sm transition-opacity hover:opacity-95 active:opacity-90"
          >
            <AppleIcon className="h-8 w-8 flex-shrink-0" />
            <span className="flex min-w-0 flex-col items-start text-left leading-tight">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/70">
                Apple App Store
              </span>
              <span className="text-[15px] sm:text-base font-semibold">
                Download on the App Store
              </span>
            </span>
          </a>

          <a
            href={GOOGLE_PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => gaEvent('google_play_clicked', { source: 'download_page' })}
            className="flex w-full items-center gap-3.5 rounded-[var(--radius-md)] bg-[var(--lingo-red)] px-5 py-4 text-white shadow-sm transition-colors hover:bg-[var(--lingo-red-hover)] active:bg-[var(--lingo-red-dark)]"
          >
            <PlayIcon className="h-7 w-7 flex-shrink-0" />
            <span className="flex min-w-0 flex-col items-start text-left leading-tight">
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/75">
                Google Play
              </span>
              <span className="text-[15px] sm:text-base font-semibold">
                Get it on Google Play
              </span>
            </span>
          </a>
        </div>

        <p className="mt-5 text-center text-xs sm:text-sm text-[var(--text-secondary)]">
          Available on iPhone and Android
        </p>

        <a
          href={WEBSITE_URL}
          onClick={() => gaEvent('website_clicked', { source: 'download_page' })}
          className="mt-10 text-sm font-medium text-[var(--text-secondary)] underline-offset-4 transition-colors hover:text-[var(--lingo-red)] hover:underline"
        >
          Continue on the LingoTheory website
        </a>
      </div>
    </div>
  );
}
