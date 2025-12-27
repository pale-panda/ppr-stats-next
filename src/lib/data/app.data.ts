import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';

export const getAppStats = cache(async () => {
  const supabase = await createClient();
  const { data: appStats, error } = await supabase
    .from('app_stats')
    .select('total_sessions, total_laps, total_tracks, total_users')
    .order('created_at', { ascending: false })
    .single();

  if (error) {
    console.error('Error fetching app stats:', error);
    return {
      totalTracks: 0,
      totalSessions: 0,
      totalLaps: 0,
      totalUsers: 0,
    };
  }

  return {
    totalTracks: appStats?.total_tracks || 0,
    totalSessions: appStats?.total_sessions || 0,
    totalLaps: appStats?.total_laps || 0,
    totalUsers: appStats?.total_users || 0,
  };
});
