import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARNING !!
    // This allows production builds to successfully complete even if
    // your project has type errors. Use with caution.
    ignoreBuildErrors: true,
  },
  // Add other Next.js config options here
};

export default nextConfig;
