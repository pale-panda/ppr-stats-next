import type { AppStatsApp } from '@/types/app-stats';
import type { Database } from '@/types/supabase.type';

type AppStatsRow = Database['public']['Tables']['app_stats']['Row'];

export function mapAppStatsRowToApp(r: AppStatsRow): AppStatsApp {
  return {
    totalSessions: r.total_sessions || 0,
    totalUsers: r.total_users || 0,
    totalTracks: r.total_tracks || 0,
    totalLaps: r.total_laps || 0,
  };
}

export function mapAppStatsRowsToApp(
  rows: AppStatsRow[] | undefined
): AppStatsApp[] | undefined {
  if (!rows) return undefined;
  return rows.map(mapAppStatsRowToApp);
}
