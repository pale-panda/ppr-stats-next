import TrackSessionDetails from '@/components/track-session-details';
import TrackSessionHero from '@/components/track-session-hero';
import TrackSessionLapTimesTable from '@/components/track-session-laptimes-table';
import TrackSessionStats from '@/components/track-session-stats';
import TrackSessionTopSection from '@/components/track-session-top-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSessionByIdFull } from '@/services/sessions.service';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Session Details',
  description:
    'View detailed information about a specific Pale Panda Racing Team session',
  keywords: ['Pale Panda Racing Team', 'Session', 'Details'],
};

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const session = getSessionByIdFull(id);

  return (
    <>
      {/* Hero Section */}
      <div className='relative h-64 md:h-80 overflow-hidden'>
        <Suspense
          fallback={
            <h1>
              {/* TODO: Create and replace with skeleton! */}
              Loading...
            </h1>
          }>
          <TrackSessionHero session={session} />
        </Suspense>
        <div className='absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent' />
        <div className='absolute inset-0 flex items-end'>
          <div className='container mx-auto px-4 pb-6'>
            <Link
              href='/sessions'
              className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors'>
              <ArrowLeft className='w-4 h-4' />
              Back to Sessions
            </Link>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
              <Suspense
                fallback={
                  <h1>
                    {/* TODO: Create and replace with skeleton! */}
                    Loading...
                  </h1>
                }>
                <TrackSessionTopSection session={session} />
              </Suspense>
              <Button className='bg-primary hover:bg-primary/90 w-fit' asChild>
                <Link href={`${id}/dashboard`}>
                  <BarChart3 className='w-4 h-4 mr-2' />
                  Open Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        {/* Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8'>
          <Suspense
            fallback={
              <h1>
                {/* TODO: Create and replace with skeleton! */}
                Loading...
              </h1>
            }>
            <TrackSessionStats session={session} />
          </Suspense>
        </div>
        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Lap Times Table */}
          <Card className='lg:col-span-2 bg-card border-border/50'>
            <CardHeader>
              <CardTitle className='text-foreground'>Lap Times</CardTitle>
            </CardHeader>
            <CardContent>
              <TrackSessionLapTimesTable session={session} />
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card className='bg-card border-border/50'>
            <CardHeader>
              <CardTitle className='text-foreground'>Session Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Suspense
                fallback={
                  <h1>
                    {/* TODO: Create and replace with skeleton! */}
                    Loading...
                  </h1>
                }>
                <TrackSessionDetails session={session} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
