import type {
  Session,
  SessionExtras,
  SessionFull,
} from '@/types/sessions.type';
import type { Database } from '@/types/supabase.type';

type SessionRow = Database['public']['Tables']['sessions']['Row'] & {
  tracks?: {
    name: string;
    country: string;
    image_url: string | null;
  };
};

export function mapSessionRowToApp(s: SessionRow): Session {
  return {
    id: s.id,
    bestLapTimeSeconds: s.best_lap_time_seconds ?? null,
    createdAt: s.created_at ?? null,
    dataSource: s.data_source ?? null,
    durationSeconds: s.duration_seconds,
    sessionDate: s.session_date,
    sessionSource: s.session_source ?? null,
    sessionType: s.session_type ?? null,
    totalLaps: s.total_laps,
    trackId: s.track_id ?? null,
    updatedAt: s.updated_at ?? null,
    userId: s.user_id,
    vehicle: s.vehicle ?? null,
    tracks: {
      name: s.tracks?.name ?? '',
      country: s.tracks?.country ?? '',
      imageUrl: s.tracks?.image_url ?? null,
    },
  };
}

export function mapSessionRowsToApp(
  rows: SessionRow[] | undefined
): Session[] | undefined {
  if (!rows) return undefined;
  return rows.map(mapSessionRowToApp);
}

export function mapSessionFullRowToApp(
  s: SessionRow,
  extras: SessionExtras
): SessionFull {
  return {
    id: s.id,
    bestLapTimeSeconds: s.best_lap_time_seconds ?? null,
    createdAt: s.created_at ?? null,
    dataSource: s.data_source ?? null,
    durationSeconds: s.duration_seconds ?? null,
    sessionDate: s.session_date,
    sessionSource: s.session_source ?? null,
    sessionType: s.session_type ?? null,
    totalLaps: s.total_laps ?? null,
    trackId: s.track_id ?? null,
    updatedAt: s.updated_at ?? null,
    userId: s.user_id,
    vehicle: s.vehicle ?? null,
    tracks: extras.tracks,
    profiles: extras.profiles,
    telemetryPoints: extras.telemetryPoints ?? undefined,
    laps: extras.laps,
    avgSpeed: extras?.avgSpeed ?? null,
    minSpeed: extras?.minSpeed ?? null,
    maxSpeed: extras?.maxSpeed ?? null,
    maxLeanAngle: extras?.maxLeanAngle ?? null,
    theoreticalBest: extras?.theoreticalBest ?? null,
  };
}
