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
};

export default withNextIntl(nextConfig);
