'use server';
import { LapsDAL } from '@/db/laps.dal';
import { createClient } from '@/lib/supabase/server';
import type { SearchParams } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getLaps = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  return LapsDAL.listLaps(db, searchParams);
});

export const getLapsBySessionId = cache(async (sessionId: string) => {
  const db: SupabaseClient = await createClient();
  return LapsDAL.getLapsBySessionId(db, sessionId);
});
