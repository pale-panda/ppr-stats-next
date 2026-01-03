import { Card, CardContent } from '@/components/ui/card';
import { formatDuration, formatLapTime, formatSpeed } from '@/lib/format-utils';
import type { SessionFull } from '@/types/sessions.type';
import {
  Clock,
  Cloud,
  Flag,
  Gauge,
  Thermometer,
  TrendingUp,
} from 'lucide-react';
import { use } from 'react';

interface TrackSessionStatsProps {
  session: Promise<SessionFull>;
}

export default function TrackSessionStats({ session }: TrackSessionStatsProps) {
  const data = use(session);

  const { laps } = data;

  return (
    <>
      <Card className='bg-card border-border/50'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-2 text-muted-foreground mb-1'>
            <Clock className='w-4 h-4' />
            <span className='text-xs uppercase tracking-wider'>Duration</span>
          </div>
          <p className='text-xl font-mono font-bold text-foreground'>
            {formatDuration(data.durationSeconds)}
          </p>
        </CardContent>
      </Card>
      <Card className='bg-card border-border/50'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-2 text-muted-foreground mb-1'>
            <Flag className='w-4 h-4' />
            <span className='text-xs uppercase tracking-wider'>Laps</span>
          </div>
          <p className='text-xl font-mono font-bold text-foreground'>
            {data.totalLaps}
          </p>
        </CardContent>
      </Card>
      <Card className='bg-card border-border/50'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-2 text-muted-foreground mb-1'>
            <TrendingUp className='w-4 h-4' />
            <span className='text-xs uppercase tracking-wider'>Best Lap</span>
          </div>
          <p className='text-xl font-mono font-bold text-primary'>
            {formatLapTime(data.bestLapTimeSeconds)}
          </p>
        </CardContent>
      </Card>
      <Card className='bg-card border-border/50'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-2 text-muted-foreground mb-1'>
            <Gauge className='w-4 h-4' />
            <span className='text-xs uppercase tracking-wider'>Top Speed</span>
          </div>
          <p className='text-xl font-mono font-bold text-foreground'>
            {formatSpeed(
              laps &&
                laps
                  ?.map((lap) => lap && lap.maxSpeedKmh)
                  .reduce((a, b) => (b && a! > b ? a : b), 0)
            )}
          </p>
        </CardContent>
      </Card>
      <Card className='bg-card border-border/50'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-2 text-muted-foreground mb-1'>
            <Cloud className='w-4 h-4' />
            <span className='text-xs uppercase tracking-wider'>Weather</span>
          </div>
          <p className='text-xl font-mono font-bold text-foreground'>N/A</p>
        </CardContent>
      </Card>
      <Card className='bg-card border-border/50'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-2 text-muted-foreground mb-1'>
            <Thermometer className='w-4 h-4' />
            <span className='text-xs uppercase tracking-wider'>Track Temp</span>
          </div>
          <p className='text-xl font-mono font-bold text-foreground'>N/A</p>
        </CardContent>
      </Card>
    </>
  );
}
