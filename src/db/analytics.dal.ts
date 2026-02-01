import 'server-only';

import { ANALYTICS_SESSIONS_SELECT } from '@/db/_select';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const AnalyticsDAL = {
  async listAnalyticsSessions(db: DB, slug?: string) {
    let q = db.from('sessions').select(ANALYTICS_SESSIONS_SELECT);

    if (slug) {
      q = q.eq('track_slug', slug);
    }

    q = q.order('session_date', { ascending: false });

    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  },
};
