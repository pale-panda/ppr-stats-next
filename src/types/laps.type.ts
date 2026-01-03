import type { Database } from '@/types/supabase.type';

export type Lap = Database['public']['Tables']['laps']['Row'];

export type LapInsert = Omit<
  Database['public']['Tables']['laps']['Insert'],
  'id' | 'created_at' | 'updated_at'
>;

export type LapUpdate = Partial<LapInsert>;

export type LapFilters = {
  session_id?: string[];
  lap_number?: number[];
  track_id?: string[];
};

// App-facing lap model (camelCase)
export type LapApp = {
  id: string;
  lapNumber: number;
  lapTimeSeconds: number | null;
  maxLeanAngle: number | null;
  maxSpeedKmh: number | null;
  maxGForceX: number | null;
  maxGForceZ: number | null;
  minGForceX: number | null;
  minGForceZ: number | null;
  startTime?: string | null;
  endTime?: string | null;
  sector1?: number | null;
  sector2?: number | null;
  sector3?: number | null;
  trackId?: string | null;
  sessionId?: string | null;
  // Backwards-compatible snake_case aliases
  lap_number?: number;
  lap_time_seconds?: number | null;
  max_lean_angle?: number | null;
  max_speed_kmh?: number | null;
  max_g_force_x?: number | null;
  max_g_force_z?: number | null;
  min_g_force_x?: number | null;
  min_g_force_z?: number | null;
  start_time?: string | null;
  end_time?: string | null;
  sector_1?: number | null;
  sector_2?: number | null;
  sector_3?: number | null;
  track_id?: string | null;
  session_id?: string | null;
};
