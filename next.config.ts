import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/web-arc-raiders-cms-assets/**',
      },
      {
        protocol: 'https',
        hostname: 'images8.alphacoders.com',
      },
    ],
  },
};

export default nextConfig;
