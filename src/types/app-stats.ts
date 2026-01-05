import type { Database } from '@/types/supabase.type';

export type AppStatsRow = Database['public']['Tables']['app_stats']['Row'];

export type AppStatsInsert = {
  total_users: number;
  total_tracks: number;
  total_laps: number;
};

export type AppStatsUpdate = Partial<AppStatsInsert>;

export type AppStatsFilters = {
  created_at?: string[];
  from?: string;
  to?: string;
};

export type AppStatsApp = {
  totalSessions: number;
  totalUsers: number;
  totalTracks: number;
  totalLaps: number;
};
