'use client';
import { PageSizeSelector } from '@/components/page-size-selector';
import { TrackSessionPagination } from '@/components/track-session-pagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { QueryOptions } from '@/db/types/db.types';
import { formatLapTime, formatSpeed } from '@/lib/format-utils';
import type { TrackApp } from '@/types';
import {
  Calendar,
  ChevronRight,
  CornerDownRight,
  Flag,
  Gauge,
  MapPin,
  Route,
  Timer,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';

interface TrackCardProps {
  trackCardsData: Promise<{
    data: (TrackApp & {
      stats: {
        totalSessions: number;
        totalLaps: number;
        bestLapTime: number | null;
        avgTopSpeed: number | null;
      };
    })[];
    meta: QueryOptions;
  }>;
}

export function TrackCards({ ...props }: TrackCardProps) {
  const searchParams = useSearchParams();
  const { data: tracksWithStats, meta } = use(props.trackCardsData);

  console.log('meta: ', meta);

  return (
    <div className='container mx-auto px-4'>
      {tracksWithStats.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-muted-foreground'>
            No tracks found. Upload sessions to see tracks!
          </p>
        </div>
      ) : (
        <div className='grid gap-6'>
          {tracksWithStats.map((track) => (
            <Card
              key={track.id}
              className='overflow-hidden bg-card border-border py-0 hover:border-primary/50 transition-colors'>
              <div className='grid md:grid-cols-[300px_1fr] lg:grid-cols-[400px_1fr]'>
                {/* Track Image */}
                <div className='relative h-48 md:h-auto'>
                  <Image
                    src={track.imageUrl || '/placeholder.svg'}
                    className='absolute inset-0 w-full h-full object-cover 100vh'
                    alt={track.name}
                    width={400}
                    height={300}
                    unoptimized
                  />
                  <div className='absolute inset-0 bg-linear-to-r from-transparent to-card/80 hidden md:block' />
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
                    <div className='flex gap-2'>
                      <Button
                        variant='outline'
                        className='flex-1 bg-transparent text-foreground'
                        asChild>
                        <Link href={`/tracks/${track.id}`}>View Details</Link>
                      </Button>
                      <Button
                        className='flex-1 bg-primary hover:bg-primary/90'
                        asChild>
                        <Link href={`/tracks/${track.id}/analytics`}>
                          Open Analytics
                          <ChevronRight className='w-4 h-4 ml-1' />
                        </Link>
                      </Button>
                    </div>
                  </div>

                  {/* Track Specs */}
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-border'>
                    <div className='flex items-center gap-2'>
                      <Route className='w-4 h-4 text-primary' />
                      <div>
                        <p className='text-xs text-muted-foreground'>Length</p>
                        <p className='text-sm font-semibold text-foreground'>
                          {track?.lengthMeters
                            ? `${(track.lengthMeters / 1000).toFixed(2)} km`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {track.turns && (
                      <div className='flex items-center gap-2'>
                        <CornerDownRight className='w-4 h-4 text-primary' />
                        <div>
                          <p className='text-xs text-muted-foreground'>Turns</p>
                          <p className='text-sm font-semibold text-foreground'>
                            {track.turns}
                          </p>
                        </div>
                      </div>
                    )}
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
                          {track.stats.totalSessions}
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
                          {track.stats.totalLaps}
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
                          {track.stats.bestLapTime
                            ? formatLapTime(track.stats.bestLapTime)
                            : '--:--:---'}
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
                          {track.stats.avgTopSpeed
                            ? formatSpeed(track.stats.avgTopSpeed)
                            : '--'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      <div className='flex flex-col gap-4 md:flex-row py-6'>
        <div className={'w-50 flex-none hidden md:block'} />
        <TrackSessionPagination meta={meta} searchParams={searchParams} />
        <PageSizeSelector meta={meta} searchParams={searchParams} />
      </div>
    </div>
  );
}
