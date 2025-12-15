export type LatLngLiteral = {
  lat: number;
  lng: number;
};

export type SingleLap = {
  id: string;
  lap_number: number;
  start_time: string;
  end_time: string;
  lap_time_seconds: number;
  max_lean_angle: number;
  min_speed_kmh: number;
  max_speed_kmh: number;
  min_g_force_x: number;
  max_g_force_x: number;
  min_g_force_z: number;
  max_g_force_z: number;
  sector_1: number;
  sector_2: number;
  sector_3: number;
};

export type SingleTelemetryPoint = {
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

export type Track = {
  id: string;
  name: string;
  country: string;
  length_meters: number | null;
  turns: number | null;
  configuration: string | null;
  description: string | null;
  image_url: string | null;
  gps_point: LatLngLiteral;
};

export type TrackSession = {
  id: string;
  track_id: string;
  avg_speed: number;
  min_speed: number;
  max_speed: number;
  max_lean_angle: number;
  max_g_force_x: number;
  min_g_force_x: number;
  max_g_force_z: number;
  theoretical_best: number;
  session_date: string;
  session_type: string;
  total_laps: number;
  best_lap_time_seconds: number;
  duration_seconds: number;
  vehicle: string;
  data_source: string;
  session_source: string;
};

export type TrackSessionWithTrack = TrackSession & {
  track?: Track;
  laps?: Laps;
  telemetry?: TelemetryPoints;
};

export type Laps = Array<SingleLap>;
export type TelemetryPoints = Array<SingleTelemetryPoint>;
export type TrackSessionData = Array<TrackSession>;
export type Tracks = Array<Track>;

export type PaginationMeta = {
  currentPage: number;
  nextPage: number | null;
  totalPages: number;
  totalCount: number;
  remainingCount: number;
};
