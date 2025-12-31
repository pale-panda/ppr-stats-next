'use client';
import dynamic from 'next/dynamic';

// Client-only to avoid SSR/hydration mismatches.
export const AnalyticsConsent = dynamic(
  () =>
    import('./analytics-consent.client').then((m) => m.AnalyticsConsentClient),
  { ssr: false }
);
