'use client';
import { SessionCard } from '@/components/session-card';
import { formatLapTime } from '@/lib/format-utils';
import { TrackSessionPagination } from '@/components/track-session-pagination';
import { useFetchTrackSessionsQuery } from '@/state/services/track-session';
import { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/lib/data/constants';

interface TrackSessionSectionProps {
  query?: string;
  currentPage?: number;
  orderBy?: string;
  pageSize?: number;
  sort?: 'asc' | 'desc';
}

export function TrackSessionCards({ ...props }: TrackSessionSectionProps) {
  if (props.query) {
    // Implement search functionality here in the future
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const {
    data: sessionData,
    error,
    isLoading,
  } = useFetchTrackSessionsQuery({ page: currentPage, pageSize });

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

  const sessions = sessionData?.sessions || [];
  const meta = sessionData?.meta;

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
      <TrackSessionPagination
        className='py-6'
        meta={meta}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        isLoading={isLoading}
        size={{ pageSize, setPageSize }}
      />
    </>
  );
}
