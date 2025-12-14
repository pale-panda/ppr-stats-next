import { createServerClient } from '@/lib/supabase/server';
import type { Session, Lap, Track } from '@/lib/types/database';

export async function getSessionById(id: string) {
  const supabase = await createServerClient();

  const { data: session, error } = await supabase
    .from('sessions')
    .select(
      `
      *,
      track:tracks(*)
    `
    )
    .eq('id', id)
    .single();

  if (error) {
    console.error('[v0] Error fetching session:', error);
    return null;
  }

  return session as Session & { track: Track };
}

export async function getSessionLaps(sessionId: string) {
  const supabase = await createServerClient();

  const { data: laps, error } = await supabase
    .from('laps')
    .select('*')
    .eq('session_id', sessionId)
    .order('lap_number', { ascending: true });

  if (error) {
    console.error('[v0] Error fetching laps:', error);
    return [];
  }

  return laps as Lap[];
}

export async function getSessionStats(sessionId: string) {
  const supabase = await createServerClient();

  const { data: stats, error } = await supabase.rpc('get_session_stats', {
    p_session_id: sessionId,
  });

  if (error) {
    // Fallback: Calculate stats from laps if RPC doesn't exist
    const { data: laps } = await supabase
      .from('laps')
      .select('max_speed_kmh, max_lean_angle, max_g_force_x, max_g_force_z')
      .eq('session_id', sessionId);

    if (laps && laps.length > 0) {
      return {
        max_speed: Math.max(...laps.map((l) => l.max_speed_kmh || 0)),
        max_lean_angle: Math.max(...laps.map((l) => l.max_lean_angle || 0)),
        avg_speed:
          laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) /
          laps.length,
      };
    }

    return {
      max_speed: 0,
      max_lean_angle: 0,
      avg_speed: 0,
    };
  }

  return stats;
}

export function formatLapTime(seconds: number | null): string {
  if (!seconds) return '--:--:---';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toFixed(3).padStart(6, '0')}`;
}

export function formatSessionDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function calculateSessionDuration(laps: Lap[]): string {
  if (laps.length === 0) return '0 min';

  const firstLap = laps[0];
  const lastLap = laps[laps.length - 1];

  if (!firstLap.start_time || !lastLap.end_time) return 'N/A';

  const start = new Date(firstLap.start_time);
  const end = new Date(lastLap.end_time);
  const durationMs = end.getTime() - start.getTime();
  const minutes = Math.floor(durationMs / 60000);

  return `${minutes} min`;
}

export async function getAllSessions() {
  const supabase = await createServerClient();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(
      `
      *,
      track:tracks(*)
    `
    )
    .order('session_date', { ascending: false });

  if (error) {
    console.error('[v0] Error fetching all sessions:', error);
    return [];
  }

  return sessions as (Session & { track: Track })[];
}

export async function getSessionsForAnalytics() {
  const supabase = await createServerClient();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(
      `
      *,
      track:tracks(*),
      laps(*)
    `
    )
    .order('session_date', { ascending: false });

  if (error) {
    console.error('[v0] Error fetching sessions for analytics:', error);
    return [];
  }

  return sessions as (Session & { track: Track; laps: Lap[] })[];
}

export async function getAllTracks() {
  const supabase = await createServerClient();

  const { data: tracks, error } = await supabase
    .from('tracks')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('[v0] Error fetching tracks:', error);
    return [];
  }

  return tracks as Track[];
}

export async function getTrackById(id: string) {
  const supabase = await createServerClient();

  const { data: track, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('[v0] Error fetching track:', error);
    return null;
  }

  return track as Track;
}

export async function getTrackSessions(trackId: string) {
  const supabase = await createServerClient();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*, laps(*)')
    .eq('track_id', trackId)
    .order('session_date', { ascending: false });

  if (error) {
    console.error('[v0] Error fetching track sessions:', error);
    return [];
  }

  return sessions as (Session & { laps: Lap[] })[];
}

export async function getDashboardStats() {
  const supabase = await createServerClient();

  // Get total sessions
  const { count: totalSessions } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true });

  // Get total laps
  const { count: totalLaps } = await supabase
    .from('laps')
    .select('*', { count: 'exact', head: true });

  // Get best lap time
  const { data: bestLap } = await supabase
    .from('laps')
    .select('lap_time_seconds')
    .order('lap_time_seconds', { ascending: true })
    .limit(1)
    .single();

  // Get top speed
  const { data: topSpeed } = await supabase
    .from('laps')
    .select('max_speed_kmh')
    .order('max_speed_kmh', { ascending: false })
    .limit(1)
    .single();

  return {
    totalSessions: totalSessions || 0,
    totalLaps: totalLaps || 0,
    bestLapTime: bestLap?.lap_time_seconds || null,
    topSpeed: topSpeed?.max_speed_kmh || null,
  };
}

export async function getAnalyticsStats() {
  const supabase = await createServerClient();

  // Get all completed sessions with laps
  const { data: sessions } = await supabase
    .from('sessions')
    .select(
      `
      *,
      track:tracks(*),
      laps(*)
    `
    )
    .order('session_date', { ascending: false });

  if (!sessions || sessions.length === 0) {
    return {
      bestLapTime: 0,
      avgLapTime: 0,
      totalLaps: 0,
      topSpeed: 0,
      sessions: [],
    };
  }

  // Calculate all-time stats
  const allLaps = sessions.flatMap((s) => s.laps || []);
  const allTimes = allLaps.map((l) => l.lap_time_seconds).filter((t) => t > 0);
  const bestLapTime = allTimes.length > 0 ? Math.min(...allTimes) : 0;
  const avgLapTime =
    allTimes.length > 0
      ? allTimes.reduce((a, b) => a + b, 0) / allTimes.length
      : 0;
  const totalLaps = allLaps.length;
  const topSpeed = Math.max(...allLaps.map((l) => l.max_speed_kmh || 0));

  return {
    bestLapTime,
    avgLapTime,
    totalLaps,
    topSpeed,
    sessions: sessions as (Session & { track: Track; laps: Lap[] })[],
  };
}
