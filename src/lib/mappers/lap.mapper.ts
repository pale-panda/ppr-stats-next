import type { Lap } from '@/types/laps.type';
import type { Database } from '@/types/supabase.type';

type LapRow = Database['public']['Tables']['laps']['Row'];

export function mapLapRowToApp(r: LapRow): Lap {
  const sectors = r.sectors ?? [];
  const s1 = typeof sectors[0] === 'number' ? sectors[0] : 0;
  const s2 = typeof sectors[1] === 'number' ? sectors[1] : 0;
  const s3 = typeof sectors[2] === 'number' ? sectors[2] : 0;

  return {
    id: r.id,
    lapNumber: r.lap_number,
    lapTimeSeconds: r.lap_time_seconds,
    maxLeanAngle: r.max_lean_angle,
    maxSpeedKmh: r.max_speed_kmh,
    maxGForceX: r.max_g_force_x,
    maxGForceZ: r.max_g_force_z,
    minGForceX: r.min_g_force_x,
    minGForceZ: r.min_g_force_z,
    startTime: r.start_time,
    endTime: r.end_time,
    sectors: [s1, s2, s3],
    trackId: r.track_id,
    sessionId: r.session_id,
  };
}

export function mapLapRowsToApp(rows: LapRow[] | undefined): Lap[] {
  if (!rows) return [];
  return rows.map(mapLapRowToApp);
}
