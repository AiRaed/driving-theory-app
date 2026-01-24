/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_OUTPUT === "export";

const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },

  // ✅ فقط لما بدنا نعمل Static export (لـ Capacitor)
  ...(isExport ? { output: "export" } : {}),
};

export default nextConfig;