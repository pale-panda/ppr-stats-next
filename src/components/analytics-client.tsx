'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatLapTime, formatSpeed, formatTime } from '@/lib/format-utils';
import type { AnalyticsData } from '@/types/analytics.type';
import {
  BarChart3,
  Clock,
  Flag,
  Gauge,
  GitCompare,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';

type Props = {
  initialData: AnalyticsData;
};

export function AnalyticsClient({ initialData }: Props) {
  const data = initialData;

  const [selectedSession1, setSelectedSession1] = useState<string>('');
  const [selectedSession2, setSelectedSession2] = useState<string>('');
  const [selectedLap1, setSelectedLap1] = useState<number>(0);
  const [selectedLap2, setSelectedLap2] = useState<number>(0);

  const sessions = useMemo(() => data.sessions ?? [], [data]);

  // Keep session selections pointing at existing sessions when data refreshes.
  useEffect(() => {
    if (!sessions.length) return;
    async function setStateSafeSession1() {
      setSelectedSession1((current) => {
        if (current && sessions.some((s) => s.id === current)) {
          return current;
        }
        return sessions[0].id;
      });
    }

    setStateSafeSession1();
  }, [sessions]);

  useEffect(() => {
    if (!sessions.length) return;

    async function setStateSafeSession2() {
      setSelectedSession2((current) => {
        const hasValidSelection =
          current && sessions.some((s) => s.id === current);
        if (hasValidSelection) {
          return current;
        }

        const alternative =
          sessions.find((session) => session.id !== selectedSession1)?.id ??
          sessions[0].id;
        return alternative;
      });
    }

    setStateSafeSession2();
  }, [sessions, selectedSession1]);

  const allTimeStats = useMemo(
    () => ({
      bestLapTime: data.bestLapTime || 0,
      avgLapTime: data.avgLapTime || 0,
      totalLaps: data.totalLaps || 0,
      topSpeed: data.topSpeed || 0,
    }),
    [data],
  );

  const session1 = useMemo(
    () => sessions.find((s) => s.id === selectedSession1),
    [sessions, selectedSession1],
  );
  const session2 = useMemo(
    () => sessions.find((s) => s.id === selectedSession2),
    [sessions, selectedSession2],
  );
  const laps1 = useMemo(() => session1?.laps || [], [session1]);
  const laps2 = useMemo(() => session2?.laps || [], [session2]);

  const resolvedSelectedLap1 = useMemo(() => {
    if (!laps1.length) return undefined;
    return laps1.some((lap) => lap.lapNumber === selectedLap1)
      ? selectedLap1
      : laps1[0].lapNumber;
  }, [laps1, selectedLap1]);

  const resolvedSelectedLap2 = useMemo(() => {
    if (!laps2.length) return undefined;
    return laps2.some((lap) => lap.lapNumber === selectedLap2)
      ? selectedLap2
      : laps2[0].lapNumber;
  }, [laps2, selectedLap2]);

  // Lap comparison chart data
  const lapComparisonData = useMemo(() => {
    const maxLaps = Math.max(laps1.length, laps2.length);
    return Array.from({ length: maxLaps }, (_, idx) => ({
      lap: idx + 1,
      'Session 1': laps1[idx]?.lapTimeSeconds ?? null,
      'Session 2': laps2[idx]?.lapTimeSeconds ?? null,
    }));
  }, [laps1, laps2]);

  // Sector comparison for selected laps
  const sectorComparisonData = useMemo(() => {
    const lap1Data = laps1.find((l) => l.lapNumber === resolvedSelectedLap1);
    const lap2Data = laps2.find((l) => l.lapNumber === resolvedSelectedLap2);
    if (!lap1Data || !lap2Data) return [];
    return [
      {
        sector: 'Sector 1',
        'Session 1': lap1Data.sectors[0] || 0,
        'Session 2': lap2Data.sectors[0] || 0,
      },
      {
        sector: 'Sector 2',
        'Session 1': lap1Data.sectors[1] || 0,
        'Session 2': lap2Data.sectors[1] || 0,
      },
      {
        sector: 'Sector 3',
        'Session 1': lap1Data.sectors[2] || 0,
        'Session 2': lap2Data.sectors[2] || 0,
      },
    ];
  }, [laps1, laps2, resolvedSelectedLap1, resolvedSelectedLap2]);

  // Radar chart data for overall performance
  const radarData = useMemo(() => {
    if (!session1 || !session2 || laps1.length === 0 || laps2.length === 0)
      return [];
    const bestLap1 = Math.min(...laps1.map((l) => l.lapTimeSeconds));
    const bestLap2 = Math.min(...laps2.map((l) => l.lapTimeSeconds));
    const avgLap1 =
      laps1.reduce((sum, l) => sum + l.lapTimeSeconds, 0) / laps1.length;
    const avgLap2 =
      laps2.reduce((sum, l) => sum + l.lapTimeSeconds, 0) / laps2.length;
    const consistency1 =
      100 -
      ((Math.max(...laps1.map((l) => l.lapTimeSeconds)) - bestLap1) /
        bestLap1) *
        100;
    const consistency2 =
      100 -
      ((Math.max(...laps2.map((l) => l.lapTimeSeconds)) - bestLap2) /
        bestLap2) *
        100;

    const avgSpeed1 = session1.avgSpeedKmh || 0;
    const avgSpeed2 = session2.avgSpeedKmh || 0;
    const topSpeed1 = Math.max(...laps1.map((l) => l.maxSpeedKmh || 0));
    const topSpeed2 = Math.max(...laps2.map((l) => l.maxSpeedKmh || 0));

    return [
      {
        attribute: 'Top Speed',
        'Session 1': (topSpeed1 / 250) * 100,
        'Session 2': (topSpeed2 / 250) * 100,
        fullMark: 100,
      },
      {
        attribute: 'Consistency',
        'Session 1': consistency1,
        'Session 2': consistency2,
        fullMark: 100,
      },
      {
        attribute: 'Pace',
        'Session 1': Math.max(0, 100 - ((avgLap1 - 60) / 60) * 100),
        'Session 2': Math.max(0, 100 - ((avgLap2 - 60) / 60) * 100),
        fullMark: 100,
      },
      {
        attribute: 'Best Lap',
        'Session 1': Math.max(0, 100 - ((bestLap1 - 60) / 60) * 100),
        'Session 2': Math.max(0, 100 - ((bestLap2 - 60) / 60) * 100),
        fullMark: 100,
      },
      {
        attribute: 'Speed',
        'Session 1': (avgSpeed1 / 250) * 100,
        'Session 2': (avgSpeed2 / 250) * 100,
        fullMark: 100,
      },
    ];
  }, [session1, session2, laps1, laps2]);

  const progressionData = useMemo(
    () =>
      sessions.map((s, idx) => ({
        session: idx + 1,
        bestLap: s.bestLapTimeSeconds,
        date: new Date(s.sessionDate).toLocaleDateString(),
      })),
    [sessions],
  );

  if (sessions.length === 0) {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
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
                            {new Date(session.sessionDate).toLocaleDateString()}
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
                          {session1.track.country}
                        </p>
                        <div className='flex gap-4 mt-2 text-sm'>
                          <span className='text-primary font-mono'>
                            {formatTime(session1.bestLapTimeSeconds)}
                          </span>
                          <span className='text-muted-foreground'>
                            {session1.totalLaps} laps
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
                            {new Date(session.sessionDate).toLocaleDateString()}
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
                          {session2.track.country}
                        </p>
                        <div className='flex gap-4 mt-2 text-sm'>
                          <span className='text-chart-2 font-mono'>
                            {formatTime(session2.bestLapTimeSeconds)}
                          </span>
                          <span className='text-muted-foreground'>
                            {session2.totalLaps} laps
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Charts */}
            <div className='grid lg:grid-cols-2 xl:grid-cols-3 gap-6'>
              {/* Lap Times Overlay */}
              <Card className='bg-card lg:col-span-1 xl:col-span-2 border-border/50'>
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
                      'Session 1': {
                        label: 'S1',
                        color: 'var(--primary)',
                      },
                      'Session 2': {
                        label: 'S2',
                        color: 'var(--chart-2)',
                      },
                    }}
                    className='w-auto h-auto lg:w-full lg:h-[300px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <LineChart
                        data={lapComparisonData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid
                          strokeDasharray='3 3'
                          stroke='var(--border)'
                        />
                        <XAxis
                          dataKey='lap'
                          stroke='var(--muted-foreground)'
                          fontSize={12}
                        />
                        <YAxis
                          stroke='var(--muted-foreground)'
                          fontSize={12}
                          tickFormatter={(v) => `${v}s`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line
                          type='monotone'
                          dataKey='Session 1'
                          stroke='var(--primary)'
                          name='Session 1'
                          strokeWidth={2}
                          dot={{ fill: 'var(--primary)' }}
                          connectNulls
                        />
                        <Line
                          type='monotone'
                          dataKey='Session 2'
                          stroke='var(--chart-2)'
                          name='Session 2'
                          strokeWidth={2}
                          dot={{ fill: 'var(--chart-2)' }}
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
                      'Session 1': {
                        label: 'S1',
                        color: 'var(--primary)',
                      },
                      'Session 2': {
                        label: 'S2',
                        color: 'var(--chart-2)',
                      },
                    }}
                    className='w-auto h-auto lg:w-full lg:h-[300px]'>
                    <ResponsiveContainer width='100%' height='100%'>
                      <RadarChart data={radarData}>
                        <PolarGrid stroke='var(--border)' />
                        <PolarAngleAxis
                          dataKey='attribute'
                          tick={{
                            fill: 'var(--muted-foreground)',
                            fontSize: 12,
                          }}
                        />
                        <PolarRadiusAxis
                          angle={30}
                          domain={[0, 100]}
                          tick={{
                            fill: 'var(--muted-foreground)',
                            fontSize: 10,
                          }}
                        />
                        <Radar
                          dataKey='Session 1'
                          stroke='var(--primary)'
                          fill='var(--primary)'
                          fillOpacity={0.3}
                        />
                        <Radar
                          dataKey='Session 2'
                          stroke='var(--chart-2)'
                          fill='var(--chart-2)'
                          fillOpacity={0.3}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
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
                        {'Session 1'}
                      </TableHead>
                      <TableHead className='text-chart-2'>
                        {'Session 2'}
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
                        {session1 && formatTime(session1.bestLapTimeSeconds)}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2 && formatTime(session2.bestLapTimeSeconds)}
                      </TableCell>
                      <TableCell>
                        {session1 && session2 && (
                          <Badge
                            variant={
                              session1.bestLapTimeSeconds <
                              session2.bestLapTimeSeconds
                                ? 'default'
                                : 'secondary'
                            }>
                            {(
                              session1.bestLapTimeSeconds -
                              session2.bestLapTimeSeconds
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
                              ...session1.laps.map((l) => l.maxSpeedKmh ?? 0),
                            ),
                          )}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2 &&
                          formatSpeed(
                            Math.max(
                              ...session2.laps.map((l) => l.maxSpeedKmh ?? 0),
                            ),
                          )}
                      </TableCell>
                      <TableCell>
                        {session1 && session2 && (
                          <Badge variant='secondary'>
                            {formatSpeed(
                              Math.max(
                                ...session1.laps.map((l) => l.maxSpeedKmh ?? 0),
                              ) -
                                Math.max(
                                  ...session2.laps.map(
                                    (l) => l.maxSpeedKmh ?? 0,
                                  ),
                                ),
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
                        {session1?.totalLaps}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2?.totalLaps}
                      </TableCell>
                      <TableCell>
                        {session1 && session2 && (
                          <Badge variant='secondary'>
                            {session1.totalLaps - session2.totalLaps}
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
                            {new Date(session.sessionDate).toLocaleDateString()}
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
                          {session1.track.country}
                        </p>
                        <div className='flex gap-4 mt-2 text-sm'>
                          <span className='text-primary font-mono'>
                            {formatTime(session1.bestLapTimeSeconds)}
                          </span>
                          <span className='text-muted-foreground'>
                            {session1.totalLaps} laps
                          </span>
                        </div>
                      </div>
                    )}
                    <div className='mt-4'>
                      <p className='font-medium text-muted-foreground'>
                        Select Lap - Session 1
                      </p>
                    </div>
                    <Select
                      value={
                        resolvedSelectedLap1 !== undefined
                          ? resolvedSelectedLap1.toString()
                          : undefined
                      }
                      onValueChange={(v) => setSelectedLap1(Number(v))}>
                      <SelectTrigger className='bg-background border-border'>
                        <SelectValue placeholder='Select lap' />
                      </SelectTrigger>
                      <SelectContent>
                        {laps1.map((lap) => (
                          <SelectItem
                            key={lap.id}
                            value={lap.lapNumber.toString()}>
                            Lap {lap.lapNumber} -{' '}
                            {formatTime(lap.lapTimeSeconds)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                            {new Date(session.sessionDate).toLocaleDateString()}
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
                          {session2.track.country}
                        </p>
                        <div className='flex gap-4 mt-2 text-sm'>
                          <span className='text-chart-2 font-mono'>
                            {formatTime(session2.bestLapTimeSeconds)}
                          </span>
                          <span className='text-muted-foreground'>
                            {session2.totalLaps} laps
                          </span>
                        </div>
                      </div>
                    )}
                    <div className='mt-4'>
                      <p className='font-medium text-muted-foreground'>
                        Select Lap - Session 2
                      </p>
                    </div>
                    <Select
                      value={
                        resolvedSelectedLap2 !== undefined
                          ? resolvedSelectedLap2.toString()
                          : undefined
                      }
                      onValueChange={(v) => setSelectedLap2(Number(v))}>
                      <SelectTrigger className='bg-background border-border'>
                        <SelectValue placeholder='Select lap' />
                      </SelectTrigger>
                      <SelectContent>
                        {laps2.map((lap) => (
                          <SelectItem
                            key={lap.id}
                            value={lap.lapNumber.toString()}>
                            Lap {lap.lapNumber} -{' '}
                            {formatTime(lap.lapTimeSeconds)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    'Session 1': {
                      label: 'S1',
                      color: 'var(--primary)',
                    },
                    'Session 2': {
                      label: 'S2',
                      color: 'var(--chart-2)',
                    },
                  }}
                  className='w-auto h-auto lg:w-full lg:h-[300px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={sectorComparisonData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='var(--border)'
                      />
                      <XAxis
                        dataKey='sector'
                        stroke='var(--muted-foreground)'
                        fontSize={12}
                      />
                      <YAxis
                        stroke='var(--muted-foreground)'
                        fontSize={12}
                        tickFormatter={(v) => `${v}s`}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar dataKey='Session 1' fill='var(--primary)' />
                      <Bar dataKey='Session 2' fill='var(--chart-2)' />
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
                              lap.lapTimeSeconds ===
                              Math.min(...laps1.map((l) => l.lapTimeSeconds))
                                ? 'bg-primary/5'
                                : ''
                            }`}>
                            <TableCell className='font-medium text-foreground'>
                              {lap.lapNumber}
                            </TableCell>
                            <TableCell className='font-mono text-foreground'>
                              {formatTime(lap.lapTimeSeconds)}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sectors[0] > 0
                                ? lap.sectors[0].toFixed(3)
                                : '-'}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sectors[1] > 0
                                ? lap.sectors[1].toFixed(3)
                                : '-'}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sectors[2] > 0
                                ? lap.sectors[2].toFixed(3)
                                : '-'}
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
                              lap.lapTimeSeconds ===
                              Math.min(...laps2.map((l) => l.lapTimeSeconds))
                                ? 'bg-chart-2/5'
                                : ''
                            }`}>
                            <TableCell className='font-medium text-foreground'>
                              {lap.lapNumber}
                            </TableCell>
                            <TableCell className='font-mono text-foreground'>
                              {formatTime(lap.lapTimeSeconds)}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sectors[0] > 0
                                ? lap.sectors[0].toFixed(3)
                                : '-'}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sectors[1] > 0
                                ? lap.sectors[1].toFixed(3)
                                : '-'}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground text-sm'>
                              {lap.sectors[2] > 0
                                ? lap.sectors[2].toFixed(3)
                                : '-'}
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
                      color: 'var(--primary)',
                    },
                  }}
                  className='w-auto h-auto lg:w-full lg:h-[300px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                      data={progressionData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='var(--border)'
                      />
                      <XAxis
                        dataKey='session'
                        stroke='var(--muted-foreground)'
                        fontSize={12}
                      />
                      <YAxis
                        stroke='var(--muted-foreground)'
                        fontSize={12}
                        tickFormatter={(v) => `${v}s`}
                      />
                      <ChartTooltip
                        content={<ChartTooltipContent />}
                        formatter={(value: number) =>
                          `Time: ${formatLapTime(value)}`
                        }
                      />
                      <Line
                        type='monotone'
                        dataKey='bestLap'
                        stroke='var(--primary)'
                        strokeWidth={2}
                        dot={{ fill: 'var(--primary)', r: 4 }}
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
                          {new Date(session.sessionDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell className='text-foreground'>
                          {session.track.name}
                        </TableCell>
                        <TableCell className='font-mono text-foreground'>
                          {formatTime(session.bestLapTimeSeconds)}
                        </TableCell>
                        <TableCell className='text-foreground'>
                          {session.totalLaps}
                        </TableCell>
                        <TableCell className='font-mono text-foreground'>
                          {formatSpeed(
                            Math.max(
                              ...session.laps.map((l) => l.maxSpeedKmh ?? 0),
                            ),
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
    </>
  );
}
