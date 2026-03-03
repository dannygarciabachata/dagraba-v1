import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  // Cloudflare Pages compatibility
  experimental: {
    serverActions: {
      bodySizeLimit: '2gb',
    },
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // If it's the edge runtime (middleware or edge functions)
    // We mock out modules that rely on Node.js native APIs or don't work in Edge
    if (nextRuntime === 'edge') {
      config.resolve.alias = {
        ...config.resolve.alias,
        'firebase-admin': false,
        'jwks-rsa': false,
        'jose': false,
      };
    }
    return config;
  },
};

export default withNextIntl(nextConfig);
