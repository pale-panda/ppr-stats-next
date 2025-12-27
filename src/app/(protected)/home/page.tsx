import { HeroSection } from '@/components/hero-section';
import { TrackSessionCards } from '@/components/track-session-cards';
import { TrackSessionFilter } from '@/components/track-session-filter';
import { StatsBar } from '@/components/stats-bar';
import { createDashboardStats } from '@/lib/create-stats-items';

export default async function HomePage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const stats = await createDashboardStats();
  

  return (
    <>
      <HeroSection />
      <StatsBar statItems={stats} type='dashboard' />

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
        <TrackSessionCards query={query} />
      </section>
    </>
  );
}
