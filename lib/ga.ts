/**
 * Google Analytics 4 helper functions for Capacitor mobile app
 * Safely handles cases where GA is blocked or unavailable
 */

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Track a custom event in Google Analytics
 * @param name - Event name (e.g., 'button_click', 'page_view')
 * @param params - Optional event parameters
 * @example
 * gaEvent('practice_started', { topic: 'hazard-awareness' });
 */
export function gaEvent(name: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  if (window.gtag) {
    try {
      window.gtag('event', name, params || {});
    } catch (error) {
      // Silently fail if GA is blocked or unavailable
      // No console errors to avoid breaking the app
    }
  }
}

/**
 * Track a page view in Google Analytics
 * @param url - The page URL to track
 * @example
 * gaPageView('/practice');
 */
export function gaPageView(url: string): void {
  if (typeof window === 'undefined') return;
  
  if (window.gtag) {
    try {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID || 'G-6FYBSNW1VP', {
        page_path: url,
      });
    } catch (error) {
      // Silently fail if GA is blocked or unavailable
      // No console errors to avoid breaking the app
    }
  }
}

