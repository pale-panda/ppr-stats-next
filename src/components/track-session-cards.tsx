'use client';
import { SessionCard } from '@/components/session-card';
import { formatLapTime } from '@/lib/format-utils';
import { type DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { TRACK_SESSION_LIMIT_CARDS } from '@/lib/data/constants';
import { TrackSessionPagination } from '@/components/track-session-pagination';
import { getTrackSessions } from '@/state/api/track-session';
import { useEffect } from 'react';

type Checked = DropdownMenuCheckboxItemProps['checked'];

interface TrackSessionSectionProps {
  query?: string;
  currentPage?: number;
  orderBy?: string;
  limit?: number;
  sort?: 'asc' | 'desc';
}

export function TrackSessionCards({
  query = '',
  currentPage = 1,
  orderBy = '',
  limit = TRACK_SESSION_LIMIT_CARDS,
  sort = 'desc',
}: TrackSessionSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const sessions = useSelector((state: RootState) => state.trackSession.data);
  const meta = useSelector((state: RootState) => state.trackSession.meta);

  useEffect(() => {
    dispatch(getTrackSessions(meta.currentPage || currentPage));
  }, [dispatch, meta.currentPage, currentPage]);

  return (
    <div>
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
      <TrackSessionPagination className='py-6' />
    </div>
  );
}
