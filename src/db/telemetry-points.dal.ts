import 'server-only';

import { TELEMETRY_POINTS_SELECT } from '@/db/_select';
import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import { decodeCursor, encodeCursor } from '@/lib/pagination/cursor';
import type { SearchParams } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const TelemetryPointsDAL = {
  async listTelemetryPoints(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);
    const cursor = decodeCursor(searchParams.cursor as string);
    const sortDir = options.dir === 'asc' ? 'asc' : 'desc';
    const limit = options.limit;
    let q = db.from('telemetry_points').select(TELEMETRY_POINTS_SELECT.list);
    q = applyInFilters(q, [
      { column: 'session_id', values: filters.session_id },
      { column: 'lap_number', values: filters.lap_number },
    ]);

    if (cursor) {
      const op = sortDir === 'asc' ? 'gt' : 'lt';
      q = q.or(
        `timestamp.${op}.${cursor.t},and(timestamp.eq.${cursor.t},id.${op}.${cursor.id})`,
      );
    }

    q = q
      .order('timestamp', { ascending: sortDir === 'asc' })
      .order('id', { ascending: sortDir === 'asc' })
      .limit(limit + 1);
    const { data, error } = await q;
    if (error) throw error;

    const rows = data ?? [];
    const hasNext = rows.length > limit;
    const items = hasNext ? rows.slice(0, limit) : rows;
    const last = items[items.length - 1];

    return {
      items,
      nextCursor:
        hasNext && last?.timestamp && last?.id
          ? encodeCursor({ t: last.timestamp, id: last.id })
          : null,
    };
  },

  async getTelemetryPointsBySessionId(db: DB, sessionId: string) {
    const { data, error } = await db
      .from('telemetry_points')
      .select(TELEMETRY_POINTS_SELECT.detail)
      .eq('session_id', sessionId)
      .order('timestamp', { ascending: true })
      .order('lap_number', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async getTelemetryPointsBySessionIdAndLapNumber(
    db: DB,
    sessionId: string,
    lapNumber: number,
  ) {
    const { data, error } = await db
      .from('telemetry_points')
      .select(TELEMETRY_POINTS_SELECT.detail)
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
