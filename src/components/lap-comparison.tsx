'use client';

import { Card } from '@/components/ui/card';
import { formatLapTime, formatSpeed, formatTime } from '@/lib/format-utils';
import type { Lap, TelemetryPointApp } from '@/types';
import { Minus, TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface LapComparisonProps {
  lap1: number;
  lap2: number;
  laps: Lap[];
  telemetry1?: TelemetryPointApp[];
  telemetry2?: TelemetryPointApp[];
}

export function LapComparison({
  lap1,
  lap2,
  laps,
  telemetry1,
  telemetry2,
}: LapComparisonProps) {
  const lap1Data = laps[lap1 - 1];
  const lap2Data = laps[lap2 - 1];

  const downsampledTelemetryLap1 = useMemo(() => {
    if (!telemetry1) {
      return [] as TelemetryPointApp[];
    }
    let telemetryFiltered = telemetry1.filter(
      (point) => point.lapNumber === lap1,
    ) as TelemetryPointApp[];
    const maxRows = 200;
    const step = Math.ceil(telemetryFiltered.length / maxRows);

    telemetryFiltered = telemetryFiltered.filter(
      (_, index) => index % step === 0,
    );

    const formatedTelemetry = telemetryFiltered.map((dataPoint) => {
      const ts = dataPoint.timestamp;
      const timestamp = formatTime(
        (new Date(ts).getTime() -
          new Date(telemetryFiltered[0]?.timestamp).getTime()) /
          1000,
      );
      // support both camelCase (app) and snake_case (db) shapes
      return {
        timestamp,
        speedKmh: dataPoint.speedKmh,
        gForceX: dataPoint.gForceX,
        leanAngle: dataPoint.leanAngle,
      };
    });

    return formatedTelemetry;
  }, [lap1, telemetry1]);

  const downsampledTelemetryLap2 = useMemo(() => {
    if (!telemetry2) {
      return [] as TelemetryPointApp[];
    }
    let telemetryFiltered = telemetry2.filter(
      (point) => point.lapNumber === lap2,
    ) as TelemetryPointApp[];
    const maxRows = 200;
    const step = Math.ceil(telemetryFiltered.length / maxRows);

    telemetryFiltered = telemetryFiltered.filter(
      (_, index) => index % step === 0,
    );

    const formatedTelemetry = telemetryFiltered.map((dataPoint) => {
      const ts = dataPoint.timestamp;
      const timestamp = formatTime(
        (new Date(ts).getTime() -
          new Date(telemetryFiltered[0]?.timestamp).getTime()) /
          1000,
      );
      // support both camelCase (app) and snake_case (db) shapes
      return {
        timestamp,
        speedKmh: dataPoint.speedKmh,
        gForceX: dataPoint.gForceX,
        leanAngle: dataPoint.leanAngle,
      };
    });

    return formatedTelemetry;
  }, [lap2, telemetry2]);

  const mergedTelemetry = downsampledTelemetryLap1.map((t1, i) => ({
    time: t1.timestamp,
    speed1: t1.speedKmh || 0,
    speed2: downsampledTelemetryLap2[i]?.speedKmh || 0,
    accBrkG1: t1.gForceX || 0,
    accBrkG2: downsampledTelemetryLap2[i]?.gForceX || 0,
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
      val1: lap1Data.lapTimeSeconds ?? 0,
      val2: lap2Data.lapTimeSeconds ?? 0,
      format: formatLapTime,
      inverse: true,
    },
    {
      label: 'Sector 1',
      val1: lap1Data.sectors[0] ?? 0,
      val2: lap2Data.sectors[0] ?? 0,
      format: formatLapTime,
      inverse: true,
    },
    {
      label: 'Sector 2',
      val1: lap1Data.sectors[1] ?? 0,
      val2: lap2Data.sectors[1] ?? 0,
      format: formatLapTime,
      inverse: true,
    },
    {
      label: 'Sector 3',
      val1: lap1Data.sectors[2] ?? 0,
      val2: lap2Data.sectors[2] ?? 0,
      format: formatLapTime,
      inverse: true,
    },
    {
      label: 'Max Speed',
      val1: lap1Data.maxSpeedKmh ?? 0,
      val2: lap2Data.maxSpeedKmh ?? 0,
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
                Lap {lap1} ({formatLapTime(lap1Data.lapTimeSeconds)})
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <div className='w-3 h-0.5 bg-blue-500'></div>
              <span className='text-muted-foreground'>
                Lap {lap2} ({formatLapTime(lap2Data.lapTimeSeconds)})
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

        <div className='overflow-x-scroll sm:overflow-auto'>
          <div className='h-[250px] lg:h-[300px] w-dvh sm:w-full'>
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
        </div>
      </Card>
    </div>
  );
}
