'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

interface SpeedChartProps {
  sessionId: string;
  topSpeed: string;
}

const speedData = [
  { distance: 0, speed: 0 },
  { distance: 200, speed: 120 },
  { distance: 400, speed: 245 },
  { distance: 600, speed: 180 },
  { distance: 800, speed: 280 },
  { distance: 1000, speed: 312 },
  { distance: 1200, speed: 290 },
  { distance: 1400, speed: 150 },
  { distance: 1600, speed: 210 },
  { distance: 1800, speed: 265 },
  { distance: 2000, speed: 185 },
  { distance: 2200, speed: 298 },
  { distance: 2400, speed: 240 },
  { distance: 2600, speed: 180 },
  { distance: 2800, speed: 220 },
  { distance: 3000, speed: 145 },
];

export function SpeedChart({ sessionId, topSpeed }: SpeedChartProps) {
  console.log(
    'Rendering SpeedChart for session:',
    sessionId,
    'topSpeed:',
    topSpeed
  );
  return (
    <Card className='bg-card border-border/50'>
      <CardHeader>
        <CardTitle className='text-foreground'>Speed Trace</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            speed: {
              label: 'Speed (km/h)',
              color: 'hsl(var(--chart-2))',
            },
          }}
          className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={speedData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id='speedGradient' x1='0' y1='0' x2='0' y2='1'>
                  <stop
                    offset='5%'
                    stopColor='hsl(var(--chart-2))'
                    stopOpacity={0.3}
                  />
                  <stop
                    offset='95%'
                    stopColor='hsl(var(--chart-2))'
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='hsl(var(--border))'
              />
              <XAxis
                dataKey='distance'
                stroke='hsl(var(--muted-foreground))'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}m`}
              />
              <YAxis
                domain={[0, 350]}
                stroke='hsl(var(--muted-foreground))'
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type='monotone'
                dataKey='speed'
                stroke='hsl(var(--chart-2))'
                strokeWidth={2}
                fill='url(#speedGradient)'
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
