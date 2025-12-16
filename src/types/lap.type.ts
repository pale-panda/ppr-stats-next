export type Lap = {
  id: string;
  session_id: string;
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
  created_at: string;
};

export type Laps = Array<Lap>;
