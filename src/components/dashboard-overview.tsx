'use client';

import { LapTimeChart } from '@/components/lap-time-chart';
import { SpeedChart } from '@/components/speed-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  formatGForce,
  formatLapTime,
  formatLeanAngle,
  formatSpeed,
  formatTrackLength,
} from '@/lib/format-utils';
import type { SessionFull } from '@/types';
import { Activity, Bike, Flag, Gauge, Wind, Zap } from 'lucide-react';
import { use } from 'react';

interface DashboardOverviewProps {
  trackSession: Promise<SessionFull | null>;
}

export function DashboardOverview({ trackSession }: DashboardOverviewProps) {
  const session = use(trackSession);
  if (!session) {
    return <div>Session not found.</div>;
  }

  const { tracks, laps } = session;

  return (
    <>
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
                  {formatSpeed(session.maxSpeed ?? 0)}
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
                  {formatSpeed(session.avgSpeed ?? 0)}
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
                  {session.totalLaps}
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
                  {formatLapTime(session.bestLapTimeSeconds)}
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
          sessionId={session.id}
          bestLap={formatLapTime(session.bestLapTimeSeconds)}
        />
        <SpeedChart
          sessionId={session.id}
          topSpeed={formatSpeed(session.maxSpeed ?? 0)}
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
                {tracks ? tracks.name : 'N/A'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Country</span>
              <span className='text-foreground font-mono'>
                {tracks ? tracks.country : 'N/A'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Length</span>
              <span className='text-foreground font-mono'>
                {formatTrackLength(tracks.lengthMeters ?? 0)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Data Source</span>
              <span className='text-foreground font-mono'>
                {session.dataSource}
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
                <span className='text-muted-foreground'>Max Lean Angle</span>
                <span className='text-foreground font-mono'>
                  {formatLeanAngle(session.maxLeanAngle ?? 0)}
                </span>
              </div>
              <Progress
                value={
                  laps && laps.length > 0
                    ? ((session.maxLeanAngle ?? 0) / 65) * 100
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
                  {formatGForce(session.maxGForceX ?? 0)}
                </span>
              </div>
              <Progress
                value={
                  laps && laps.length > 0
                    ? ((session.maxGForceX ?? 0) / 2) * 100
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
                  {formatGForce(session.maxGForceZ ?? 0)}
                </span>
              </div>
              <Progress
                value={
                  laps && laps.length > 0
                    ? ((session.maxGForceZ ?? 0) / 3) * 100
                    : 0
                }
                className='h-2'
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
