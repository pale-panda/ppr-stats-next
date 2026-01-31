'use server';

import { LapsDAL } from '@/db/laps.dal';
import { SessionsDAL } from '@/db/sessions.dal';
import { TracksDAL } from '@/db/tracks.dal';
import {
  mapTrackRowsToApp,
  mapTrackRowToApp,
  mapTrackStatsRowsToApp,
} from '@/lib/mappers/track.mapper';
import { createClient } from '@/lib/supabase/server';
import type { SearchParams, StatItem } from '@/types';
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

export const getTrackBySlug = cache(async (slug: string) => {
  const db: SupabaseClient = await createClient();
  const data = await TracksDAL.getTrackBySlug(db, slug);

  return data ? mapTrackRowToApp(data) : null;
});

export const getTracksWithStats = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  const res = await TracksDAL.getTracksWithStats(db, searchParams);

  return {
    data: res.data ? mapTrackStatsRowsToApp(res.data) : undefined,
    meta: res.meta,
  };
});

export const getTrackDashboardStats = cache(
  async (searchParams: SearchParams) => {
    const db: SupabaseClient = await createClient();

    const totalTracks = await TracksDAL.countTracks(db, searchParams);
    const totalSessions = await SessionsDAL.countSessions(db, searchParams);
    const totalLaps = await LapsDAL.countLaps(db, searchParams);
    const totalLength = await TracksDAL.getTotalLength(db, searchParams);

    const combinedLength = Math.round(totalLength / 1000);

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
  },
);
