import { FeaturesSection } from '@/components/features-section';
import { HeroSection } from '@/components/hero-section';
import { StatsBarSkeleton } from '@/components/skeletons';
import { StatsBar } from '@/components/stats-bar';
import { getAppStats } from '@/services/app-stats.service';
import { Suspense } from 'react';

export default function HomePage() {
  const stats = getAppStats();

  return (
    <>
      <HeroSection />

      <Suspense fallback={<StatsBarSkeleton />}>
        <StatsBar statItems={stats} type='app' />
      </Suspense>

      {/* Welcome / Overview Section */}
      <section className='container mx-auto px-4 py-10 md:py-14'>
        <FeaturesSection />
      </section>
    </>
  );
}
