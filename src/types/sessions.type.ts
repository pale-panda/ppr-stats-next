import type { ProfileApp } from './profile.type';
import type { Database } from '@/types/supabase.type';
import type { TrackApp } from '@/types/track.type';
import type { LapApp } from '@/types/laps.type';
import type { TelemetryApp } from '@/types/telemetry-app.type';

export type Session = Database['public']['Tables']['sessions']['Row'];

export type SessionInsert = Database['public']['Tables']['sessions']['Insert'];

export type SessionUpdate = Database['public']['Tables']['sessions']['Update'];

// Full session shape returned by joined queries (DAL) — reference shared types
export type SessionFull = Session & {
  // keep plural name `tracks` for backward compatibility with existing code
  tracks?: TrackApp | null;
  profiles?: ProfileApp | null;
  telemetry_points?: TelemetryApp;
  laps?: LapApp[];
  // computed/aggregated metrics (may be absent)
  avg_speed?: number | null;
  min_speed?: number | null;
  max_speed?: number | null;
  max_lean_angle?: number | null;
  max_g_force_x?: number | null;
  min_g_force_x?: number | null;
  max_g_force_z?: number | null;
  theoretical_best?: number | null;
};

// App-facing session model (camelCase) — produce this from mappers in services
export type SessionApp = Partial<Session> & {
  id: string;
  bestLapTimeSeconds?: number | null;
  createdAt?: string | null;
  dataSource?: string | null;
  durationSeconds?: number | null;
  sessionDate: string;
  sessionSource?: string | null;
  sessionType?: string | null;
  totalLaps?: number | null;
  trackId?: string | null;
  updatedAt?: string | null;
  userId: string;
  vehicle?: string | null;

  // relations
  tracks?: TrackApp | null;
  profiles?: ProfileApp | null;
  telemetryPoints?: TelemetryApp;
  laps?: LapApp[];

  // computed
  avgSpeed?: number | null;
  minSpeed?: number | null;
  maxSpeed?: number | null;
  maxLeanAngle?: number | null;
  theoreticalBest?: number | null;
  // Backwards-compatible snake_case aliases for components still using DB-shaped props
  session_type?: string | null;
  session_date?: string;
  total_laps?: number | null;
  best_lap_time_seconds?: number | null;
  created_at?: string | null;
  duration_seconds?: number | null;
  track_id?: string | null;
  updated_at?: string | null;
  user_id?: string;
};

// Example mapper stub — implement actual mapping logic in services/ or DAL
export function mapSessionRowToApp(
  s: Session,
  extras?: Partial<SessionFull>
): SessionApp {
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
    tracks: extras?.tracks ?? null,
    profiles: extras?.profiles ?? null,
    telemetryPoints: extras?.telemetry_points ?? undefined,
    laps: extras?.laps ?? undefined,
    avgSpeed: extras?.avg_speed ?? null,
    minSpeed: extras?.min_speed ?? null,
    maxSpeed: extras?.max_speed ?? null,
    maxLeanAngle: extras?.max_lean_angle ?? null,
    theoreticalBest: extras?.theoretical_best ?? null,
  };
}

export type SessionFilters = {
  track_id?: string[];
  user_id?: string[];
  session_type?: 'track' | 'practice' | 'qualifying' | 'race';
  vehicle?: string[];
  from?: string;
  to?: string;
  track_name?: string[];
  country?: string[];
};
