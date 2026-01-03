import { PaginationMeta } from '@/types';
import { LapApp } from '@/types/laps.type';
import { TelemetryApp } from '@/types/telemetry-app.type';
import { TrackApp } from '@/types/track.type';
import { ReadonlyURLSearchParams } from 'next/navigation';

export type TrackSessionValues = Record<string, unknown>;

export type TrackSession = {
  id: string;
  track_id: string;
  avg_speed: number | null;
  min_speed: number | null;
  max_speed: number | null;
  max_lean_angle: number | null;
  max_g_force_x: number | null;
  min_g_force_x: number | null;
  max_g_force_z: number | null;
  theoretical_best: number | null;
  session_date: string;
  session_type: string;
  total_laps: number;
  best_lap_time_seconds: number;
  duration_seconds: number;
  vehicle: string;
  data_source: string;
  session_source: string;
  created_at: string;
  updated_at: string;
};

export type TrackSessionJoined = {
  id: string;
  track_id: string;
  avg_speed: number;
  min_speed: number;
  max_speed: number;
  max_lean_angle: number;
  max_g_force_x: number;
  min_g_force_x: number;
  max_g_force_z: number;
  theoretical_best: number;
  session_date: string;
  session_type: string;
  total_laps: number;
  best_lap_time_seconds: number;
  duration_seconds: number;
  vehicle: string;
  data_source: string;
  session_source: string;
  created_at: string;
  updated_at: string;
  track: TrackApp;
  laps: LapApp[];
  telemetry?: TelemetryApp;
};

export type TrackSessions = Array<TrackSession> | Array<TrackSessionJoined>;

export type TrackSessionApiResponse = {
  sessions: TrackSessionJoined[];
  meta: PaginationMeta;
};

export type TrackSessionByIdApiResponse = {
  session: TrackSessionJoined;
};

export type TrackSessionSearchParams = {
  page: number | null;
  size: number | null;
  order: string | null;
  sort: 'asc' | 'desc' | null;
  [key: string]: string | number | null;
};

export type SearchQueryParams = {
  searchParams: ReadonlyURLSearchParams;
};
