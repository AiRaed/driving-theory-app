import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a topic key (e.g., "road-signs", "rules-of-the-road") to Title Case
 * for display purposes. Keeps small words lowercase unless they're the first word.
 */
export function toTitleCaseLabel(topicKey: string | undefined | null): string {
  // Handle undefined, null, or empty string
  if (!topicKey || typeof topicKey !== 'string') {
    return '';
  }
  
  const smallWords = new Set(['of', 'the', 'and', 'to', 'a', 'an', 'in', 'on', 'at', 'for', 'by']);
  
  return topicKey
    .split('-')
    .map((word, index) => {
      // Always capitalize the first word
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      // Keep small words lowercase, capitalize others
      if (smallWords.has(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

