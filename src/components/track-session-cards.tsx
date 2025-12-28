'use client';
import { SessionCard } from '@/components/session-card';
import { formatLapTime } from '@/lib/format-utils';
import { TrackSessionPagination } from '@/components/track-session-pagination';
import { useFetchTrackSessionsQuery } from '@/state/services/track-session';
import { useState } from 'react';
import { DEFAULT_PAGE_SIZE } from '@/lib/data/constants';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export function TrackSessionCards() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const query = searchParams.get('query') || '';
  const page = Number(searchParams.get('page')) || 1;
  const pageSizeParam =
    Number(searchParams.get('pageSize')) || DEFAULT_PAGE_SIZE;

  if (query) {
    // Implement search functionality here in the future
  }

  const [currentPage, setCurrentPage] = useState(page);
  const [pageSize, setPageSize] = useState(pageSizeParam);

  const {
    data: sessionData,
    error,
    isLoading,
  } = useFetchTrackSessionsQuery({
    page: currentPage,
    pageSize: pageSize,
    query,
  });

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

  function onSearchParams(
    param: string,
    value: string | number,
    callback?: (value: string | number) => void
  ) {
    const params: URLSearchParams = new URLSearchParams(searchParams);

    if (value) {
      params.set(param, `${value}`);
    } else {
      params.delete(param);
    }

    const newSearch = params.toString();

    if (callback) {
      callback(value);
    }

    if (param !== 'page') {
      replace(`${pathname}?${newSearch}`);
    }
  }

  const handlePageChange = (newPage: number) =>
    onSearchParams('page', newPage, (page) => setCurrentPage(Number(page)));

  function handlePageSizeChange(newPageSize: string | number) {
    onSearchParams('pageSize', newPageSize, (pageSize) => {
      setPageSize(Number(pageSize));
      setCurrentPage(1);
    });
  }

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
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );
}
