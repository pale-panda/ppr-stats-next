import 'server-only';

import { applyInFilters, normalizeQuery } from '@/db/utils/helpers';
import type { SearchParams } from '@/types';
import type { Database } from '@/types/supabase.type';
import type { SupabaseClient } from '@supabase/supabase-js';

type DB = SupabaseClient<Database>;

export const UserDAL = {
  async listUserProfiles(db: DB, searchParams: SearchParams) {
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

  async getUserProfileById(db: DB, id: string) {
    const { data, error } = await db
      .from('profiles')
      .select('email, first_name, last_name, avatar_url')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  async updateUserProfile(
    db: DB,
    id: string,
    updateData: Partial<{
      email: string;
      first_name?: string;
      last_name?: string;
      avatar_url?: string | null;
    }>
  ) {
    const { error } = await db
      .from('profiles')
      .update(updateData)
      .eq('id', id)
      .single();
    if (error) throw error;
    return true;
  },

  async updateUserMetadata(
    db: DB,
    metadata: Partial<{
      first_name: string | undefined;
      last_name: string | undefined;
      full_name: string | undefined;
      avatar_url: string | null;
    }>
  ) {
    const {
      data: { user },
      error,
    } = await db.auth.updateUser({
      data: metadata,
    });
    if (error) throw error;
    return user;
  },

  async getCurrentUser(db: DB) {
    const {
      data: { user },
      error,
    } = await db.auth.getUser();
    if (error) throw error;
    return user;
  },
};
