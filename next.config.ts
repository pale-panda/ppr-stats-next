import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      new URL(
        'https://aqjcyshltghdrukzofmq.supabase.co/storage/v1/object/public/**'
      ),
      new URL('http://127.0.0.1:54321/storage/v1/object/public/**'),
      new URL('http://localhost:54321/storage/v1/object/public/**'),
    ],
  },
};

export default nextConfig;
