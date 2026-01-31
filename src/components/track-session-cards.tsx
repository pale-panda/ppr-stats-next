'use client';
import { PageSizeSelector } from '@/components/page-size-selector';
import { SessionCard } from '@/components/session-card';
import { TrackSessionPagination } from '@/components/track-session-pagination';
import type { QueryOptions } from '@/db/types/db.types';
import {
  formatDuration,
  formatLapTime,
  formatSessionDate,
} from '@/lib/format-utils';
import type { Session, SessionCondensed } from '@/types';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';

interface TrackSessionCardsProps {
  sessions: Promise<{
    data?: Session[] | SessionCondensed[];
    meta: QueryOptions;
  }>;
}

function createSessionUrl(
  session: Session | SessionCondensed,
  pathname: string | undefined = '',
) {
  return `${pathname}${session.tracks?.slug}/${new Date(session.sessionDate).getFullYear()}/${session.id}`;
}

export function TrackSessionCards({ sessions }: TrackSessionCardsProps) {
  const { data, meta } = use(sessions);
  const searchParams = useSearchParams();

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {!data || data.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No sessions found. Upload your first session to get started!
            </p>
          </div>
        ) : (
          data.map((session) => (
            <SessionCard
              key={session.id}
              title={`${session.tracks?.name}`}
              track={session.tracks ? session.tracks.name : 'Unknown Track'}
              date={formatSessionDate(session.sessionDate)}
              laps={session.totalLaps || 0}
              bestLap={formatLapTime(session.bestLapTimeSeconds)}
              status='completed'
              imageUrl={session.tracks?.imageUrl ?? null}
              url={createSessionUrl(session)}
              duration={formatDuration(session.durationSeconds || 0)}
            />
          ))
        )}
      </div>
      <div className='flex flex-col gap-4 md:flex-row py-6'>
        <div className={'w-50 flex-none hidden md:block'} />
        <div className='w-50 flex-none'></div>
        <TrackSessionPagination meta={meta} searchParams={searchParams} />
        <PageSizeSelector meta={meta} searchParams={searchParams} />
      </div>
    </>
  );
}
