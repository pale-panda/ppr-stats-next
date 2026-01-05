import type { Database } from '@/types/supabase.type';
import type { TelemetryPointApp } from '@/types/telemetry.type';

type TelemetryRow = Database['public']['Tables']['telemetry_points']['Row'];

export function mapTelemetryRowToApp(r: TelemetryRow): TelemetryPointApp {
  return {
    id: r.id,
    lapId: r.lap_id,
    lapNumber: r.lap_number,
    recordNumber: r.record_number,
    timestamp: r.timestamp,
    speedKmh: r.speed_kmh ?? null,
    gForceX: r.g_force_x ?? null,
    gForceZ: r.g_force_z ?? null,
    leanAngle: r.lean_angle ?? null,
    gyroX: r.gyro_x ?? null,
    gyroY: r.gyro_y ?? null,
    gyroZ: r.gyro_z ?? null,
    altitude: r.altitude ?? null,
    gpsPoint: (() => {
      const gp = r.gps_point;
      if (!gp) return null;
      if (typeof gp === 'string') {
        try {
          const parsed = JSON.parse(gp);
          if (
            parsed &&
            typeof parsed.lat === 'number' &&
            typeof parsed.lng === 'number'
          )
            return parsed;
        } catch (e) {
          console.error('Error parsing gps_point:', e);
          return null;
        }
      }
      if (typeof gp === 'object') return gp;
      return null;
    })(),
    sessionId: r.session_id ?? null,
  };
}

export function mapTelemetryRowsToApp(
  rows: TelemetryRow[]
): TelemetryPointApp[] {
  return rows.map(mapTelemetryRowToApp);
}
