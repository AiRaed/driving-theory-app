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

/**
 * Check if running on iOS (iPhone, iPad, iPod, iPadOS)
 * Reliable detection using user agent and touch detection for iPadOS
 * @returns true if iOS device, false otherwise
 */
export function isIOSDevice(): boolean {
  // Return false on server
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
  
  // Check for iOS devices (iPhone, iPad, iPod)
  const isIOS = /iPhone|iPad|iPod/.test(userAgent) && !(window as any).MSStream;
  
  // Check for iPadOS (iPad reports as MacIntel with touch support)
  const isIPadOS = /MacIntel/.test(userAgent) && 
                   navigator.maxTouchPoints > 1;
  
  return isIOS || isIPadOS;
}

/**
 * Check if running in iOS Safari (not Chrome iOS, not Firefox iOS, not in-app browsers)
 * @returns true if iOS Safari, false otherwise
 */
export function isSafari(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Must be iOS device first
  if (!isIOSDevice()) {
    return false;
  }

  const userAgent = navigator.userAgent || '';

  // Chrome iOS has "CriOS" in user agent
  if (userAgent.includes('CriOS')) {
    return false;
  }

  // Firefox iOS has "FxiOS" in user agent
  if (userAgent.includes('FxiOS')) {
    return false;
  }

  // In-app browsers often have specific patterns
  // Facebook in-app: "FBAN" or "FBAV"
  if (userAgent.includes('FBAN') || userAgent.includes('FBAV')) {
    return false;
  }

  // Twitter in-app: "Twitter"
  if (userAgent.includes('Twitter')) {
    return false;
  }

  // Instagram in-app: "Instagram"
  if (userAgent.includes('Instagram')) {
    return false;
  }

  // LinkedIn in-app: "LinkedInApp"
  if (userAgent.includes('LinkedInApp')) {
    return false;
  }

  // Check for Safari (Safari has "Safari" but not "Chrome" or "CriOS")
  // Safari on iOS will have "Safari" in user agent and not have "CriOS" or "FxiOS"
  const hasSafari = userAgent.includes('Safari');
  const hasChrome = userAgent.includes('Chrome');
  
  // Safari has "Safari" but not "Chrome" (Chrome iOS has "CriOS" which we already filtered)
  // However, Safari on iOS also includes "Version" in the user agent
  return hasSafari && !hasChrome;
}

/**
 * Safely copy text to clipboard
 * Falls back to textarea method if clipboard API is not available
 * @param text - The text to copy
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  // Try modern clipboard API first
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fall through to fallback method
    }
  }

  // Fallback: use textarea method
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    textarea.style.top = '-999999px';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textarea);
    
    return successful;
  } catch (err) {
    return false;
  }
}





