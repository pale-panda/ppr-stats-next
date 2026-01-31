import { AppBreadcrumb } from '@/components/app-breadcrumb';
import { TrackSessionCards } from '@/components/track-session-cards';
import { QueryOptions } from '@/db/types/db.types';
import { breadcrumbLinks } from '@/lib/data/breadcrumb-links';
import { Session, SessionCondensed } from '@/types/sessions.type';
import type { TrackSessionsBySlug } from '@/types/slug.type';
import { use, useMemo } from 'react';

interface SectionSessionTrackProps {
  sessions: Promise<TrackSessionsBySlug | null>;
}

type TrackSessionCardsData = Promise<{
  data?: Session[] | SessionCondensed[];
  meta: QueryOptions;
}>;

export function SectionSessionTrack({ sessions }: SectionSessionTrackProps) {
  const data = use(sessions);

  const sessionMemo = useMemo(() => {
    if (!data) return [];
    const trackData = {
      name: data.name,
      slug: data.slug,
      imageUrl: data.imageUrl,
    };
    const meta = {
      page: 1,
      pageSize: data.sessions.length,
      total: data.sessions.length,
    } as unknown as QueryOptions;

    const sessionData = data.sessions.map((session) => ({
      id: session.id,
      sessionDate: session.sessionDate,
      bestLapTimeSeconds: session.lapStats[0]?.bestLapTimeSeconds || 0,
      totalLaps: session.lapStats[0]?.totalLaps || 0,
      tracks: trackData,
    })) as SessionCondensed[];

    return new Promise((resolve) => resolve({ data: sessionData, meta }));
  }, [data]) as TrackSessionCardsData;

  if (!data) {
    return <div>No session data available.</div>;
  }

  /*
  return (
    <section>
      <div className='container mx-auto px-4 py-8'>
        <AppBreadcrumb {...breadcrumbLinks} />
        <h1 className='text-3xl font-bold mb-4'>
          Session @ {data.name}
        </h1>
        <div className='bg-white shadow rounded-lg p-6'>
          <h2 className='text-2xl font-semibold mb-2'>{data.name}</h2>
          <p className='text-gray-600 mb-4'>
            {data.sessions[0]?.sessionDate}
          </p>
          <div>
            <h3 className='text-xl font-semibold mb-2'>Overview</h3>
            <p className='text-gray-700'>
              {data.sessions[0]?.sessionType}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
  */

  if (!data) {
    return <div>No session data available.</div>;
  }

  return (
    <section className='container mx-auto px-4 py-8'>
      <AppBreadcrumb {...breadcrumbLinks} />
      <h1 className='text-3xl font-bold mb-4'>Sessions @ {data.name}</h1>
      <TrackSessionCards sessions={sessionMemo} />
    </section>
  );
}
