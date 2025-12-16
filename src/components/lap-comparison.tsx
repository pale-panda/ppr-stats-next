'use client';

import { Card } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatLapTime } from '@/lib/format-utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatSpeed } from '@/lib/format-utils';
import { Laps } from '@/types';

interface LapComparisonProps {
  lap1: number;
  lap2: number;
  laps: Laps;
}

export function LapComparison({ lap1, lap2, laps }: LapComparisonProps) {
  const lap1Data = laps[lap1 - 1];
  const lap2Data = laps[lap2 - 1];

  const telemetry1 = [
    {
      time: lap1Data.lap_time_seconds,
      speed: lap1Data.max_speed_kmh,
      accBrkG: lap1Data.max_g_force_x,
    },
  ];
  const telemetry2 = [
    {
      time: lap2Data.lap_time_seconds,
      speed: lap2Data.max_speed_kmh,
      accBrkG: lap2Data.max_g_force_x,
    },
  ];

  // Merge telemetry data for comparison chart
  const mergedTelemetry = telemetry1.map((t1, i) => ({
    time: t1.time,
    speed1: t1.speed,
    speed2: telemetry2[i]?.speed || 0,
    accBrkG1: t1.accBrkG,
    accBrkG2: telemetry2[i]?.accBrkG || 0,
  }));

  const getDelta = (val1: number, val2: number, inverse = false) => {
    const delta = inverse ? val2 - val1 : val1 - val2;
    if (Math.abs(delta) < 0.01)
      return {
        delta: 0,
        color: 'text-muted-foreground',
        icon: Minus,
        better: null,
      };
    const isBetter = inverse ? delta < 0 : delta > 0;
    return {
      delta,
      color: isBetter ? 'text-green-500' : 'text-red-500',
      icon: isBetter ? TrendingUp : TrendingDown,
      better: isBetter,
    };
  };

  const comparisons = [
    {
      label: 'Lap Time',
      val1: lap1Data.lap_time_seconds,
      val2: lap2Data.lap_time_seconds,
      format: formatLapTime,
      inverse: true,
    },
    {
      label: 'Sector 1',
      val1: lap1Data.sector_1,
      val2: lap2Data.sector_1,
      format: formatLapTime,
      inverse: true,
    },
    {
      label: 'Sector 2',
      val1: lap1Data.sector_2,
      val2: lap2Data.sector_2,
      format: formatLapTime,
      inverse: true,
    },
    {
      label: 'Sector 3',
      val1: lap1Data.sector_3,
      val2: lap2Data.sector_3,
      format: formatLapTime,
      inverse: true,
    },
    {
      label: 'Max Speed',
      val1: lap1Data.max_speed_kmh,
      val2: lap2Data.max_speed_kmh,
      format: (v: number) => formatSpeed(v),
      inverse: false,
    },
  ];

  return (
    <div className='space-y-4'>
      <Card className='bg-card border-border p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div>
            <div className='text-xs text-muted-foreground uppercase tracking-wider'>
              Lap Comparison
            </div>
            <div className='text-lg font-semibold text-foreground'>
              Lap {lap1} vs Lap {lap2}
            </div>
          </div>
          <div className='flex items-center gap-6 text-xs'>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-0.5 bg-red-500'></div>
              <span className='text-muted-foreground'>
                Lap {lap1} ({formatLapTime(lap1Data.lap_time_seconds)})
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-0.5 bg-blue-500'></div>
              <span className='text-muted-foreground'>
                Lap {lap2} ({formatLapTime(lap2Data.lap_time_seconds)})
              </span>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6'>
          {comparisons.map((comp) => {
            const {
              delta,
              color,
              icon: Icon,
            } = getDelta(comp.val1, comp.val2, comp.inverse);
            return (
              <div
                key={comp.label}
                className='text-center p-3 bg-secondary rounded-lg'>
                <div className='text-xs text-muted-foreground mb-1'>
                  {comp.label}
                </div>
                <div className='space-y-1'>
                  <div className='font-mono text-sm text-red-400'>
                    {comp.format(comp.val1)}
                  </div>
                  <div className='font-mono text-sm text-blue-400'>
                    {comp.format(comp.val2)}
                  </div>
                  {delta !== 0 && (
                    <div
                      className={`flex items-center justify-center gap-1 text-xs ${color}`}>
                      <Icon className='w-3 h-3' />
                      {comp.inverse
                        ? delta > 0
                          ? '+'
                          : ''
                        : delta > 0
                        ? '+'
                        : ''}
                      {delta.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className='h-[250px] lg:h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={mergedTelemetry}
              margin={{ top: 10, right: 50, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
              <XAxis
                dataKey='time'
                stroke='#6b7280'
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                interval={19}
              />
              <YAxis
                yAxisId='speed'
                stroke='#6b7280'
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                domain={[0, 250]}
                label={{
                  value: 'Speed',
                  angle: -90,
                  position: 'insideLeft',
                  fill: '#9ca3af',
                  fontSize: 11,
                }}
              />
              <YAxis
                yAxisId='g-force'
                orientation='right'
                stroke='#6b7280'
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                domain={[-1.5, 1.5]}
                label={{
                  value: 'G-Force',
                  angle: 90,
                  position: 'insideRight',
                  fill: '#9ca3af',
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                }}
                labelStyle={{ color: '#f3f4f6' }}
              />
              <ReferenceLine
                yAxisId='g-force'
                y={0}
                stroke='#4b5563'
                strokeDasharray='3 3'
              />
              <Line
                yAxisId='speed'
                type='monotone'
                dataKey='speed1'
                stroke='#ef4444'
                dot={false}
                strokeWidth={2}
                name={`Lap ${lap1} Speed`}
              />
              <Line
                yAxisId='speed'
                type='monotone'
                dataKey='speed2'
                stroke='#3b82f6'
                dot={false}
                strokeWidth={2}
                name={`Lap ${lap2} Speed`}
              />
              <Line
                yAxisId='g-force'
                type='monotone'
                dataKey='accBrkG1'
                stroke='#f87171'
                dot={false}
                strokeWidth={1}
                strokeDasharray='4 2'
                name={`Lap ${lap1} Acc/Brk G`}
              />
              <Line
                yAxisId='g-force'
                type='monotone'
                dataKey='accBrkG2'
                stroke='#60a5fa'
                dot={false}
                strokeWidth={1}
                strokeDasharray='4 2'
                name={`Lap ${lap2} Acc/Brk G`}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
