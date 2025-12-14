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
    console.error('Error fetching session:', error);
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
    .neq('lap_number', 0)
    .order('lap_number', { ascending: true });

  if (error) {
    console.error('Error fetching laps:', error);
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
    const { data: session } = await supabase
      .from('sessions')
      .select('duration_seconds')
      .eq('id', sessionId)
      .single();
    // Fallback: Calculate stats from laps if RPC doesn't exist
    const { data: laps } = await supabase
      .from('laps')
      .select(
        'lap_time_seconds, max_speed_kmh, max_lean_angle, max_g_force_x, max_g_force_z'
      )
      .eq('session_id', sessionId);

    if (laps && laps.length > 0) {
      return {
        duration_seconds: session?.duration_seconds || 0,
        theoretical_best: laps.reduce(
          (sum, l) => sum + (l.lap_time_seconds || 0),
          0
        ),
        max_speed: Math.max(...laps.map((l) => l.max_speed_kmh || 0)),
        max_lean_angle: Math.max(...laps.map((l) => l.max_lean_angle || 0)),
        avg_speed:
          laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) /
          laps.length,
      };
    }

    return {
      duration_seconds: 0,
      theoretical_best: 0,
      max_speed: 0,
      max_lean_angle: 0,
      avg_speed: 0,
    };
  }

  return stats;
}

export async function getAllSessions(limit: number = 24) {
  const supabase = await createServerClient();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(
      `
      *,
      track:tracks(*)
    `
    )
    .order('session_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching all sessions:', error);
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
    console.error('Error fetching sessions for analytics:', error);
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
    console.error('Error fetching tracks:', error);
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
    console.error('Error fetching track:', error);
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
    console.error('Error fetching track sessions:', error);
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
    .neq('lap_number', 0)
    .limit(1)
    .single();

  // Get top speed
  const { data: topSpeed } = await supabase
    .from('laps')
    .select('max_speed_kmh')
    .order('max_speed_kmh', { ascending: false })
    .neq('lap_number', 0)
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
