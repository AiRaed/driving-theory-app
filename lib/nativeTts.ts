'use client';

/**
 * Check if the app is running inside Capacitor on Android
 * Safe to call during SSR - returns false if window is undefined
 */
export function isAndroidApp(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    // Dynamically import Capacitor only when window is available
    const Capacitor = (window as any).Capacitor;
    if (!Capacitor) return false;
    
    const isCapacitor = Capacitor.isNativePlatform?.();
    const platform = Capacitor.getPlatform?.();
    return isCapacitor && platform === 'android';
  } catch (error) {
    return false;
  }
}

/**
 * Speak text using native Android TTS
 * @param text - The text to speak (English question text)
 */
export async function speakNative(text: string): Promise<void> {
  if (typeof window === 'undefined') {
    console.warn('Native TTS is only available in browser/Android app');
    return;
  }

  if (!isAndroidApp()) {
    console.warn('Native TTS is only available on Android app');
    return;
  }

  try {
    // Dynamically access TextToSpeech only when available
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
    await TextToSpeech.speak({
      text,
      lang: 'en-GB',
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
    });
  } catch (error) {
    console.error('Native TTS error:', error);
    throw error;
  }
}

/**
 * Stop native TTS playback
 */
export async function stopNative(): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  if (!isAndroidApp()) {
    return;
  }

  try {
    // Dynamically access TextToSpeech only when available
    const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
    await TextToSpeech.stop();
  } catch (error) {
    console.error('Native TTS stop error:', error);
  }
}

