'use server';
import { TelemetryPointsDAL } from '@/db/telemetry-points.dal';
import { createClient } from '@/lib/supabase/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';
import { mapTelemetryRowsToApp } from '@/lib/mappers/telemetry.mapper';

export const getTelemetryBySessionId = cache(async (sessionId: string) => {
  const db: SupabaseClient = await createClient();

  const data = await TelemetryPointsDAL.getTelemetryPointsBySessionId(
    db,
    sessionId
  );
  return mapTelemetryRowsToApp(data);
});

export const getTelemetryBySessionIdAndLapNumber = cache(
  async (sessionId: string, lapNumber: number) => {
    const db: SupabaseClient = await createClient();

    const data =
      await TelemetryPointsDAL.getTelemetryPointsBySessionIdAndLapNumber(
        db,
        sessionId,
        lapNumber || 1
      );

    return mapTelemetryRowsToApp(data);
  }
);
