import 'server-only';

import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import type { SearchParams } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const TracksDAL = {
  async listTracks(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);

    const offset = (options.page - 1) * options.limit;
    const to = offset + options.limit - 1;

    let q = db.from('tracks').select('*');

    q = applyInFilters(q, [
      { column: 'name', values: filters.name },
      { column: 'country', values: filters.country },
    ]);

    if (filters.search) {
      q = q.ilike('name', `%${filters.search}%`);
    }

    q = q
      .order(options.sort, { ascending: options.dir === 'asc' })
      .range(offset, to);

    const { data, error } = await q;
    if (error) throw error;
    const count = await this.countTracks(db, { ...filters } as SearchParams);

    return {
      data: data ?? [],
      meta: {
        page: options.page,
        limit: options.limit,
        sort: options.sort,
        dir: options.dir,
        count,
        filters,
      },
    };
  },

  async getTrackById(db: DB, id: string) {
    const { data, error } = await db
      .from('tracks')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async countTracks(db: DB, searchParams: SearchParams) {
    const { filters } = normalizeQuery(searchParams);
    let q = db.from('tracks').select('id', { count: 'exact', head: true });
    q = applyInFilters(q, [
      { column: 'name', values: filters.name },
      { column: 'country', values: filters.country },
    ]);
    if (filters.search) {
      q = q.ilike('name', `%${filters.search}%`);
    }
    const { count, error } = await q;
    if (error) throw error;
    return count ?? 0;
  },

  async getAllTracks(db: DB) {
    const { data, error } = await db.from('tracks').select('*').order('name');
    if (error) throw error;
    return data ?? [];
  },

  async getTrackIDByFilters(db: DB, searchParams: SearchParams) {
    const { filters } = normalizeQuery(searchParams);
    let f = db.from('tracks').select('id');
    f = applyInFilters(f, [
      { column: 'name', values: filters.name },
      { column: 'country', values: filters.country },
    ]);

    const { data: trackData, error: filterError } = await f;
    if (filterError) throw filterError;

    const trackIds = trackData?.map((t) => t.id) || [];
    return trackIds;
  },
};
