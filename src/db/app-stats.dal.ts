import 'server-only';

import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import type { SearchParams } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const AppStatsDAL = {
  async listAppStats(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);

    let q = db.from('app_stats').select('*');

    q = applyInFilters(q, [
      { column: 'created_at', values: filters.created_at },
    ]);

    if (filters.from) {
      q = q.gte('created_at', filters.from);
    }
    if (filters.to) {
      q = q.lte('created_at', filters.to);
    }

    q = q.order(options.sort || 'created_at', {
      ascending: options.dir === 'asc',
    });

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

  async getAppStats(db: DB) {
    const { data, error } = await db
      .from('app_stats')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (error) throw error;
    return data;
  },
};
