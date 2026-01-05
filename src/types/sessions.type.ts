import type { LapApp } from '@/types/laps.type';
import type { Database } from '@/types/supabase.type';
import type { TelemetryApp } from '@/types/telemetry.type';
import type { TrackApp } from '@/types/track.type';
import type { ProfileApp } from './profile.type';

export type Session = Database['public']['Tables']['sessions']['Row'] & {
  tracks?: {
    name: string;
    country: string;
    image_url: string | null;
  };
};

export type SessionInsert = Database['public']['Tables']['sessions']['Insert'];

export type SessionUpdate = Database['public']['Tables']['sessions']['Update'];

// App-facing session model (camelCase) — produce this from mappers in services
export type SessionApp = {
  id: string;
  bestLapTimeSeconds: number;
  createdAt?: string | null;
  dataSource?: string | null;
  durationSeconds?: number | null;
  sessionDate: string;
  sessionSource?: string | null;
  sessionType?: string | null;
  totalLaps: number;
  trackId?: string | null;
  updatedAt?: string | null;
  userId: string;
  vehicle?: string | null;
  tracks: { name: string; country: string; imageUrl: string | null };
};

export type SessionAppExtras = {
  tracks: TrackApp;
  profiles: ProfileApp;
  telemetryPoints?: TelemetryApp;
  laps: LapApp[];

  // computed
  avgSpeed?: number | null;
  minSpeed?: number | null;
  maxSpeed?: number | null;
  maxLeanAngle?: number | null;
  theoreticalBest?: number | null;
  maxGForceX?: number | null;
  minGForceX?: number | null;
  maxGForceZ?: number | null;
};

// Full session shape returned by joined queries (DAL) — reference shared types
export type SessionAppFull = SessionApp & SessionAppExtras;

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
