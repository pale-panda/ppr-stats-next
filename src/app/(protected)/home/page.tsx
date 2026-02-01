import { HeroSection } from '@/components/hero-section';
import {
  StatsBarSkeleton,
  TrackSessionCardSkeleton,
  TrackSessionFilterSkeleton,
} from '@/components/skeletons';
import { StatsBar } from '@/components/stats-bar';
import { TrackSessionCards } from '@/components/track-session-cards';
import { TrackSessionFilter } from '@/components/track-session-filter';
import { PresenceList } from '@/components/presence-list';
import { getDashboardStats } from '@/services/dashboard-stats.service';
import { getSessions } from '@/services/sessions.service';
import { getAllTracks } from '@/services/tracks.service';
import type { SearchParams } from '@/types';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to your Pale Panda Racing Team dashboard',
  keywords: ['Pale Panda Racing Team', 'Home', 'Dashboard'],
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const stats = getDashboardStats(params);
  const sessions = getSessions(params);
  const tracks = getAllTracks();

  return (
    <>
      <HeroSection />
      <Suspense fallback={<StatsBarSkeleton />}>
        <StatsBar statItems={stats} type='dashboard' />
      </Suspense>

      <section className='container mx-auto px-4 py-6'>
        <PresenceList />
      </section>

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
}
