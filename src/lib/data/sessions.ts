import { createServerClient } from '@/lib/supabase/server';
import {
  Laps,
  Tracks,
  TrackSessionData,
  PaginationMeta,
  TrackSessionWithTrack,
  Track,
} from '@/lib/types/response';
import { TRACK_SESSION_LIMIT_CARDS } from '@/lib/data/constants';
import { filterByFilterParams, FilterParams } from '@/lib/filter-utils';

export async function getSessionById(id: string): Promise<TrackSessionData> {
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
    throw new Error('Failed to fetch session data');
  }

  return session;
}

export async function getSessionLaps(sessionId: string): Promise<Laps> {
  const supabase = await createServerClient();

  const { data: laps, error } = await supabase
    .from('laps')
    .select('*')
    .eq('session_id', sessionId)
    .neq('lap_number', 0)
    .order('lap_number', { ascending: true });

  if (error) {
    console.error('Error fetching laps:', error);
    throw new Error('Failed to fetch laps data');
  }

  return laps as Laps;
}

export async function getSessionStats(sessionId: string) {
  const supabase = await createServerClient();

  const { data: session, error } = await supabase
    .from('sessions')
    .select(
      'duration_seconds, theoretical_best, laps:laps(lap_time_seconds, max_speed_kmh, max_lean_angle, max_g_force_x, max_g_force_z)'
    )
    .eq('id', sessionId)
    .neq('laps.lap_number', 0)
    .single();

  if (error) {
    console.error('Error fetching session stats:', error);
    throw new Error('Failed to fetch session stats');
  }

  if (session.laps && session.laps.length > 0) {
    const { laps } = session;

    return {
      duration_seconds: session.duration_seconds || 0,
      theoretical_best: laps.reduce(
        (sum, l) => sum + (l.lap_time_seconds || 0),
        0
      ),
      max_speed: Math.max(...laps.map((l) => l.max_speed_kmh || 0)),
      max_lean_angle: Math.max(...laps.map((l) => l.max_lean_angle || 0)),
      avg_speed:
        laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) / laps.length,
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

export async function getSessionCount(): Promise<number> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('sessions')
    .select('id')
    .order('id', { ascending: true });
  if (error) {
    console.error('Error fetching session count:', error);
    return 0;
  }

  if (data && data.length !== undefined) {
    return data.length;
  }

  return 0;
}

interface GetAllSessionsProps {
  filter?: FilterParams;
  currentPage?: number;
  limit?: number;
}

export async function getAllSessions({
  filter,
  currentPage = 1,
  limit = TRACK_SESSION_LIMIT_CARDS,
}: GetAllSessionsProps): Promise<{
  sessions: TrackSessionWithTrack[];
  meta: PaginationMeta;
}> {
  const currentIndex = (currentPage - 1) * limit;
  const supabase = await createServerClient();

  const { data: tracks, error: trackError } = await supabase.from('tracks')
    .select(`id,
      name,
      country,
      configuration,
      length_meters,
      turns`);

  if (trackError) {
    console.error('Error fetching tracks:', trackError);
    throw new Error('Failed to fetch tracks');
  }

  let filteredTracks;

  if (filter !== undefined)
    filteredTracks = filterByFilterParams(tracks, filter);
  else filteredTracks = tracks;

  const trackIds = filteredTracks.map((t) => t.id) || [];

  if (trackIds.length === 0) {
    return {
      sessions: [],
      meta: {
        currentPage,
        nextPage: null,
        totalPages: 0,
        totalCount: 0,
        remainingCount: 0,
      },
    };
  }

  const totalCount = (
    await supabase
      .from('sessions')
      .select('id', { count: 'exact', head: true })
      .in(`track_id`, trackIds)
  ).count;

  const { data, error } = await supabase
    .from('sessions')
    .select('*, track:tracks(*)')
    .in(`track_id`, trackIds)
    .order('session_date', { ascending: false })
    .range(currentIndex, currentIndex + limit - 1);
  if (error) {
    console.error('Error fetching sessions:', error);
    throw new Error('Failed to fetch sessions');
  }

  const sessions: TrackSessionWithTrack[] = data;

  const totalPages = Math.ceil((totalCount || 0) / limit);
  const remainingCount = Math.max((totalCount || 0) - currentPage * limit, 0);

  return {
    sessions,
    meta: {
      currentPage,
      nextPage: currentPage < (totalPages || 0) ? currentPage + 1 : null,
      totalPages,
      totalCount: totalCount || 0,
      remainingCount,
    },
  };
}

export async function getSessionsForAnalytics() {
  const supabase = await createServerClient();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select(`*, track:tracks(*), laps(*)`)
    .order('session_date', { ascending: false });

  if (error) {
    console.error('Error fetching sessions for analytics:', error);
    return [];
  }

  return sessions as TrackSessionWithTrack[];
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

  return tracks as Tracks;
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

  return sessions as TrackSessionWithTrack[];
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
    .select(`*, track:tracks(*), laps(*)`)
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
    sessions: sessions as TrackSessionWithTrack[],
  };
}

export async function getTrackMetaData() {
  const supabase = await createServerClient();

  const { data: tracks, error } = await supabase
    .from('tracks')
    .select('country, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tracks:', error);
    return { countries: [], names: [] };
  }

  return {
    countries: [...new Set(tracks.map((t) => t.country))],
    names: [...new Set(tracks.map((t) => t.name))],
  };
}

interface TrackWithStats extends Track {
  stats: {
    totalSessions: number;
    totalLaps: number;
    bestLapTime: number | null;
    avgTopSpeed: number | null;
  };
}

export async function getTracksWithStats(): Promise<TrackWithStats[]> {
  const tracks = await getAllTracks();
  const { sessions } = await getAllSessions({ limit: 100000 });

  const tracksWithStats = tracks
    .map((track) => {
      const trackSessions = sessions.filter((s) => s.track_id === track.id);
      if (!trackSessions || trackSessions.length === 0) return undefined;

      const totalLaps = trackSessions.reduce((sum, s) => sum + s.total_laps, 0);
      const allLaps = trackSessions.flatMap((s) => s.laps || []) as Laps;

      const bestLapTime =
        allLaps.length > 0
          ? Math.min(...allLaps.map((l) => l.lap_time_seconds))
          : null;
      const avgTopSpeed =
        allLaps.length > 0
          ? Math.round(
              allLaps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) /
                allLaps.length
            )
          : null;

      const result: TrackWithStats = {
        ...track,
        stats: {
          totalSessions: trackSessions.length,
          totalLaps,
          bestLapTime,
          avgTopSpeed,
        },
      };

      return result;
    })
    .filter((t): t is TrackWithStats => t !== undefined);

  return tracksWithStats;
}
