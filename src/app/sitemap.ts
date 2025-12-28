import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://ppr-stats-next.vercel.app',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app',
          en: 'https://ppr-stats-next.vercel.app/en',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/about',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/about',
          en: 'https://ppr-stats-next.vercel.app/en/about',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/contact',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/contact',
          en: 'https://ppr-stats-next.vercel.app/en/contact',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/auth/login',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/auth/login',
          en: 'https://ppr-stats-next.vercel.app/en/auth/login',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/auth/register',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/auth/register',
          en: 'https://ppr-stats-next.vercel.app/en/auth/register',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/analytics',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/analytics',
          en: 'https://ppr-stats-next.vercel.app/en/analytics',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/leaderboard',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/leaderboard',
          en: 'https://ppr-stats-next.vercel.app/en/leaderboard',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/upload',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/upload',
          en: 'https://ppr-stats-next.vercel.app/en/upload',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/home',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/home',
          en: 'https://ppr-stats-next.vercel.app/en/home',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/sessions',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/sessions',
          en: 'https://ppr-stats-next.vercel.app/en/sessions',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/tracks',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/tracks',
          en: 'https://ppr-stats-next.vercel.app/en/tracks',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/tracks/[trackId]',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/tracks/[trackId]',
          en: 'https://ppr-stats-next.vercel.app/en/tracks/[trackId]',
        },
      },
    },
    {
      url: 'https://ppr-stats-next.vercel.app/sessions/[sessionId]',
      lastModified: new Date(),
      alternates: {
        languages: {
          sv: 'https://ppr-stats-next.vercel.app/sessions/[sessionId]',
          en: 'https://ppr-stats-next.vercel.app/en/sessions/[sessionId]',
        },
      },
    },
  ];
}
