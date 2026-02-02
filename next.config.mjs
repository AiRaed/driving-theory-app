/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only enable static export for Capacitor builds
  ...(process.env.CAPACITOR_BUILD === 'true' && {
    output: 'export',
    images: { unoptimized: true },
  }),
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