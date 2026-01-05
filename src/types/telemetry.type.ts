import { LatLngLiteral } from '@/types';
import { ID, ISODateString } from '@/types/common-types';

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
};

export type TelemetryApp = Array<TelemetryPointApp>;
