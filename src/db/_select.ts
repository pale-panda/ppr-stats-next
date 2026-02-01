import 'server-only';

export const SESSIONS_SELECT = {
  list: `id,
    track_id,
    updated_at,
    user_id,
    created_at,
    theoretical_best_lap_time_seconds,
    data_source,
    session_date,
    session_type,
    total_laps,
    best_lap_time_seconds,
    vehicle,
    duration_seconds,
    session_source,
    track_slug,
    tracks!track_id(name, country, image_url, slug)`,
  detail: `*,
    telemetry_points(*),
    tracks!track_id(*),
    profiles(*),
    laps(*)`,
  detailByTrackSlug: `*,
    telemetry_points(*),
    tracks!track_slug(*),
    profiles(*),
    laps(*)`,
} as const;

export const TELEMETRY_POINTS_SELECT = {
  list: `id,
    session_id,
    lap_id,
    lap_number,
    record_number,
    timestamp,
    speed_kmh,
    g_force_x,
    g_force_z,
    lean_angle,
    gyro_x,
    gyro_y,
    gyro_z,
    altitude,
    gps_point`,
  detail: `id,
    session_id,
    lap_id,
    lap_number,
    record_number,
    timestamp,
    speed_kmh,
    g_force_x,
    g_force_z,
    lean_angle,
    gyro_x,
    gyro_y,
    gyro_z,
    altitude,
    gps_point`,
} as const;

export const TRACKS_SELECT = {
  list: `id,
    name,
    country,
    length_meters,
    turns,
    configuration,
    image_url,
    description,
    created_at,
    updated_at,
    gps_point,
    slug`,
  detail: `id,
    name,
    country,
    length_meters,
    turns,
    configuration,
    image_url,
    description,
    created_at,
    updated_at,
    gps_point,
    slug`,
  stats: `id, name, country, length_meters, turns, image_url, slug, created_at,
    lap_stats:laps(best_lap_time:lap_time_seconds.min(), total_laps:id.count(), avg_top_speed:max_speed_kmh.avg()),
    session_stats:sessions!track_id(total_sessions:id.count())`,
} as const;

export const ANALYTICS_SESSIONS_SELECT = `
  id,
  session_type,
  session_date,
  total_laps,
  best_lap_time_seconds,
  track:tracks!track_id(
    id,
    name,
    country
  ),
  laps(
    id,
    lap_number,
    lap_time_seconds,
    max_speed_kmh,
    sectors
  ),
  speed_stats:telemetry_points(avg_speed_kmh:speed_kmh.avg())
` as const;

export const SLUG_SELECT = {
  track: 'id, slug, name',
  trackSessions: `id, slug, name, country, image_url, length_meters, turns,
    sessions!track_slug(
      id,
      session_date,
      session_type,
      track_slug,
      total_sessions:id.count(),
      lap_stats:laps(
        best_lap_time_seconds:lap_time_seconds.min(),
        total_laps:lap_number.count(),
        top_speed_kmh:max_speed_kmh.max(),
        telemetry:telemetry_points(
          total_rows:id.count(),
          avg_speed_kmh:speed_kmh.avg(),
          max_speed_kmh:speed_kmh.max(),
          min_speed_kmh:speed_kmh.min()
        )
      ),
      laps(
        lap_number,
        lap_time_seconds,
        sectors,
        lap_telemetry:telemetry_points(
          lap_id,
          lap_number,
          total_points:id.count(),
          avg_speed_kmh:speed_kmh.avg(),
          max_speed_kmh:speed_kmh.max(),
          min_speed_kmh:speed_kmh.min(),
          avg_g_force_x:g_force_x.avg(),
          max_g_force_x:g_force_x.max(),
          min_g_force_x:g_force_x.min(),
          avg_g_force_z:g_force_z.avg(),
          max_g_force_z:g_force_z.max(),
          min_g_force_z:g_force_z.min(),
          avg_lean_angle:lean_angle.avg(),
          max_lean_angle:lean_angle.max(),
          min_lean_angle:lean_angle.min()
        )
      )
    )`,
} as const;
