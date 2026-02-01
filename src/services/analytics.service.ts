'use server';
import 'server-only';

import { AnalyticsDAL } from '@/db/analytics.dal';
import {
  mapAnalyticsSessionRowsToDomain,
  type AnalyticsSessionRow,
} from '@/lib/mappers/analytics.mapper';
import { createClient } from '@/lib/supabase/server';
import type { AnalyticsData } from '@/types/analytics.type';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getAnalyticsData = cache(
  async (slug?: string): Promise<AnalyticsData> => {
    const supabase: SupabaseClient = await createClient();

    const sessionsRaw = await AnalyticsDAL.listAnalyticsSessions(
      supabase,
      slug,
    );

    const sessions = mapAnalyticsSessionRowsToDomain(
      (sessionsRaw ?? []) as unknown as AnalyticsSessionRow[],
    );

    const allLaps = sessions.flatMap((s) => s.laps);
    const allTimes = allLaps.map((l) => l.lapTimeSeconds).filter((t) => t > 0);

    const bestLapTime = allTimes.length ? Math.min(...allTimes) : 0;
    const avgLapTime = allTimes.length
      ? allTimes.reduce((sum, t) => sum + t, 0) / allTimes.length
      : 0;
    const totalLaps = allLaps.length;
    const topSpeed = Math.max(...allLaps.map((l) => l.maxSpeedKmh ?? 0));

    return {
      sessions,
      bestLapTime,
      avgLapTime,
      totalLaps,
      topSpeed,
    };
  },
);
