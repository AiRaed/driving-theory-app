'use client';

import { useState, useEffect, useRef } from 'react';
import { isStandaloneMode, isCapacitorWebView } from '@/lib/utils/platform';

/**
 * Shared hook for managing PWA install prompt
 * Provides deferred prompt state and methods to trigger install
 */
export function useInstallPrompt() {
  const [hasInstallPrompt, setHasInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const deferredPromptRef = useRef<any>(null);

  useEffect(() => {
    // Check if already installed
    if (isStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    // Don't listen for prompts in Capacitor WebView
    if (isCapacitorWebView()) {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      setHasInstallPrompt(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      deferredPromptRef.current = null;
      setHasInstallPrompt(false);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      }
    };
  }, []);

  /**
   * Trigger the native install prompt
   * @returns Promise that resolves when user makes a choice
   */
  const triggerInstall = async (): Promise<{ outcome: 'accepted' | 'dismissed' } | null> => {
    if (!deferredPromptRef.current) {
      return null;
    }

    try {
      const promptEvent = deferredPromptRef.current as any;
      await promptEvent.prompt();
      const { outcome } = await promptEvent.userChoice;
      
      // Clear the stored prompt
      deferredPromptRef.current = null;
      setHasInstallPrompt(false);
      
      return { outcome: outcome === 'accepted' ? 'accepted' : 'dismissed' };
    } catch (error) {
      console.error('Install prompt error:', error);
      deferredPromptRef.current = null;
      setHasInstallPrompt(false);
      return null;
    }
  };

  return {
    hasInstallPrompt,
    isInstalled,
    triggerInstall,
  };
}

