import { HeroSection } from '@/components/hero-section';
import { StatsBarSkeleton } from '@/components/skeletons';
import { StatsBar } from '@/components/stats-bar';
import { TrackSessionCards } from '@/components/track-session-cards';
import { TrackSessionFilter } from '@/components/track-session-filter';
import { createDashboardStats } from '@/lib/create-stats-items';
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
  searchParams: Promise<{
    [key: string]: string | string[];
  }>;
}) {
  const params = await searchParams;
  const stats = createDashboardStats(params);

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
          <TrackSessionFilter />
        </div>
        <TrackSessionCards />
      </section>
    </>
  );
}
