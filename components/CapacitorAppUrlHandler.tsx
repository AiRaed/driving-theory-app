'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

/**
 * CapacitorAppUrlHandler
 * Listens for deep links and app URL opens (e.g., from email confirmation links)
 * Navigates the WebView to the callback URL when detected
 */
export default function CapacitorAppUrlHandler() {
  const router = useRouter();

  useEffect(() => {
    // Only run in native Capacitor apps
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    let listener: any;

    const setupListener = async () => {
      try {
        // Listen for app URL opens (deep links, App Links)
        listener = await App.addListener('appUrlOpen', (event: { url: string }) => {
          console.log('[AppUrlHandler] App opened with URL:', event.url);

          // Check if it's an auth callback URL
          if (event.url.includes('/auth/callback')) {
            console.log('[AppUrlHandler] Auth callback detected, navigating WebView...');
            
            // Extract the path and query from the URL
            try {
              const url = new URL(event.url);
              const pathWithQuery = url.pathname + url.search;
              
              // Navigate the WebView to the callback URL
              // This ensures the callback happens in the same WebView context
              // where the signup started, preserving PKCE verifier
              router.push(pathWithQuery);
            } catch (err) {
              console.error('[AppUrlHandler] Error parsing URL:', err);
              // Fallback: try to extract path manually
              const match = event.url.match(/https?:\/\/[^\/]+(\/.*)/);
              if (match && match[1]) {
                router.push(match[1]);
              }
            }
          }
        });

        console.log('[AppUrlHandler] App URL listener registered');
      } catch (err) {
        console.error('[AppUrlHandler] Error setting up listener:', err);
      }
    };

    setupListener();

    // Cleanup
    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, [router]);

  // This component doesn't render anything
  return null;
}

