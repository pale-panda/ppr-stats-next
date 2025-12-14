import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Flag,
  Gauge,
  Zap,
  Activity,
  Wind,
  Bike,
} from 'lucide-react';
import {
  getSessionById,
  getSessionLaps,
  formatLapTime,
  formatSessionDate,
} from '@/lib/data/sessions';
import { LapTimeChart } from '@/components/lap-time-chart';
import { SpeedChart } from '@/components/speed-chart';
import { TelemetryPanel } from '@/components/telemetry-panel';

interface DashboardPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { id } = await params;
  const [session, laps] = await Promise.all([
    getSessionById(id),
    getSessionLaps(id),
  ]);

  if (!session) {
    notFound();
  }

  const maxSpeed =
    laps.length > 0 ? Math.max(...laps.map((l) => l.max_speed_kmh || 0)) : 0;
  const avgSpeed =
    laps.length > 0
      ? laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) / laps.length
      : 0;

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      {/* Dashboard Header */}
      <div className='border-b border-border bg-card/50'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex items-center gap-4'>
              <Link href={`/session/${id}`}>
                <Button variant='ghost' size='icon'>
                  <ArrowLeft className='w-5 h-5' />
                </Button>
              </Link>
              <div>
                <div className='flex items-center gap-2'>
                  <h1 className='text-xl md:text-2xl font-bold text-foreground'>
                    {session.session_type} Session
                  </h1>
                  <Badge className='bg-muted text-muted-foreground'>
                    Completed
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {session.track.name} •{' '}
                  {formatSessionDate(session.session_date)}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 text-sm'>
                <Flag className='w-4 h-4 text-muted-foreground' />
                <span className='font-mono text-foreground'>
                  {session.total_laps} laps
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Zap className='w-4 h-4 text-primary' />
                <span className='font-mono text-primary font-medium'>
                  {formatLapTime(session.best_lap_time_seconds)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        <Tabs defaultValue='overview' className='space-y-6'>
          <TabsList className='bg-card border border-border'>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='telemetry'>Telemetry</TabsTrigger>
            <TabsTrigger value='analysis'>Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-6'>
            {/* Key Metrics */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <Card className='bg-card border-border/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                        Top Speed
                      </p>
                      <p className='text-2xl font-mono font-bold text-foreground mt-1'>
                        {Math.round(maxSpeed)} km/h
                      </p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                      <Gauge className='w-5 h-5 text-primary' />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-card border-border/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                        Avg Speed
                      </p>
                      <p className='text-2xl font-mono font-bold text-foreground mt-1'>
                        {Math.round(avgSpeed)} km/h
                      </p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center'>
                      <Activity className='w-5 h-5 text-chart-2' />
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
                        {session.total_laps}
                      </p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center'>
                      <Zap className='w-5 h-5 text-chart-4' />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className='bg-card border-border/50'>
                <CardContent className='p-4'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                        Best Lap
                      </p>
                      <p className='text-2xl font-mono font-bold text-primary mt-1'>
                        {formatLapTime(session.best_lap_time_seconds)}
                      </p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center'>
                      <Flag className='w-5 h-5 text-chart-3' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className='grid lg:grid-cols-2 gap-6'>
              <LapTimeChart
                sessionId={id}
                bestLap={formatLapTime(session.best_lap_time_seconds)}
              />
              <SpeedChart
                sessionId={id}
                topSpeed={`${Math.round(maxSpeed)} km/h`}
              />
            </div>

            {/* Conditions & Bike Setup */}
            <div className='grid md:grid-cols-2 gap-6'>
              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground flex items-center gap-2'>
                    <Wind className='w-5 h-5' />
                    Track Information
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Track</span>
                    <span className='text-foreground font-medium'>
                      {session.track.name}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Country</span>
                    <span className='text-foreground font-mono'>
                      {session.track.country}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Length</span>
                    <span className='text-foreground font-mono'>
                      {session.track?.length_meters
                        ? `${(session.track.length_meters / 1000).toFixed(
                            2
                          )} km`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Data Source</span>
                    <span className='text-foreground font-mono'>
                      {session.data_source}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Bike Setup */}
              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground flex items-center gap-2'>
                    <Bike className='w-5 h-5' />
                    Session Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>
                        Max Lean Angle
                      </span>
                      <span className='text-foreground font-mono'>
                        {laps.length > 0
                          ? `${Math.round(
                              Math.max(
                                ...laps.map((l) => l.max_lean_angle || 0)
                              )
                            )}°`
                          : '--'}
                      </span>
                    </div>
                    <Progress
                      value={
                        laps.length > 0
                          ? (Math.max(
                              ...laps.map((l) => l.max_lean_angle || 0)
                            ) /
                              65) *
                            100
                          : 0
                      }
                      className='h-2'
                    />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>
                        Max G-Force (Lateral)
                      </span>
                      <span className='text-foreground font-mono'>
                        {laps.length > 0
                          ? `${Math.max(
                              ...laps.map((l) => Math.abs(l.max_g_force_x || 0))
                            ).toFixed(2)}g`
                          : '--'}
                      </span>
                    </div>
                    <Progress
                      value={
                        laps.length > 0
                          ? (Math.max(
                              ...laps.map((l) => Math.abs(l.max_g_force_x || 0))
                            ) /
                              2) *
                            100
                          : 0
                      }
                      className='h-2'
                    />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>
                        Max G-Force (Vertical)
                      </span>
                      <span className='text-foreground font-mono'>
                        {laps.length > 0
                          ? `${Math.max(
                              ...laps.map((l) => Math.abs(l.max_g_force_z || 0))
                            ).toFixed(2)}g`
                          : '--'}
                      </span>
                    </div>
                    <Progress
                      value={
                        laps.length > 0
                          ? (Math.max(
                              ...laps.map((l) => Math.abs(l.max_g_force_z || 0))
                            ) /
                              3) *
                            100
                          : 0
                      }
                      className='h-2'
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='telemetry'>
            <TelemetryPanel sessionId={id} />
          </TabsContent>

          <TabsContent value='analysis'>
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle className='text-foreground'>
                  Session Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-muted-foreground'>
                  Detailed performance analysis and AI-powered insights for this
                  session will be available here. Compare lap times, identify
                  areas for improvement, and track your progress over time.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
