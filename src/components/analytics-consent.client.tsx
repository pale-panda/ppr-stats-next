'use client';

import { Analytics } from '@vercel/analytics/next';
import { useEffect, useState } from 'react';

import {
  CONSENT_EVENT,
  hasAnalyticsConsentInBrowser,
} from '@/components/cookie-consent.client';

export function AnalyticsConsentClient() {
  const [enabled, setEnabled] = useState(() => hasAnalyticsConsentInBrowser());

  useEffect(() => {
    const handler = () => setEnabled(hasAnalyticsConsentInBrowser());
    window.addEventListener(CONSENT_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(CONSENT_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  if (!enabled) return null;
  return <Analytics />;
}
