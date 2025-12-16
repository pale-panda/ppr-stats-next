'use client';
import { useEffect } from 'react';
import { SessionCard } from '@/components/session-card';
import { formatLapTime } from '@/lib/format-utils';
import { type DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import { PaginationMeta, TrackSessionJoined } from '@/types';
import useSWR from 'swr';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/state/store';
import { TRACK_SESSION_LIMIT_CARDS } from '@/lib/data/constants';
import { AppPagination } from '@/components/app-pagination';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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
  const url = `/api/sessions?query=${query}&page=${currentPage}&order_by=${orderBy}&sort=${sort}&limit=${limit}`;

  const { data, error, isLoading } = useSWR<{
    sessions: TrackSessionJoined[];
    meta: PaginationMeta;
  }>(url, fetcher);

  const filter = useSelector((state: RootState) => state.filter.country);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log('filter to parse: ', filter);
  }, [filter]);

  if (error) return <div>Error loading sessions.</div>;
  if (isLoading) return <div>Loading sessions...</div>;

  const sessions = data?.sessions || [];
  const meta = data?.meta;

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
      <AppPagination meta={meta} className='py-6' />
    </div>
  );
}
