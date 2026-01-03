import 'server-only';

import { TracksDAL } from '@/db/tracks.dal';
import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import type { SearchParams, SessionInsert } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const SessionsDAL = {
  async listSessions(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);
    const offset = (options.page - 1) * options.limit;
    const to = offset + options.limit - 1;

    const trackIds = await TracksDAL.getTrackIDByFilters(db, searchParams);

    let q = db.from('sessions').select('*');
    q = applyInFilters(q, [
      { column: 'track_id', values: filters.track_id || trackIds },
      { column: 'user_id', values: filters.user_id },
      { column: 'vehicle', values: filters.vehicle },
    ]);

    if (filters.session_type) {
      q = q.eq('session_type', filters.session_type);
    }
    if (filters.from) {
      q = q.gte('session_date', filters.from);
    }
    if (filters.to) {
      q = q.lte('session_date', filters.to);
    }

    q = q
      .order(options.sort || 'session_date', {
        ascending: options.dir === 'asc',
      })
      .range(offset, to);

    const { data, error } = await q;
    if (error) throw error;

    const count = await this.countSessions(db, { ...filters } as SearchParams);
    return {
      data: data ?? [],
      meta: {
        page: options.page,
        limit: options.limit,
        sort: options.sort,
        dir: options.dir,
        count: count ?? 0,
        filters,
      },
    };
  },

  async getSessionById(db: DB, id: string) {
    const { data, error } = await db
      .from('sessions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getSessionsByUserId(db: DB, userId: string) {
    const { data, error } = await db
      .from('sessions')
      .select('*')
      .eq('user_id', userId);
    if (error) throw error;
    return data ?? [];
  },

  async getSessionsByTrackId(db: DB, trackId: string) {
    const { data, error } = await db
      .from('sessions')
      .select('*')
      .eq('track_id', trackId);
    if (error) throw error;
    return data ?? [];
  },

  async listSessionsFull(db: DB, searchParams: SearchParams) {
    searchParams.sort = searchParams.sort ?? 'session_date';
    searchParams.dir = searchParams.dir ?? 'desc';

    const { filters, options } = normalizeQuery(searchParams);
    const offset = (options.page - 1) * options.limit;
    const to = offset + options.limit - 1;

    const trackIds = await TracksDAL.getTrackIDByFilters(db, searchParams);

    let q = db
      .from('sessions')
      .select(
        `*, tracks(id, name, country, length_meters, turns, image_url), profiles(id, first_name, last_name), laps(lap_number, lap_time_seconds, max_lean_angle, max_speed_kmh, max_g_force_x, max_g_force_z, min_g_force_x, min_g_force_z, start_time, end_time, sector_1, sector_2, sector_3)`
      );
    q = applyInFilters(q, [
      {
        column: 'track_id',
        values: filters.track_id || trackIds,
      },
      { column: 'user_id', values: filters.user_id },
      { column: 'vehicle', values: filters.vehicle },
    ]);

    if (filters.session_type) {
      q = q.eq('session_type', filters.session_type);
    }
    if (filters.from) {
      q = q.gte('session_date', filters.from);
    }
    if (filters.to) {
      q = q.lte('session_date', filters.to);
    }

    q = q
      .order(options.sort || 'session_date', {
        ascending: options.dir === 'asc',
      })
      .range(offset, to);

    const { data, error } = await q;
    if (error) throw error;

    const count = await this.countSessions(db, { ...filters } as SearchParams);
    return {
      data: data ?? [],
      meta: {
        page: options.page,
        limit: options.limit,
        sort: options.sort,
        dir: options.dir,
        count: count ?? 0,
        filters,
      },
    };
  },

  async getSessionByIdFull(db: DB, id: string) {
    const { data, error } = await db
      .from('sessions')
      .select(
        `*, telemetry_points(speed_kmh, lean_angle, g_force_x, g_force_z, timestamp, lap_number), tracks(id, name, country, length_meters, turns, image_url, gps_point), profiles(id, first_name, last_name), laps(lap_number, lap_time_seconds, max_lean_angle, max_speed_kmh, max_g_force_x, max_g_force_z, min_g_force_x, min_g_force_z, start_time, end_time, sector_1, sector_2, sector_3)`
      )
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async countSessions(db: DB, searchParams: SearchParams) {
    const { filters } = normalizeQuery(searchParams);
    const trackIds = await TracksDAL.getTrackIDByFilters(db, searchParams);

    let q = db.from('sessions').select('*', {
      count: 'exact',
      head: true,
    });

    q = applyInFilters(q, [
      { column: 'track_id', values: filters.track_id || trackIds },
      { column: 'user_id', values: filters.user_id },
      { column: 'vehicle', values: filters.vehicle },
    ]);

    if (filters.session_type) {
      q = q.eq('session_type', filters.session_type);
    }
    if (filters.from) {
      q = q.gte('session_date', filters.from);
    }
    if (filters.to) {
      q = q.lte('session_date', filters.to);
    }

    const { count, error } = await q;
    if (error) throw error;

    return count ?? 0;
  },

  async createSession(db: DB, sessionData: SessionInsert) {
    const { data, error } = await db
      .from('sessions')
      .insert(sessionData)
      .single();
    if (error) throw error;
    return data;
  },

  async deleteSession(db: DB, id: string) {
    const { data, error } = await db
      .from('sessions')
      .delete()
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
};
