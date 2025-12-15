import { cache } from 'react';
import { createServerClient } from '@/lib/supabase/server';
import {
  TelemetryPoints,
  Track,
  TrackSessionWithTrack,
} from '@/lib/types/response';

export const getSession = cache(
  async (sessionId: string): Promise<TrackSessionWithTrack> => {
    const supabase = await createServerClient();

    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select(
        `id,
        track_id,
        session_date,
        session_type,
        total_laps,
        best_lap_time_seconds,
        vehicle,
        duration_seconds,
        data_source,
        session_source,
        laps(id,
          lap_number,
          start_time,
          end_time,
          lap_time_seconds,
          max_lean_angle,
          min_speed_kmh,
          max_speed_kmh,
          min_g_force_x,
          max_g_force_x,
          min_g_force_z,
          max_g_force_z,
          sector_1,
          sector_2,
          sector_3)`
      )
      .eq('id', sessionId)
      .neq('laps.lap_number', 0)
      .single();

    if (sessionError) {
      throw new Error('Failed to fetch session data');
    }

    const { data: trackData, error: trackError } = await supabase
      .from('tracks')
      .select(
        `id,
        name,
        country,
        length_meters,
        turns,
        configuration,
        description,
        image_url,
        gps_point`
      )
      .eq('id', session.track_id)
      .single();

    if (trackError) {
      throw new Error('Failed to fetch track data');
    }

    const track: Track = trackData;

    const laps = session.laps;

    const { data: minSpeed, error: minSpeedError } = await supabase
      .from('telemetry_points')
      .select('speed_kmh')
      .eq('session_id', sessionId)
      .neq('lap_number', 0)
      .order('speed_kmh', { ascending: true })
      .limit(1)
      .single();

    if (minSpeedError) {
      throw new Error('Failed to fetch min speed data');
    }

    const calculateTheoreticalBest = () => {
      if (!session) return 0;
      // Hämta de snabbaste hastigheterna från varje sektor och summera dem
      const sector1Best = Math.min(
        ...laps.map((lap) => lap.sector_1).filter((time) => time !== null)
      );
      const sector2Best = Math.min(
        ...laps.map((lap) => lap.sector_2).filter((time) => time !== null)
      );
      const sector3Best = Math.min(
        ...laps.map((lap) => lap.sector_3).filter((time) => time !== null)
      );

      return (sector1Best || 0) + (sector2Best || 0) + (sector3Best || 0);
    };

    return {
      ...session,
      avg_speed:
        laps.reduce((sum, l) => sum + (l.max_speed_kmh || 0), 0) / laps.length,
      min_speed: minSpeed.speed_kmh || 0,
      max_speed: Math.max(...laps.map((l) => l.max_speed_kmh || 0)),
      max_lean_angle: Math.max(...laps.map((l) => l.max_lean_angle || 0)),
      max_g_force_x: Math.max(...laps.map((l) => l.max_g_force_x || 0)),
      min_g_force_x: Math.min(...laps.map((l) => l.max_g_force_x || 0)),
      max_g_force_z: Math.max(...laps.map((l) => l.max_g_force_z || 0)),
      theoretical_best: calculateTheoreticalBest(),
      track,
      laps,
    };
  }
);

export const getTelemetry = cache(
  async (sessionId: string, lapNumber?: number): Promise<TelemetryPoints> => {
    const supabase = await createServerClient();
    const { data: telemetry, error: telemetryError } = await supabase
      .from('telemetry_points')
      .select(
        'lap_number, record_number, timestamp, speed_kmh, g_force_x, g_force_z, lean_angle, gyro_x, gyro_y, gyro_z, gps_point'
      )
      .eq('session_id', sessionId)
      .filter('lap_number', lapNumber ? 'eq' : 'neq', lapNumber ?? 0)
      .order('record_number', { ascending: true });

    if (telemetryError) {
      console.error(JSON.stringify(telemetryError));
      throw new Error('Failed to fetch telemetry data');
    }

    const data: TelemetryPoints = telemetry;

    return data;
  }
);

export const getTelemetryPerLap = cache(
  async (sessionId: string, lapNumber: number): Promise<TelemetryPoints> => {
    const supabase = await createServerClient();
    const { data: telemetry, error: telemetryError } = await supabase
      .from('telemetry_points')
      .select(
        'lap_number, record_number, timestamp, altitude, speed_kmh, g_force_x, g_force_z, lean_angle, gyro_x, gyro_y, gyro_z, gps_point'
      )
      .eq('session_id', sessionId)
      .eq('lap_number', lapNumber)
      .order('record_number', { ascending: true });

    if (telemetryError) {
      console.error(JSON.stringify(telemetryError));
      throw new Error('Failed to fetch telemetry data');
    }

    const data: TelemetryPoints = telemetry;

    return data;
  }
);
