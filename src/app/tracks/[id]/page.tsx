import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { tracksData, getTrackById, getTrackStats } from '@/lib/tracks-data';
import { lapsData } from '@/lib/sessions-data';
import {
  MapPin,
  Route,
  CornerDownRight,
  TrendingUp,
  ChevronLeft,
  Trophy,
  Flame,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return tracksData.map((track) => ({
    id: track.id,
  }));
}

export default async function TrackDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const track = getTrackById(id);

  if (!track) {
    notFound();
  }

  const stats = getTrackStats(id);
  const trackSessions = stats?.sessions || [];

  // Get all laps for this track sorted by time
  const allLaps: {
    sessionId: string;
    sessionTitle: string;
    lap: number;
    time: number;
    topSpeed: number;
  }[] = [];
  trackSessions.forEach((session) => {
    const sessionLaps = lapsData[session.id] || [];
    sessionLaps.forEach((lap) => {
      allLaps.push({
        sessionId: session.id,
        sessionTitle: session.title,
        lap: lap.lap,
        time: lap.time,
        topSpeed: lap.topSpeed,
      });
    });
  });
  allLaps.sort((a, b) => a.time - b.time);
  const topLaps = allLaps.slice(0, 10);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      {/* Hero Section */}
      <section className='relative h-64 md:h-80'>
        <Image
          src={track.imageUrl || '/placeholder.svg'}
          alt={track.name}
          fill
          className='object-cover'
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
              <Badge variant='secondary'>
                {track.type === 'permanent' ? 'Permanent' : 'Street'}
              </Badge>
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
          <div className='grid grid-cols-2 md:grid-cols-6 gap-4'>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>
                {track.length} km
              </p>
              <p className='text-xs text-muted-foreground'>Length</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>
                {track.turns}
              </p>
              <p className='text-xs text-muted-foreground'>Turns</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>
                {track.longestStraight}m
              </p>
              <p className='text-xs text-muted-foreground'>Longest Straight</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-primary'>
                {track.lapRecord}
              </p>
              <p className='text-xs text-muted-foreground'>Lap Record</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>
                {stats?.totalSessions || 0}
              </p>
              <p className='text-xs text-muted-foreground'>Your Sessions</p>
            </div>
            <div className='text-center'>
              <p className='text-2xl font-bold text-foreground'>
                {stats?.totalLaps || 0}
              </p>
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
                      {track.description}
                    </p>
                    <div className='flex items-center gap-2 pt-4 border-t border-border'>
                      <Trophy className='w-4 h-4 text-primary' />
                      <span className='text-sm text-muted-foreground'>
                        Official Lap Record:
                      </span>
                      <span className='text-sm font-semibold text-foreground'>
                        {track.lapRecord}
                      </span>
                      <span className='text-sm text-muted-foreground'>by</span>
                      <span className='text-sm font-semibold text-foreground'>
                        {track.recordHolder}
                      </span>
                    </div>
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
                        {stats?.bestLapTime || '--:--.---'}
                      </p>
                      <p className='text-sm text-muted-foreground mt-1'>
                        Best Lap Time
                      </p>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='bg-secondary/50 rounded-md p-3 text-center'>
                        <p className='text-lg font-bold text-foreground'>
                          {stats?.avgTopSpeed || '--'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Avg Top Speed (km/h)
                        </p>
                      </div>
                      <div className='bg-secondary/50 rounded-md p-3 text-center'>
                        <p className='text-lg font-bold text-foreground'>
                          {stats?.totalDuration || '0:00:00'}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Total Track Time
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
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center'>
                        <Route className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          Circuit Length
                        </p>
                        <p className='text-lg font-semibold text-foreground'>
                          {track.length} km
                        </p>
                      </div>
                    </div>
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
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center'>
                        <TrendingUp className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          Longest Straight
                        </p>
                        <p className='text-lg font-semibold text-foreground'>
                          {track.longestStraight} meters
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start gap-3'>
                      <div className='w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center'>
                        <Flame className='w-5 h-5 text-primary' />
                      </div>
                      <div>
                        <p className='text-sm text-muted-foreground'>
                          Track Type
                        </p>
                        <p className='text-lg font-semibold text-foreground capitalize'>
                          {track.type} Circuit
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sessions Tab */}
            <TabsContent value='sessions' className='space-y-6'>
              {trackSessions.length === 0 ? (
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
                          <TableHead className='text-muted-foreground text-right'>
                            Top Speed
                          </TableHead>
                          <TableHead className='text-muted-foreground text-right'>
                            Duration
                          </TableHead>
                          <TableHead className='text-muted-foreground'></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trackSessions.map((session) => (
                          <TableRow key={session.id} className='border-border'>
                            <TableCell>
                              <div className='flex items-center gap-2'>
                                <span className='font-medium text-foreground'>
                                  {session.title}
                                </span>
                                {session.status === 'live' && (
                                  <Badge className='bg-red-500/20 text-red-400 border-red-500/30'>
                                    Live
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className='text-muted-foreground'>
                              {session.date}
                            </TableCell>
                            <TableCell className='text-right text-foreground'>
                              {session.laps}
                            </TableCell>
                            <TableCell className='text-right font-mono text-primary'>
                              {session.bestLap}
                            </TableCell>
                            <TableCell className='text-right text-foreground'>
                              {session.topSpeed}
                            </TableCell>
                            <TableCell className='text-right text-muted-foreground'>
                              {session.duration}
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
                    <CardTitle>Your Top 10 Laps</CardTitle>
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
                            index === 0 ? 0 : lap.time - topLaps[0].time;
                          return (
                            <TableRow
                              key={`${lap.sessionId}-${lap.lap}`}
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
                                {formatTime(lap.time)}
                              </TableCell>
                              <TableCell className='text-muted-foreground'>
                                {lap.sessionTitle}
                              </TableCell>
                              <TableCell className='text-right text-foreground'>
                                Lap {lap.lap}
                              </TableCell>
                              <TableCell className='text-right text-foreground'>
                                {lap.topSpeed} km/h
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
    </div>
  );
}
