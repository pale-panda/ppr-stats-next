import { LatLngLiteral } from '@/types';

export type TelemetryPoint = {
  lap_number: number;
  record_number: number;
  timestamp: string;
  speed_kmh: number;
  g_force_x: number;
  g_force_z: number;
  lean_angle: number;
  gyro_x: number;
  gyro_y: number;
  gyro_z: number;
  gps_point: LatLngLiteral;
};

export type Telemetry = Array<TelemetryPoint>;
