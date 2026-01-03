import { LatLngLiteral } from '@/types';
import { ISODateString, ID } from '@/types/common-types';

// App-level telemetry point type (camelCase) — preferred for UI and business logic
export type TelemetryPointApp = {
  id?: ID<'telemetry'>;
  lapId?: ID<'lap'> | null;
  lapNumber: number | null;
  recordNumber: number;
  timestamp: ISODateString;
  speedKmh: number | null;
  gForceX: number | null;
  gForceZ: number | null;
  leanAngle: number | null;
  gyroX: number | null;
  gyroY: number | null;
  gyroZ: number | null;
  altitude?: number | null;
  gpsPoint?: LatLngLiteral | null;
  sessionId?: ID<'session'> | null;
  // Backwards-compatible snake_case aliases
  lap_id?: ID<'lap'> | null;
  lap_number?: number | null;
  record_number?: number;
  speed_kmh?: number | null;
  g_force_x?: number | null;
  g_force_z?: number | null;
  lean_angle?: number | null;
  gyro_x?: number | null;
  gyro_y?: number | null;
  gyro_z?: number | null;
  gps_point?: LatLngLiteral | null;
  session_id?: ID<'session'> | null;
};

export type TelemetryApp = Array<TelemetryPointApp>;
