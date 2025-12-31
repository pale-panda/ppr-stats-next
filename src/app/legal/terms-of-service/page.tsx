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

// NOTE: This page is a practical template derived from the app's behavior.
// It must be reviewed for your specific business, jurisdiction, and compliance needs.
const TERMS = {
  productName: 'Pale Panda Racing Team Stats',
  websiteHost: 'ppr-stats-next.vercel.app',
  operatorName: 'Pale Panda Racing Team',
  supportEmail: 'support@your-domain.example',
  jurisdiction: 'Sweden / EU',
  lastUpdatedISO: '2025-12-31',
} as const;

export default function TermsOfServicePage() {
  return (
    <div className='w-full'>
      <div className='mx-auto w-full max-w-3xl px-4 py-10'>
        <Card>
          <CardHeader>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <CardTitle className='text-2xl'>Terms of Service</CardTitle>
              <Badge variant='secondary'>
                Last updated: {TERMS.lastUpdatedISO}
              </Badge>
            </div>
            <p className='text-sm text-muted-foreground'>
              These Terms of Service govern your use of {TERMS.productName}
              {TERMS.websiteHost ? ` (${TERMS.websiteHost})` : ''}.
            </p>
          </CardHeader>

          <CardContent className='space-y-4 text-sm'>
            <div className='space-y-2'>
              <p>
                <span className='font-medium'>Important:</span> This is a
                general terms template and may not be sufficient for your
                specific legal requirements in {TERMS.jurisdiction}. You should
                review it and customize it (including dispute resolution,
                consumer rights, and required disclosures).
              </p>
              <p>
                Questions? Contact{' '}
                <a className='underline' href={`mailto:${TERMS.supportEmail}`}>
                  {TERMS.supportEmail}
                </a>
                .
              </p>
            </div>

            <Separator />

            <Accordion type='multiple' className='w-full'>
              <AccordionItem value='acceptance'>
                <AccordionTrigger>
                  1) Acceptance of these terms
                </AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    By accessing or using the service, you agree to these Terms.
                    If you do not agree, do not use the service.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='who-we-are'>
                <AccordionTrigger>2) Who we are</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    The service is operated by{' '}
                    <span className='font-medium'>{TERMS.operatorName}</span>.
                  </p>
                  <p>
                    Support contact:{' '}
                    <a
                      className='underline'
                      href={`mailto:${TERMS.supportEmail}`}>
                      {TERMS.supportEmail}
                    </a>
                    .
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='accounts'>
                <AccordionTrigger>
                  3) Accounts and authentication
                </AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    Some features require an account (for example: saving
                    profiles and viewing protected pages). You are responsible
                    for keeping your account secure and for activity that occurs
                    under your account.
                  </p>
                  <p>
                    Authentication is provided via Supabase; you may be asked to
                    sign in again if your session expires.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='acceptable-use'>
                <AccordionTrigger>4) Acceptable use</AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>You agree not to:</p>
                  <ul className='list-disc pl-5 space-y-1'>
                    <li>Use the service in violation of applicable law.</li>
                    <li>
                      Attempt to gain unauthorized access to accounts or
                      systems.
                    </li>
                    <li>
                      Interfere with or disrupt the service (including abuse of
                      uploads).
                    </li>
                    <li>
                      Upload malicious code or content designed to harm others.
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='uploads'>
                <AccordionTrigger>
                  5) Uploads and user content (telemetry)
                </AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    The service may allow you to upload CSV files (for example
                    RaceBox telemetry) to create sessions, laps, and telemetry
                    visualizations. You represent that you have the rights to
                    upload and use this data.
                  </p>
                  <p>
                    You are responsible for ensuring your uploaded data does not
                    violate privacy, confidentiality, or third-party rights (for
                    example, GPS traces that identify individuals).
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='availability'>
                <AccordionTrigger>6) Availability and changes</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    We may modify, suspend, or discontinue the service (in whole
                    or in part) at any time. We do not guarantee uninterrupted
                    availability.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='third-party'>
                <AccordionTrigger>7) Third-party services</AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    The service may rely on third-party services for hosting,
                    authentication, analytics, or maps (for example: Vercel,
                    Supabase, Google Maps). Your use of those services may be
                    subject to their own terms.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='ip'>
                <AccordionTrigger>8) Intellectual property</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    We and our licensors retain all rights in the service,
                    including software, design, and branding. These terms do not
                    grant you ownership rights.
                  </p>
                  <p>
                    You retain rights to your uploaded content, subject to the
                    license you grant us below.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='license'>
                <AccordionTrigger>
                  9) License to operate the service
                </AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    To operate the service, you grant us a limited,
                    non-exclusive, worldwide license to host, process, transmit,
                    and display your uploaded content solely for providing the
                    service to you.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='warranty'>
                <AccordionTrigger>10) Disclaimers</AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    The service is provided on an “as is” and “as available”
                    basis. To the extent permitted by law, we disclaim
                    warranties of merchantability, fitness for a particular
                    purpose, and non-infringement.
                  </p>
                  <p>
                    Racing telemetry and analytics are informational only and
                    may be inaccurate. Do not rely on the service for
                    safety-critical decisions.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='liability'>
                <AccordionTrigger>11) Limitation of liability</AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    To the extent permitted by law, we are not liable for
                    indirect, incidental, special, consequential, or punitive
                    damages, or any loss of profits, data, or goodwill.
                  </p>
                  <p>
                    <span className='font-medium'>Jurisdiction note:</span>{' '}
                    limitation language often requires tailoring for consumer
                    protection laws in {TERMS.jurisdiction}.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='termination'>
                <AccordionTrigger>12) Termination</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    You may stop using the service at any time. We may suspend
                    or terminate access if we reasonably believe you violated
                    these Terms or to protect the service and other users.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='privacy'>
                <AccordionTrigger>13) Privacy</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    Our collection and use of personal data is described in our
                    Privacy Policy.
                  </p>
                  <p>
                    Read the{' '}
                    <Link className='underline' href='/legal/privacy-policy'>
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='governing-law'>
                <AccordionTrigger>
                  14) Governing law and disputes
                </AccordionTrigger>
                <AccordionContent className='space-y-3'>
                  <p>
                    These Terms are governed by the laws of {TERMS.jurisdiction}
                    . Any dispute resolution clause should be customized for
                    your situation.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='changes'>
                <AccordionTrigger>15) Changes to these terms</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    We may update these Terms from time to time. We will post
                    the updated version on this page and update the “Last
                    updated” date.
                  </p>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value='contact'>
                <AccordionTrigger>16) Contact</AccordionTrigger>
                <AccordionContent className='space-y-2'>
                  <p>
                    Email:{' '}
                    <a
                      className='underline'
                      href={`mailto:${TERMS.supportEmail}`}>
                      {TERMS.supportEmail}
                    </a>
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
