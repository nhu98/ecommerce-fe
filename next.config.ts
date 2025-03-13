import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'qlbh-be.onrender.com',
      },
      {
        protocol: 'http',
        hostname: '14.225.206.204',
        port: '3001', // Thêm port nếu cần thiết
      },
    ],
  },
};

export default nextConfig;
