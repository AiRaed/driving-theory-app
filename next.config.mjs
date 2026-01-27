/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },

  // ✅ فقط لما بدنا نعمل Static export (لـ Capacitor)
  ...(isExport ? { output: "export" } : {}),
  
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