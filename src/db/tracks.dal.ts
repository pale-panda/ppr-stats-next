import 'server-only';

import { TRACKS_SELECT } from '@/db/_select';
import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import { decodeCursor, encodeCursor } from '@/lib/pagination/cursor';
import type { SearchParams } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const TracksDAL = {
  async listTracks(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);
    const cursor = decodeCursor(searchParams.cursor as string);
    const sortDir = options.dir === 'asc' ? 'asc' : 'desc';
    const limit = options.limit;

    let q = db.from('tracks').select(TRACKS_SELECT.list);

    q = applyInFilters(q, [
      { column: 'name', values: filters.name },
      { column: 'country', values: filters.country },
      { column: 'slug', values: filters.slug },
    ]);

    if (filters.search) {
      q = q.ilike('name', `%${filters.search}%`);
    }

    if (cursor) {
      const op = sortDir === 'asc' ? 'gt' : 'lt';
      q = q.or(
        `created_at.${op}.${cursor.t},and(created_at.eq.${cursor.t},id.${op}.${cursor.id})`,
      );
    }

    q = q
      .order('created_at', { ascending: sortDir === 'asc' })
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
        hasNext && last?.created_at && last?.id
          ? encodeCursor({ t: last.created_at, id: last.id })
          : null,
    };
  },

  async getTracksWithStats(db: DB, searchParams: SearchParams) {
    const { options, filters } = normalizeQuery(searchParams);
    const cursor = decodeCursor(searchParams.cursor as string);
    const sortDir = options.dir === 'asc' ? 'asc' : 'desc';
    const limit = options.limit;

    let q = db.from('tracks').select(TRACKS_SELECT.stats);

    q = applyInFilters(q, [
      { column: 'name', values: filters.name },
      { column: 'country', values: filters.country },
      { column: 'slug', values: filters.slug },
    ]);

    if (cursor) {
      const op = sortDir === 'asc' ? 'gt' : 'lt';
      q = q.or(
        `created_at.${op}.${cursor.t},and(created_at.eq.${cursor.t},id.${op}.${cursor.id})`,
      );
    }

    q = q
      .order('created_at', { ascending: sortDir === 'asc' })
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
        hasNext && last?.created_at && last?.id
          ? encodeCursor({ t: last.created_at, id: last.id })
          : null,
    };
  },

  async getTrackById(db: DB, id: string) {
    const { data, error } = await db
      .from('tracks')
      .select(TRACKS_SELECT.detail)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getTrackBySlug(db: DB, slug: string) {
    const { data, error } = await db
      .from('tracks')
      .select(TRACKS_SELECT.detail)
      .eq('slug', slug)
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
      { column: 'slug', values: filters.slug },
    ]);
    if (filters.search) {
      q = q.ilike('name', `%${filters.search}%`);
    }
    const { count, error } = await q;
    if (error) throw error;
    return count ?? 0;
  },

  async getTotalLength(db: DB, searchParams: SearchParams) {
    const { filters } = normalizeQuery(searchParams);
    let q = db.from('tracks').select('length_meters.sum()');
    q = applyInFilters(q, [
      { column: 'name', values: filters.name },
      { column: 'country', values: filters.country },
      { column: 'slug', values: filters.slug },
    ]);
    const { data, error } = await q.single();
    if (error) throw error;
    return data?.sum ?? 0;
  },

  async getAllTracks(db: DB) {
    const { data, error } = await db
      .from('tracks')
      .select(TRACKS_SELECT.list)
      .order('name');
    if (error) throw error;
    return data ?? [];
  },

  async getTrackIDByFilters(db: DB, searchParams: SearchParams) {
    const { filters } = normalizeQuery(searchParams);
    let f = db.from('tracks').select('id');
    f = applyInFilters(f, [
      { column: 'name', values: filters.name },
      { column: 'country', values: filters.country },
      { column: 'slug', values: filters.slug },
    ]);

    const { data: trackData, error: filterError } = await f;
    if (filterError) throw filterError;

    const trackIds = trackData?.map((t) => t.id) || [];
    return trackIds;
  },
};
