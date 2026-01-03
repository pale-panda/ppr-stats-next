import 'server-only';

import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import type { SearchParams } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const TelemetryPointsDAL = {
  async listTelemetryPoints(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);
    const offset = (options.page - 1) * options.limit;
    const to = offset + options.limit - 1;
    let q = db.from('telemetry_points').select('*');
    q = applyInFilters(q, [
      { column: 'session_id', values: filters.session_id },
      { column: 'lap_number', values: filters.lap_number },
      { column: 'point_index', values: filters.point_index },
    ]);
    q = q
      .order(options.sort || 'timetamp', {
        ascending: options.dir === 'asc',
      })
      .range(offset, to);
    const { data, error } = await q;
    if (error) throw error;
    return {
      data: data ?? [],
      meta: {
        page: options.page,
        limit: options.limit,
        sort: options.sort,
        dir: options.dir,
        count: data?.length ?? 0,
        filters,
      },
    };
  },

  async getTelemetryPointsBySessionId(db: DB, sessionId: string) {
    const { data, error } = await db
      .from('telemetry_points')
      .select('*')
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true })
      .order('lap_number', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async getTelemetryPointsBySessionIdAndLapNumber(
    db: DB,
    sessionId: string,
    lapNumber: number
  ) {
    const { data, error } = await db
      .from('telemetry_points')
      .select('*')
      .eq('session_id', sessionId)
      .eq('lap_number', lapNumber)
      .order('timestamp', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async getTelemetryMinSpeedBySessionId(db: DB, sessionId: string) {
    const { data, error } = await db
      .from('telemetry_points')
      .select('speed_kmh')
      .eq('session_id', sessionId)
      .order('speed_kmh', { ascending: true })
      .limit(1)
      .single();
    if (error) throw error;
    return data?.speed_kmh ?? null;
  },
};
