/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export for Capacitor builds (Android)
  // For Render/server builds, use normal Next.js server mode (no output: 'export')
  ...(process.env.CAPACITOR_BUILD === 'true' && {
    output: 'export',
    images: { unoptimized: true },
  }),
  // Default: no output: 'export' - allows API routes to work on Render
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  
  // إصلاح مشكلة webpack مع next-sitemap
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;