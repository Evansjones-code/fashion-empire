import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allows Next.js to securely render lookbook photography layers from external image servers
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // Keeps your internal windows network adapter proxy streams online
  allowedDevOrigins: ['172.25.128.1', 'localhost:3000']
};

export default nextConfig;
