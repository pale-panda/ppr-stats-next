'use server';
import 'server-only';
import { LapsDAL } from '@/db/laps.dal';
import { SessionsDAL } from '@/db/sessions.dal';
import { formatLapTime, formatSpeed } from '@/lib/format-utils';
import { createClient } from '@/lib/supabase/server';
import type { SearchParams, StatItem } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { Clock, Flag, Gauge, Zap } from 'lucide-react';
import { cache } from 'react';

export const getDashboardStats = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();

  const totalSessions = await SessionsDAL.countSessions(db, searchParams);
  const totalLaps = await LapsDAL.countLaps(db, searchParams);
  const bestLap = await LapsDAL.getBestLap(db, searchParams);
  const topSpeed = await LapsDAL.getTopSpeed(db, searchParams);

  type BestLapType = {
    lap_time_seconds: number | null;
    tracks: {
      name: string;
    };
  };

  type TopSpeedType = {
    max_speed_kmh: number | null;
    tracks: {
      name: string;
    };
  };

  let bestLapTrackName;
  let topSpeedTrackName;
  if (bestLap) {
    const bestLapTyped = bestLap as unknown as BestLapType;
    bestLapTrackName = '@' + bestLapTyped.tracks.name;
  }
  if (topSpeed) {
    const topSpeedTyped = topSpeed as unknown as TopSpeedType;
    topSpeedTrackName = '@' + topSpeedTyped.tracks.name;
  }

  const data = {
    totalSessions: totalSessions || 0,
    totalLaps: totalLaps || 0,
    bestLapTime: {
      lapTimeSeconds: bestLap?.lap_time_seconds || null,
      trackName: bestLapTrackName || null,
    },
    topSpeed: {
      maxSpeedKmh: topSpeed?.max_speed_kmh || null,
      trackName: topSpeedTrackName || null,
    },
  };

  const statsList: StatItem[] = [
    {
      label: 'Best Lap',
      value: formatLapTime(data.bestLapTime.lapTimeSeconds),
      sublabel: data.bestLapTime.trackName || '',
      icon: Zap,
    },
    {
      label: 'Top Speed',
      value: formatSpeed(data.topSpeed.maxSpeedKmh, { showUnit: false }),
      unit: 'km/h',
      sublabel: data.topSpeed.trackName || '',
      icon: Gauge,
    },
    {
      label: 'Sessions',
      value: data.totalSessions,
      sublabel: 'At the selected tracks',
      icon: Clock,
    },
    {
      label: 'Total Laps',
      value: data.totalLaps,
      sublabel: 'At the selected tracks',
      icon: Flag,
    },
  ];

  return statsList;
});
