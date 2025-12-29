'use client';
import { PageSizeSelector } from '@/components/page-size-selector';
import { SessionCard } from '@/components/session-card';
import { TrackSessionPagination } from '@/components/track-session-pagination';
import { formatLapTime } from '@/lib/format-utils';
import { useFetchTrackSessionsQuery } from '@/state/services/track-session';
import { useSearchParams } from 'next/navigation';

export function TrackSessionCards() {
  const searchParams = useSearchParams();
  const query = searchParams.toString();

  const {
    data: sessionData,
    error,
    isLoading,
  } = useFetchTrackSessionsQuery(query);

  if (error) {
    return (
      <div className='text-center py-12'>
        <p className='text-red-500'>
          Error loading sessions. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>Loading sessions...</p>
      </div>
    );
  }

  if (!sessionData || !sessionData.sessions || !sessionData.meta) {
    return (
      <div className='text-center py-12'>
        <p className='text-muted-foreground'>No session data available.</p>
      </div>
    );
  }

  const sessions = sessionData.sessions || [];
  const meta = sessionData.meta;

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {sessions.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>
              No sessions found. Upload your first session to get started!
            </p>
          </div>
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              id={session.id}
              title={`${session.session_type} Session`}
              track={session.track ? session.track.name : 'Unknown Track'}
              date={new Date(session.session_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
              laps={session.total_laps}
              bestLap={formatLapTime(session.best_lap_time_seconds)}
              status='completed'
              imageUrl={
                session.track ? session.track.image_url : '/default-track.jpg'
              }
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
