import { notFound } from 'next/navigation';
import Link from 'next/link';
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
import { getSessionById } from '@/lib/sessions-data';

interface SessionPageProps {
  params: Promise<{ id: string }>;
}

export default async function SessionPage({ params }: SessionPageProps) {
  const { id } = await params;
  const session = getSessionById(id);

  if (!session) {
    notFound();
  }

  const statusStyles = {
    completed: 'bg-muted text-muted-foreground',
    live: 'bg-primary text-primary-foreground animate-pulse',
    upcoming: 'bg-secondary text-secondary-foreground',
  };

  const statusLabels = {
    completed: 'Completed',
    live: 'Live',
    upcoming: 'Upcoming',
  };

  const lapTimes = [
    {
      lap: 1,
      time: '1:45.234',
      sector1: '32.456',
      sector2: '41.234',
      sector3: '31.544',
    },
    {
      lap: 2,
      time: '1:44.112',
      sector1: '31.987',
      sector2: '40.891',
      sector3: '31.234',
    },
    {
      lap: 3,
      time: '1:43.567',
      sector1: '31.654',
      sector2: '40.567',
      sector3: '31.346',
    },
    {
      lap: 4,
      time: session.bestLap,
      sector1: '31.234',
      sector2: '40.123',
      sector3: '31.490',
    },
    {
      lap: 5,
      time: '1:43.891',
      sector1: '31.456',
      sector2: '40.234',
      sector3: '32.201',
    },
  ];

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      {/* Hero Section */}
      <div className='relative h-64 md:h-80 overflow-hidden'>
        <img
          src={session.imageUrl || '/placeholder.svg'}
          alt={session.track}
          className='w-full h-full object-cover'
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
                <Badge className={statusStyles[session.status]}>
                  {statusLabels[session.status]}
                </Badge>
                <h1 className='text-3xl md:text-4xl font-bold text-foreground mt-2 text-balance'>
                  {session.title}
                </h1>
                <div className='flex items-center gap-2 text-muted-foreground mt-2'>
                  <MapPin className='w-4 h-4' />
                  <span>{session.track}</span>
                  <span className='text-border'>•</span>
                  <span>{session.date}</span>
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
                {session.duration}
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
                {session.laps}
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
                {session.bestLap}
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
                {session.topSpeed}
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
              <p className='text-xl font-mono font-bold text-foreground'>
                {session.weather}
              </p>
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
              <p className='text-xl font-mono font-bold text-foreground'>
                {session.trackTemp}
              </p>
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
                        S1
                      </th>
                      <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
                        S2
                      </th>
                      <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
                        S3
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {lapTimes.map((lap) => (
                      <tr
                        key={lap.lap}
                        className={`border-b border-border/50 ${
                          lap.time === session.bestLap ? 'bg-primary/10' : ''
                        }`}>
                        <td className='py-3 px-2 font-mono text-foreground'>
                          {lap.lap}
                        </td>
                        <td
                          className={`py-3 px-2 font-mono font-medium ${
                            lap.time === session.bestLap
                              ? 'text-primary'
                              : 'text-foreground'
                          }`}>
                          {lap.time}
                          {lap.time === session.bestLap && (
                            <Badge
                              variant='outline'
                              className='ml-2 text-primary border-primary'>
                              Fastest
                            </Badge>
                          )}
                        </td>
                        <td className='py-3 px-2 font-mono text-muted-foreground'>
                          {lap.sector1}
                        </td>
                        <td className='py-3 px-2 font-mono text-muted-foreground'>
                          {lap.sector2}
                        </td>
                        <td className='py-3 px-2 font-mono text-muted-foreground'>
                          {lap.sector3}
                        </td>
                      </tr>
                    ))}
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
                  {session.avgSpeed}
                </span>
              </div>
              <Separator className='bg-border/50' />
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Fuel Used</span>
                <span className='font-mono text-foreground'>
                  {session.fuelUsed}
                </span>
              </div>
              <Separator className='bg-border/50' />
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Front Tire</span>
                <Badge
                  variant='outline'
                  className='border-chart-3 text-chart-3'>
                  82%
                </Badge>
              </div>
              <Separator className='bg-border/50' />
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Rear Tire</span>
                <Badge
                  variant='outline'
                  className='border-chart-4 text-chart-4'>
                  68%
                </Badge>
              </div>
              <Separator className='bg-border/50' />
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Air Temp</span>
                <span className='font-mono text-foreground'>
                  {session.temperature}
                </span>
              </div>
              <Separator className='bg-border/50' />
              <div className='flex justify-between items-center'>
                <span className='text-muted-foreground'>Track Temp</span>
                <span className='font-mono text-foreground'>
                  {session.trackTemp}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
