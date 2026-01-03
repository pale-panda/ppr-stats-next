'use client';

import { Card } from '@/components/ui/card';
import {
  formatDuration,
  formatLapTime,
  formatMinMaxSpeed,
} from '@/lib/format-utils';
import { type SessionFull } from '@/types';
import { Bike, Clock, Flag, Gauge, Target } from 'lucide-react';

export function SessionKPIs({ ...stats }: SessionFull) {
  const kpis = [
    {
      label: 'Vehicle',
      value: stats.vehicle,
      icon: Bike,
    },
    {
      label: 'Duration',
      value: formatDuration(stats.durationDeconds),
      icon: Clock,
    },
    {
      label: 'Best Lap Time',
      value: formatLapTime(stats.bestLapTimeSeconds),
      icon: Flag,
    },
    {
      label: 'Theoretical Best Lap',
      value: formatLapTime(stats.theoreticalBest),
      icon: Target,
    },
    {
      label: 'Max/Min Speed',
      value: formatMinMaxSpeed(stats.minSpeed, stats.maxSpeed),
      icon: Gauge,
    },
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4'>
      {kpis.map((kpi) => (
        <Card key={kpi.label} className='bg-card border-border p-3 lg:p-4'>
          <div className='flex items-start gap-3'>
            <div className='flex items-center justify-center w-8 h-8 rounded bg-secondary'>
              <kpi.icon className='w-4 h-4 text-primary' />
            </div>
            <div className='flex-1 min-w-0'>
              <div className='text-xs text-muted-foreground uppercase tracking-wider truncate'>
                {kpi.label}
              </div>
              <div className='text-sm lg:text-base font-semibold text-foreground mt-0.5 truncate'>
                {kpi.value}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
