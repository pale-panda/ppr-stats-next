import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { Clock, Flag, Zap, Gauge } from 'lucide-react';
import { getDashboardStats, getAllTracks } from '@/lib/data/track-session.data';
import { formatLapTime, formatSpeed } from '@/lib/format-utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrackSessionCards } from '@/components/track-session-cards';
import { ReduxWrapper } from '@/components/redux-wrapper';
import { Suspense } from 'react';
import { TrackSessionFilter } from '@/components/track-session-filter';

export default async function HomePage(props: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const stats = await getDashboardStats();
  const tracks = await getAllTracks();

  const url = `/api/sessions?page=${currentPage}`;

  return (
    <ReduxWrapper>
      <div className='min-h-screen bg-background'>
        <Header />
        <HeroSection />

        <section className='py-8 border-b border-border bg-card/50'>
          <div className='container mx-auto px-4'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <Card className='bg-card border-border/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                        Best Lap
                      </p>
                      <p className='text-2xl font-mono font-bold text-primary mt-1'>
                        {stats.bestLapTime
                          ? formatLapTime(stats.bestLapTime)
                          : '--:--.---'}
                      </p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                      <Zap className='w-5 h-5 text-primary' />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-card border-border/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                        Top Speed
                      </p>
                      <p className='text-2xl font-mono font-bold text-foreground mt-1'>
                        {stats.topSpeed
                          ? formatSpeed(stats.topSpeed, {
                              component: (
                                <span className='text-sm text-muted-foreground ml-1'>
                                  km/h
                                </span>
                              ),
                            })
                          : '--'}
                      </p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center'>
                      <Gauge className='w-5 h-5 text-chart-2' />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-card border-border/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                        Sessions
                      </p>
                      <p className='text-2xl font-mono font-bold text-foreground mt-1'>
                        {stats.totalSessions}
                      </p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center'>
                      <Clock className='w-5 h-5 text-chart-3' />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-card border-border/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                        Total Laps
                      </p>
                      <p className='text-2xl font-mono font-bold text-foreground mt-1'>
                        {stats.totalLaps}
                      </p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center'>
                      <Flag className='w-5 h-5 text-chart-4' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Sessions Section */}
        <section className='container mx-auto px-4 py-6'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
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
        </section>
        <section className='container mx-auto px-4 py-6'>
          <Suspense
            key={query + currentPage}
            fallback={<div>Loading sessions...</div>}>
            <TrackSessionCards query={query} currentPage={currentPage} />
          </Suspense>
        </section>
      </div>
    </ReduxWrapper>
  );
}
