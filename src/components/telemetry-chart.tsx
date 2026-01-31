'use client';

import { Card } from '@/components/ui/card';
import { formatLapTime, formatTime } from '@/lib/format-utils';
import type { Lap } from '@/types/laps.type';
import type { TelemetryPointApp } from '@/types/telemetry.type';
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

interface TelemetryChartProps {
  selectedLap: number;
  laps: Lap[];
  telemetry?: TelemetryPointApp[];
}

export function TelemetryChart({
  selectedLap,
  laps,
  telemetry,
}: TelemetryChartProps) {
  const lap = laps.find((lap) => lap.lapNumber === selectedLap);

  const downsampledTelemetry = useMemo(() => {
    if (!telemetry) {
      return [] as TelemetryPointApp[];
    }
    let telemetryFiltered = telemetry.filter(
      (point) => point.lapNumber === selectedLap,
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
        ...dataPoint,
        timestamp,
        speedKmh: dataPoint.speedKmh,
        gForceX: dataPoint.gForceX,
        leanAngle: dataPoint.leanAngle,
      };
    });

    return formatedTelemetry;
  }, [selectedLap, telemetry]);

  if (!lap || !telemetry) {
    return (
      <Card className='bg-card border-border p-4'>
        <div className='text-center text-muted-foreground'>
          No telemetry data available for Lap {selectedLap}.
        </div>
      </Card>
    );
  }

  return (
    <Card className='bg-card border-border p-4'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <div className='text-xs text-muted-foreground uppercase tracking-wider'>
            Telemetry Data
          </div>
          <div className='text-lg font-semibold text-foreground'>
            Lap {selectedLap} - {formatLapTime(lap.lapTimeSeconds)}
          </div>
        </div>
        <div className='flex items-center gap-6 text-xs'>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-chart-1'></div>
            <span className='text-muted-foreground'>Speed</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-chart-2'></div>
            <span className='text-muted-foreground'>Acc/Brk G</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-3 h-3 rounded-full bg-chart-3'></div>
            <span className='text-muted-foreground'>Cornering G</span>
          </div>
        </div>
      </div>

      <div className='overflow-x-scroll sm:overflow-auto'>
        <div className='h-[250px] lg:h-[300px] w-dvh sm:w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={downsampledTelemetry}
              margin={{ top: 10, right: 50, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
              <XAxis
                dataKey='timestamp'
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
                dataKey='speedKmh'
                stroke='#ef4444'
                dot={false}
                strokeWidth={2}
                name='Speed (kph)'
              />
              <Line
                yAxisId='g-force'
                type='monotone'
                dataKey='gForceX'
                stroke='#22c55e'
                dot={false}
                strokeWidth={2}
                name='Acc/Brk G'
              />
              <Line
                yAxisId='g-force'
                type='monotone'
                dataKey='leanAngle'
                stroke='#3b82f6'
                dot={false}
                strokeWidth={2}
                name='Lean Angle'
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
