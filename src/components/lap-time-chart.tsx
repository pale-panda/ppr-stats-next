'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
} from 'recharts';

interface LapTimeChartProps {
  sessionId: string;
  bestLap: string;
}

const lapData = [
  { lap: 1, time: 105.234, delta: 2.387 },
  { lap: 2, time: 104.112, delta: 1.265 },
  { lap: 3, time: 103.567, delta: 0.72 },
  { lap: 4, time: 102.847, delta: 0 },
  { lap: 5, time: 103.891, delta: 1.044 },
  { lap: 6, time: 103.234, delta: 0.387 },
  { lap: 7, time: 104.567, delta: 1.72 },
  { lap: 8, time: 103.012, delta: 0.165 },
  { lap: 9, time: 102.987, delta: 0.14 },
  { lap: 10, time: 103.456, delta: 0.609 },
];

export function LapTimeChart({ sessionId, bestLap }: LapTimeChartProps) {
  console.log(
    'Rendering LapTimeChart for session:',
    sessionId,
    'bestLap:',
    bestLap
  );

  return (
    <Card className='bg-card border-border/50'>
      <CardHeader>
        <CardTitle className='text-foreground'>Lap Times</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            time: {
              label: 'Lap Time (s)',
              color: 'hsl(var(--chart-1))',
            },
          }}
          className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={lapData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='hsl(var(--border))'
              />
              <XAxis
                dataKey='lap'
                stroke='hsl(var(--muted-foreground))'
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[100, 110]}
                stroke='hsl(var(--muted-foreground))'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}s`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type='monotone'
                dataKey='time'
                stroke='var(--color-time)'
                strokeWidth={2}
                dot={{ fill: 'var(--color-time)', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: 'var(--color-time)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
