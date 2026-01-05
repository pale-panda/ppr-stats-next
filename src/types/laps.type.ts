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
  lapTimeSeconds: number;
  maxLeanAngle: number;
  maxSpeedKmh: number;
  maxGForceX: number;
  maxGForceZ: number;
  minGForceX: number;
  minGForceZ: number;
  startTime: string;
  endTime: string;
  sectors: [number, number, number];
  trackId: string;
  sessionId: string | null;
};
