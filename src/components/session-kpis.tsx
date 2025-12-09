'use client';

import { Card } from '@/components/ui/card';
import {
  Clock,
  Gauge,
  Activity,
  Target,
  Thermometer,
  Bike,
} from 'lucide-react';
import { formatLapTime } from '@/lib/sessions-data';

interface SessionKPIsProps {
  stats: {
    duration: number;
    maxSpeed: number;
    minSpeed: number;
    maxCorneringG: number;
    minCorneringG: number;
    theoreticalBest: number;
  };
  sessionInfo: {
    vehicle: string;
    weather: {
      temperature: number;
      pressure: number;
      humidity: number;
    };
  };
}

export function SessionKPIs({ stats, sessionInfo }: SessionKPIsProps) {
  const kpis = [
    {
      label: 'Vehicle',
      value: sessionInfo.vehicle,
      icon: Bike,
    },
    {
      label: 'Duration',
      value: `${stats.duration} minutes`,
      icon: Clock,
    },
    {
      label: 'Max/Min Speed',
      value: `${stats.maxSpeed.toFixed(2)} / ${stats.minSpeed.toFixed(2)} kph`,
      icon: Gauge,
    },
    {
      label: 'Max Lateral/Cornering G',
      value: `${stats.maxCorneringG.toFixed(2)} / ${stats.minCorneringG.toFixed(
        2
      )}`,
      icon: Activity,
    },
    {
      label: 'Theoretical Best Lap',
      value: formatLapTime(stats.theoreticalBest),
      icon: Target,
    },
    {
      label: 'Weather',
      value: `${sessionInfo.weather.temperature}°C, ${sessionInfo.weather.pressure} hPa, ${sessionInfo.weather.humidity}%`,
      icon: Thermometer,
    },
  ];

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4'>
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
