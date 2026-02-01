'use server';
import 'server-only';
import { AppStatsDAL } from '@/db/app-stats.dal';
import { createClient } from '@/lib/supabase/server';
import type { StatItem } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import {
  ChartLine,
  MapPinned,
  UploadCloud,
  UserCheck2Icon,
} from 'lucide-react';
import { mapAppStatsRowToApp } from '@/lib/mappers/app-stats.mapper';

export const getAppStats = cache(async () => {
  const db: SupabaseClient = await createClient();
  const rowData = await AppStatsDAL.getAppStats(db);

  const data = mapAppStatsRowToApp(rowData);

  const statsList: StatItem[] = [
    {
      label: 'Total Sessions',
      value: data.totalSessions,
      sublabel: 'Uploaded to date',
      icon: UploadCloud,
    },
    {
      label: 'Total Laps',
      value: data.totalLaps,
      sublabel: 'Completed so far',
      icon: ChartLine,
    },
    {
      label: 'Total Tracks',
      value: data.totalTracks,
      sublabel: 'Available in the app',
      icon: MapPinned,
    },
    {
      label: 'Total Users',
      value: data.totalUsers,
      sublabel: 'Registered riders',
      icon: UserCheck2Icon,
    },
  ];

  return statsList;
});
