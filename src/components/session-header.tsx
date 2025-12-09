'use client';

import { Flag, Settings, Download, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatLapTime } from '@/lib/sessions-data';

interface SessionHeaderProps {
  sessionInfo: {
    track: string;
    sessionIndex: number;
    date: string;
    time: string;
  };
  bestLapTime: number;
}

export function SessionHeader({
  sessionInfo,
  bestLapTime,
}: SessionHeaderProps) {
  return (
    <header className='border-b border-border bg-card px-4 lg:px-6 py-4'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10'>
            <Flag className='w-5 h-5 text-primary' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium text-primary uppercase tracking-wider'>
                Track Sessions
              </span>
              <span className='text-sm text-muted-foreground'>»</span>
              <span className='text-sm text-muted-foreground'>
                #{sessionInfo.sessionIndex.toString().padStart(2, '0')} on{' '}
                {sessionInfo.date} {sessionInfo.time.replace(/\//g, ':')}
              </span>
            </div>
            <h1 className='text-2xl lg:text-3xl font-bold text-foreground mt-1'>
              {sessionInfo.track.trim() || 'Unknown Track'}
            </h1>
          </div>
        </div>

        <div className='flex items-center gap-6'>
          <div className='text-right'>
            <div className='text-xs text-muted-foreground uppercase tracking-wider'>
              Best Lap
            </div>
            <div className='text-2xl lg:text-3xl font-mono font-bold text-primary'>
              {formatLapTime(bestLapTime)}
            </div>
          </div>

          <div className='flex items-center gap-1'>
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-foreground'>
              <Settings className='w-5 h-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-foreground'>
              <Download className='w-5 h-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-foreground'>
              <Share2 className='w-5 h-5' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='text-muted-foreground hover:text-destructive'>
              <Trash2 className='w-5 h-5' />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
