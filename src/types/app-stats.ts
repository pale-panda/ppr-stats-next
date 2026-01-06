export type AppStatsFilters = {
  created_at?: string[];
  from?: string;
  to?: string;
};

export type AppStats = {
  totalSessions: number;
  totalUsers: number;
  totalTracks: number;
  totalLaps: number;
};
