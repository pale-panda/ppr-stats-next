'use server';
import { TracksDAL } from '@/db/tracks.dal';
import { createClient } from '@/lib/supabase/server';
import type { SearchParams } from '@/types';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cache } from 'react';

export const getTracks = cache(async (searchParams: SearchParams) => {
  const db: SupabaseClient = await createClient();
  return TracksDAL.listTracks(db, searchParams);
});

export const getTrackById = cache(async (id: string) => {
  const db: SupabaseClient = await createClient();
  return TracksDAL.getTrackById(db, id);
});


