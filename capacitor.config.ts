import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.lingotheory.app',
  appName: 'Driving Theory Helper',
  webDir: 'out',
  server: {
    // Production: use stable origin for GA tracking
    // No localhost in production builds
    // Set CAPACITOR_SERVER_URL environment variable if needed for dev
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    cleartext: false,
    // Allow navigation to production domains for GA and external resources
    allowNavigation: [
      'https://www.lingotheory.org',
      'https://lingotheory.org',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://www.google.com',
    ],
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
  },
  ios: {
    contentInset: 'automatic',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
    },
  },
};

export default config;
