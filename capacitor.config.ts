import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.lingotheory.app',
  appName: 'Driving Theory Helper',

  // مهم: نتركها out لكن التطبيق فعلياً رح يعتمد على server.url
  webDir: 'out',

  server: {
    url: 'https://www.lingotheory.org',
    androidScheme: 'https',
    cleartext: false,
    allowNavigation: [
      'https://www.lingotheory.org',
      'https://lingotheory.org',
      'https://checkout.stripe.com',
      'https://*.stripe.com',
      'https://*.supabase.co',
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