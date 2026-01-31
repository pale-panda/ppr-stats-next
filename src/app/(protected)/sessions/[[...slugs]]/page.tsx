import { HeroSection } from '@/components/hero-section';
import { SectionSessionTrack } from '@/components/section-session-track';
import {
  StatsBarSkeleton,
  TrackSessionCardSkeleton,
  TrackSessionFilterSkeleton,
} from '@/components/skeletons';
import { StatsBar } from '@/components/stats-bar';
import { TrackSessionCards } from '@/components/track-session-cards';
import TrackSessionDetails from '@/components/track-session-details';
import { TrackSessionFilter } from '@/components/track-session-filter';
import TrackSessionHero from '@/components/track-session-hero';
import TrackSessionLapTimesTable from '@/components/track-session-laptimes-table';
import TrackSessionStats from '@/components/track-session-stats';
import TrackSessionTopSection from '@/components/track-session-top-section';
import { SessionComments } from '@/components/session-comments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardStats } from '@/services/dashboard-stats.service';
import { getSessionByIdFull, getSessions } from '@/services/sessions.service';
import { getTrackSessionsBySlug } from '@/services/slug.service';
import { getTrackBySlug, getTracks } from '@/services/tracks.service';
import type { RouteState } from '@/types/slug.type';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { AppBreadcrumb } from '@/components/app-breadcrumb';
import { breadcrumbLinks } from '@/lib/data/breadcrumb-links';

export async function generateMetadata(
  props: PageProps<'/sessions/[[...slugs]]'>,
): Promise<Metadata> {
  const { slugs } = await props.params;
  const state = parseSlug(slugs);

  const description = {
    description:
      'View detailed information about a specific Pale Panda Racing Team session',
    keywords: ['Pale Panda Racing Team', 'Session', 'Details'],
  };

  if (state.kind === 'index') {
    return { title: 'Sessions', ...description };
  }

  const track = await getTrackBySlug(state.slug);
  if (!track) return { title: 'Sessions – Unknown Track', ...description };

  if (state.kind === 'track') {
    return { title: `Sessions – ${track.name}`, ...description };
  }

  if (state.kind === 'year') {
    return {
      title: `Sessions – ${track.name} – ${state.year}`,
      ...description,
    };
  }

  return {
    title: `Session – ${track.name} – ${state.year} – Details`,
    ...description,
  };
}

function parseSlug(params?: string[]): RouteState {
  if (!params || params.length === 0) {
    return { kind: 'index' };
  }

  if (params.length > 3) notFound();

  const [slug, year, sessionId] = params;

  if (params.length === 1) {
    return { kind: 'track', slug: slug! };
  }

  const isValidYear = /^(19|20)\d{2}$/.test(year);

  if (!isValidYear) notFound();
  if (params.length === 2) {
    return { kind: 'year', slug: slug!, year: year! };
  }

  if (!sessionId) notFound();

  return {
    kind: 'session',
    slug: slug!,
    year: year!,
    sessionId: sessionId!,
  };
}

export default async function SessionPage(
  props: PageProps<'/sessions/[[...slugs]]'>,
) {
  const { slugs } = await props.params;
  const params = await props.searchParams;

  const state = parseSlug(slugs);

  const stats = getDashboardStats(params);
  const sessions = getSessions(params);
  const tracks = getTracks({});

  switch (state.kind) {
    case 'index':
      return (
        <>
          <HeroSection />
          <Suspense fallback={<StatsBarSkeleton />}>
            <StatsBar statItems={stats} type='dashboard' />
          </Suspense>

          {/* Sessions Section */}
          <section className='container mx-auto px-4 py-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8'>
              <div>
                <h2 className='text-2xl md:text-3xl font-bold text-foreground'>
                  Your Sessions
                </h2>
                <p className='text-muted-foreground mt-1'>
                  Select a session to view detailed analytics
                </p>
              </div>
              <Suspense fallback={<TrackSessionFilterSkeleton />}>
                <TrackSessionFilter tracks={tracks} />
              </Suspense>
            </div>
            <Suspense fallback={<TrackSessionCardSkeleton />}>
              <TrackSessionCards sessions={sessions} />
            </Suspense>
          </section>
        </>
      );
    case 'track':
      const sessionsBySlug = getTrackSessionsBySlug(state);

      return (
        <section className='container mx-auto px-4 py-8'>
          <AppBreadcrumb {...breadcrumbLinks} />
          <h1 className='text-3xl font-bold mb-4'>Sessions @ {state.slug}</h1>
          <Suspense fallback={<TrackSessionCardSkeleton />}>
            <SectionSessionTrack sessions={sessionsBySlug} />
          </Suspense>
        </section>
      );

    case 'year':
      const sessionsBySlugYear = getTrackSessionsBySlug(state);
      return (
        <section className='container mx-auto px-4 py-8'>
          <AppBreadcrumb {...breadcrumbLinks} />
          <h1 className='text-3xl font-bold mb-4'>
            Sessions @ {state.slug} – {state.year}
          </h1>
          <Suspense fallback={<TrackSessionCardSkeleton />}>
            <SectionSessionTrack sessions={sessionsBySlugYear} />
          </Suspense>
        </section>
      );

    case 'session':
      const session = getSessionByIdFull(state.sessionId);
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
              <Suspense
                fallback={
                  <h1>
                    {/* TODO: Create and replace with skeleton! */}
                    Loading...
                  </h1>
                }>
                <TrackSessionTopSection session={session} />
              </Suspense>
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
                  <CardTitle className='text-foreground'>
                    Session Details
                  </CardTitle>
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

            <div className='mt-8'>
              <SessionComments sessionId={state.sessionId} />
            </div>
          </div>
        </>
      );
    default:
      notFound();
  }
}

/*
        <>
          <HeroSection />
          <Suspense fallback={<StatsBarSkeleton />}>
            <StatsBar statItems={stats} type='dashboard' />
          </Suspense>

          {/* Sessions Section * / }

          <section className='container mx-auto px-4 py-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8'>
              <div>
                <h2 className='text-2xl md:text-3xl font-bold text-foreground'>
                  Your Sessions - {state.slug}
                </h2>
                <p className='text-muted-foreground mt-1'>
                  Select a session to view detailed analytics
                </p>
              </div>
              <Suspense fallback={<TrackSessionFilterSkeleton />}>
                <TrackSessionFilter tracks={tracks} />
              </Suspense>
            </div>
            <Suspense fallback={<TrackSessionCardSkeleton />}>
              <TrackSessionCards sessions={sessions} />
            </Suspense>
          </section>
        </>
         */
