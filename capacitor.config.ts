const config = {
  appId: 'io.lingotheory.mobile',
  appName: 'Driving Theory Helper',
  webDir: 'public',
  server: {
    // MUST be production URL - NO localhost, NO mock auth
    url: 'https://www.lingotheory.org',
    androidScheme: 'https',
    cleartext: false,
  },
};

export default config;