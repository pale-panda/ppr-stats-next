import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getTrackById,
  getTrackSessionsByTrackId,
} from '@/lib/data/track-session.data';
import {
  formatLapTime,
  formatSessionDate,
  formatTrackLength,
} from '@/lib/format-utils';
import {
  MapPin,
  Route,
  CornerDownRight,
  ChevronLeft,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lap } from '@/types';
import { AppImage } from '@/components/app-image';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Details',
  description:
    'View detailed information about a specific track in the Pale Panda Racing Team',
  keywords: ['Pale Panda Racing Team', 'Track', 'Details'],
};

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [track, sessions] = await Promise.all([
    getTrackById(id),
    getTrackSessionsByTrackId(id),
  ]);

  if (!track) {
    notFound();
  }

  if (!sessions) {
    throw new Error('Failed to fetch sessions for this track');
  }

  const totalLaps = sessions.reduce((sum, s) => sum + s.total_laps, 0);
  const allLaps = sessions
    .flatMap((s) => s.laps)
    .filter((l): l is Lap => l != null);
  const lapTimes = allLaps
    .map((l) => l.lap_time_seconds)
    .filter((t): t is number => typeof t === 'number');
  const bestLapTime = Math.min(...lapTimes);
  const avgTopSpeed =
    allLaps.length > 0
      ? Math.round(
          allLaps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) /
            allLaps.length
        )
      : 0;

  // Get top 10 laps sorted by time
  const topLaps = allLaps
    .map((lap) => {
      const session = sessions.find((s) => s.id === lap.session_id);
      return {
        ...lap,
        sessionTitle: session ? `${session.session_type} Session` : 'Unknown',
        sessionDate: session?.session_date || '',
      };
    })
    .sort((a, b) => a.lap_time_seconds - b.lap_time_seconds)
    .slice(0, 10);

  const imageUrl =
    `${process.env.NEXT_PUBLIC_STORAGE_SUPABASE_URL}${track.image_url}` ||
    '/placeholder.svg';

  return (
    <>
      {/* Hero Section */}
      <section className='relative h-64 md:h-80'>
        <AppImage
          src={imageUrl}
          alt={track.name}
          fill
          className='absolute inset-0 w-full h-full object-fill'
        />

        <div className='absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent' />
        <div className='absolute bottom-0 left-0 right-0 p-6'>
          <div className='container mx-auto'>
            <Link
              href='/tracks'
              className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors'>
              <ChevronLeft className='w-4 h-4' />
              Back to Tracks
            </Link>
            <div className='flex items-center gap-3 mb-2'>
              <h1 className='text-3xl md:text-4xl font-bold text-foreground'>
                {track.name}
              </h1>
            </div>
            <div className='flex items-center gap-1 text-muted-foreground'>
              <MapPin className='w-4 h-4' />
              <span>{track.country}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Track Stats Bar */}
      <section className='py-6 border-b border-border bg-card/50'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>
                {formatTrackLength(track.length_meters)}
              </p>
              <p className='text-xs text-muted-foreground'>Length</p>
            </div>
            {track.turns && (
              <div className='text-center'>
                <p className='text-2xl font-bold text-foreground'>
                  {track.turns}
                </p>
                <p className='text-xs text-muted-foreground'>Turns</p>
              </div>
            )}
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>
                {sessions.length}
              </p>
              <p className='text-xs text-muted-foreground'>Your Sessions</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>{totalLaps}</p>
              <p className='text-xs text-muted-foreground'>Your Laps</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className='py-8'>
        <div className='container mx-auto px-4'>
          <Tabs defaultValue='overview' className='space-y-6'>
            <TabsList className='bg-secondary'>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='sessions'>Sessions</TabsTrigger>
              <TabsTrigger value='leaderboard'>Best Laps</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value='overview' className='space-y-6'>
              <div className='grid lg:grid-cols-3 gap-6'>
                {/* Track Description */}
                <Card className='lg:col-span-2 bg-card border-border'>
                  <CardHeader>
                    <CardTitle>About This Track</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <p className='text-muted-foreground leading-relaxed'>
                      {track.description ||
                        'No description available for this track.'}
                    </p>
                  </CardContent>
                </Card>

                {/* Your Personal Best */}
                <Card className='bg-card border-border'>
                  <CardHeader>
                    <CardTitle>Your Personal Best</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='text-center py-4'>
                      <p className='text-4xl font-bold text-primary'>
                        {bestLapTime ? formatLapTime(bestLapTime) : '--:--:---'}
                      </p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Best Lap Time
                      </p>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='bg-secondary/50 rounded-md p-3 text-center'>
                        <p className='text-lg font-bold text-foreground'>
                          {avgTopSpeed || '--'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Avg Top Speed (km/h)
                        </p>
                      </div>
                      <div className='bg-secondary/50 rounded-md p-3 text-center'>
                        <p className='text-lg font-bold text-foreground'>
                          {sessions.length}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Sessions
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Track Characteristics */}
              <Card className='bg-card border-border'>
                <CardHeader>
                  <CardTitle>Track Characteristics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-6'>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center'>
                        <Route className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          Circuit Length
                        </p>
                        <p className='text-lg font-semibold text-foreground'>
                          {track?.length_meters
                            ? `${(track.length_meters / 1000).toFixed(2)} km`
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                    {track.turns && (
                      <div className='flex items-start gap-3'>
                        <div className='w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center'>
                          <CornerDownRight className='w-5 h-5 text-primary' />
                        </div>
                        <div>
                          <p className='text-sm text-muted-foreground'>
                            Number of Turns
                          </p>
                          <p className='text-lg font-semibold text-foreground'>
                            {track.turns} corners
                          </p>
                        </div>
                      </div>
                    )}
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center'>
                        <MapPin className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          Location
                        </p>
                        <p className='text-lg font-semibold text-foreground'>
                          {track.country}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value='sessions' className='space-y-6'>
              {sessions.length === 0 ? (
                <Card className='bg-card border-border'>
                  <CardContent className='py-12 text-center'>
                    <p className='text-muted-foreground'>
                      No sessions recorded at this track yet.
                    </p>
                    <p className='text-sm text-muted-foreground mt-1'>
                      Get out there and start racing!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className='bg-card border-border'>
                  <CardHeader>
                    <CardTitle>Session History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className='border-border hover:bg-transparent'>
                          <TableHead className='text-muted-foreground'>
                            Session
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            Date
                          </TableHead>
                          <TableHead className='text-muted-foreground text-right'>
                            Laps
                          </TableHead>
                          <TableHead className='text-muted-foreground text-right'>
                            Best Lap
                          </TableHead>
                          <TableHead className='text-muted-foreground'></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sessions.map((session) => (
                          <TableRow key={session.id} className='border-border'>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <span className='font-medium text-foreground'>
                                  {session.session_type} Session
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className='text-muted-foreground'>
                              {formatSessionDate(session.session_date)}
                            </TableCell>
                            <TableCell className='text-right text-foreground'>
                              {session.total_laps}
                            </TableCell>
                            <TableCell className='text-right font-mono text-primary'>
                              {formatLapTime(session.best_lap_time_seconds)}
                            </TableCell>
                            <TableCell className='text-right'>
                              <Link href={`/session/${session.id}/dashboard`}>
                                <Button
                                  variant='ghost'
                                  size='sm'
                                  className='text-primary hover:text-primary'>
                                  View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Best Laps Tab */}
            <TabsContent value='leaderboard' className='space-y-6'>
              {topLaps.length === 0 ? (
                <Card className='bg-card border-border'>
                  <CardContent className='py-12 text-center'>
                    <p className='text-muted-foreground'>
                      No lap times recorded at this track yet.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card className='bg-card border-border'>
                  <CardHeader>
                    <CardTitle>
                      Your Top {Math.min(10, topLaps.length)} Laps
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className='border-border hover:bg-transparent'>
                          <TableHead className='text-muted-foreground w-12'>
                            #
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            Lap Time
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            Session
                          </TableHead>
                          <TableHead className='text-muted-foreground text-right'>
                            Lap
                          </TableHead>
                          <TableHead className='text-muted-foreground text-right'>
                            Top Speed
                          </TableHead>
                          <TableHead className='text-muted-foreground text-right'>
                            Gap to Best
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topLaps.map((lap, index) => {
                          const gap =
                            index === 0
                              ? 0
                              : lap.lap_time_seconds! -
                                topLaps[0].lap_time_seconds!;
                          return (
                            <TableRow
                              key={`${lap.session_id}-${lap.lap_number}`}
                              className='border-border'>
                              <TableCell>
                                {index === 0 ? (
                                  <div className='w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center'>
                                    <Trophy className='w-3 h-3 text-primary' />
                                  </div>
                                ) : (
                                  <span className='text-muted-foreground'>
                                    {index + 1}
                                  </span>
                                )}
                              </TableCell>
                              <TableCell
                                className={`font-mono font-semibold ${
                                  index === 0
                                    ? 'text-primary'
                                    : 'text-foreground'
                                }`}>
                                {formatLapTime(lap.lap_time_seconds)}
                              </TableCell>
                              <TableCell className='text-muted-foreground'>
                                {lap.sessionTitle}
                              </TableCell>
                              <TableCell className='text-right text-foreground'>
                                Lap {lap.lap_number}
                              </TableCell>
                              <TableCell className='text-right text-foreground'>
                                {Math.round(lap.max_speed_kmh || 0)} km/h
                              </TableCell>
                              <TableCell className='text-right text-muted-foreground'>
                                {index === 0 ? '--' : `+${gap.toFixed(3)}s`}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </>
  );
}
