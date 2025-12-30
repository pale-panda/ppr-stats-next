'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatLapTime, formatSessionDate } from '@/lib/format-utils';
import { TrackSessionJoined } from '@/types';
import { ArrowLeft, Flag, Zap } from 'lucide-react';
import Link from 'next/link';

interface DashboardHeaderProps {
  trackSession: TrackSessionJoined;
}

export function DashboardHeader({ trackSession }: DashboardHeaderProps) {
  if (!trackSession || !trackSession.track) {
    return <div>Session not found.</div>;
  }

  return (
    <div className='border-b border-border bg-card/50'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Button variant='ghost' size='icon' asChild>
              <Link href={`/sessions/${trackSession.id}`}>
                <ArrowLeft className='w-5 h-5' />
              </Link>
            </Button>
            <div>
              <div className='flex items-center gap-2'>
                <h1 className='text-xl md:text-2xl font-bold text-foreground'>
                  {trackSession.session_type} Session
                </h1>
                <Badge className='bg-muted text-muted-foreground'>
                  Completed
                </Badge>
              </div>
              <p className='text-sm text-muted-foreground'>
                {trackSession.track.name} •{' '}
                {formatSessionDate(trackSession.session_date)}
              </p>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2 text-sm'>
              <Flag className='w-4 h-4 text-muted-foreground' />
              <span className='font-mono text-foreground'>
                {trackSession.total_laps} laps
              </span>
            </div>
            <div className='flex items-center gap-2 text-sm'>
              <Zap className='w-4 h-4 text-primary' />
              <span className='font-mono text-primary font-medium'>
                {formatLapTime(trackSession.best_lap_time_seconds)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
