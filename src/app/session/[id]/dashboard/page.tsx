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
  Clock,
  Flag,
  Gauge,
  Zap,
  Activity,
  ThermometerSun,
  Wind,
  Bike,
} from 'lucide-react';
import {
  getSessionById,
  sessionInfo,
  getSessionStats,
} from '@/lib/sessions-data';
import { LapTimeChart } from '@/components/lap-time-chart';
import { SpeedChart } from '@/components/speed-chart';
import { TelemetryPanel } from '@/components/telemetry-panel';
import { SessionDashboard } from '@/components/session-dashboard';

interface DashboardPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { id } = await params;
  const session = getSessionById(id);
  const stats = getSessionStats();

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
                    {session.title}
                  </h1>
                  <Badge className={statusStyles[session.status]}>
                    {statusLabels[session.status]}
                  </Badge>
                </div>
                <p className='text-sm text-muted-foreground'>
                  {session.track} • {session.date}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 text-sm'>
                <Clock className='w-4 h-4 text-muted-foreground' />
                <span className='font-mono text-foreground'>
                  {session.duration}
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Flag className='w-4 h-4 text-muted-foreground' />
                <span className='font-mono text-foreground'>
                  {session.laps} laps
                </span>
              </div>
              <div className='flex items-center gap-2 text-sm'>
                <Zap className='w-4 h-4 text-primary' />
                <span className='font-mono text-primary font-medium'>
                  {session.bestLap}
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
                        {session.topSpeed}
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
                        {session.avgSpeed}
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
                        Fuel Used
                      </p>
                      <p className='text-2xl font-mono font-bold text-foreground mt-1'>
                        {session.fuelUsed}
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
                        Track Temp
                      </p>
                      <p className='text-2xl font-mono font-bold text-foreground mt-1'>
                        {session.trackTemp}
                      </p>
                    </div>
                    <div className='w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center'>
                      <ThermometerSun className='w-5 h-5 text-chart-3' />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className='grid lg:grid-cols-2 gap-6'>
              <LapTimeChart sessionId={id} bestLap={session.bestLap} />
              <SpeedChart sessionId={id} topSpeed={session.topSpeed} />
            </div>

            {/* Conditions & Bike Setup */}
            <div className='grid md:grid-cols-2 gap-6'>
              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground flex items-center gap-2'>
                    <Wind className='w-5 h-5' />
                    Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Weather</span>
                    <span className='text-foreground font-medium'>
                      {session.weather}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Air Temperature
                    </span>
                    <span className='text-foreground font-mono'>
                      {session.temperature}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>
                      Road Temperature
                    </span>
                    <span className='text-foreground font-mono'>
                      {session.trackTemp}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>Wind Speed</span>
                    <span className='text-foreground font-mono'>12 km/h</span>
                  </div>
                </CardContent>
              </Card>

              {/* Bike Setup */}
              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground flex items-center gap-2'>
                    <Bike className='w-5 h-5' />
                    Bike Setup
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>
                        Front Tire Temp
                      </span>
                      <span className='text-foreground font-mono'>87°C</span>
                    </div>
                    <Progress value={72} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>
                        Rear Tire Temp
                      </span>
                      <span className='text-foreground font-mono'>94°C</span>
                    </div>
                    <Progress value={78} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>
                        Front Suspension
                      </span>
                      <span className='text-foreground font-mono'>
                        32 clicks
                      </span>
                    </div>
                    <Progress value={64} className='h-2' />
                  </div>
                  <div>
                    <div className='flex justify-between text-sm mb-2'>
                      <span className='text-muted-foreground'>
                        Rear Suspension
                      </span>
                      <span className='text-foreground font-mono'>
                        28 clicks
                      </span>
                    </div>
                    <Progress value={56} className='h-2' />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='telemetry'>
            <TelemetryPanel sessionId={id} />
          </TabsContent>

          <TabsContent value='analysis'>
            <SessionDashboard />
            <div className='py-6'>
              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground'>
                    Session Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-muted-foreground'>
                    Detailed performance analysis and AI-powered insights for
                    this session will be available here. Compare lap times,
                    identify areas for improvement, and track your progress over
                    time.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
