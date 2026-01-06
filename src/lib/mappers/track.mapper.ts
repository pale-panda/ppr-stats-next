import type { Database } from '@/types/supabase.type';
import type { Track, TrackStats } from '@/types/track.type';

type TrackRow = Database['public']['Tables']['tracks']['Row'];

export function mapTrackRowToApp(r: TrackRow): Track {
  return {
    id: r.id,
    name: r.name,
    country: r.country,
    lengthMeters: r.length_meters ?? null,
    turns: r.turns ?? null,
    imageUrl: r.image_url ?? null,
    configuration: r.configuration ?? null,
    description: r.description ?? null,
    slug: r.slug,
    gpsPoint: (() => {
      const gp = r.gps_point;
      if (!gp) return null;
      if (typeof gp === 'string') {
        try {
          const parsed = JSON.parse(gp);
          if (
            parsed &&
            typeof parsed.lat === 'number' &&
            typeof parsed.lng === 'number'
          )
            return parsed;
        } catch (e) {
          throw e;
          return null;
        }
      }
      if (typeof gp === 'object') return gp;
      return null;
    })(),
  };
}

export function mapTrackRowsToApp(rows: TrackRow[]): Track[] {
  return rows.map(mapTrackRowToApp);
}

type TrackStatsRow = {
  id: string;
  name: string;
  country: string;
  length_meters: number;
  turns: number;
  image_url: string | null;
  slug: string;
  lap_stats: {
    best_lap_time: number;
    total_laps: number;
    avg_top_speed: number;
  }[];
  session_stats: {
    total_sessions: number;
  }[];
};

export function mapTrackStatsRowToApp(rows: TrackStatsRow): TrackStats {
  return {
    id: rows.id,
    name: rows.name,
    country: rows.country,
    lengthMeters: rows.length_meters,
    turns: rows.turns,
    imageUrl: rows.image_url,
    slug: rows.slug,
    stats: {
      bestLapTime: rows.lap_stats[0]?.best_lap_time ?? null,
      totalLaps: rows.lap_stats[0]?.total_laps ?? 0,
      avgTopSpeed: rows.lap_stats[0]?.avg_top_speed ?? null,
      totalSessions: rows.session_stats[0]?.total_sessions ?? 0,
    },
  };
}

export function mapTrackStatsRowsToApp(rows: TrackStatsRow[]): TrackStats[] {
  return rows.map(mapTrackStatsRowToApp);
}
