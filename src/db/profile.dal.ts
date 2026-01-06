import 'server-only';

import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import type { SearchParams } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const ProfileDAL = {
  async listProfiles(db: DB, searchParams: SearchParams) {
    const { filters, options } = normalizeQuery(searchParams);

    let q = db.from('profiles').select('*');

    q = applyInFilters(q, [
      { column: 'id', values: filters.id },
      { column: 'full_name', values: filters.full_name },
      { column: 'email', values: filters.email },
    ]);

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

  async getProfileById(db: DB, id: string) {
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateProfile(db: DB, id: string, updateData: Omit<Database['public']['Tables']['profiles']['Update'], 'id'>) {
    const { data, error } = await db
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
};
