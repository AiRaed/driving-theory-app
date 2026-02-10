/**
 * Platform detection utilities
 * Detects if running in Capacitor Android app
 */

/**
 * Check if running in Capacitor Android app
 * @returns true if running in Android app, false otherwise
 */
export function isCapacitorAndroid(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for Capacitor
  const capacitor = (window as any).Capacitor;
  if (!capacitor) {
    return false;
  }

  // Check if platform is Android
  return capacitor.isNativePlatform() && capacitor.getPlatform() === 'android';
}

/**
 * Check if running in web browser (not Capacitor)
 * @returns true if running in web browser, false otherwise
 */
export function isWebBrowser(): boolean {
  return !isCapacitorAndroid();
}

/**
 * Check if running on a mobile device (iOS or Android)
 * @returns true if mobile device, false otherwise
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check user agent for mobile devices
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
  return mobileRegex.test(userAgent);
}

/**
 * Check if running in standalone/PWA mode (already installed)
 * @returns true if in standalone mode, false otherwise
 */
export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for display-mode: standalone (PWA)
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return true;
  }

  // Check for iOS standalone mode
  if ((navigator as any).standalone === true) {
    return true;
  }

  return false;
}

/**
 * Check if running in Capacitor WebView (should not show PWA popup)
 * @returns true if in Capacitor WebView, false otherwise
 */
export function isCapacitorWebView(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Check for Capacitor
  if (isCapacitorAndroid()) {
    return true;
  }

  // Check user agent for WebView
  const userAgent = navigator.userAgent || '';
  if (userAgent.includes('wv')) {
    return true;
  }

  // Check for Capacitor object
  const capacitor = (window as any).Capacitor;
  if (capacitor && capacitor.isNativePlatform && capacitor.isNativePlatform()) {
    return true;
  }

  return false;
}





