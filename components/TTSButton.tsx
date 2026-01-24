'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { isNativeAndroid } from '@/lib/capacitor-utils';

interface TTSButtonProps {
  text: string;
  className?: string;
}

export default function TTSButton({ text, className }: TTSButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check if TTS is available (web or Android native)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isNativeAndroid()) {
      // Android native TTS is always available
      setIsAvailable(true);
    } else if ('speechSynthesis' in window) {
      // Web TTS
      setIsAvailable(true);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window === 'undefined') return;
      
      if (isNativeAndroid()) {
        // Stop Android TTS - dynamic import
        import('@capacitor-community/text-to-speech').then(({ TextToSpeech }) => {
          TextToSpeech.stop().catch(() => {
            // Ignore errors on cleanup
          });
        }).catch(() => {
          // Ignore import errors
        });
      } else if (window.speechSynthesis) {
        // Stop web TTS
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Stop speech when text changes (e.g., user navigates to next question)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (isNativeAndroid()) {
      // Stop Android TTS - dynamic import
      import('@capacitor-community/text-to-speech').then(({ TextToSpeech }) => {
        TextToSpeech.stop().catch(() => {
          // Ignore errors
        });
      }).catch(() => {
        // Ignore import errors
      });
      setIsSpeaking(false);
    } else if (window.speechSynthesis) {
      // Stop web TTS
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }
  }, [text]);

  const handleToggle = async () => {
    if (typeof window === 'undefined') return;

    // Android native TTS
    if (isNativeAndroid()) {
      // Dynamic import to avoid SSR issues
      const { TextToSpeech } = await import('@capacitor-community/text-to-speech');
      
      // If already speaking, stop and restart from the beginning
      if (isSpeaking) {
        try {
          await TextToSpeech.stop();
        } catch (error) {
          // Ignore stop errors
        }
        setIsSpeaking(false);
      }

      try {
        setIsSpeaking(true);
        await TextToSpeech.speak({
          text,
          lang: 'en-GB',
          rate: 1.0,
          pitch: 1.0,
          volume: 1.0,
        });
        setIsSpeaking(false);
      } catch (error) {
        console.error('Android TTS error:', error);
        setIsSpeaking(false);
      }
      return;
    }

    // Web TTS (fallback)
    if (!window.speechSynthesis) return;

    // If already speaking, stop and restart from the beginning
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      utteranceRef.current = null;
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Find an English voice (prefer en-GB, fallback to any English)
    const voices = window.speechSynthesis.getVoices();
    const enGBVoice = voices.find(v => v.lang.startsWith('en-GB'));
    const enVoice = enGBVoice || voices.find(v => v.lang.startsWith('en'));
    
    if (enVoice) {
      utterance.voice = enVoice;
    }

    // Set default properties
    utterance.lang = 'en-GB';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Handle events
    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utterance.onerror = (error) => {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    // Load voices if needed (some browsers load voices asynchronously)
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        const updatedVoices = window.speechSynthesis.getVoices();
        const enGBVoice = updatedVoices.find(v => v.lang.startsWith('en-GB'));
        const enVoice = enGBVoice || updatedVoices.find(v => v.lang.startsWith('en'));
        if (enVoice) {
          utterance.voice = enVoice;
        }
        window.speechSynthesis.speak(utterance);
      };
    } else {
      window.speechSynthesis.speak(utterance);
    }
  };

  // Hide button if TTS is not available
  if (!isAvailable) {
    return null;
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        "cursor-pointer transition-all duration-150 ease-in-out",
        "hover:bg-[var(--teal-soft)]/40",
        "focus:outline-none focus:ring-2 focus:ring-[var(--teal)]/50",
        // Mobile: icon-only, circular button (36-40px)
        "w-9 h-9 sm:w-auto sm:h-auto",
        "sm:gap-2 sm:px-2 sm:py-1",
        "whitespace-nowrap",
        isSpeaking && "bg-[var(--teal-soft)]/40",
        className
      )}
      aria-label={isSpeaking ? "Stop speaking" : "Read question aloud"}
      title={isSpeaking ? "Stop speaking" : "Read question aloud"}
    >
      <span 
        className={cn(
          "text-base transition-opacity duration-150 ease-in-out",
          "flex items-center justify-center",
          isSpeaking ? "opacity-100" : "opacity-80 hover:opacity-100"
        )}
      >
        {isSpeaking ? "⏹" : "🔊"}
      </span>
      <span 
        className={cn(
          "text-sm leading-none transition-colors duration-150 ease-in-out",
          "text-[#6B7280] hover:text-[#4B5563]",
          isSpeaking && "text-[var(--teal)]",
          // Hide text on mobile, show on sm and above
          "hidden sm:inline"
        )}
      >
        Play voice
      </span>
    </button>
  );
}

