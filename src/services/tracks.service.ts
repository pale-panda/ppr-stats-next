'use server';
import 'server-only';

import { LapsDAL } from '@/db/laps.dal';
import { SessionsDAL } from '@/db/sessions.dal';
import { asInt } from '@/db/utils/helpers';
import { TracksDAL } from '@/db/tracks.dal';
import {
  mapTrackRowsToApp,
  mapTrackRowToApp,
  mapTrackStatsRowsToApp,
} from '@/lib/mappers/track.mapper';
import { DEFAULT_PAGE_LIMIT } from '@/lib/data/constants';
import { createClient } from '@/lib/supabase/server';
import type { SearchParams, StatItem } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Clock, Flag, Gauge, Zap } from 'lucide-react';
import { cache } from 'react';

export const getTracks = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  const data = await TracksDAL.listTracks(db, searchParams);
  const pageSize = asInt(searchParams.limit, DEFAULT_PAGE_LIMIT);

  return {
    items: mapTrackRowsToApp(data.items),
    nextCursor: data.nextCursor,
    pageSize,
  };
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

export const getAllTracks = cache(async () => {
  const db: SupabaseClient = await createClient();
  const data = await TracksDAL.getAllTracks(db);

  return mapTrackRowsToApp(data);
});

export const getTracksWithStats = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  const res = await TracksDAL.getTracksWithStats(db, searchParams);
  const pageSize = asInt(searchParams.limit, DEFAULT_PAGE_LIMIT);

  return {
    items: res.items ? mapTrackStatsRowsToApp(res.items) : undefined,
    nextCursor: res.nextCursor,
    pageSize,
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
