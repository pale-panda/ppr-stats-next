import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/track',
        '/sessions',
        '/analytics',
        '/leaderboard',
        '/upload',
      ],
    },
    sitemap: 'https://ppr-stats-next.vercel.app/sitemap.xml',
  };
}
