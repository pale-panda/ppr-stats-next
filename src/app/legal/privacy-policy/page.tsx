import Link from 'next/link';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// NOTE: This page intentionally avoids asserting facts that cannot be verified from the codebase.
// Please review with counsel and fill in the placeholders below.
const POLICY = {
  productName: 'Pale Panda Racing Team Stats',
  websiteHost: 'ppr-stats-next.vercel.app',
  controllerName: 'Pale Panda Racing Team',
  contactEmail: 'privacy@your-domain.example',
  contactAddress: '',
  jurisdiction: 'Sweden / EU',
  lastUpdatedISO: '2025-12-31',
} as const;

export default function PrivacyPolicyPage() {
  return (
    <div className='w-full'>
      <div className='mx-auto w-full max-w-3xl px-4 py-10'>
        <Card>
          <CardHeader>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <CardTitle className='text-2xl'>Privacy Policy</CardTitle>
              <Badge variant='secondary'>
                Last updated: {POLICY.lastUpdatedISO}
              </Badge>
            </div>
            <p className='text-sm text-muted-foreground'>
              This Privacy Policy describes how {POLICY.controllerName}{' '}
              &quot;we&quot; processes personal data when you use{' '}
              {POLICY.productName}.
            </p>
          </CardHeader>
          <CardContent className='space-y-4 text-sm'>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Important:</span> This text is a
                privacy-policy template generated from the codebase and should
                be reviewed for your specific business, hosting setup, and legal
                obligations in {POLICY.jurisdiction}.
              </p>
              <p>
                For questions, contact us at{' '}
                <a className='underline' href={`mailto:${POLICY.contactEmail}`}>
                  {POLICY.contactEmail}
                </a>
                .
              </p>
            </div>

            <Separator />

            <Accordion type='multiple' className='w-full'>
              <AccordionItem value='who-we-are'>
                <AccordionTrigger>1) Who we are</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    <span className='font-medium'>Controller:</span>{' '}
                    {POLICY.controllerName}
                  </p>
                  <p>
                    <span className='font-medium'>Contact:</span>{' '}
                    {POLICY.contactEmail}
                    {POLICY.contactAddress ? ` • ${POLICY.contactAddress}` : ''}
                  </p>
                  <p>
                    <span className='font-medium'>Service:</span>{' '}
                    {POLICY.productName}
                    {POLICY.websiteHost ? ` (${POLICY.websiteHost})` : ''}
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='data-we-collect'>
                <AccordionTrigger>2) Personal data we collect</AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    Depending on how you use the service (e.g., browsing,
                    signing up, logging in, uploading telemetry), we may
                    process:
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <span className='font-medium'>Account data:</span> email,
                      authentication identifiers, and session tokens (handled
                      via Supabase Auth).
                    </li>
                    <li>
                      <span className='font-medium'>Profile data:</span>{' '}
                      username, full name, and avatar URL if you choose to
                      provide them.
                    </li>
                    <li>
                      <span className='font-medium'>
                        Telemetry and uploads:
                      </span>{' '}
                      uploaded CSV files and derived racing session data.
                      Telemetry records may include GPS coordinates and
                      timestamps.
                    </li>
                    <li>
                      <span className='font-medium'>Usage data:</span> page
                      views and performance metrics (for example via Vercel
                      Analytics).
                    </li>
                    <li>
                      <span className='font-medium'>
                        Device/technical data:
                      </span>{' '}
                      IP address, browser/device identifiers, and log data that
                      may be generated when you access the service.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='how-we-use'>
                <AccordionTrigger>3) How we use personal data</AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      Provide and operate the service (login, sessions,
                      dashboards).
                    </li>
                    <li>
                      Store and display racing session, lap, and telemetry
                      analytics.
                    </li>
                    <li>
                      Maintain security, prevent abuse, and troubleshoot issues.
                    </li>
                    <li>
                      Measure and improve performance and user experience.
                    </li>
                    <li>
                      Respond to your requests (e.g., contact form submissions).
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='legal-basis'>
                <AccordionTrigger>
                  4) Legal basis (if applicable)
                </AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    If laws like the GDPR apply, we generally rely on one or
                    more of the following legal bases (as applicable):
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <span className='font-medium'>Contract:</span> to provide
                      the service you request.
                    </li>
                    <li>
                      <span className='font-medium'>Legitimate interests:</span>{' '}
                      to secure, maintain, and improve the service.
                    </li>
                    <li>
                      <span className='font-medium'>Consent:</span> where
                      required (for example, certain analytics/cookie
                      scenarios).
                    </li>
                    <li>
                      <span className='font-medium'>Legal obligation:</span>{' '}
                      where we must comply with applicable laws.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='sharing'>
                <AccordionTrigger>5) Sharing and processors</AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    We may share personal data with service providers
                    (processors) who help us run the service, such as:
                  </p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>
                      <span className='font-medium'>Supabase</span> (database,
                      authentication, storage).
                    </li>
                    <li>
                      <span className='font-medium'>Vercel</span> (hosting and
                      analytics).
                    </li>
                    <li>
                      <span className='font-medium'>Google Maps</span> (map
                      display) if you view features that load map tiles/scripts.
                    </li>
                  </ul>
                  <p>
                    We may also share data if required by law, to protect rights
                    and safety, or in connection with a corporate transaction
                    (e.g., merger/acquisition).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='international-transfers'>
                <AccordionTrigger>6) International transfers</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    Your data may be processed in countries other than your own,
                    depending on where our providers operate. Where required, we
                    use appropriate safeguards for cross-border transfers (for
                    example, contractual clauses).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='retention'>
                <AccordionTrigger>7) Data retention</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    We keep personal data only as long as needed for the
                    purposes described above, including to comply with legal
                    obligations, resolve disputes, and enforce agreements.
                    Retention periods depend on the type of data (account vs.
                    telemetry vs. logs).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='security'>
                <AccordionTrigger>8) Security</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    We use reasonable administrative, technical, and
                    organizational measures to protect personal data. No method
                    of transmission or storage is 100% secure.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='rights'>
                <AccordionTrigger>9) Your rights</AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    Depending on your location, you may have rights such as
                    access, correction, deletion, portability, and
                    objection/restriction. To exercise rights, contact{' '}
                    <a
                      className='underline'
                      href={`mailto:${POLICY.contactEmail}`}>
                      {POLICY.contactEmail}
                    </a>
                    .
                  </p>
                  <p>
                    You may also be able to manage account information through
                    the in-app settings pages.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='cookies'>
                <AccordionTrigger>
                  10) Cookies and similar technologies
                </AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    We use cookies and similar technologies for authentication
                    (keeping you logged in) and, where enabled, analytics. Your
                    browser settings may allow you to control cookies; disabling
                    some cookies may affect functionality.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='children'>
                <AccordionTrigger>11) Children</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    The service is not intended for children. If you believe a
                    child has provided us personal data, contact us so we can
                    take appropriate steps.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='changes'>
                <AccordionTrigger>12) Changes to this policy</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    We may update this policy from time to time. We will post
                    the updated version on this page and update the “Last
                    updated” date.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='contact'>
                <AccordionTrigger>13) Contact</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    Email:{' '}
                    <a
                      className='underline'
                      href={`mailto:${POLICY.contactEmail}`}>
                      {POLICY.contactEmail}
                    </a>
                  </p>
                  <p>
                    If you are in the EU/EEA/UK, you may have the right to lodge
                    a complaint with your data protection authority.
                  </p>
                  <p>
                    Return to{' '}
                    <Link className='underline' href='/'>
                      home
                    </Link>
                    .
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
