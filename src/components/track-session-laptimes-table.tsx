import { Badge } from '@/components/ui/badge';
import {
  formatLapTime,
  formatLeanAngle,
  formatSpeed,
} from '@/lib/format-utils';
import type { SessionAppFull } from '@/types/sessions.type';
import { use } from 'react';

export default function TrackSessionLapTimesTable({
  session,
}: {
  session: Promise<SessionAppFull | null>;
}) {
  const data = use(session);
  if (!data) {
    return null;
  }
  const laps = data.laps || [];

  laps.sort((a, b) => a.lapNumber - b.lapNumber);

  return (
    <div className='overflow-x-auto'>
      <table className='w-full'>
        <thead>
          <tr className='border-b border-border'>
            <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
              Lap
            </th>
            <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
              Time
            </th>
            <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
              Max Speed
            </th>
            <th className='text-left py-3 px-2 text-xs uppercase tracking-wider text-muted-foreground'>
              Lean Angle
            </th>
          </tr>
        </thead>
        <tbody>
          {laps.map((lap) => {
            const isFastest = lap.lapTimeSeconds === data.bestLapTimeSeconds;
            return (
              <tr
                key={lap.lapNumber}
                className={`border-b border-border/50 ${
                  isFastest ? 'bg-primary/10' : ''
                }`}>
                <td className='py-3 px-2 font-mono text-foreground'>
                  {lap.lapNumber}
                </td>
                <td
                  className={`py-3 px-2 font-mono font-medium ${
                    isFastest ? 'text-primary' : 'text-foreground'
                  }`}>
                  {formatLapTime(lap.lapTimeSeconds)}
                  {isFastest && (
                    <Badge
                      variant='outline'
                      className='ml-2 text-primary border-primary'>
                      Fastest
                    </Badge>
                  )}
                </td>
                <td className='py-3 px-2 font-mono text-muted-foreground'>
                  {formatSpeed(lap.maxSpeedKmh)}
                </td>
                <td className='py-3 px-2 font-mono text-muted-foreground'>
                  {formatLeanAngle(lap.maxLeanAngle)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
