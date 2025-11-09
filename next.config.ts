import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';

// Debug: log the backend URL being used (only visible during build)
console.log('[Next.js Config] Using BACKEND_URL:', backendUrl);

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
  // Enable image optimization for external images
  // Allow images from any domain (less secure but more flexible)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
