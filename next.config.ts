import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The postcard image reads its art from public/ at request time
  outputFileTracingIncludes: {
    '/card/[id]/image': ['./public/share/og-*.png', './public/icons/halftone/song.png', './public/results/record-large.png'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'thumb.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'is1-ssl.mzstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.mzstatic.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
