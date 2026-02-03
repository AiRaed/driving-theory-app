const config = {
  appId: 'io.lingotheory.app',
  appName: 'Driving Theory Helper',
  // webDir points to build output (not 'public')
  webDir: '.next',
  server: {
    // MUST be production URL - NO localhost, NO mock auth
    url: 'https://www.lingotheory.org',
    androidScheme: 'https',
    cleartext: false,
  },
};

export default config;