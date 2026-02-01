import 'server-only';

import { SLUG_SELECT } from '@/db/_select';
import type { RouteState } from '@/types/slug.type';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const SlugDAL = {
  async getSessionSlugsByTrackAndDate(
    db: DB,
    slug: string,
    from: string,
    to: string,
  ) {
    const q = db
      .from('sessions')
      .select('id, track_slug, session_date')
      .eq('track_slug', slug)
      .gte('session_date', from)
      .lt('session_date', to)
      .order('session_date', { ascending: false });
    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },

  async getTrackBySlug(db: DB, slug: string) {
    const q = db
      .from('tracks')
      .select(SLUG_SELECT.track)
      .eq('slug', slug)
      .single();
    const { data, error } = await q;
    if (error) throw error;
    return data ?? null;
  },

  async getTrackSessionsBySlug(db: DB, state: RouteState) {
    let q = db.from('tracks').select(SLUG_SELECT.trackSessions);

    switch (state.kind) {
      case 'track':
        q = q.eq('slug', state.slug);
        break;
      case 'year':
        q = q
          .eq('slug', state.slug)
          .gte(
            'sessions.session_date',
            new Date(Date.UTC(Number(state.year), 0, 1)).toISOString(),
          )
          .lt(
            'sessions.session_date',
            new Date(Date.UTC(Number(state.year) + 1, 0, 1)).toISOString(),
          );
        break;
      case 'session':
        q = q
          .eq('slug', state.slug)
          .gte(
            'sessions.session_date',
            new Date(Date.UTC(Number(state.year), 0, 1)).toISOString(),
          )
          .lt(
            'sessions.session_date',
            new Date(Date.UTC(Number(state.year) + 1, 0, 1)).toISOString(),
          )
          .eq('sessions.id', state.sessionId);
        break;
    }

    const { data, error } = await q.single();
    if (error) throw error;
    return data ?? null;
  },
};
