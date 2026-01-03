import type { Database } from '@/types/supabase.type';
import type { AppStatsApp } from '@/types/app-stats';

type AppStatsRow = Database['public']['Tables']['app_stats']['Row'];

export function mapAppStatsRowToApp(r: AppStatsRow): AppStatsApp {
  return {
    totalSessions: r.total_sessions,
    totalUsers: r.total_users,
    totalTracks: r.total_tracks,
    totalLaps: r.total_laps,
  };
}

export function mapAppStatsRowsToApp(
  rows: AppStatsRow[] | undefined
): AppStatsApp[] | undefined {
  if (!rows) return undefined;
  return rows.map(mapAppStatsRowToApp);
}
