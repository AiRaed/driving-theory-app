'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { isAndroidApp, speakNative, stopNative } from '@/lib/nativeTts';

interface NativeVoiceButtonProps {
  text: string;
  className?: string;
}

export default function NativeVoiceButton({ text, className }: NativeVoiceButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if running on Android app
  useEffect(() => {
    setIsAvailable(isAndroidApp());
  }, []);

  // Stop speech when text changes (e.g., user navigates to next question)
  useEffect(() => {
    if (isSpeaking) {
      stopNative().catch(() => {}).finally(() => {
        setIsSpeaking(false);
      });
    }
  }, [text, isSpeaking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSpeaking) {
        stopNative();
      }
    };
  }, [isSpeaking]);

  const handleToggle = async () => {
    if (!isAvailable) return;

    try {
      if (isSpeaking) {
        await stopNative();
        setIsSpeaking(false);
        setError(null);
      } else {
        await speakNative(text);
        setIsSpeaking(true);
        setError(null);
        
        // Note: Native TTS doesn't provide onEnd callback easily,
        // so we'll reset after a reasonable timeout or let user stop manually
        // For better UX, we could listen to TTS events if the plugin supports it
      }
    } catch (err) {
      console.error('Native TTS error:', err);
      setError('Voice not available');
      setIsSpeaking(false);
    }
  };

  // Hide button if not on Android app
  if (!isAvailable) {
    return null;
  }

  // Show error message if TTS failed
  if (error) {
    return (
      <div className={cn("text-xs text-red-500", className)}>
        {error}
      </div>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center gap-[6px] rounded-full px-2 py-1",
        "cursor-pointer transition-all duration-150 ease-in-out",
        "hover:bg-[var(--teal-soft)]/40",
        "focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/50",
        isSpeaking && "bg-[var(--teal-soft)]/40",
        className
      )}
      aria-label={isSpeaking ? "Stop speaking" : "Read question aloud (Native)"}
      title={isSpeaking ? "Stop speaking" : "Read question aloud (Native)"}
    >
      <span 
        className={cn(
          "text-base transition-opacity duration-150 ease-in-out",
          isSpeaking ? "opacity-100" : "opacity-80 hover:opacity-100"
        )}
      >
        {isSpeaking ? "⏹" : "🔊"}
      </span>
      <span 
        className={cn(
          "text-[12px] leading-none transition-colors duration-150 ease-in-out",
          "text-[#6B7280] hover:text-[#4B5563]",
          isSpeaking && "text-[var(--teal)]"
        )}
      >
        {isSpeaking ? "Stop" : "Play voice"}
      </span>
    </button>
  );
}

