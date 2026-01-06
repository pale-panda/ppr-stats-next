import { HeroSection } from '@/components/hero-section';
import { SectionSessionDetails } from '@/components/section-session-details';
import { SectionSessionTrack } from '@/components/section-session-track';
import {
  StatsBarSkeleton,
  TrackSessionCardSkeleton,
  TrackSessionFilterSkeleton,
} from '@/components/skeletons';
import { StatsBar } from '@/components/stats-bar';
import { TrackSessionCards } from '@/components/track-session-cards';
import { TrackSessionFilter } from '@/components/track-session-filter';
import { getDashboardStats } from '@/services/dashboard-stats.service';
import { getSessionByIdFull, getSessions } from '@/services/sessions.service';
import { getTrackSessionsBySlug } from '@/services/slug.service';
import { getTrackBySlug, getTracks } from '@/services/tracks.service';
import type { RouteState } from '@/types/slug.type';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';



export async function generateMetadata(
  props: PageProps<'/sessions/[[...slugs]]'>
): Promise<Metadata> {
  const { slugs } = await props.params;
  const state = parseSlug(slugs);

  const description = {
    description:
    'View detailed information about a specific Pale Panda Racing Team session',
    keywords: ['Pale Panda Racing Team', 'Session', 'Details'],
  }

  if (state.kind === 'index') {
    return { title: 'Sessions', ...description };
  }

  const track = await getTrackBySlug(state.slug);
  if (!track) return { title: 'Sessions – Unknown Track', ...description };

  if (state.kind === 'track') {
    return { title: `Sessions – ${track.name}`, ...description };
  }

  if (state.kind === 'year') {
    return { title: `Sessions – ${track.name} – ${state.year}`, ...description  };
  }

  return {
    title: `Session – ${track.name} – ${state.year} – Details`, ...description
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

  const isValidYM = /^\d{4}(0[1-9]|1[0-2])$/.test(year);
  if (!isValidYM) notFound();
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

/*
function monthRangeUTC(yearMonth: string) {
  const [yStr, mStr] = yearMonth.split('-');
  const y = Number(yStr);
  const m = Number(mStr); // 1-12
  const from = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const to = new Date(Date.UTC(y, m, 1, 0, 0, 0)); // nästa månad
  return { from: from.toISOString(), to: to.toISOString() };
}
*/

export default async function SessionPage(
  props: PageProps<'/sessions/[[...slugs]]'>
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
        <Suspense fallback={<TrackSessionCardSkeleton />}>
          <SectionSessionTrack sessions={sessionsBySlug} />
        </Suspense>
      );

    case 'year':
      notFound();
    case 'session':
      const session = getSessionByIdFull(state.sessionId);
      return (
        <Suspense fallback={<div>Loading session details...</div>}>
          <SectionSessionDetails session={session} />
        </Suspense>
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
