import { DashboardAnalysis } from '@/components/dashboard-analysis';
import { DashboardHeader } from '@/components/dashboard-header';
import { DashboardOverview } from '@/components/dashboard-overview';
import { TelemetryPanel } from '@/components/telemetry-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getSessionByIdFull } from '@/services/sessions.service';
import { getTrackBySlug } from '@/services/tracks.service';
import type { RouteState } from '@/types/slug.type';
import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

export async function generateMetadata(
  props: PageProps<'/dashboard/[[...slugs]]'>
): Promise<Metadata> {
  const { slugs } = await props.params;
  const state = parseSlug(slugs);

  const description = {
    description: 'Welcome to your Pale Panda Racing Team dashboard',
    keywords: ['Pale Panda Racing Team', 'Dashboard'],
  };

  if (state.kind === 'index') {
    return { title: 'Dashboard', ...description };
  }

  const track = await getTrackBySlug(state.slug);
  if (!track) return { title: 'Dashboard – Unknown Track', ...description };

  if (state.kind === 'track') {
    return { title: `Dashboard – ${track.name}`, ...description };
  }

  if (state.kind === 'year') {
    return {
      title: `Dashboard – ${track.name} – ${state.year}`,
      ...description,
    };
  }

  return {
    title: `Dashboard – ${track.name} – ${state.year} – Details`,
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

export default async function DashboardPage(
  props: PageProps<'/dashboard/[[...slugs]]'>
) {
  const { slugs } = await props.params;
  const state = parseSlug(slugs);

  switch (state.kind) {
    case 'index':
      return redirect('/sessions');
    case 'track':
      return redirect('/sessions');
    case 'year':
      return redirect('/sessions');

    case 'session':
      const session = getSessionByIdFull(state.sessionId);
      return (
        <>
          {/* Dashboard Header */}
          <Suspense
            fallback={<div>{/** TODO: Implement skeleton! */}Loading...</div>}>
            <DashboardHeader trackSession={session} />
          </Suspense>
          <div className='container mx-auto px-4 py-6'>
            <Tabs defaultValue='overview' className='space-y-6'>
              <TabsList className='bg-card border border-border'>
                <TabsTrigger value='overview'>Overview</TabsTrigger>
                <TabsTrigger value='telemetry'>Telemetry</TabsTrigger>
                <TabsTrigger value='analysis'>Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value='overview' className='space-y-6'>
                <Suspense
                  fallback={
                    <div>{/** TODO: Implement skeleton! */}Loading...</div>
                  }>
                  <DashboardOverview trackSession={session} />
                </Suspense>
              </TabsContent>

              <TabsContent value='telemetry'>
                <Suspense
                  fallback={
                    <div>{/** TODO: Implement skeleton! */}Loading...</div>
                  }>
                  <TelemetryPanel trackSession={session} />
                </Suspense>
              </TabsContent>

              <TabsContent value='analysis'>
                <Suspense
                  fallback={
                    <div>{/** TODO: Implement skeleton! */}Loading...</div>
                  }>
                  <DashboardAnalysis trackSession={session} />
                </Suspense>
              </TabsContent>
            </Tabs>
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
