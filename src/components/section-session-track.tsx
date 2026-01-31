import { TrackSessionCards } from '@/components/track-session-cards';
import { QueryOptions } from '@/db/types/db.types';
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

  return <TrackSessionCards sessions={sessionMemo} />;
}
