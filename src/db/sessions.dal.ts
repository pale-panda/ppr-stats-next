import 'server-only';

import { SESSIONS_SELECT } from '@/db/_select';
import { TracksDAL } from '@/db/tracks.dal';
import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import { decodeCursor, encodeCursor } from '@/lib/pagination/cursor';
import type { SearchParams } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const SessionsDAL = {
  async listSessions(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);
    const cursor = decodeCursor(searchParams.cursor as string);
    const sortDir = options.dir === 'asc' ? 'asc' : 'desc';
    const limit = options.limit;

    const shouldResolveTrackIds = Boolean(
      filters.name?.length || filters.country?.length || filters.slug?.length,
    );
    const trackIds = shouldResolveTrackIds
      ? await TracksDAL.getTrackIDByFilters(db, searchParams)
      : undefined;

    let q = db.from('sessions').select(SESSIONS_SELECT.list);
    q = applyInFilters(q, [
      { column: 'track_id', values: filters.track_id ?? trackIds },
      { column: 'track_slug', values: filters.track_slug },
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

    if (cursor) {
      const op = sortDir === 'asc' ? 'gt' : 'lt';
      q = q.or(
        `session_date.${op}.${cursor.t},and(session_date.eq.${cursor.t},id.${op}.${cursor.id})`,
      );
    }

    q = q
      .order('session_date', { ascending: sortDir === 'asc' })
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
        hasNext && last?.session_date && last?.id
          ? encodeCursor({ t: last.session_date, id: last.id })
          : null,
    };
  },

  async getSessionById(db: DB, id: string) {
    const { data, error } = await db
      .from('sessions')
      .select(SESSIONS_SELECT.detail)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async getSessionsByUserId(db: DB, userId: string) {
    const { data, error } = await db
      .from('sessions')
      .select(SESSIONS_SELECT.detail)
      .eq('user_id', userId);
    if (error) throw error;
    return data ?? [];
  },

  async getSessionsByTrackId(db: DB, trackId: string) {
    const { data, error } = await db
      .from('sessions')
      .select(SESSIONS_SELECT.detail)
      .eq('track_id', trackId);
    if (error) throw error;
    return data ?? [];
  },

  async getSessionsByTrackSlug(db: DB, slug: string) {
    const { data, error } = await db
      .from('sessions')
      .select(SESSIONS_SELECT.detailByTrackSlug)
      .eq('track_slug', slug);
    if (error) throw error;
    return data ?? [];
  },

  async listSessionsFull(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);
    const cursor = decodeCursor(searchParams.cursor as string);
    const sortDir = options.dir === 'asc' ? 'asc' : 'desc';
    const limit = options.limit;

    const shouldResolveTrackIds = Boolean(
      filters.name?.length || filters.country?.length || filters.slug?.length,
    );
    const trackIds = shouldResolveTrackIds
      ? await TracksDAL.getTrackIDByFilters(db, searchParams)
      : undefined;

    let q = db.from('sessions').select(SESSIONS_SELECT.detail);
    q = applyInFilters(q, [
      {
        column: 'track_id',
        values: filters.track_id ?? trackIds,
      },
      { column: 'track_slug', values: filters.track_slug },
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

    if (cursor) {
      const op = sortDir === 'asc' ? 'gt' : 'lt';
      q = q.or(
        `session_date.${op}.${cursor.t},and(session_date.eq.${cursor.t},id.${op}.${cursor.id})`,
      );
    }

    q = q
      .order('session_date', { ascending: sortDir === 'asc' })
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
        hasNext && last?.session_date && last?.id
          ? encodeCursor({ t: last.session_date, id: last.id })
          : null,
    };
  },

  async getSessionByIdFull(db: DB, id: string) {
    const { data, error } = await db
      .from('sessions')
      .select(SESSIONS_SELECT.detail)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async countSessions(db: DB, searchParams: SearchParams) {
    const { filters } = normalizeQuery(searchParams);
    const shouldResolveTrackIds = Boolean(
      filters.name?.length || filters.country?.length || filters.slug?.length,
    );
    const trackIds = shouldResolveTrackIds
      ? await TracksDAL.getTrackIDByFilters(db, searchParams)
      : undefined;

    let q = db.from('sessions').select('id', {
      count: 'exact',
      head: true,
    });

    q = applyInFilters(q, [
      { column: 'track_id', values: filters.track_id ?? trackIds },
      { column: 'track_slug', values: filters.track_slug },
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

  async createSession(
    db: DB,
    sessionData: Database['public']['Tables']['sessions']['Insert'],
  ) {
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
