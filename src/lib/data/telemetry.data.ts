import { cache } from 'react';
import { createClient } from '@/lib/supabase/server';
import { Telemetry } from '@/types';

export const getTelemetry = cache(
  async (sessionId: string, lapNumber?: number): Promise<Telemetry> => {
    const supabase = await createClient();
    const { data: telemetry, error: telemetryError } = await supabase
      .from('telemetry_points')
      .select(
        'lap_number, record_number, timestamp, altitude, speed_kmh, g_force_x, g_force_z, lean_angle, gyro_x, gyro_y, gyro_z, gps_point'
      )
      .eq('session_id', sessionId)
      .filter('lap_number', lapNumber ? 'eq' : 'neq', lapNumber ?? 0)
      .order('record_number', { ascending: true });

    if (telemetryError) {
      console.error(JSON.stringify(telemetryError));
      throw new Error('Failed to fetch telemetry data');
    }

    return telemetry;
  }
);

export const getTelemetryPerLap = cache(
  async (sessionId: string, lapNumber: number): Promise<Telemetry> => {
    const supabase = await createClient();
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

    return telemetry;
  }
);
