import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(
        'https://aqjcyshltghdrukzofmq.supabase.co/storage/v1/object/public/assets/**'
      ),
    ],
  },
};

export default nextConfig;
