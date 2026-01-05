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
};
