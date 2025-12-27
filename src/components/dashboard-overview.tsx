'use client';

import { Progress } from '@/components/ui/progress';
import { Flag, Gauge, Zap, Activity, Wind, Bike } from 'lucide-react';
import { LapTimeChart } from '@/components/lap-time-chart';
import { SpeedChart } from '@/components/speed-chart';
import {
  formatGForce,
  formatLapTime,
  formatLeanAngle,
  formatSpeed,
  formatTrackLength,
} from '@/lib/format-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrackSessionJoined } from '@/types';

interface DashboardOverviewProps {
  trackSession: TrackSessionJoined;
}

export function DashboardOverview({ trackSession }: DashboardOverviewProps) {
  if (!trackSession) {
    return <div>Session not found.</div>;
  }

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
                  {formatSpeed(trackSession.max_speed)}
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
                  {formatSpeed(trackSession.avg_speed)}
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
                  {trackSession.total_laps}
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
                  {formatLapTime(trackSession.best_lap_time_seconds)}
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
          sessionId={trackSession.id}
          bestLap={formatLapTime(trackSession.best_lap_time_seconds)}
        />
        <SpeedChart
          sessionId={trackSession.id}
          topSpeed={formatSpeed(trackSession.max_speed)}
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
                {trackSession.track ? trackSession.track.name : 'N/A'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Country</span>
              <span className='text-foreground font-mono'>
                {trackSession.track ? trackSession.track.country : 'N/A'}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Length</span>
              <span className='text-foreground font-mono'>
                {formatTrackLength(
                  trackSession.track ? trackSession.track.length_meters : 0
                )}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Data Source</span>
              <span className='text-foreground font-mono'>
                {trackSession.data_source}
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
                  {formatLeanAngle(trackSession.max_lean_angle)}
                </span>
              </div>
              <Progress
                value={
                  trackSession.laps && trackSession.laps.length > 0
                    ? (trackSession.max_lean_angle / 65) * 100
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
                  {formatGForce(trackSession.max_g_force_x)}
                </span>
              </div>
              <Progress
                value={
                  trackSession.laps && trackSession.laps.length > 0
                    ? (trackSession.max_g_force_x / 2) * 100
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
                  {formatGForce(trackSession.max_g_force_z)}
                </span>
              </div>
              <Progress
                value={
                  trackSession.laps && trackSession.laps.length > 0
                    ? (trackSession.max_g_force_z / 3) * 100
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
