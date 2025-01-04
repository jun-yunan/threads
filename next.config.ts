import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'watchful-mouse-748.convex.cloud',
      },
    ],
  },
};

export default nextConfig;
