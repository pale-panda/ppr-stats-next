import { Separator } from '@/components/ui/separator';
import {
  formatLeanAngle,
  formatSpeed,
  formatTrackLength,
} from '@/lib/format-utils';
import type { SessionFull } from '@/types';
import { use } from 'react';

export default function TrackSessionDetails({
  session,
}: {
  session: Promise<SessionFull | null>;
}) {
  const data = use(session);
  if (!data) {
    return null;
  }
  const track = data.tracks;
  const laps = data.laps;

  return (
    <>
      <div className='flex justify-between items-center'>
        <span className='text-muted-foreground'>Avg Speed</span>
        <span className='font-mono text-foreground'>
          {formatSpeed(
            laps
              .map((lap) => lap.maxSpeedKmh ?? 0)
              .reduce((a, b) => b && a! + b, 0) / laps.length
          )}
        </span>
      </div>
      <Separator className='bg-border/50' />
      <div className='flex justify-between items-center'>
        <span className='text-muted-foreground'>Data Source</span>
        <span className='font-mono text-foreground'>
          {data.dataSource || 'N/A'}
        </span>
      </div>
      <Separator className='bg-border/50' />
      <div className='flex justify-between items-center'>
        <span className='text-muted-foreground'>Track Length</span>
        <span className='font-mono text-foreground'>
          {formatTrackLength(track.lengthMeters ?? 0)}
        </span>
      </div>
      <Separator className='bg-border/50' />
      <div className='flex justify-between items-center'>
        <span className='text-muted-foreground'>Turns</span>
        <span className='font-mono text-foreground'>
          {track.turns || 'N/A'}
        </span>
      </div>
      <Separator className='bg-border/50' />
      <div className='flex justify-between items-center'>
        <span className='text-muted-foreground'>Max Lean Angle</span>
        <span className='font-mono text-foreground'>
          {formatLeanAngle(
            laps
              .map((lap) => lap.maxLeanAngle ?? 0)
              .reduce((a, b) => (b !== null ? a! + b : a), 0) / laps.length
          )}
        </span>
      </div>
    </>
  );
}
