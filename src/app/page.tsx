import { HeroSection } from '@/components/hero-section';
import { StatsBar } from '@/components/stats-bar';
import { createAppStats } from '@/lib/create-stats-items';

export default async function HomePage() {
  const stats = await createAppStats();

  return (
    <>
      <HeroSection />
      <StatsBar statItems={stats} type='app' />

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
        </div>
        <div>
          <h3>Data</h3>
        </div>
      </section>
    </>
  );
}
