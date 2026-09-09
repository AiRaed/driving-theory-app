'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { App, type URLOpenListenerEvent } from '@capacitor/app';
import { authDeepLinkTarget, currentLocationKey } from '@/lib/deeplink/authDeepLink';

/** Prevents getLaunchUrl + appUrlOpen from navigating twice in the same JS context. */
let inFlightTarget: string | null = null;

function navigateToAuthDeepLink(rawUrl: string | undefined) {
  if (!rawUrl) {
    return;
  }

  const target = authDeepLinkTarget(rawUrl);
  if (!target) {
    return;
  }

  if (currentLocationKey() === target) {
    return;
  }

  if (inFlightTarget === target) {
    return;
  }

  inFlightTarget = target;
  window.location.replace(target);
}

/**
 * Single Capacitor appUrlOpen / cold-launch handler for email confirmation and reset links.
 */
export default function DeepLinkHandler() {
  useEffect(() => {
    if (typeof window === 'undefined' || !Capacitor.isNativePlatform()) {
      return;
    }

    let cancelled = false;

    const handle = (rawUrl: string | undefined) => {
      if (cancelled) {
        return;
      }
      navigateToAuthDeepLink(rawUrl);
    };

    const listenerPromise = App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      handle(event.url);
    });

    void App.getLaunchUrl()
      .then((result) => {
        handle(result?.url);
      })
      .catch(() => {
        // Launch URL is optional; appUrlOpen still covers warm starts.
      });

    return () => {
      cancelled = true;
      void listenerPromise.then((handleRef) => handleRef.remove()).catch(() => undefined);
    };
  }, []);

  return null;
}
