import 'server-only';

import { TracksDAL } from '@/db/tracks.dal';
import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import type { SearchParams } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const LapsDAL = {
  async listLaps(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);
    const offset = (options.page - 1) * options.limit;
    const to = offset + options.limit - 1;
    let q = db.from('laps').select('*');
    q = applyInFilters(q, [
      { column: 'session_id', values: filters.session_id },
      { column: 'lap_number', values: filters.lap_number },
      { column: 'track_id', values: filters.track_id },
    ]);
    q = q
      .order(options.sort, {
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

  async getLapsBySessionId(db: DB, sessionId: string) {
    const { data, error } = await db
      .from('laps')
      .select('*')
      .eq('session_id', sessionId)
      .order('lap_number', { ascending: true });
    if (error) throw error;
    return data ?? [];
  },

  async countLaps(db: DB, searchParams: SearchParams) {
    const { filters } = normalizeQuery(searchParams);
    const trackIds = await TracksDAL.getTrackIDByFilters(db, searchParams);

    let q = db
      .from('laps')
      .select('id', { count: 'exact', head: true })
      .neq('lap_number', 0);
    q = applyInFilters(q, [
      { column: 'session_id', values: filters.session_id },
      { column: 'track_id', values: filters.track_id || trackIds },
    ]);

    const { count, error } = await q;
    if (error) throw error;
    return count ?? 0;
  },

  async getBestLap(db: DB, searchParams: SearchParams) {
    const { filters } = normalizeQuery(searchParams);
    const trackIds = await TracksDAL.getTrackIDByFilters(db, searchParams);

    let q = db
      .from('laps')
      .select(`lap_time_seconds, tracks(name)`)
      .limit(1)
      .order('lap_time_seconds', { ascending: true })
      .neq('lap_number', 0);
    q = applyInFilters(q, [
      { column: 'session_id', values: filters.session_id },
      { column: 'track_id', values: filters.track_id || trackIds },
    ]);
    const { data, error } = await q.single();
    if (error) throw error;
    return data ?? null;
  },

  async getTopSpeed(db: DB, searchParams: SearchParams) {
    const { filters } = normalizeQuery(searchParams);
    const trackIds = await TracksDAL.getTrackIDByFilters(db, searchParams);

    let q = db
      .from('laps')
      .select(`max_speed_kmh, tracks(name)`)
      .limit(1)
      .order('max_speed_kmh', { ascending: false })
      .neq('lap_number', 0);
    q = applyInFilters(q, [
      { column: 'session_id', values: filters.session_id },
      { column: 'track_id', values: filters.track_id || trackIds },
    ]);
    const { data, error } = await q.single();
    if (error) throw error;
    return data ?? null;
  },
};
