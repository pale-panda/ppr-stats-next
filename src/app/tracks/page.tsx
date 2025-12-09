import { Header } from '@/components/header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { tracksData, getTrackStats } from '@/lib/tracks-data';
import {
  MapPin,
  Route,
  CornerDownRight,
  Timer,
  Gauge,
  Flag,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function TracksPage() {
  return (
    <div className='min-h-screen bg-background'>
      <Header />

      {/* Hero Section */}
      <section className='relative py-16 border-b border-border'>
        <div className='container mx-auto px-4'>
          <div className='max-w-2xl'>
            <h1 className='text-4xl font-bold text-foreground mb-4 text-balance'>
              Tracks
            </h1>
            <p className='text-lg text-muted-foreground leading-relaxed'>
              Explore circuit information, your personal statistics, and
              performance data for each track you've raced on.
            </p>
          </div>
        </div>
      </section>

      {/* Track Stats Overview */}
      <section className='py-8 border-b border-border bg-card/50'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <p className='text-3xl font-bold text-foreground'>
                {tracksData.length}
              </p>
              <p className='text-sm text-muted-foreground'>Total Tracks</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-primary'>
                {tracksData.reduce(
                  (sum, t) => sum + (getTrackStats(t.id)?.totalSessions || 0),
                  0
                )}
              </p>
              <p className='text-sm text-muted-foreground'>Total Sessions</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-foreground'>
                {tracksData.reduce(
                  (sum, t) => sum + (getTrackStats(t.id)?.totalLaps || 0),
                  0
                )}
              </p>
              <p className='text-sm text-muted-foreground'>Total Laps</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-foreground'>
                {Math.round(tracksData.reduce((sum, t) => sum + t.length, 0))}{' '}
                km
              </p>
              <p className='text-sm text-muted-foreground'>Combined Length</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Grid */}
      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid gap-6'>
            {tracksData.map((track) => {
              const stats = getTrackStats(track.id);
              return (
                <Card
                  key={track.id}
                  className='overflow-hidden bg-card border-border hover:border-primary/50 transition-colors'>
                  <div className='grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr]'>
                    {/* Track Image */}
                    <div className='relative h-48 md:h-auto'>
                      <Image
                        src={track.imageUrl || '/placeholder.svg'}
                        alt={track.name}
                        fill
                        className='object-cover'
                      />
                      <div className='absolute inset-0 bg-linear-to-r from-transparent to-card/80 hidden md:block' />
                      <div className='absolute top-4 left-4'>
                        <Badge
                          variant='secondary'
                          className='bg-background/80 backdrop-blur-sm'>
                          {track.type === 'permanent' ? 'Permanent' : 'Street'}
                        </Badge>
                      </div>
                    </div>

                    {/* Track Info */}
                    <div className='p-6'>
                      <div className='flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6'>
                        <div>
                          <div className='flex items-center gap-2 mb-1'>
                            <h2 className='text-2xl font-bold text-foreground'>
                              {track.name}
                            </h2>
                          </div>
                          <div className='flex items-center gap-1 text-muted-foreground'>
                            <MapPin className='w-4 h-4' />
                            <span>{track.country}</span>
                          </div>
                        </div>
                        <Link href={`/tracks/${track.id}`}>
                          <Button
                            variant='outline'
                            className='border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent'>
                            View Details
                          </Button>
                        </Link>
                      </div>

                      <p className='text-muted-foreground text-sm mb-6 line-clamp-2'>
                        {track.description}
                      </p>

                      {/* Track Specs */}
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-border'>
                        <div className='flex items-center gap-2'>
                          <Route className='w-4 h-4 text-primary' />
                          <div>
                            <p className='text-xs text-muted-foreground'>
                              Length
                            </p>
                            <p className='text-sm font-semibold text-foreground'>
                              {track.length} km
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <CornerDownRight className='w-4 h-4 text-primary' />
                          <div>
                            <p className='text-xs text-muted-foreground'>
                              Turns
                            </p>
                            <p className='text-sm font-semibold text-foreground'>
                              {track.turns}
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <TrendingUp className='w-4 h-4 text-primary' />
                          <div>
                            <p className='text-xs text-muted-foreground'>
                              Longest Straight
                            </p>
                            <p className='text-sm font-semibold text-foreground'>
                              {track.longestStraight}m
                            </p>
                          </div>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Flag className='w-4 h-4 text-primary' />
                          <div>
                            <p className='text-xs text-muted-foreground'>
                              Lap Record
                            </p>
                            <p className='text-sm font-semibold text-foreground'>
                              {track.lapRecord}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Personal Stats */}
                      <div>
                        <p className='text-xs text-muted-foreground uppercase tracking-wider mb-3'>
                          Your Stats
                        </p>
                        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                          <div className='bg-secondary/50 rounded-md p-3'>
                            <div className='flex items-center gap-2 mb-1'>
                              <Calendar className='w-3 h-3 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                Sessions
                              </span>
                            </div>
                            <p className='text-lg font-bold text-foreground'>
                              {stats?.totalSessions || 0}
                            </p>
                          </div>
                          <div className='bg-secondary/50 rounded-md p-3'>
                            <div className='flex items-center gap-2 mb-1'>
                              <Flag className='w-3 h-3 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                Laps
                              </span>
                            </div>
                            <p className='text-lg font-bold text-foreground'>
                              {stats?.totalLaps || 0}
                            </p>
                          </div>
                          <div className='bg-secondary/50 rounded-md p-3'>
                            <div className='flex items-center gap-2 mb-1'>
                              <Timer className='w-3 h-3 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                Best Lap
                              </span>
                            </div>
                            <p className='text-lg font-bold text-primary'>
                              {stats?.bestLapTime || '--:--.---'}
                            </p>
                          </div>
                          <div className='bg-secondary/50 rounded-md p-3'>
                            <div className='flex items-center gap-2 mb-1'>
                              <Gauge className='w-3 h-3 text-muted-foreground' />
                              <span className='text-xs text-muted-foreground'>
                                Avg Top Speed
                              </span>
                            </div>
                            <p className='text-lg font-bold text-foreground'>
                              {stats?.avgTopSpeed
                                ? `${stats.avgTopSpeed} km/h`
                                : '--'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
