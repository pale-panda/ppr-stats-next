import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ppr-stats-next.vercel.app',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/about',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/about',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/contact',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/contact',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/auth/login',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/auth/login',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/auth/register',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/auth/register',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/analytics',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/analytics',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/leaderboard',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/leaderboard',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/upload',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/upload',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/home',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/home',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/sessions',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/sessions',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/tracks',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/tracks',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/tracks/[trackId]',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/tracks/[trackId]',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/sessions/[sessionId]',
      lastModified: new Date(),
      alternates: {
        languages: {
          en: 'https://ppr-stats-next.vercel.app/sessions/[sessionId]',
        },
      },
    },
  ];
}
