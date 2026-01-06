'use server';

import { TracksDAL } from '@/db/tracks.dal';
import {
  mapTrackRowsToApp,
  mapTrackRowToApp,
} from '@/lib/mappers/track.mapper';
import { createClient } from '@/lib/supabase/server';
import { getSessionsFull } from '@/services/sessions.service';
import type { Lap, SearchParams, StatItem, Track } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Clock, Flag, Gauge, Zap } from 'lucide-react';
import { cache } from 'react';

export const getTracks = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  const data = await TracksDAL.listTracks(db, searchParams);

  return { data: mapTrackRowsToApp(data.data), meta: data.meta };
});

export const getTrackById = cache(async (id: string) => {
  const db: SupabaseClient = await createClient();
  const data = await TracksDAL.getTrackById(db, id);

  return data ? mapTrackRowToApp(data) : null;
});

export const getTracksWithStats = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  const res = await TracksDAL.listTracks(db, searchParams);

  if (res.data.length === 0) {
    return { data: [], meta: res.meta };
  }

  const tracks = mapTrackRowsToApp(res.data);

  const { data: sessions } = await getSessionsFull({
    ...searchParams,
    track_id: tracks.flatMap((t) => t.id),
  });

  const tracksWithStats = await Promise.all(
    tracks.map(async (track: Track) => {
      const trackSessions = sessions.filter((s) => s.trackId === track.id);
      const totalLaps = trackSessions.reduce((sum, s) => sum + s.totalLaps, 0);
      const allLaps = trackSessions.flatMap((s) => s.laps) as Lap[];
      const bestLapTime =
        allLaps.length > 0
          ? Math.min(
              ...allLaps.map((l) => (l.lapTimeSeconds ? l.lapTimeSeconds : 0))
            )
          : null;
      const avgTopSpeed =
        allLaps.length > 0
          ? Math.round(
              allLaps.reduce((sum, l) => sum + (l.maxSpeedKmh || 0), 0) /
                allLaps.length
            )
          : null;

      return {
        ...track,
        stats: {
          totalSessions: sessions.length,
          totalLaps,
          bestLapTime,
          avgTopSpeed,
        },
      };
    })
  );

  return { data: tracksWithStats, meta: res.meta };
});

export const getTrackDashboardStats = cache(
  async (searchParams: SearchParams) => {
    //const db: SupabaseClient = await createClient();
    const { data: tracks, meta } = await getTracksWithStats(searchParams);

    const totalTracks = meta.count;
    const totalSessions = tracks.reduce(
      (sum, t) => sum + t.stats.totalSessions,
      0
    );
    const totalLaps = tracks.reduce((sum, t) => sum + t.stats.totalLaps, 0);
    const combinedLength = Math.round(
      tracks.reduce((sum, t) => sum + (t.lengthMeters || 0), 0) / 1000
    );

    const data = {
      totalTracks: totalTracks || 0,
      totalSessions: totalSessions || 0,
      totalLaps: totalLaps || 0,
      combinedLengthKm: combinedLength || 0,
    };

    const statsList: StatItem[] = [
      {
        label: 'Total Tracks',
        value: data.totalTracks,
        sublabel: 'Currently in the database',
        icon: Zap,
      },
      {
        label: 'Total Sessions',
        value: data.totalSessions,
        sublabel: 'Across all tracks',
        icon: Gauge,
      },
      {
        label: 'Total Laps',
        value: data.totalLaps,
        sublabel: 'Across all tracks',
        icon: Clock,
      },
      {
        label: 'Combined Length',
        value: data.combinedLengthKm + ' km',
        sublabel: 'Across all tracks',
        icon: Flag,
      },
    ];

    return statsList;
  }
);
