'use client';

import { useEffect } from 'react';

/**
 * Registers the service worker on the client only (no SSR).
 * Safe to mount in root layout.
 */
export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    window.navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((reg) => {
        if (process.env.NODE_ENV === 'development') console.log('SW registered', reg.scope);
      })
      .catch((err) => {
        console.warn('SW registration failed', err);
      });
  }, []);

  return null;
}
