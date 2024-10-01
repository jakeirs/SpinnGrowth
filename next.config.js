/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'elegant-cormorant-271.convex.cloud',
      },
    ],
  },
}

module.exports = nextConfig
