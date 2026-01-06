'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'ppr-cookie-consent-v1';
const CONSENT_EVENT = 'ppr:cookie-consent';

type ConsentValue = 'accepted' | 'rejected';

type StoredConsent = ConsentValue | null;

function readConsentFromBrowser(): StoredConsent {
  if (typeof window === 'undefined') return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === 'accepted' || v === 'rejected' ? v : null;
}

function writeConsentToBrowser(value: ConsentValue) {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(CONSENT_KEY, value);

  // Also set a simple cookie so future server-side usage is possible.
  // Keep it simple: no personal data, just a consent flag.
  const maxAgeDays = 7;
  document.cookie = `${CONSENT_KEY}=${value}; Path=/; Max-Age=${
    maxAgeDays * 24 * 60 * 60
  }; SameSite=Lax`;

  // Same-tab notification (storage event doesn't fire in the same tab).
  window.dispatchEvent(new Event(CONSENT_EVENT));
}

export function CookieConsentClient() {
  const [consent, setConsent] = useState<StoredConsent>(() =>
    readConsentFromBrowser()
  );

  useEffect(() => {
    const handler = () => setConsent(readConsentFromBrowser());
    window.addEventListener(CONSENT_EVENT, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(CONSENT_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  if (consent) return null;

  return (
    <div className='pointer-events-none fixed inset-x-0 bottom-0 z-50 p-4'>
      <div className='mx-auto w-full max-w-3xl'>
        <Card className='pointer-events-auto p-4'>
          <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <div className='space-y-1'>
              <p className='text-sm font-medium'>Cookies</p>
              <p className='text-sm text-muted-foreground'>
                Necessary cookies help keep you signed in. If you accept, we
                also enable analytics to improve the app. Read our{' '}
                <Link className='underline' href='/legal/privacy-policy'>
                  Privacy Policy
                </Link>
                .
              </p>
            </div>

            <div className='flex gap-2 sm:shrink-0'>
              <Button
                variant='secondary'
                onClick={() => {
                  writeConsentToBrowser('rejected');
                  setConsent('rejected');
                }}>
                Reject
              </Button>
              <Button
                onClick={() => {
                  writeConsentToBrowser('accepted');
                  setConsent('accepted');
                }}>
                Accept
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export function hasAnalyticsConsentInBrowser(): boolean {
  return readConsentFromBrowser() === 'accepted';
}

export { CONSENT_EVENT, CONSENT_KEY };
