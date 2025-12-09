'use client';

import { useState, useMemo } from 'react';
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
import {
  sessionsData,
  getLapsBySessionId,
  getCompletedSessions,
} from '@/lib/sessions-data';

export default function AnalyticsPage() {
  const completedSessions = getCompletedSessions();
  const [selectedSession1, setSelectedSession1] = useState<string>(
    completedSessions[0]?.id || ''
  );
  const [selectedSession2, setSelectedSession2] = useState<string>(
    completedSessions[1]?.id || ''
  );
  const [selectedLap1, setSelectedLap1] = useState<number>(1);
  const [selectedLap2, setSelectedLap2] = useState<number>(1);

  const session1 = sessionsData.find((s) => s.id === selectedSession1);
  const session2 = sessionsData.find((s) => s.id === selectedSession2);
  const laps1 = getLapsBySessionId(selectedSession1);
  const laps2 = getLapsBySessionId(selectedSession2);

  // Session comparison data
  const sessionComparisonData = useMemo(() => {
    if (!session1 || !session2) return [];
    return [
      {
        metric: 'Top Speed',
        session1: Number.parseInt(session1.topSpeed) || 0,
        session2: Number.parseInt(session2.topSpeed) || 0,
      },
      {
        metric: 'Avg Speed',
        session1: Number.parseInt(session1.avgSpeed) || 0,
        session2: Number.parseInt(session2.avgSpeed) || 0,
      },
      {
        metric: 'Laps',
        session1: session1.laps,
        session2: session2.laps,
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
        session1: laps1[i]?.time || null,
        session2: laps2[i]?.time || null,
      });
    }
    return data;
  }, [laps1, laps2]);

  // Sector comparison for selected laps
  const sectorComparisonData = useMemo(() => {
    const lap1Data = laps1.find((l) => l.lap === selectedLap1);
    const lap2Data = laps2.find((l) => l.lap === selectedLap2);
    if (!lap1Data || !lap2Data) return [];
    return [
      { sector: 'Sector 1', session1: lap1Data.s1, session2: lap2Data.s1 },
      { sector: 'Sector 2', session1: lap1Data.s2, session2: lap2Data.s2 },
      { sector: 'Sector 3', session1: lap1Data.s3, session2: lap2Data.s3 },
    ];
  }, [laps1, laps2, selectedLap1, selectedLap2]);

  // Radar chart data for overall performance
  const radarData = useMemo(() => {
    if (!session1 || !session2 || laps1.length === 0 || laps2.length === 0)
      return [];
    const bestLap1 = Math.min(...laps1.map((l) => l.time));
    const bestLap2 = Math.min(...laps2.map((l) => l.time));
    const avgLap1 = laps1.reduce((sum, l) => sum + l.time, 0) / laps1.length;
    const avgLap2 = laps2.reduce((sum, l) => sum + l.time, 0) / laps2.length;
    const consistency1 =
      100 -
      ((Math.max(...laps1.map((l) => l.time)) - bestLap1) / bestLap1) * 100;
    const consistency2 =
      100 -
      ((Math.max(...laps2.map((l) => l.time)) - bestLap2) / bestLap2) * 100;

    return [
      {
        attribute: 'Top Speed',
        session1: (Number.parseInt(session1.topSpeed) / 350) * 100,
        session2: (Number.parseInt(session2.topSpeed) / 350) * 100,
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
        session1: (1 - (avgLap1 - 90) / 30) * 100,
        session2: (1 - (avgLap2 - 90) / 30) * 100,
        fullMark: 100,
      },
      {
        attribute: 'Best Lap',
        session1: (1 - (bestLap1 - 90) / 30) * 100,
        session2: (1 - (bestLap2 - 90) / 30) * 100,
        fullMark: 100,
      },
      {
        attribute: 'Tire Mgmt',
        session1: session1.rearTireWear,
        session2: session2.rearTireWear,
        fullMark: 100,
      },
    ];
  }, [session1, session2, laps1, laps2]);

  // All-time stats
  const allTimeStats = useMemo(() => {
    const allLaps = completedSessions.flatMap((s) => getLapsBySessionId(s.id));
    const allTimes = allLaps.map((l) => l.time).filter((t) => t > 0);
    const bestLapTime = allTimes.length > 0 ? Math.min(...allTimes) : 0;
    const avgLapTime =
      allTimes.length > 0
        ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length
        : 0;
    const totalLaps = allLaps.length;
    const topSpeed = Math.max(
      ...completedSessions.map((s) => Number.parseInt(s.topSpeed) || 0)
    );

    return { bestLapTime, avgLapTime, totalLaps, topSpeed };
  }, [completedSessions]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
  };

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
                    {allTimeStats.topSpeed} km/h
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
                        {completedSessions.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.title} - {session.track} ({session.date})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {session1 && (
                      <div className='p-3 rounded-lg bg-primary/5 border border-primary/20'>
                        <p className='font-medium text-foreground'>
                          {session1.title}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {session1.track}
                        </p>
                        <div className='flex gap-4 mt-2 text-sm'>
                          <span className='text-primary font-mono'>
                            {session1.bestLap}
                          </span>
                          <span className='text-muted-foreground'>
                            {session1.laps} laps
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
                        {completedSessions.map((session) => (
                          <SelectItem key={session.id} value={session.id}>
                            {session.title} - {session.track} ({session.date})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {session2 && (
                      <div className='p-3 rounded-lg bg-chart-2/5 border border-chart-2/20'>
                        <p className='font-medium text-foreground'>
                          {session2.title}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {session2.track}
                        </p>
                        <div className='flex gap-4 mt-2 text-sm'>
                          <span className='text-chart-2 font-mono'>
                            {session2.bestLap}
                          </span>
                          <span className='text-muted-foreground'>
                            {session2.laps} laps
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
                        label: session1?.title || 'Session 1',
                        color: 'hsl(var(--primary))',
                      },
                      session2: {
                        label: session2?.title || 'Session 2',
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
                          name={session1?.title}
                          connectNulls
                        />
                        <Line
                          type='monotone'
                          dataKey='session2'
                          stroke='hsl(var(--chart-2))'
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--chart-2))' }}
                          name={session2?.title}
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
                        label: session1?.title || 'Session 1',
                        color: 'hsl(var(--primary))',
                      },
                      session2: {
                        label: session2?.title || 'Session 2',
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
                          name={session1?.title}
                          dataKey='session1'
                          stroke='hsl(var(--primary))'
                          fill='hsl(var(--primary))'
                          fillOpacity={0.3}
                        />
                        <Radar
                          name={session2?.title}
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
                        {session1?.title || 'Session 1'}
                      </TableHead>
                      <TableHead className='text-chart-2'>
                        {session2?.title || 'Session 2'}
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
                        {session1?.bestLap}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2?.bestLap}
                      </TableCell>
                      <TableCell>
                        {laps1.length > 0 && laps2.length > 0 && (
                          <Badge
                            variant={
                              Math.min(...laps1.map((l) => l.time)) <
                              Math.min(...laps2.map((l) => l.time))
                                ? 'default'
                                : 'secondary'
                            }>
                            {(
                              Math.min(...laps1.map((l) => l.time)) -
                              Math.min(...laps2.map((l) => l.time))
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
                        {session1?.topSpeed}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2?.topSpeed}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            Number.parseInt(session1?.topSpeed || '0') >
                            Number.parseInt(session2?.topSpeed || '0')
                              ? 'default'
                              : 'secondary'
                          }>
                          {Number.parseInt(session1?.topSpeed || '0') -
                            Number.parseInt(session2?.topSpeed || '0')}{' '}
                          km/h
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-border'>
                      <TableCell className='text-muted-foreground'>
                        Avg Speed
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session1?.avgSpeed}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2?.avgSpeed}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            Number.parseInt(session1?.avgSpeed || '0') >
                            Number.parseInt(session2?.avgSpeed || '0')
                              ? 'default'
                              : 'secondary'
                          }>
                          {Number.parseInt(session1?.avgSpeed || '0') -
                            Number.parseInt(session2?.avgSpeed || '0')}{' '}
                          km/h
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-border'>
                      <TableCell className='text-muted-foreground'>
                        Laps Completed
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session1?.laps}
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2?.laps}
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {(session1?.laps || 0) - (session2?.laps || 0)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow className='border-border'>
                      <TableCell className='text-muted-foreground'>
                        Front Tire Wear
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session1?.frontTireWear}%
                      </TableCell>
                      <TableCell className='font-mono text-foreground'>
                        {session2?.frontTireWear}%
                      </TableCell>
                      <TableCell>
                        <Badge variant='outline'>
                          {(session1?.frontTireWear || 0) -
                            (session2?.frontTireWear || 0)}
                          %
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lap Analysis Tab */}
          <TabsContent value='laps' className='space-y-6'>
            {/* Lap Selectors */}
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle className='text-foreground'>
                  Select Laps to Compare
                </CardTitle>
                <CardDescription>
                  Compare individual laps sector by sector
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='grid md:grid-cols-2 gap-6'>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      {session1?.title} - Lap
                    </label>
                    <Select
                      value={selectedLap1.toString()}
                      onValueChange={(v) =>
                        setSelectedLap1(Number.parseInt(v))
                      }>
                      <SelectTrigger className='bg-background border-border'>
                        <SelectValue placeholder='Select lap' />
                      </SelectTrigger>
                      <SelectContent>
                        {laps1.map((lap) => (
                          <SelectItem key={lap.lap} value={lap.lap.toString()}>
                            Lap {lap.lap} - {formatTime(lap.time)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium text-muted-foreground'>
                      {session2?.title} - Lap
                    </label>
                    <Select
                      value={selectedLap2.toString()}
                      onValueChange={(v) =>
                        setSelectedLap2(Number.parseInt(v))
                      }>
                      <SelectTrigger className='bg-background border-border'>
                        <SelectValue placeholder='Select lap' />
                      </SelectTrigger>
                      <SelectContent>
                        {laps2.map((lap) => (
                          <SelectItem key={lap.lap} value={lap.lap.toString()}>
                            Lap {lap.lap} - {formatTime(lap.time)}
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
                  Sector Breakdown
                </CardTitle>
                <CardDescription>
                  Compare sector times between selected laps
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    session1: {
                      label: `${session1?.title} Lap ${selectedLap1}`,
                      color: 'hsl(var(--primary))',
                    },
                    session2: {
                      label: `${session2?.title} Lap ${selectedLap2}`,
                      color: 'hsl(var(--chart-2))',
                    },
                  }}
                  className='h-[300px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                      data={sectorComparisonData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
                        name={`${session1?.title} Lap ${selectedLap1}`}
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey='session2'
                        fill='hsl(var(--chart-2))'
                        name={`${session2?.title} Lap ${selectedLap2}`}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Lap Details Table */}
            <div className='grid md:grid-cols-2 gap-6'>
              <Card className='bg-card border-border/50'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-foreground text-lg'>
                    {session1?.title} - All Laps
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                      {laps1.map((lap) => {
                        const isBest =
                          lap.time === Math.min(...laps1.map((l) => l.time));
                        return (
                          <TableRow
                            key={lap.lap}
                            className={`border-border ${
                              isBest ? 'bg-primary/5' : ''
                            }`}>
                            <TableCell className='font-mono text-foreground'>
                              {lap.lap}
                            </TableCell>
                            <TableCell
                              className={`font-mono ${
                                isBest
                                  ? 'text-primary font-bold'
                                  : 'text-foreground'
                              }`}>
                              {formatTime(lap.time)}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground'>
                              {lap.s1.toFixed(1)}s
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground'>
                              {lap.s2.toFixed(1)}s
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground'>
                              {lap.s3.toFixed(1)}s
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className='bg-card border-border/50'>
                <CardHeader className='pb-3'>
                  <CardTitle className='text-foreground text-lg'>
                    {session2?.title} - All Laps
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                      {laps2.map((lap) => {
                        const isBest =
                          lap.time === Math.min(...laps2.map((l) => l.time));
                        return (
                          <TableRow
                            key={lap.lap}
                            className={`border-border ${
                              isBest ? 'bg-chart-2/5' : ''
                            }`}>
                            <TableCell className='font-mono text-foreground'>
                              {lap.lap}
                            </TableCell>
                            <TableCell
                              className={`font-mono ${
                                isBest
                                  ? 'text-chart-2 font-bold'
                                  : 'text-foreground'
                              }`}>
                              {formatTime(lap.time)}
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground'>
                              {lap.s1.toFixed(1)}s
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground'>
                              {lap.s2.toFixed(1)}s
                            </TableCell>
                            <TableCell className='font-mono text-muted-foreground'>
                              {lap.s3.toFixed(1)}s
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Progression Tab */}
          <TabsContent value='progression' className='space-y-6'>
            <Card className='bg-card border-border/50'>
              <CardHeader>
                <CardTitle className='text-foreground'>
                  Performance Over Time
                </CardTitle>
                <CardDescription>
                  Track your best lap times across all sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    bestLap: {
                      label: 'Best Lap (s)',
                      color: 'hsl(var(--primary))',
                    },
                  }}
                  className='h-[350px]'>
                  <ResponsiveContainer width='100%' height='100%'>
                    <LineChart
                      data={completedSessions.map((s) => {
                        const laps = getLapsBySessionId(s.id);
                        const bestTime =
                          laps.length > 0
                            ? Math.min(...laps.map((l) => l.time))
                            : 0;
                        return {
                          session: s.title,
                          track: s.track,
                          date: s.date,
                          bestLap: bestTime,
                        };
                      })}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                      <CartesianGrid
                        strokeDasharray='3 3'
                        stroke='hsl(var(--border))'
                      />
                      <XAxis
                        dataKey='date'
                        stroke='hsl(var(--muted-foreground))'
                        fontSize={12}
                        angle={-45}
                        textAnchor='end'
                        height={60}
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
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', r: 6 }}
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
                        Session
                      </TableHead>
                      <TableHead className='text-muted-foreground'>
                        Track
                      </TableHead>
                      <TableHead className='text-muted-foreground'>
                        Laps
                      </TableHead>
                      <TableHead className='text-muted-foreground'>
                        Best Lap
                      </TableHead>
                      <TableHead className='text-muted-foreground'>
                        Top Speed
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedSessions.map((session) => (
                      <TableRow key={session.id} className='border-border'>
                        <TableCell className='text-muted-foreground'>
                          {session.date}
                        </TableCell>
                        <TableCell className='font-medium text-foreground'>
                          {session.title}
                        </TableCell>
                        <TableCell className='text-muted-foreground'>
                          {session.track}
                        </TableCell>
                        <TableCell className='font-mono text-foreground'>
                          {session.laps}
                        </TableCell>
                        <TableCell className='font-mono text-primary'>
                          {session.bestLap}
                        </TableCell>
                        <TableCell className='font-mono text-foreground'>
                          {session.topSpeed}
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
