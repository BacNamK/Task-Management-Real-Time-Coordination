import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    allowedDevOrigins: ['192.168.1.24'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'ui-avatars.com',
            },
        ],
    },
};

export default nextConfig;
