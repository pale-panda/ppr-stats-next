import {
  StatsBarSkeleton,
  TrackCardSkeleton,
  TrackSessionFilterSkeleton,
} from '@/components/skeletons';
import { StatsBarMini } from '@/components/stats-bar-mini';
import { TrackSessionFilter } from '@/components/track-session-filter';
import { TrackStatsCards } from '@/components/track-stats-cards';
import {
  getTrackDashboardStats,
  getAllTracks,
  getTracksWithStats,
} from '@/services/tracks.service';
import type { SearchParams } from '@/types';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Tracks',
  description:
    "Explore circuit information and your personal statistics for each track you've raced on with the Pale Panda Racing Team",
  keywords: ['Pale Panda Racing Team', 'Tracks', 'Stats'],
};

export default async function TracksPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tracks = getAllTracks();
  const tracksWithStats = getTracksWithStats(params);
  const stats = getTrackDashboardStats(params);

  return (
    <>
      {/* Hero Section */}
      <section className='relative h-64 md:h-80'>
        <Image
          src='/spa-francorchamps-race-track-aerial-view.jpg'
          alt='Track Hero Image'
          width={1200}
          height={500}
          className='absolute inset-0 w-full h-full object-cover'
        />

        <div className='absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 p-6'>
          <div className='container mx-auto px-4'>
            <div className='max-w-2xl gap-3 mb-4'>
              <h1 className='text-4xl font-bold text-foreground mb-4 text-balance'>
                Tracks
              </h1>
              <p className='text-lg text-muted-foreground leading-relaxed'>
                Explore circuit information, your personal statistics, and
                performance data for each track you&apos;ve raced on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Track Stats Overview */}
      <Suspense fallback={<StatsBarSkeleton />}>
        <StatsBarMini statItems={stats} type='dashboard' />
      </Suspense>

      {/* Tracks Grid */}
      <section className='container mx-auto px-4 py-8'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8'>
          <p className='text-muted-foreground mt-1'>
            Select a track to view detailed analytics
          </p>
          <Suspense fallback={<TrackSessionFilterSkeleton />}>
            <TrackSessionFilter tracks={tracks} />
          </Suspense>
        </div>

        <Suspense fallback={<TrackCardSkeleton />}>
          <TrackStatsCards trackStats={tracksWithStats} />
        </Suspense>
      </section>
    </>
  );
}
