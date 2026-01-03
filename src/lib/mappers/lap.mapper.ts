import type { Database } from '@/types/supabase.type';
import type { LapApp } from '@/types/laps.type';

type LapRow = Database['public']['Tables']['laps']['Row'];

export function mapLapRowToApp(r: LapRow): LapApp {
  return {
    id: r.id,
    lapNumber: r.lap_number,
    lapTimeSeconds: r.lap_time_seconds ?? null,
    maxLeanAngle: r.max_lean_angle ?? null,
    maxSpeedKmh: r.max_speed_kmh ?? null,
    maxGForceX: r.max_g_force_x ?? null,
    maxGForceZ: r.max_g_force_z ?? null,
    minGForceX: r.min_g_force_x ?? null,
    minGForceZ: r.min_g_force_z ?? null,
    startTime: r.start_time ?? null,
    endTime: r.end_time ?? null,
    sector1: r.sector_1 ?? null,
    sector2: r.sector_2 ?? null,
    sector3: r.sector_3 ?? null,
    trackId: r.track_id ?? null,
    sessionId: r.session_id ?? null,
  };
}

export function mapLapRowsToApp(rows: LapRow[] | undefined): LapApp[] | undefined {
  if (!rows) return undefined;
  return rows.map(mapLapRowToApp);
}
