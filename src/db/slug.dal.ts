import 'server-only';

import type { RouteState } from '@/types/slug.type';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const SlugDAL = {
  async getSessionSlugsByTrackAndDate(
    db: DB,
    slug: string,
    from: string,
    to: string
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
      .select('id, slug, name')
      .eq('slug', slug)
      .single();
    const { data, error } = await q;
    if (error) throw error;
    return data ?? null;
  },

  async getTrackSessionsBySlug(db: DB, state: RouteState) {
    let q = db.from('tracks').select(
      `id, slug, name, country, image_url, length_meters, turns,
        sessions!track_slug(
          id,
          session_date,
          session_type,
          track_slug,
          total_sessions:id.count(),
          lap_stats:laps(
            best_lap_time_seconds:lap_time_seconds.min(),
            total_laps:lap_number.count(),
            top_speed_kmh:max_speed_kmh.max(),
            telemetry:telemetry_points(
              total_rows:id.count(),
              avg_speed_kmh:speed_kmh.avg(),
              max_speed_kmh:speed_kmh.max(),
              min_speed_kmh:speed_kmh.min()
            )
          ),
          laps(
            lap_number,
            lap_time_seconds,
            sectors,
            lap_telemetry:telemetry_points(
              lap_number,
              total_points:id.count(),
              avg_speed_kmh:speed_kmh.avg(),
              max_speed_kmh:speed_kmh.max(),
              min_speed_kmh:speed_kmh.min(),
              avg_g_force_x:g_force_x.avg(),
              max_g_force_x:g_force_x.max(),
              min_g_force_x:g_force_x.min(),
              avg_g_force_z:g_force_z.avg(),
              max_g_force_z:g_force_z.max(),
              min_g_force_z:g_force_z.min(),
              avg_lean_angle:lean_angle.avg(),
              max_lean_angle:lean_angle.max(),
              min_lean_angle:lean_angle.min()
            )
          )
        )`
    );

    switch (state.kind) {
      case 'track':
        q = q.eq('slug', state.slug);
        break;
      case 'year':
        q = q
          .eq('slug', state.slug)
          .gte(
            'sessions.session_date',
            new Date(Date.UTC(Number(state.year), 0, 1)).toISOString()
          )
          .lt(
            'sessions.session_date',
            new Date(Date.UTC(Number(state.year) + 1, 0, 1)).toISOString()
          );
        break;
      case 'session':
        q = q
          .eq('slug', state.slug)
          .gte(
            'sessions.session_date',
            new Date(Date.UTC(Number(state.year), 0, 1)).toISOString()
          )
          .lt(
            'sessions.session_date',
            new Date(Date.UTC(Number(state.year) + 1, 0, 1)).toISOString()
          )
          .eq('sessions.id', state.sessionId);
        break;
    }

    const { data, error } = await q.single();
    if (error) throw error;
    return data ?? null;
  },
};
