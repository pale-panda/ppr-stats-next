import type { TrackBySlug, TrackSessionsBySlug } from '@/types/slug.type';

type TrackBySlugRow = {
  id: string;
  slug: string;
  name: string;
};

export function mapTrackBySlugToApp(r: TrackBySlugRow): TrackBySlug {
  return { id: r.id, slug: r.slug, name: r.name };
}

type TrackSessionsBySlugRow = {
  id: string;
  slug: string;
  name: string;
  country: string;
  image_url: string | null;
  length_meters: number;
  turns: number;
  sessions: {
    id: string;
    session_date: string;
    session_type: string;
    track_slug: string;
    total_sessions: number;
    lap_stats: {
      best_lap_time_seconds: number;
      total_laps: number;
      top_speed_kmh: number;
      telemetry: {
        total_rows: number;
        avg_speed_kmh: number;
        max_speed_kmh: number;
        min_speed_kmh: number;
      }[];
    }[];
    laps: {
      lap_number: number;
      lap_time_seconds: number;
      sectors: number[];
      lap_telemetry: {
        lap_id: string;
        lap_number: number;
        avg_speed_kmh: number;
        max_speed_kmh: number;
        min_speed_kmh: number;
        total_points: number;
        avg_g_force_x: number;
        max_g_force_x: number;
        min_g_force_x: number;
        avg_g_force_z: number;
        max_g_force_z: number;
        min_g_force_z: number;
        avg_lean_angle: number;
        max_lean_angle: number;
        min_lean_angle: number;
      }[];
    }[];
  }[];
} | null;

export function mapTrackSessionsBySlugToApp(
  r: TrackSessionsBySlugRow,
): TrackSessionsBySlug | null {
  if (!r) return null;
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    country: r.country,
    imageUrl: r.image_url,
    lengthMeters: r.length_meters,
    turns: r.turns,
    sessions: r.sessions.map((s) => ({
      id: s.id,
      sessionDate: s.session_date,
      sessionType: s.session_type,
      trackSlug: s.track_slug,
      totalSessions: s.total_sessions,
      lapStats: s.lap_stats.map((ls) => ({
        bestLapTimeSeconds: ls.best_lap_time_seconds,
        totalLaps: ls.total_laps,
        topSpeedKmh: ls.top_speed_kmh,
        telemetry: ls.telemetry.map((t) => ({
          totalRows: t.total_rows,
          avgSpeedKmh: t.avg_speed_kmh,
          maxSpeedKmh: t.max_speed_kmh,
          minSpeedKmh: t.min_speed_kmh,
        })),
      })),
      laps: s.laps.map((l) => ({
        lapNumber: l.lap_number,
        lapTimeSeconds: l.lap_time_seconds,
        sectors: l.sectors,
        lapTelemetry: l.lap_telemetry.map((lt) => ({
          lapId: lt.lap_id,
          lapNumber: lt.lap_number,
          avgSpeedKmh: lt.avg_speed_kmh,
          maxSpeedKmh: lt.max_speed_kmh,
          minSpeedKmh: lt.min_speed_kmh,
          totalPoints: lt.total_points,
          avgGForceX: lt.avg_g_force_x,
          maxGForceX: lt.max_g_force_x,
          minGForceX: lt.min_g_force_x,
          avgGForceZ: lt.avg_g_force_z,
          maxGForceZ: lt.max_g_force_z,
          minGForceZ: lt.min_g_force_z,
          avgLeanAngle: lt.avg_lean_angle,
          maxLeanAngle: lt.max_lean_angle,
          minLeanAngle: lt.min_lean_angle,
        })),
      })),
    })),
  };
}
