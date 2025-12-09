import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { StatsBar } from '@/components/stats-bar';
import { SessionCard } from '@/components/session-card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Filter } from 'lucide-react';
import { Footer } from '@/components/footer';

const sessions = [
  {
    id: '1',
    title: 'Qualifying Session',
    track: 'Spa-Francorchamps',
    date: 'Dec 7, 2025',
    duration: '45:23',
    laps: 18,
    bestLap: '1:42.847',
    status: 'completed' as const,
    imageUrl: '/spa-francorchamps-race-track-aerial-view.jpg',
  },
  {
    id: '2',
    title: 'Practice Run 3',
    track: 'Nürburgring GP',
    date: 'Dec 5, 2025',
    duration: '32:15',
    laps: 12,
    bestLap: '1:31.204',
    status: 'completed' as const,
    imageUrl: '/nurburgring-race-track-sunset.png',
  },
  {
    id: '3',
    title: 'Endurance Test',
    track: 'Silverstone Circuit',
    date: 'Dec 3, 2025',
    duration: '1:24:45',
    laps: 42,
    bestLap: '1:58.331',
    status: 'completed' as const,
    imageUrl: '/silverstone-circuit-racing-aerial.jpg',
  },
  {
    id: '4',
    title: 'Morning Session',
    track: 'Monza Circuit',
    date: 'Dec 10, 2025',
    duration: '--:--',
    laps: 0,
    bestLap: '--:--.---',
    status: 'upcoming' as const,
    imageUrl: '/monza-circuit-italy-racing.png',
  },
  {
    id: '5',
    title: 'Live Qualifying',
    track: 'Circuit de Barcelona',
    date: 'Live Now',
    duration: '23:45',
    laps: 8,
    bestLap: '1:19.547',
    status: 'live' as const,
    imageUrl: '/barcelona-circuit-spain-racing.png',
  },
  {
    id: '6',
    title: 'Race Simulation',
    track: 'Suzuka Circuit',
    date: 'Nov 28, 2025',
    duration: '1:45:12',
    laps: 53,
    bestLap: '1:32.891',
    status: 'completed' as const,
    imageUrl: '/suzuka-circuit-japan-racing-aerial.png',
  },
];

export default function HomePage() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />
      <HeroSection />
      <StatsBar />

      {/* Sessions Section */}
      <section className='container mx-auto px-4 py-12'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8'>
          <div>
            <h2 className='text-2xl md:text-3xl font-bold text-foreground'>
              Your Sessions
            </h2>
            <p className='text-muted-foreground mt-1'>
              Select a session to view detailed analytics
            </p>
          </div>
          <div className='flex gap-2'>
            <Button variant='outline' size='sm'>
              <Filter className='w-4 h-4 mr-2' />
              Filter
            </Button>
            <Button variant='ghost' size='sm' className='text-primary'>
              View All
              <ChevronRight className='w-4 h-4 ml-1' />
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {sessions.map((session) => (
            <SessionCard key={session.id} {...session} />
          ))}
        </div>
      </section>
    </div>
  );
}
