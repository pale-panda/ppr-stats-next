'use client';

import { useState, useMemo, useEffect } from 'react';
import useSWR from 'swr';
import { Header } from '@/components/header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  BarChart3,
  GitCompare,
  TrendingUp,
  Zap,
  Clock,
  Gauge,
  Flag,
  Target,
} from 'lucide-react';
import { formatSpeed, formatDuration, formatTime } from '@/lib/format-utils';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type AnalyticsSession = {
  id: string;
  session_type: string;
  session_date: string;
  total_laps: number;
  best_lap_time_seconds: number;
  track: {
    id: string;
    name: string;
    location: string;
  };
  laps: Array<{
    id: string;
    lap_number: number;
    lap_time_seconds: number;
    sector_1_seconds: number | null;
    sector_2_seconds: number | null;
    sector_3_seconds: number | null;
    max_speed_kmh: number | null;
  }>;
};

export default function AnalyticsPage() {
  const { data, error, isLoading } = useSWR('/api/analytics', fetcher);

  const sessions: AnalyticsSession[] = data?.sessions || [];
  const allTimeStats = useMemo(
    () => ({
      bestLapTime: data?.bestLapTime || 0,
      avgLapTime: data?.avgLapTime || 0,
      totalLaps: data?.totalLaps || 0,
      topSpeed: data?.topSpeed || 0,
    }),
    [data]
  );

  const [selectedSession1, setSelectedSession1] = useState<string>('');
  const [selectedSession2, setSelectedSession2] = useState<string>('');
  const [selectedLap1, setSelectedLap1] = useState<number>(1);
  const [selectedLap2, setSelectedLap2] = useState<number>(1);

  useEffect(() => {
    if (sessions.length > 0 && !selectedSession1) {
      setSelectedSession1(sessions[0].id);
      if (sessions.length > 1) {
        setSelectedSession2(sessions[1].id);
      }
    }
  }, [sessions, selectedSession1]);

  const session1 = sessions.find((s) => s.id === selectedSession1);
  const session2 = sessions.find((s) => s.id === selectedSession2);
  const laps1 = session1?.laps || [];
  const laps2 = session2?.laps || [];

  // Session comparison data
  const sessionComparisonData = useMemo(() => {
    if (!session1 || !session2) return [];
    return [
      {
        metric: 'Top Speed',
        session1:
          Math.max(...session1.laps.map((l) => l.max_speed_kmh || 0)) || 0,
        session2:
          Math.max(...session2.laps.map((l) => l.max_speed_kmh || 0)) || 0,
      },
      {
        metric: 'Avg Speed',
        session1:
          session1.laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) /
            (session1.laps.length || 1) || 0,
        session2:
          session2.laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) /
            (session2.laps.length || 1) || 0,
      },
      {
        metric: 'Laps',
        session1: session1.total_laps,
        session2: session2.total_laps,
      },
    ];
  }, [session1, session2]);

  // Lap comparison chart data
  const lapComparisonData = useMemo(() => {
    const maxLaps = Math.max(laps1.length, laps2.length);
    const data = [];
    for (let i = 0; i < maxLaps; i++) {
      data.push({
        lap: i + 1,
        session1: laps1[i]?.lap_time_seconds || null,
        session2: laps2[i]?.lap_time_seconds || null,
      });
    }
    return data;
  }, [laps1, laps2]);

  // Sector comparison for selected laps
  const sectorComparisonData = useMemo(() => {
    const lap1Data = laps1.find((l) => l.lap_number === selectedLap1);
    const lap2Data = laps2.find((l) => l.lap_number === selectedLap2);
    if (!lap1Data || !lap2Data) return [];
    return [
      {
        sector: 'Sector 1',
        session1: lap1Data.sector_1_seconds || 0,
        session2: lap2Data.sector_1_seconds || 0,
      },
      {
        sector: 'Sector 2',
        session1: lap1Data.sector_2_seconds || 0,
        session2: lap2Data.sector_2_seconds || 0,
      },
      {
        sector: 'Sector 3',
        session1: lap1Data.sector_3_seconds || 0,
        session2: lap2Data.sector_3_seconds || 0,
      },
    ];
  }, [laps1, laps2, selectedLap1, selectedLap2]);

  // Radar chart data for overall performance
  const radarData = useMemo(() => {
    if (!session1 || !session2 || laps1.length === 0 || laps2.length === 0)
      return [];
    const bestLap1 = Math.min(...laps1.map((l) => l.lap_time_seconds));
    const bestLap2 = Math.min(...laps2.map((l) => l.lap_time_seconds));
    const avgLap1 =
      laps1.reduce((sum, l) => sum + l.lap_time_seconds, 0) / laps1.length;
    const avgLap2 =
      laps2.reduce((sum, l) => sum + l.lap_time_seconds, 0) / laps2.length;
    const consistency1 =
      100 -
      ((Math.max(...laps1.map((l) => l.lap_time_seconds)) - bestLap1) /
        bestLap1) *
        100;
    const consistency2 =
      100 -
      ((Math.max(...laps2.map((l) => l.lap_time_seconds)) - bestLap2) /
        bestLap2) *
        100;

    const topSpeed1 = Math.max(...laps1.map((l) => l.max_speed_kmh || 0));
    const topSpeed2 = Math.max(...laps2.map((l) => l.max_speed_kmh || 0));

    return [
      {
        attribute: 'Top Speed',
        session1: (topSpeed1 / 350) * 100,
        session2: (topSpeed2 / 350) * 100,
        fullMark: 100,
      },
      {
        attribute: 'Consistency',
        session1: consistency1,
        session2: consistency2,
        fullMark: 100,
      },
      {
        attribute: 'Pace',
        session1: Math.max(0, 100 - ((avgLap1 - 60) / 60) * 100),
        session2: Math.max(0, 100 - ((avgLap2 - 60) / 60) * 100),
        fullMark: 100,
      },
      {
        attribute: 'Best Lap',
        session1: Math.max(0, 100 - ((bestLap1 - 60) / 60) * 100),
        session2: Math.max(0, 100 - ((bestLap2 - 60) / 60) * 100),
        fullMark: 100,
      },
      {
        attribute: 'Speed',
        session1: (topSpeed1 / 300) * 100,
        session2: (topSpeed2 / 300) * 100,
        fullMark: 100,
      },
    ];
  }, [session1, session2, laps1, laps2]);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <div className='container mx-auto px-4 py-6'>
          <p className='text-muted-foreground'>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <div className='container mx-auto px-4 py-6'>
          <p className='text-red-500'>Error loading analytics data</p>
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className='min-h-screen bg-background'>
        <Header />
        <div className='border-b border-border bg-card/50'>
          <div className='container mx-auto px-4 py-6'>
            <div className='flex items-center gap-3'>
              <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
                <BarChart3 className='w-5 h-5 text-primary' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-foreground'>
                  Analytics
                </h1>
                <p className='text-sm text-muted-foreground'>
                  Compare sessions and analyze your performance
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className='container mx-auto px-4 py-12 text-center'>
          <p className='text-muted-foreground mb-4'>
            No session data available yet.
          </p>
          <p className='text-sm text-muted-foreground'>
            Upload some sessions to start analyzing your performance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <Header />

      {/* Page Header */}
      <div className='border-b border-border bg-card/50'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center'>
              <BarChart3 className='w-5 h-5 text-primary' />
            </div>
            <div>
              <h1 className='text-2xl font-bold text-foreground'>Analytics</h1>
              <p className='text-sm text-muted-foreground'>
                Compare sessions and analyze your performance
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 py-6'>
        {/* All-Time Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
          <Card className='bg-card border-border/50'>
            <CardContent className='p-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-xs text-muted-foreground uppercase tracking-wider'>
                    Best Lap
                  </p>
                  <p className='text-2xl font-mono font-bold text-primary mt-1'>
                    {formatTime(allTimeStats.bestLapTime)}
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
                    Avg Lap
                  </p>
                  <p className='text-2xl font-mono font-bold text-foreground mt-1'>
                    {formatTime(allTimeStats.avgLapTime)}
                  </p>
                </div>
                <div className='w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center'>
                  <Clock className='w-5 h-5 text-chart-2' />
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
                    {allTimeStats.totalLaps}
                  </p>
                </div>
                <div className='w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center'>
                  <Flag className='w-5 h-5 text-chart-3' />
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
                    {formatSpeed(allTimeStats.topSpeed)}
                  </p>
                </div>
                <div className='w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center'>
                  <Gauge className='w-5 h-5 text-chart-4' />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue='sessions' className='space-y-6'>
          <TabsList className='bg-card border border-border'>
            <TabsTrigger value='sessions' className='gap-2'>
              <GitCompare className='w-4 h-4' />
              Session Comparison
            </TabsTrigger>
            <TabsTrigger value='laps' className='gap-2'>
              <TrendingUp className='w-4 h-4' />
              Lap Analysis
            </TabsTrigger>
            <TabsTrigger value='progression' className='gap-2'>
              <Target className='w-4 h-4' />
              Progression
            </TabsTrigger>
          </TabsList>

          {/* Session Comparison Tab */}
          <TabsContent value='sessions' className='space-y-6'>
            {/* Session Selectors */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle className='text-foreground'>
                  Select Sessions to Compare
                </CardTitle>
                <CardDescription>
                  Choose two sessions to analyze side by side
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Session 1
                    </label>
                    <Select
                      value={selectedSession1}
                      onValueChange={setSelectedSession1}>
                      <SelectTrigger className='bg-background border-border'>
                        <SelectValue placeholder='Select session' />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.track.name} -{' '}
                            {new Date(
                              session.session_date
                            ).toLocaleDateString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {session1 && (
                      <div className='p-3 rounded-lg bg-primary/5 border border-primary/20'>
                        <p className='font-medium text-foreground'>
                          {session1.track.name}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {session1.track.location}
                        </p>
                        <div className='flex gap-4 mt-2 text-sm'>
                          <span className='text-primary font-mono'>
                            {formatTime(session1.best_lap_time_seconds)}
                          </span>
                          <span className='text-muted-foreground'>
                            {session1.total_laps} laps
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      Session 2
                    </label>
                    <Select
                      value={selectedSession2}
                      onValueChange={setSelectedSession2}>
                      <SelectTrigger className='bg-background border-border'>
                        <SelectValue placeholder='Select session' />
                      </SelectTrigger>
                      <SelectContent>
                        {sessions.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.track.name} -{' '}
                            {new Date(
                              session.session_date
                            ).toLocaleDateString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {session2 && (
                      <div className='p-3 rounded-lg bg-chart-2/5 border border-chart-2/20'>
                        <p className='font-medium text-foreground'>
                          {session2.track.name}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {session2.track.location}
                        </p>
                        <div className='flex gap-4 mt-2 text-sm'>
                          <span className='text-chart-2 font-mono'>
                            {formatTime(session2.best_lap_time_seconds)}
                          </span>
                          <span className='text-muted-foreground'>
                            {session2.total_laps} laps
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Charts */}
            <div className='grid lg:grid-cols-2 gap-6'>
              {/* Lap Times Overlay */}
              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground'>
                    Lap Times Comparison
                  </CardTitle>
                  <CardDescription>
                    Lap-by-lap performance overlay
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      session1: {
                        label: session1?.track.name || 'Session 1',
                        color: 'hsl(var(--primary))',
                      },
                      session2: {
                        label: session2?.track.name || 'Session 2',
                        color: 'hsl(var(--chart-2))',
                      },
                    }}
                    className='h-[300px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart
                        data={lapComparisonData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid
                          strokeDasharray='3 3'
                          stroke='hsl(var(--border))'
                        />
                        <XAxis
                          dataKey='lap'
                          stroke='hsl(var(--muted-foreground))'
                          fontSize={12}
                        />
                        <YAxis
                          stroke='hsl(var(--muted-foreground))'
                          fontSize={12}
                          tickFormatter={(v) => `${v}s`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='session1'
                          stroke='hsl(var(--primary))'
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--primary))' }}
                          name={session1?.track.name}
                          connectNulls
                        />
                        <Line
                          type='monotone'
                          dataKey='session2'
                          stroke='hsl(var(--chart-2))'
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--chart-2))' }}
                          name={session2?.track.name}
                          connectNulls
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Performance Radar */}
              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground'>
                    Performance Profile
                  </CardTitle>
                  <CardDescription>
                    Overall performance comparison
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      session1: {
                        label: session1?.track.name || 'Session 1',
                        color: 'hsl(var(--primary))',
                      },
                      session2: {
                        label: session2?.track.name || 'Session 2',
                        color: 'hsl(var(--chart-2))',
                      },
                    }}
                    className='h-[300px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke='hsl(var(--border))' />
                        <PolarAngleAxis
                          dataKey='attribute'
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 12,
                          }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{
                            fill: 'hsl(var(--muted-foreground))',
                            fontSize: 10,
                          }}
                        />
                        <Radar
                          name={session1?.track.name}
                          dataKey='session1'
                          stroke='hsl(var(--primary))'
                          fill='hsl(var(--primary))'
                          fillOpacity={0.3}
                        />
                        <Radar
                          name={session2?.track.name}
                          dataKey='session2'
                          stroke='hsl(var(--chart-2))'
                          fill='hsl(var(--chart-2))'
                          fillOpacity={0.3}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>

            {/* Stats Comparison Table */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle className='text-foreground'>
                  Session Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className='border-border hover:bg-transparent'>
                      <TableHead className='text-muted-foreground'>
                        Metric
                      </TableHead>
                      <TableHead className='text-primary'>
                        {session1?.track.name || 'Session 1'}
                      </TableHead>
                      <TableHead className='text-chart-2'>
                        {session2?.track.name || 'Session 2'}
                      </TableHead>
                      <TableHead className='text-muted-foreground'>
                        Difference
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className='border-border'>
                      <TableCell className='text-muted-foreground'>
                        Best Lap
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session1 && formatTime(session1.best_lap_time_seconds)}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2 && formatTime(session2.best_lap_time_seconds)}
                      </TableCell>
                      <TableCell>
                        {session1 && session2 && (
                          <Badge
                            variant={
                              session1.best_lap_time_seconds <
                              session2.best_lap_time_seconds
                                ? 'default'
                                : 'secondary'
                            }>
                            {(
                              session1.best_lap_time_seconds -
                              session2.best_lap_time_seconds
                            ).toFixed(3)}
                            s
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-border'>
                      <TableCell className='text-muted-foreground'>
                        Top Speed
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session1 &&
                          formatSpeed(
                            Math.max(
                              ...session1.laps.map((l) => l.max_speed_kmh || 0)
                            )
                          )}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2 &&
                          formatSpeed(
                            Math.max(
                              ...session2.laps.map((l) => l.max_speed_kmh || 0)
                            )
                          )}
                      </TableCell>
                      <TableCell>
                        {session1 && session2 && (
                          <Badge variant='secondary'>
                            {formatSpeed(
                              Math.max(
                                ...session1.laps.map(
                                  (l) => l.max_speed_kmh || 0
                                )
                              ) -
                                Math.max(
                                  ...session2.laps.map(
                                    (l) => l.max_speed_kmh || 0
                                  )
                                )
                            )}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-border'>
                      <TableCell className='text-muted-foreground'>
                        Total Laps
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session1?.total_laps}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2?.total_laps}
                      </TableCell>
                      <TableCell>
                        {session1 && session2 && (
                          <Badge variant='secondary'>
                            {session1.total_laps - session2.total_laps}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lap Analysis Tab */}
          <TabsContent value='laps' className='space-y-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground'>
                    Select Lap - Session 1
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedLap1.toString()}
                    onValueChange={(v) => setSelectedLap1(Number(v))}>
                    <SelectTrigger className='bg-background border-border'>
                      <SelectValue placeholder='Select lap' />
                    </SelectTrigger>
                    <SelectContent>
                      {laps1.map((lap) => (
                        <SelectItem
                          key={lap.id}
                          value={lap.lap_number.toString()}>
                          Lap {lap.lap_number} -{' '}
                          {formatTime(lap.lap_time_seconds)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground'>
                    Select Lap - Session 2
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedLap2.toString()}
                    onValueChange={(v) => setSelectedLap2(Number(v))}>
                    <SelectTrigger className='bg-background border-border'>
                      <SelectValue placeholder='Select lap' />
                    </SelectTrigger>
                    <SelectContent>
                      {laps2.map((lap) => (
                        <SelectItem
                          key={lap.id}
                          value={lap.lap_number.toString()}>
                          Lap {lap.lap_number} -{' '}
                          {formatTime(lap.lap_time_seconds)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Sector Comparison */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle className='text-foreground'>
                  Sector Time Comparison
                </CardTitle>
                <CardDescription>
                  Compare individual sector performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    session1: {
                      label: session1?.track.name || 'Session 1',
                      color: 'hsl(var(--primary))',
                    },
                    session2: {
                      label: session2?.track.name || 'Session 2',
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                  className='h-[300px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={sectorComparisonData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='hsl(var(--border))'
                      />
                      <XAxis
                        dataKey='sector'
                        stroke='hsl(var(--muted-foreground))'
                        fontSize={12}
                      />
                      <YAxis
                        stroke='hsl(var(--muted-foreground))'
                        fontSize={12}
                        tickFormatter={(v) => `${v}s`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey='session1'
                        fill='hsl(var(--primary))'
                        name={session1?.track.name}
                      />
                      <Bar
                        dataKey='session2'
                        fill='hsl(var(--chart-2))'
                        name={session2?.track.name}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Lap Details Tables */}
            <div className='grid md:grid-cols-2 gap-6'>
              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground'>
                    Session 1 Laps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='max-h-[400px] overflow-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow className='border-border hover:bg-transparent'>
                          <TableHead className='text-muted-foreground'>
                            Lap
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            Time
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            S1
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            S2
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            S3
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {laps1.map((lap) => (
                          <TableRow
                            key={lap.id}
                            className={`border-border ${
                              lap.lap_time_seconds ===
                              Math.min(...laps1.map((l) => l.lap_time_seconds))
                                ? 'bg-primary/5'
                                : ''
                            }`}>
                            <TableCell className='font-medium text-foreground'>
                              {lap.lap_number}
                            </TableCell>
                            <TableCell className='font-mono text-foreground'>
                              {formatTime(lap.lap_time_seconds)}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sector_1_seconds?.toFixed(3) || '-'}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sector_2_seconds?.toFixed(3) || '-'}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sector_3_seconds?.toFixed(3) || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              <Card className='bg-card border-border/50'>
                <CardHeader>
                  <CardTitle className='text-foreground'>
                    Session 2 Laps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='max-h-[400px] overflow-auto'>
                    <Table>
                      <TableHeader>
                        <TableRow className='border-border hover:bg-transparent'>
                          <TableHead className='text-muted-foreground'>
                            Lap
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            Time
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            S1
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            S2
                          </TableHead>
                          <TableHead className='text-muted-foreground'>
                            S3
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {laps2.map((lap) => (
                          <TableRow
                            key={lap.id}
                            className={`border-border ${
                              lap.lap_time_seconds ===
                              Math.min(...laps2.map((l) => l.lap_time_seconds))
                                ? 'bg-chart-2/5'
                                : ''
                            }`}>
                            <TableCell className='font-medium text-foreground'>
                              {lap.lap_number}
                            </TableCell>
                            <TableCell className='font-mono text-foreground'>
                              {formatTime(lap.lap_time_seconds)}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sector_1_seconds?.toFixed(3) || '-'}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sector_2_seconds?.toFixed(3) || '-'}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sector_3_seconds?.toFixed(3) || '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progression Tab */}
          <TabsContent value='progression' className='space-y-6'>
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle className='text-foreground'>
                  Best Lap Times Over Time
                </CardTitle>
                <CardDescription>
                  Track your improvement across all sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    bestLap: {
                      label: 'Best Lap',
                      color: 'hsl(var(--primary))',
                    },
                  }}
                  className='h-[300px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                      data={sessions.map((s, idx) => ({
                        session: idx + 1,
                        bestLap: s.best_lap_time_seconds,
                        date: new Date(s.session_date).toLocaleDateString(),
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='hsl(var(--border))'
                      />
                      <XAxis
                        dataKey='session'
                        stroke='hsl(var(--muted-foreground))'
                        fontSize={12}
                      />
                      <YAxis
                        stroke='hsl(var(--muted-foreground))'
                        fontSize={12}
                        tickFormatter={(v) => `${v}s`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type='monotone'
                        dataKey='bestLap'
                        stroke='hsl(var(--primary))'
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                        name='Best Lap'
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Session History */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle className='text-foreground'>
                  Session History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className='border-border hover:bg-transparent'>
                      <TableHead className='text-muted-foreground'>
                        Date
                      </TableHead>
                      <TableHead className='text-muted-foreground'>
                        Track
                      </TableHead>
                      <TableHead className='text-muted-foreground'>
                        Best Lap
                      </TableHead>
                      <TableHead className='text-muted-foreground'>
                        Laps
                      </TableHead>
                      <TableHead className='text-muted-foreground'>
                        Top Speed
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sessions.map((session) => (
                      <TableRow key={session.id} className='border-border'>
                        <TableCell className='text-foreground'>
                          {new Date(session.session_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='text-foreground'>
                          {session.track.name}
                        </TableCell>
                        <TableCell className='font-mono text-foreground'>
                          {formatTime(session.best_lap_time_seconds)}
                        </TableCell>
                        <TableCell className='text-foreground'>
                          {session.total_laps}
                        </TableCell>
                        <TableCell className='font-mono text-foreground'>
                          {formatSpeed(
                            Math.max(
                              ...session.laps.map((l) => l.max_speed_kmh || 0)
                            )
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
