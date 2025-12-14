import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Clock,
  Flag,
  MapPin,
  Gauge,
  Thermometer,
  Cloud,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import {
  getSessionById,
  getSessionLaps,
  getSessionStats,
  formatLapTime,
  formatSessionDate,
  calculateSessionDuration,
} from '@/lib/data/sessions';

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const [session, laps, stats] = await Promise.all([
    getSessionById(id),
    getSessionLaps(id),
    getSessionStats(id),
  ]);

  if (!session) {
    notFound();
  }

  const bestLapTime = session.best_lap_time_seconds;
  const duration = calculateSessionDuration(laps);
  const maxSpeed =
    stats.max_speed || Math.max(...laps.map((l) => l.max_speed_kmh || 0));
  const avgSpeed =
    stats.avg_speed ||
    laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) / laps.length ||
    0;

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      {/* Hero Section */}
      <div className='relative h-64 md:h-80 overflow-hidden'>
        <Image
          src={session.track?.image_url || '/default-track.jpg'}
          alt={session.track?.name || 'Track'}
          className='w-full h-full object-cover'
          width={1200}
          height={400}
          priority
        />
        <div className='absolute inset-0 bg-linear-to-t from-background via-background/60 to-transparent' />
        <div className='absolute inset-0 flex items-end'>
          <div className='container mx-auto px-4 pb-6'>
            <Link
              href='/'
              className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors'>
              <ArrowLeft className='w-4 h-4' />
              Back to Sessions
            </Link>
            <div className='flex flex-col md:flex-row md:items-end md:justify-between gap-4'>
              <div>
                <Badge className='bg-primary text-primary-foreground'>
                  {session.session_type}
                </Badge>
                <h1 className='text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance'>
                  {session.track?.name || 'Unknown Track'}
                </h1>
                <div className='flex items-center gap-2 text-muted-foreground mt-2'>
                  <MapPin className='w-4 h-4' />
                  <span>
                    {session.track?.name}
                    {session.track?.country && `, ${session.track.country}`}
                  </span>
                  <span className='text-border'>•</span>
                  <span>{formatSessionDate(session.session_date)}</span>
                </div>
              </div>
              <Button className='bg-primary hover:bg-primary/90 w-fit' asChild>
                <Link href={`/session/${id}/dashboard`}>
                  <BarChart3 className='w-4 h-4 mr-2' />
                  Open Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-8'>
        {/* Stats Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8'>
          <Card className='bg-card border-border/50'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                <Clock className='w-4 h-4' />
                <span className='text-xs uppercase tracking-wider'>
                  Duration
                </span>
              </div>
              <p className='text-xl font-mono font-bold text-foreground'>
                {duration}
              </p>
            </CardContent>
          </Card>
          <Card className='bg-card border-border/50'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                <Flag className='w-4 h-4' />
                <span className='text-xs uppercase tracking-wider'>Laps</span>
              </div>
              <p className='text-xl font-mono font-bold text-foreground'>
                {session.total_laps}
              </p>
            </CardContent>
          </Card>
          <Card className='bg-card border-border/50'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                <TrendingUp className='w-4 h-4' />
                <span className='text-xs uppercase tracking-wider'>
                  Best Lap
                </span>
              </div>
              <p className='text-xl font-mono font-bold text-primary'>
                {formatLapTime(bestLapTime)}
              </p>
            </CardContent>
          </Card>
          <Card className='bg-card border-border/50'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                <Gauge className='w-4 h-4' />
                <span className='text-xs uppercase tracking-wider'>
                  Top Speed
                </span>
              </div>
              <p className='text-xl font-mono font-bold text-foreground'>
                {maxSpeed.toFixed(0)} km/h
              </p>
            </CardContent>
          </Card>
          <Card className='bg-card border-border/50'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                <Cloud className='w-4 h-4' />
                <span className='text-xs uppercase tracking-wider'>
                  Weather
                </span>
              </div>
              <p className='text-xl font-mono font-bold text-foreground'>N/A</p>
            </CardContent>
          </Card>
          <Card className='bg-card border-border/50'>
            <CardContent className='p-4'>
              <div className='flex items-center gap-2 text-muted-foreground mb-1'>
                <Thermometer className='w-4 h-4' />
                <span className='text-xs uppercase tracking-wider'>
                  Track Temp
                </span>
              </div>
              <p className='text-xl font-mono font-bold text-foreground'>N/A</p>
            </CardContent>
          </Card>
        </div>

        <div className='grid lg:grid-cols-3 gap-6'>
          {/* Lap Times Table */}
          <Card className='lg:col-span-2 bg-card border-border/50'>
            <CardHeader>
              <CardTitle className='text-foreground'>Lap Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='overflow-x-auto'>
                <table className='w-full'>
                  <thead>
                    <tr className='border-b border-border'>
                      <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
                        Lap
                      </th>
                      <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
                        Time
                      </th>
                      <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
                        Max Speed
                      </th>
                      <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
                        Lean Angle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {laps.map((lap) => {
                      const isFastest = lap.lap_time_seconds === bestLapTime;
                      return (
                        <tr
                          key={lap.id}
                          className={`border-b border-border/50 ${
                            isFastest ? 'bg-primary/10' : ''
                          }`}>
                          <td className='py-3 px-2 font-mono text-foreground'>
                            {lap.lap_number}
                          </td>
                          <td
                            className={`py-3 px-2 font-mono font-medium ${
                              isFastest ? 'text-primary' : 'text-foreground'
                            }`}>
                            {formatLapTime(lap.lap_time_seconds)}
                            {isFastest && (
                              <Badge
                                variant='outline'
                                className='ml-2 text-primary border-primary'>
                                Fastest
                              </Badge>
                            )}
                          </td>
                          <td className='py-3 px-2 font-mono text-muted-foreground'>
                            {lap.max_speed_kmh
                              ? `${lap.max_speed_kmh.toFixed(0)} km/h`
                              : 'N/A'}
                          </td>
                          <td className='py-3 px-2 font-mono text-muted-foreground'>
                            {lap.max_lean_angle
                              ? `${lap.max_lean_angle.toFixed(1)}°`
                              : 'N/A'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Session Details */}
          <Card className='bg-card border-border/50'>
            <CardHeader>
              <CardTitle className='text-foreground'>Session Details</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Avg Speed</span>
                <span className='font-mono text-foreground'>
                  {avgSpeed.toFixed(0)} km/h
                </span>
              </div>
              <Separator className='bg-border/50' />
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Data Source</span>
                <span className='font-mono text-foreground'>
                  {session.data_source || 'N/A'}
                </span>
              </div>
              <Separator className='bg-border/50' />
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Track Length</span>
                <span className='font-mono text-foreground'>
                  {session.track?.length_meters
                    ? `${(session.track.length_meters / 1000).toFixed(2)} km`
                    : 'N/A'}
                </span>
              </div>
              <Separator className='bg-border/50' />
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Turns</span>
                <span className='font-mono text-foreground'>
                  {session.track?.turns || 'N/A'}
                </span>
              </div>
              <Separator className='bg-border/50' />
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Max Lean Angle</span>
                <span className='font-mono text-foreground'>
                  {stats.max_lean_angle
                    ? `${stats.max_lean_angle.toFixed(1)}°`
                    : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
