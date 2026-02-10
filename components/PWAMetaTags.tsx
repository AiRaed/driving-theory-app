'use client';

import { useEffect } from 'react';

/**
 * PWA Meta Tags Component
 * Adds iOS-specific meta tags for proper splash screen and app appearance
 */
export default function PWAMetaTags() {
  useEffect(() => {
    // Add or update meta tags
    const addMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // iOS status bar style
    addMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    
    // Theme color (white background)
    addMetaTag('theme-color', '#ffffff');
    
    // Apple mobile web app capable
    addMetaTag('apple-mobile-web-app-capable', 'yes');
    
    // Apple mobile web app title
    addMetaTag('apple-mobile-web-app-title', 'LingoTheory');
  }, []);

  return null;
}

