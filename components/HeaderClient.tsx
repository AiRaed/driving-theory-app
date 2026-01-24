'use client';

import Image from 'next/image';
import Navigation from '@/components/Navigation';

export default function HeaderClient() {
  return (
    <header className="border-b border-red-100 bg-gradient-to-b from-white to-[#fff5f5]/80 backdrop-blur-md sticky top-0 z-20 shadow-sm">
      <div className="max-w-5xl mx-auto px-3 py-2 sm:px-4 md:py-5">
        {/* Mobile: 2-row layout, Desktop: single row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Row 1: Logo only (mobile) / Logo + Title (desktop) */}
          <div className="flex items-center gap-2 sm:items-end sm:gap-3 mb-2 sm:mb-0">
            <Image
              src="/logo-lingotheory.png"
              alt="LingoTheory logo"
              width={60}
              height={60}
              className="flex-shrink-0 cursor-pointer transition-opacity duration-200 hover:opacity-80 h-12 w-12 sm:h-[60px] sm:w-auto"
              priority
            />
            {/* Title - hidden on mobile, shown on desktop */}
            <div className="hidden sm:block sm:flex-none">
              <div className="text-sm md:text-base text-slate-800 font-medium leading-tight whitespace-normal">
                Driving Theory Test. In Your Language.
              </div>
            </div>
          </div>
          {/* Row 2: Navigation (mobile) / Navigation (desktop) */}
          <div className="sm:flex-shrink-0">
            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
}

