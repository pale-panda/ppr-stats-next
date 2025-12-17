import { cache } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import {
  Laps,
  Tracks,
  TrackSessions,
  PaginationMeta,
  Track,
  TrackSessionJoined,
} from '@/types';
import { TRACK_SESSION_LIMIT_CARDS } from '@/lib/data/constants';
import { filterByFilterParams, FilterParams } from '@/lib/filter-utils';

export async function getSessionById(id: string): Promise<TrackSessions> {
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
  sessions: TrackSessionJoined[];
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

  const { count: totalCount } = await supabase
    .from('sessions')
    .select('id', { count: 'exact', head: true })
    .in(`track_id`, trackIds);

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

  const sessions: TrackSessionJoined[] = data;

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

export const getTrackSessionsByIdFullJoin = cache(
  async (sessionId: string): Promise<TrackSessions> => {
    const supabase = await createServerClient();

    const { data: sessions, error } = await supabase
      .from('sessions')
      .select(`*, track:tracks(*), laps(*)`)
      .eq('id', sessionId)
      .neq('laps.lap_number', 0)
      .single();

    if (error) {
      console.error('Error fetching sessions for analytics:', error);
      return [];
    }

    return sessions;
  }
);

export async function getAllTracks(): Promise<Tracks> {
  const supabase = await createServerClient();

  const { data: tracks, error } = await supabase
    .from('tracks')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching tracks:', error);
    return [];
  }

  return tracks;
}

export async function getTrackById(id: string): Promise<Track> {
  const supabase = await createServerClient();

  const { data: track, error } = await supabase
    .from('tracks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching track:', error);
    throw new Error('Failed to fetch track data');
  }

  return track;
}

export async function getTrackSessionsByTrackId(
  trackId: string
): Promise<TrackSessionJoined[]> {
  const supabase = await createServerClient();

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*, track:tracks(*), laps(*)')
    .eq('track_id', trackId)
    .neq('laps.lap_number', 0)
    .order('session_date', { ascending: false });

  if (error) {
    console.error('Error fetching track sessions:', error);
    throw new Error('Failed to fetch track sessions data');
  }

  return sessions;
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

interface AnalyticsStats {
  bestLapTime: number;
  avgLapTime: number;
  totalLaps: number;
  topSpeed: number;
  sessions: TrackSessionJoined[];
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
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
    sessions,
  };
}

interface TrackMetaData {
  countries: string[];
  names: string[];
}

export async function getTrackMetaData(): Promise<TrackMetaData> {
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

export const getTrackSessionWithStats = cache(
  async (sessionId: string): Promise<TrackSessionJoined> => {
    const supabase = await createServerClient();

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select(
        `id,
        track_id,
        session_date,
        session_type,
        total_laps,
        best_lap_time_seconds,
        vehicle,
        duration_seconds,
        data_source,
        session_source,
        track:tracks(
          id,
          name,
          country,
          length_meters,
          turns,
          configuration,
          description,
          image_url,
          gps_point,
          created_at,
          updated_at),
        created_at,
        updated_at,
        laps(id,
          session_id,
          lap_number,
          start_time,
          end_time,
          lap_time_seconds,
          max_lean_angle,
          min_speed_kmh,
          max_speed_kmh,
          min_g_force_x,
          max_g_force_x,
          min_g_force_z,
          max_g_force_z,
          sector_1,
          sector_2,
          sector_3,
          created_at)`
      )
      .eq('id', sessionId)
      .neq('laps.lap_number', 0)
      .single();

    if (sessionError) {
      throw new Error('Failed to fetch session data');
    }

    const laps = session.laps;
    const track = session.track as unknown as Track;

    const { data: minSpeed, error: minSpeedError } = await supabase
      .from('telemetry_points')
      .select('speed_kmh')
      .eq('session_id', sessionId)
      .neq('lap_number', 0)
      .order('speed_kmh', { ascending: true })
      .limit(1)
      .single();

    if (minSpeedError) {
      throw new Error('Failed to fetch min speed data');
    }

    const calculateTheoreticalBest = () => {
      if (!session) return 0;
      // Hämta de snabbaste hastigheterna från varje sektor och summera dem
      const sector1Best = Math.min(
        ...laps.map((lap) => lap.sector_1).filter((time) => time !== null)
      );
      const sector2Best = Math.min(
        ...laps.map((lap) => lap.sector_2).filter((time) => time !== null)
      );
      const sector3Best = Math.min(
        ...laps.map((lap) => lap.sector_3).filter((time) => time !== null)
      );

      return (sector1Best || 0) + (sector2Best || 0) + (sector3Best || 0);
    };

    const { track: trackArray, ...sessionRest } = session as any;
    const trackObj = Array.isArray(trackArray)
      ? (trackArray[0] as Track)
      : (trackArray as Track | undefined);

    return {
      ...sessionRest,
      track: trackObj,
      avg_speed:
        laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) / laps.length,
      min_speed: minSpeed?.speed_kmh ?? 0,
      max_speed: Math.max(...laps.map((l) => l.max_speed_kmh || 0)),
      max_lean_angle: Math.max(...laps.map((l) => l.max_lean_angle || 0)),
      max_g_force_x: Math.max(...laps.map((l) => l.max_g_force_x || 0)),
      min_g_force_x: Math.min(...laps.map((l) => l.max_g_force_x || 0)),
      max_g_force_z: Math.max(...laps.map((l) => l.max_g_force_z || 0)),
      theoretical_best: calculateTheoreticalBest(),
    };
  }
);
