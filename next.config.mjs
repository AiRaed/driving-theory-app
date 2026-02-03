/** @type {import('next').NextConfig} */
const nextConfig = {
  // DO NOT globally enable static export - API routes must work on Render
  // output: 'export', // REMOVED - breaks API routes

  // Disable ESLint blocking builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable TypeScript errors blocking builds (optional, but safe)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;