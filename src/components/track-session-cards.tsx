'use client';
import { PageSizeSelector } from '@/components/page-size-selector';
import { SessionCard } from '@/components/session-card';
import { TrackSessionPagination } from '@/components/track-session-pagination';
import type { QueryOptions } from '@/db/types/db.types';
import { formatLapTime } from '@/lib/format-utils';
import type { SessionApp } from '@/types';
import { useSearchParams } from 'next/navigation';
import { use } from 'react';

interface TrackSessionCardsProps {
  sessions: Promise<{
    data?: SessionApp[];
    meta: QueryOptions;
  }>;
}

export function TrackSessionCards({ sessions }: TrackSessionCardsProps) {
  const { data, meta } = use(sessions);
  const searchParams = useSearchParams();

  if (!data) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {data.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No sessions found. Upload your first session to get started!
            </p>
          </div>
        ) : (
          data.map((session) => (
            <SessionCard
              key={session.id}
              id={session.id}
              title={`${session.tracks?.name}`}
              track={session.tracks ? session.tracks.name : 'Unknown Track'}
              date={new Date(session.sessionDate).toLocaleDateString('sv-SE', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              laps={session.totalLaps || 0}
              bestLap={formatLapTime(session.bestLapTimeSeconds)}
              status='completed'
              imageUrl={session.tracks?.imageUrl ?? null}
            />
          ))
        )}
      </div>
      <div className='flex flex-col gap-4 md:flex-row py-6'>
        <div className={'w-50 flex-none hidden md:block'} />
        <TrackSessionPagination meta={meta} searchParams={searchParams} />
        <PageSizeSelector meta={meta} searchParams={searchParams} />
      </div>
    </>
  );
}
