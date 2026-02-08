'use client';

import { Capacitor } from '@capacitor/core';

/**
 * AppVersionBadge - Only visible in native Android app
 * Fixed position badge at top-right corner
 */
export default function AppVersionBadge() {
  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 m-2 z-[9999] pointer-events-none">
      <div className="bg-red-600 text-white text-xs px-2 py-1 rounded font-medium">
        APP VERSION
      </div>
    </div>
  );
}

