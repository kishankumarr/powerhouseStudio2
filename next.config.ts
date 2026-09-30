import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // A package-lock.json in a parent folder would otherwise be taken as the workspace root.
  turbopack: { root: process.cwd() },
  poweredByHeader: false,
  trailingSlash: false,
  images: {
    // Remote photos are served by the Unsplash CDN through a custom loader
    // (see src/lib/image-loader.ts); these patterns keep next/image honest.
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    qualities: [60, 70, 75],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920, 2400],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
