import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  getAllTracks,
  getTrackSessionsByTrackId,
} from '@/lib/data/track-session.data';
import { formatLapTime, formatSpeed } from '@/lib/format-utils';
import {
  MapPin,
  Route,
  CornerDownRight,
  Timer,
  Gauge,
  Flag,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { Laps } from '@/types';
import { AppImage } from '@/components/app-image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tracks',
  description:
    "Explore circuit information and your personal statistics for each track you've raced on with the Pale Panda Racing Team",
  keywords: ['Pale Panda Racing Team', 'Tracks', 'Stats'],
};

export default async function TracksPage() {
  const tracks = await getAllTracks();

  const tracksWithStats = await Promise.all(
    tracks.map(async (track) => {
      const sessions = await getTrackSessionsByTrackId(track.id);
      const totalLaps = sessions.reduce((sum, s) => sum + s.total_laps, 0);
      const allLaps = sessions.flatMap((s) => s.laps) as Laps;
      const bestLapTime =
        allLaps.length > 0
          ? Math.min(...allLaps.map((l) => l.lap_time_seconds))
          : null;
      const avgTopSpeed =
        allLaps.length > 0
          ? Math.round(
              allLaps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) /
                allLaps.length
            )
          : null;

      return {
        ...track,
        ImageComponent: (
          <AppImage
            src={
              `${process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL}${track.image_url}` ||
              '/placeholder.svg'
            }
            className='absolute inset-0 w-full h-full object-cover 100vh'
            alt={track.name}
            width={400}
            height={300}
          />
        ),
        stats: {
          totalSessions: sessions.length,
          totalLaps,
          bestLapTime,
          avgTopSpeed,
        },
      };
    })
  );

  const totalTracks = tracks.length;
  const totalSessions = tracksWithStats.reduce(
    (sum, t) => sum + t.stats.totalSessions,
    0
  );
  const totalLaps = tracksWithStats.reduce(
    (sum, t) => sum + t.stats.totalLaps,
    0
  );
  const combinedLength = Math.round(
    tracks.reduce((sum, t) => sum + (t.length_meters || 0), 0) / 1000
  );

  return (
    <>
      {/* Hero Section */}
      <section className='relative h-64 md:h-80'>
        <AppImage
          src='/spa-francorchamps-race-track-aerial-view.jpg'
          alt='Track Hero Image'
          width={1200}
          height={500}
          className='absolute inset-0 w-full h-full object-fill'
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
      <section className='py-8 border-b border-border bg-card/50'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <p className='text-3xl font-bold text-foreground'>
                {totalTracks}
              </p>
              <p className='text-sm text-muted-foreground'>Total Tracks</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-primary'>{totalSessions}</p>
              <p className='text-sm text-muted-foreground'>Total Sessions</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-foreground'>{totalLaps}</p>
              <p className='text-sm text-muted-foreground'>Total Laps</p>
            </div>
            <div className='text-center'>
              <p className='text-3xl font-bold text-foreground'>
                {combinedLength} km
              </p>
              <p className='text-sm text-muted-foreground'>Combined Length</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tracks Grid */}
      <section className='py-6'>
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
                      {track.ImageComponent}
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
                        <Link href={`/tracks/${track.id}`}>
                          <Button
                            variant='outline'
                            className='border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent'>
                            View Details
                          </Button>
                        </Link>
                      </div>

                      {/* Track Specs */}
                      <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 pb-6 border-b border-border'>
                        <div className='flex items-center gap-2'>
                          <Route className='w-4 h-4 text-primary' />
                          <div>
                            <p className='text-xs text-muted-foreground'>
                              Length
                            </p>
                            <p className='text-sm font-semibold text-foreground'>
                              {track?.length_meters
                                ? `${(track.length_meters / 1000).toFixed(
                                    2
                                  )} km`
                                : 'N/A'}
                            </p>
                          </div>
                        </div>
                        {track.turns && (
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
        </div>
      </section>
    </>
  );
}
