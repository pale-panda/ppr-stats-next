export interface Track {
  id: string;
  name: string;
  country: string | null;
  length_meters: number | null;
  turns: number | null;
  configuration: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  track_id: string | null;
  data_source: string | null;
  session_date: string;
  session_type: string;
  total_laps: number;
  best_lap_time_seconds: number | null;
  created_at: string;
  updated_at: string;
  // Joined data
  track?: Track;
}

export interface Lap {
  id: string;
  session_id: string;
  lap_number: number;
  lap_time_seconds: number | null;
  max_speed_kmh: number | null;
  max_lean_angle: number | null;
  max_g_force_x: number | null;
  max_g_force_z: number | null;
  start_time: string | null;
  end_time: string | null;
  created_at: string;
}

export interface TelemetryPoint {
  id: string;
  session_id: string;
  lap_id: string | null;
  record_number: number;
  timestamp: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
  speed_kmh: number | null;
  g_force_x: number | null;
  g_force_z: number | null;
  lap_number: number | null;
  lean_angle: number | null;
  gyro_x: number | null;
  gyro_y: number | null;
  gyro_z: number | null;
}

// CSV parsing types
export interface RaceBoxCSVHeader {
  format: string;
  dataSource: string;
  dateUtc: string;
  date: string;
  time: string;
  sessionIndex: number;
  sessionType: string;
  track: string;
  configuration: string;
  laps: number;
  bestLapTime: number;
}

export interface RaceBoxCSVRecord {
  record: number;
  time: string;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  gForceX: number;
  gForceZ: number;
  lap: number;
  leanAngle: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
}
