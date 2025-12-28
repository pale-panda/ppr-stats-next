import { Track } from '@/types/track.type';
import { Lap } from '@/types/lap.type';
import { Telemetry } from '@/types/telemetry.type';
import { PaginationMeta } from '@/types';

export type TrackSessionValues = Record<string, unknown>;

export type TrackSession = {
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
  track: Track;
  laps: Lap[];
  telemetry?: Telemetry;
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
  query?: string | null;
  page?: number | null;
  orderBy?: string | null;
  pageSize?: number | null;
  sort?: 'asc' | 'desc' | null;
};
