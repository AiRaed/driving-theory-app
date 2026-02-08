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





