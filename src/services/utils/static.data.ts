import { TrackSession } from '@/types/track-session.type';

export const emptyTrackSession: TrackSession = {
  id: '',
  track_id: '',
  avg_speed: 0,
  min_speed: 0,
  max_speed: 0,
  max_lean_angle: 0,
  max_g_force_x: 0,
  min_g_force_x: 0,
  max_g_force_z: 0,
  theoretical_best: 0,
  session_date: '',
  session_type: '',
  total_laps: 0,
  best_lap_time_seconds: 0,
  duration_seconds: 0,
  vehicle: '',
  data_source: '',
  session_source: '',
  created_at: '',
  updated_at: '',
};
