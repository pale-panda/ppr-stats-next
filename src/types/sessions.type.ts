import type { Lap } from '@/types/laps.type';
import type { TelemetryApp } from '@/types/telemetry.type';
import type { Track } from '@/types/track.type';
import type { Profile } from './profile.type';

// App-facing session model (camelCase) — produce this from mappers in services
export type Session = {
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
  track_slug: string | null;
  theoreticalBestLapTimeSeconds?: number | null;
  tracks: {
    name: string;
    country: string;
    imageUrl: string | null;
    slug: string;
  };
};

export type SessionExtras = {
  tracks: Track;
  profiles: Profile;
  telemetryPoints?: TelemetryApp;
  laps: Lap[];

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
export type SessionFull = Session & SessionExtras;

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
