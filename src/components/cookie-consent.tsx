'use client';
import dynamic from 'next/dynamic';

// Render this component on the client only to avoid hydration mismatches
// when reading localStorage/cookies.
export const CookieConsent = dynamic(
  () =>
    import('@/components/cookie-consent.client').then(
      (m) => m.CookieConsentClient
    ),
  { ssr: false }
);
